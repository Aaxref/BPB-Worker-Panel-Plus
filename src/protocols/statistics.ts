export type ProtocolType = 'vless' | 'vmess' | 'trojan' | 'shadowsocks' | 'warp' | 'hysteria2' | 'tuic';
export type ConnectionStatus = 'connected' | 'disconnected' | 'connecting' | 'error';

export interface ConnectionStats {
    timestamp: number;
    protocol: ProtocolType;
    status: ConnectionStatus;
    bytesUp: number;
    bytesDown: number;
    duration: number;
    latency?: number;
    error?: string;
}

export interface ProtocolStats {
    protocol: ProtocolType;
    totalConnections: number;
    activeConnections: number;
    totalBytesUp: number;
    totalBytesDown: number;
    avgLatency: number;
    successRate: number;
    lastUsed: number;
}

export interface DailyStats {
    date: string;
    totalConnections: number;
    totalBytesUp: number;
    totalBytesDown: number;
    totalDuration: number;
    protocols: Record<ProtocolType, number>;
}

export interface MonitoringConfig {
    enableMonitoring: boolean;
    maxHistoryDays: number;
    maxConnectionsPerProtocol: number;
    enableAlerts: boolean;
    alertThresholds: {
        highLatency: number;
        lowSuccessRate: number;
        highErrorRate: number;
    };
}

export class StatisticsManager {
    private connections: Map<string, ConnectionStats[]> = new Map();
    private dailyStats: Map<string, DailyStats> = new Map();
    private config: MonitoringConfig;

    constructor(config?: Partial<MonitoringConfig>) {
        this.config = {
            enableMonitoring: true,
            maxHistoryDays: 30,
            maxConnectionsPerProtocol: 1000,
            enableAlerts: true,
            alertThresholds: {
                highLatency: 500,
                lowSuccessRate: 80,
                highErrorRate: 20
            },
            ...config
        };
    }

    recordConnection(stats: ConnectionStats): void {
        if (!this.config.enableMonitoring) return;

        const key = `${stats.protocol}_${stats.status}`;
        
        if (!this.connections.has(key)) {
            this.connections.set(key, []);
        }

        const list = this.connections.get(key)!;
        list.push(stats);

        if (list.length > this.config.maxConnectionsPerProtocol) {
            list.shift();
        }

        this.updateDailyStats(stats);
        this.cleanupOldRecords();
    }

    getProtocolStats(protocol: ProtocolType): ProtocolStats {
        const allConnections = Array.from(this.connections.values())
            .flat()
            .filter(c => c.protocol === protocol);

        const successful = allConnections.filter(c => c.status === 'connected');
        const active = allConnections.filter(c => c.status === 'connected' && Date.now() - c.timestamp < 300000);

        const totalBytesUp = allConnections.reduce((sum, c) => sum + c.bytesUp, 0);
        const totalBytesDown = allConnections.reduce((sum, c) => sum + c.bytesDown, 0);
        
        const latencies = successful
            .filter(c => c.latency !== undefined)
            .map(c => c.latency!);

        const avgLatency = latencies.length > 0
            ? latencies.reduce((a, b) => a + b, 0) / latencies.length
            : 0;

        const successRate = allConnections.length > 0
            ? (successful.length / allConnections.length) * 100
            : 0;

        const lastUsed = successful.length > 0
            ? Math.max(...successful.map(c => c.timestamp))
            : 0;

        return {
            protocol,
            totalConnections: allConnections.length,
            activeConnections: active.length,
            totalBytesUp,
            totalBytesDown,
            avgLatency,
            successRate,
            lastUsed
        };
    }

    getAllProtocolStats(): ProtocolStats[] {
        const protocols: ProtocolType[] = ['vless', 'vmess', 'trojan', 'shadowsocks', 'warp', 'hysteria2', 'tuic'];
        return protocols.map(p => this.getProtocolStats(p));
    }

    getDailyStats(date: string): DailyStats | null {
        return this.dailyStats.get(date) || null;
    }

    getDailyStatsRange(startDate: string, endDate: string): DailyStats[] {
        const stats: DailyStats[] = [];
        let current = new Date(startDate);
        const end = new Date(endDate);

        while (current <= end) {
            const dateStr = current.toISOString().split('T')[0];
            const dayStats = this.dailyStats.get(dateStr);
            if (dayStats) {
                stats.push(dayStats);
            }
            current.setDate(current.getDate() + 1);
        }

        return stats;
    }

    getTotalStats(): {
        totalConnections: number;
        totalBytesUp: number;
        totalBytesDown: number;
        totalDuration: number;
        avgLatency: number;
        overallSuccessRate: number;
    } {
        const allStats = this.getAllProtocolStats();

        return {
            totalConnections: allStats.reduce((sum, s) => sum + s.totalConnections, 0),
            totalBytesUp: allStats.reduce((sum, s) => sum + s.totalBytesUp, 0),
            totalBytesDown: allStats.reduce((sum, s) => sum + s.totalBytesDown, 0),
            totalDuration: 0,
            avgLatency: this.calculateAverageLatency(allStats),
            overallSuccessRate: this.calculateOverallSuccessRate(allStats)
        };
    }

    getActiveConnections(): ConnectionStats[] {
        const now = Date.now();
        const activeThreshold = 300000; // 5 minutes

        return Array.from(this.connections.values())
            .flat()
            .filter(c => c.status === 'connected' && (now - c.timestamp) < activeThreshold);
    }

    getRecentConnections(limit: number = 50): ConnectionStats[] {
        return Array.from(this.connections.values())
            .flat()
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, limit);
    }

    getErrorConnections(limit: number = 20): ConnectionStats[] {
        return Array.from(this.connections.values())
            .flat()
            .filter(c => c.status === 'error')
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, limit);
    }

    checkAlerts(): string[] {
        if (!this.config.enableAlerts) return [];

        const alerts: string[] = [];
        const stats = this.getAllProtocolStats();

        for (const stat of stats) {
            if (stat.totalConnections === 0) continue;

            if (stat.avgLatency > this.config.alertThresholds.highLatency) {
                alerts.push(`High latency detected for ${stat.protocol}: ${stat.avgLatency.toFixed(2)}ms`);
            }

            if (stat.successRate < this.config.alertThresholds.lowSuccessRate) {
                alerts.push(`Low success rate for ${stat.protocol}: ${stat.successRate.toFixed(2)}%`);
            }

            const errorRate = 100 - stat.successRate;
            if (errorRate > this.config.alertThresholds.highErrorRate) {
                alerts.push(`High error rate for ${stat.protocol}: ${errorRate.toFixed(2)}%`);
            }
        }

        return alerts;
    }

    exportData(): string {
        const data = {
            connections: Array.from(this.connections.entries()),
            dailyStats: Array.from(this.dailyStats.entries()),
            exportedAt: new Date().toISOString()
        };

        return JSON.stringify(data, null, 2);
    }

    importData(json: string): boolean {
        try {
            const data = JSON.parse(json);
            
            if (data.connections) {
                this.connections = new Map(data.connections);
            }
            
            if (data.dailyStats) {
                this.dailyStats = new Map(data.dailyStats);
            }

            return true;
        } catch {
            return false;
        }
    }

    reset(): void {
        this.connections.clear();
        this.dailyStats.clear();
    }

    private updateDailyStats(stats: ConnectionStats): void {
        const date = new Date(stats.timestamp).toISOString().split('T')[0];
        
        if (!this.dailyStats.has(date)) {
            this.dailyStats.set(date, {
                date,
                totalConnections: 0,
                totalBytesUp: 0,
                totalBytesDown: 0,
                totalDuration: 0,
                protocols: {} as Record<ProtocolType, number>
            });
        }

        const dayStats = this.dailyStats.get(date)!;
        dayStats.totalConnections++;
        dayStats.totalBytesUp += stats.bytesUp;
        dayStats.totalBytesDown += stats.bytesDown;
        dayStats.totalDuration += stats.duration;
        dayStats.protocols[stats.protocol] = (dayStats.protocols[stats.protocol] || 0) + 1;
    }

    private cleanupOldRecords(): void {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - this.config.maxHistoryDays);

        for (const [key, list] of this.connections.entries()) {
            const filtered = list.filter(c => new Date(c.timestamp) > cutoffDate);
            this.connections.set(key, filtered);
        }

        const cutoffDateStr = cutoffDate.toISOString().split('T')[0];
        for (const date of this.dailyStats.keys()) {
            if (date < cutoffDateStr) {
                this.dailyStats.delete(date);
            }
        }
    }

    private calculateAverageLatency(stats: ProtocolStats[]): number {
        const validStats = stats.filter(s => s.avgLatency > 0);
        if (validStats.length === 0) return 0;

        return validStats.reduce((sum, s) => sum + s.avgLatency, 0) / validStats.length;
    }

    private calculateOverallSuccessRate(stats: ProtocolStats[]): number {
        const totalConnections = stats.reduce((sum, s) => sum + s.totalConnections, 0);
        if (totalConnections === 0) return 0;

        const weightedSuccess = stats.reduce((sum, s) => {
            return sum + (s.successRate * s.totalConnections);
        }, 0);

        return weightedSuccess / totalConnections;
    }
}

export function formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';

    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

export function formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
        return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
        return `${minutes}m ${secs}s`;
    } else {
        return `${secs}s`;
    }
}

export function getDefaultMonitoringConfig(): MonitoringConfig {
    return {
        enableMonitoring: true,
        maxHistoryDays: 30,
        maxConnectionsPerProtocol: 1000,
        enableAlerts: true,
        alertThresholds: {
            highLatency: 500,
            lowSuccessRate: 80,
            highErrorRate: 20
        }
    };
}

export function createConnectionStats(
    protocol: ProtocolType,
    status: ConnectionStatus,
    bytesUp: number = 0,
    bytesDown: number = 0,
    duration: number = 0,
    latency?: number,
    error?: string
): ConnectionStats {
    return {
        timestamp: Date.now(),
        protocol,
        status,
        bytesUp,
        bytesDown,
        duration,
        latency,
        error
    };
}
