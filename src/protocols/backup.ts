import type { Settings } from '../types/global';
import type { FilterConfig } from './filter-rules';
import type { ChainConfig } from './chain-proxy';
import type { WarpProConfig } from './warp';
import type { MonitoringConfig, DailyStats } from './statistics';

export interface BackupData {
    version: string;
    createdAt: string;
    settings?: Partial<Settings>;
    filterRules?: FilterConfig;
    chainConfig?: ChainConfig;
    warpConfig?: WarpProConfig;
    monitoringConfig?: MonitoringConfig;
    statistics?: {
        dailyStats: DailyStats[];
    };
    metadata?: {
        hostname?: string;
        userId?: string;
        panelVersion?: string;
        description?: string;
        tags?: string[];
    };
}

export interface BackupOptions {
    includeSettings?: boolean;
    includeFilterRules?: boolean;
    includeChainConfig?: boolean;
    includeWarpConfig?: boolean;
    includeMonitoringConfig?: boolean;
    includeStatistics?: boolean;
    encrypt?: boolean;
    compression?: boolean;
}

export class BackupManager {
    private readonly version = '1.0.0';

    async createBackup(
        data: Partial<BackupData>,
        options: BackupOptions = {}
    ): Promise<BackupData> {
        const backup: BackupData = {
            version: this.version,
            createdAt: new Date().toISOString(),
            metadata: {
                panelVersion: data.metadata?.panelVersion || '4.2.0',
                description: data.metadata?.description || 'BPB Panel Backup',
                tags: data.metadata?.tags || []
            }
        };

        if (options.includeSettings !== false && data.settings) {
            backup.settings = this.sanitizeSettings(data.settings);
        }

        if (options.includeFilterRules !== false && data.filterRules) {
            backup.filterRules = data.filterRules;
        }

        if (options.includeChainConfig !== false && data.chainConfig) {
            backup.chainConfig = this.sanitizeChainConfig(data.chainConfig);
        }

        if (options.includeWarpConfig !== false && data.warpConfig) {
            backup.warpConfig = this.sanitizeWarpConfig(data.warpConfig);
        }

        if (options.includeMonitoringConfig !== false && data.monitoringConfig) {
            backup.monitoringConfig = data.monitoringConfig;
        }

        if (options.includeStatistics && data.statistics) {
            backup.statistics = data.statistics;
        }

        return backup;
    }

    async restoreBackup(
        backup: BackupData,
        options: BackupOptions = {}
    ): Promise<{
        success: boolean;
        errors: string[];
        warnings: string[];
    }> {
        const errors: string[] = [];
        const warnings: string[] = [];

        if (!this.validateBackup(backup)) {
            errors.push('Invalid backup format or version');
            return { success: false, errors, warnings };
        }

        if (backup.version !== this.version) {
            warnings.push(`Backup version ${backup.version} may not be fully compatible with current version ${this.version}`);
        }

        return { success: true, errors, warnings };
    }

    async exportBackup(
        backup: BackupData,
        format: 'json' | 'yaml' = 'json'
    ): Promise<string> {
        switch (format) {
            case 'json':
                return JSON.stringify(backup, null, 2);
            
            case 'yaml':
                return this.convertToYaml(backup);
            
            default:
                throw new Error(`Unsupported export format: ${format}`);
        }
    }

    async importBackup(
        data: string,
        format: 'json' | 'yaml' = 'json'
    ): Promise<BackupData | null> {
        try {
            switch (format) {
                case 'json':
                    return JSON.parse(data);
                
                case 'yaml':
                    return this.parseFromYaml(data);
                
                default:
                    throw new Error(`Unsupported import format: ${format}`);
            }
        } catch {
            return null;
        }
    }

    validateBackup(backup: any): boolean {
        if (!backup || typeof backup !== 'object') return false;
        if (!backup.version || typeof backup.version !== 'string') return false;
        if (!backup.createdAt || typeof backup.createdAt !== 'string') return false;

        const date = new Date(backup.createdAt);
        if (isNaN(date.getTime())) return false;

        return true;
    }

    getBackupSummary(backup: BackupData): {
        version: string;
        createdAt: string;
        size: number;
        includes: string[];
    } {
        const includes: string[] = [];

        if (backup.settings) includes.push('Settings');
        if (backup.filterRules) includes.push('Filter Rules');
        if (backup.chainConfig) includes.push('Chain Config');
        if (backup.warpConfig) includes.push('Warp Config');
        if (backup.monitoringConfig) includes.push('Monitoring Config');
        if (backup.statistics) includes.push('Statistics');

        return {
            version: backup.version,
            createdAt: backup.createdAt,
            size: JSON.stringify(backup).length,
            includes
        };
    }

    async createScheduledBackup(
        data: Partial<BackupData>,
        schedule: 'daily' | 'weekly' | 'monthly'
    ): Promise<string> {
        const timestamp = new Date().toISOString().split('T')[0];
        const backupId = `${schedule}_${timestamp}`;

        const backup = await this.createBackup(data, {
            includeStatistics: false
        });

        backup.metadata = {
            ...backup.metadata,
            description: `Scheduled ${schedule} backup`,
            tags: ['scheduled', schedule, backupId]
        };

        return JSON.stringify(backup);
    }

    async mergeBackups(
        primary: BackupData,
        secondary: BackupData,
        strategy: 'primary' | 'secondary' | 'merge' = 'merge'
    ): Promise<BackupData> {
        const merged: BackupData = { ...primary };

        if (strategy === 'secondary') {
            return { ...secondary };
        }

        if (strategy === 'merge') {
            if (secondary.filterRules && primary.filterRules) {
                merged.filterRules = {
                    ...primary.filterRules,
                    rules: [
                        ...primary.filterRules.rules,
                        ...secondary.filterRules.rules
                    ]
                };
            }

            if (secondary.chainConfig && primary.chainConfig) {
                merged.chainConfig = {
                    ...primary.chainConfig,
                    chains: [
                        ...primary.chainConfig.chains,
                        ...secondary.chainConfig.chains
                    ],
                    nodes: [
                        ...primary.chainConfig.nodes,
                        ...secondary.chainConfig.nodes
                    ]
                };
            }

            if (secondary.warpConfig && primary.warpConfig) {
                merged.warpConfig = {
                    ...primary.warpConfig,
                    endpoints: [
                        ...primary.warpConfig.endpoints,
                        ...secondary.warpConfig.endpoints
                    ]
                };
            }
        }

        return merged;
    }

    async encryptBackup(
        backup: BackupData,
        password: string
    ): Promise<{ data: string; salt: string; iv: string }> {
        const encoder = new TextEncoder();
        const data = encoder.encode(JSON.stringify(backup));

        const salt = crypto.getRandomValues(new Uint8Array(16));
        const iv = crypto.getRandomValues(new Uint8Array(12));

        const keyMaterial = await crypto.subtle.importKey(
            'raw',
            encoder.encode(password),
            'PBKDF2',
            false,
            ['deriveKey']
        );

        const key = await crypto.subtle.deriveKey(
            {
                name: 'PBKDF2',
                salt,
                iterations: 100000,
                hash: 'SHA-256'
            },
            keyMaterial,
            { name: 'AES-GCM', length: 256 },
            false,
            ['encrypt']
        );

        const encrypted = await crypto.subtle.encrypt(
            { name: 'AES-GCM', iv },
            key,
            data
        );

        return {
            data: btoa(String.fromCharCode(...new Uint8Array(encrypted))),
            salt: btoa(String.fromCharCode(...salt)),
            iv: btoa(String.fromCharCode(...iv))
        };
    }

    async decryptBackup(
        encryptedData: string,
        password: string,
        salt: string,
        iv: string
    ): Promise<BackupData | null> {
        try {
            const encoder = new TextEncoder();
            const decoder = new TextDecoder();

            const saltBytes = new Uint8Array(atob(salt).split('').map(c => c.charCodeAt(0)));
            const ivBytes = new Uint8Array(atob(iv).split('').map(c => c.charCodeAt(0)));
            const dataBytes = new Uint8Array(atob(encryptedData).split('').map(c => c.charCodeAt(0)));

            const keyMaterial = await crypto.subtle.importKey(
                'raw',
                encoder.encode(password),
                'PBKDF2',
                false,
                ['deriveKey']
            );

            const key = await crypto.subtle.deriveKey(
                {
                    name: 'PBKDF2',
                    salt: saltBytes,
                    iterations: 100000,
                    hash: 'SHA-256'
                },
                keyMaterial,
                { name: 'AES-GCM', length: 256 },
                false,
                ['decrypt']
            );

            const decrypted = await crypto.subtle.decrypt(
                { name: 'AES-GCM', iv: ivBytes },
                key,
                dataBytes
            );

            const json = decoder.decode(decrypted);
            return JSON.parse(json);
        } catch {
            return null;
        }
    }

    private sanitizeSettings(settings: Partial<Settings>): Partial<Settings> {
        const sanitized: Partial<Settings> = { ...settings };

        delete sanitized.TR_PASS;
        delete (sanitized as any).password;
        delete (sanitized as any).secret;

        return sanitized;
    }

    private sanitizeChainConfig(config: ChainConfig): ChainConfig {
        return {
            ...config,
            nodes: config.nodes.map(node => ({
                ...node,
                config: this.redactSensitiveConfig(node.config)
            }))
        };
    }

    private sanitizeWarpConfig(config: WarpProConfig): WarpProConfig {
        const sanitized = { ...config };
        
        if (sanitized.licenseKey && sanitized.licenseKey.length > 8) {
            sanitized.licenseKey = sanitized.licenseKey.slice(0, 4) + '****' + sanitized.licenseKey.slice(-4);
        }

        return sanitized;
    }

    private redactSensitiveConfig(config: string): string {
        try {
            if (config.includes('password=')) {
                return config.replace(/password=([^&]+)/, 'password=****');
            }
            if (config.includes('id=')) {
                return config.replace(/id=([^&@]+)/, 'id=****');
            }
            return config;
        } catch {
            return '[REDACTED]';
        }
    }

    private convertToYaml(backup: BackupData): string {
        let yaml = `# BPB Panel Backup\n`;
        yaml += `version: ${backup.version}\n`;
        yaml += `createdAt: ${backup.createdAt}\n\n`;

        if (backup.metadata) {
            yaml += `metadata:\n`;
            yaml += `  panelVersion: ${backup.metadata.panelVersion}\n`;
            if (backup.metadata.description) {
                yaml += `  description: ${backup.metadata.description}\n`;
            }
            if (backup.metadata.tags) {
                yaml += `  tags:\n${backup.metadata.tags.map(t => `    - ${t}`).join('\n')}\n`;
            }
            yaml += '\n';
        }

        yaml += `# Encoded settings data (base64)\n`;
        const settingsData = backup.settings ? btoa(JSON.stringify(backup.settings)) : '';
        yaml += `settings: ${settingsData}\n`;

        return yaml;
    }

    private parseFromYaml(yaml: string): BackupData | null {
        try {
            const lines = yaml.split('\n');
            const backup: Partial<BackupData> = {};

            for (const line of lines) {
                if (line.startsWith('version:')) {
                    backup.version = line.split(':')[1].trim();
                } else if (line.startsWith('createdAt:')) {
                    backup.createdAt = line.split(':')[1].trim();
                } else if (line.startsWith('settings:')) {
                    const data = line.split(':')[1].trim();
                    if (data) {
                        backup.settings = JSON.parse(atob(data));
                    }
                }
            }

            if (!backup.version || !backup.createdAt) {
                return null;
            }

            return backup as BackupData;
        } catch {
            return null;
        }
    }
}

export function getDefaultBackupOptions(): BackupOptions {
    return {
        includeSettings: true,
        includeFilterRules: true,
        includeChainConfig: true,
        includeWarpConfig: true,
        includeMonitoringConfig: true,
        includeStatistics: false,
        encrypt: false,
        compression: false
    };
}

export async function createQuickBackup(settings: Partial<Settings>): Promise<string> {
    const manager = new BackupManager();
    const backup = await manager.createBackup({ settings });
    return await manager.exportBackup(backup);
}
