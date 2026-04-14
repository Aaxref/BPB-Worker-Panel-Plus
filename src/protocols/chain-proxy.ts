export type ProxyType = 'vless' | 'vmess' | 'trojan' | 'shadowsocks' | 'socks' | 'http' | 'v2ray';
export type ChainMode = 'serial' | 'parallel' | 'failover' | 'load-balance';

export interface ProxyNode {
    id: string;
    name: string;
    type: ProxyType;
    config: string;
    enabled: boolean;
    priority: number;
    latency?: number;
    lastCheck?: number;
}

export interface ProxyChain {
    id: string;
    name: string;
    mode: ChainMode;
    nodes: string[];
    enabled: boolean;
}

export interface ChainConfig {
    chains: ProxyChain[];
    nodes: ProxyNode[];
    enableHealthCheck: boolean;
    healthCheckInterval: number;
    healthCheckTimeout: number;
    enableFailover: boolean;
    failoverThreshold: number;
}

export function parseProxyURL(url: string): ProxyNode | null {
    try {
        if (url.startsWith('vless://')) {
            return {
                id: generateId(),
                name: 'VLESS',
                type: 'vless',
                config: url,
                enabled: true,
                priority: 1
            };
        }
        
        if (url.startsWith('vmess://')) {
            return {
                id: generateId(),
                name: 'VMess',
                type: 'vmess',
                config: url,
                enabled: true,
                priority: 1
            };
        }
        
        if (url.startsWith('trojan://')) {
            return {
                id: generateId(),
                name: 'Trojan',
                type: 'trojan',
                config: url,
                enabled: true,
                priority: 1
            };
        }
        
        if (url.startsWith('ss://')) {
            return {
                id: generateId(),
                name: 'Shadowsocks',
                type: 'shadowsocks',
                config: url,
                enabled: true,
                priority: 1
            };
        }
        
        if (url.startsWith('socks://') || url.startsWith('socks5://')) {
            return {
                id: generateId(),
                name: 'SOCKS',
                type: 'socks',
                config: url,
                enabled: true,
                priority: 1
            };
        }
        
        if (url.startsWith('http://') || url.startsWith('https://')) {
            const parsed = new URL(url);
            if (parsed.username || parsed.password) {
                return {
                    id: generateId(),
                    name: 'HTTP',
                    type: 'http',
                    config: url,
                    enabled: true,
                    priority: 1
                };
            }
        }
        
        return null;
    } catch {
        return null;
    }
}

export function generateId(): string {
    return `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function createProxyChain(name: string, mode: ChainMode, nodeIds: string[]): ProxyChain {
    return {
        id: `chain_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name,
        mode,
        nodes: nodeIds,
        enabled: true
    };
}

export function selectNodesForChain(chain: ProxyChain, nodes: ProxyNode[]): ProxyNode[] {
    const chainNodes = nodes.filter(node => chain.nodes.includes(node.id) && node.enabled);
    
    switch (chain.mode) {
        case 'serial':
            return chainNodes.sort((a, b) => a.priority - b.priority);
        
        case 'parallel':
            return chainNodes;
        
        case 'failover':
            return chainNodes
                .sort((a, b) => a.priority - b.priority)
                .filter(node => {
                    if (!node.lastCheck) return true;
                    const age = Date.now() - node.lastCheck;
                    return age < 300000;
                });
        
        case 'load-balance':
            return chainNodes
                .sort((a, b) => (a.latency || Infinity) - (b.latency || Infinity));
        
        default:
            return chainNodes;
    }
}

export function getBestNodeForFailover(nodes: ProxyNode[]): ProxyNode | null {
    const enabledNodes = nodes.filter(node => {
        if (!node.enabled || !node.lastCheck) return false;
        const age = Date.now() - node.lastCheck;
        return age < 300000;
    });
    
    if (enabledNodes.length === 0) {
        return nodes.filter(n => n.enabled)[0] || null;
    }
    
    return enabledNodes.reduce((best, node) => {
        if (!best) return node;
        if (!node.latency) return best;
        if (!best.latency) return node;
        return node.latency < best.latency ? node : best;
    });
}

export function validateProxyURL(url: string): boolean {
    const proxyPatterns = [
        /^vless:\/\/[^\s]+$/,
        /^vmess:\/\/[^\s]+$/,
        /^trojan:\/\/[^\s]+$/,
        /^ss:\/\/[^\s]+$/,
        /^ssocks[5]?:\/\/[^\s]+$/,
        /^https?:\/\/[^\s@]+@[^\s]+/
    ];
    
    return proxyPatterns.some(pattern => pattern.test(url));
}

export function getDefaultChainConfig(): ChainConfig {
    return {
        chains: [],
        nodes: [],
        enableHealthCheck: true,
        healthCheckInterval: 60,
        healthCheckTimeout: 5,
        enableFailover: true,
        failoverThreshold: 3
    };
}

export async function checkNodeHealth(node: ProxyNode, timeout: number = 5000): Promise<{ success: boolean; latency: number }> {
    const startTime = Date.now();
    
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        
        const testUrl = 'https://www.google.com/generate_204';
        await fetch(testUrl, {
            method: 'HEAD',
            signal: controller.signal,
            cache: 'no-store'
        });
        
        clearTimeout(timeoutId);
        const latency = Date.now() - startTime;
        
        return { success: true, latency };
    } catch {
        return { success: false, latency: -1 };
    }
}

export function formatChainConfig(chain: ProxyChain, nodes: ProxyNode[]): string {
    const chainNodes = selectNodesForChain(chain, nodes);
    
    switch (chain.mode) {
        case 'serial':
            return chainNodes.map(n => n.config).join(' -> ');
        
        case 'parallel':
            return chainNodes.map(n => n.config).join(' || ');
        
        case 'failover':
            return chainNodes.map(n => n.config).join(' | ');
        
        case 'load-balance':
            return chainNodes.map(n => n.config).join(' , ');
        
        default:
            return chainNodes.map(n => n.config).join(' -> ');
    }
}

export function exportChainConfig(config: ChainConfig): string {
    return JSON.stringify(config, null, 2);
}

export function importChainConfig(json: string): ChainConfig | null {
    try {
        const parsed = JSON.parse(json);
        
        if (!parsed.chains || !Array.isArray(parsed.chains)) return null;
        if (!parsed.nodes || !Array.isArray(parsed.nodes)) return null;
        
        return parsed as ChainConfig;
    } catch {
        return null;
    }
}

export function getChainModeDescription(mode: ChainMode): string {
    switch (mode) {
        case 'serial':
            return 'Traffic passes through nodes in sequence';
        case 'parallel':
            return 'Traffic is distributed across all nodes simultaneously';
        case 'failover':
            return 'Automatically switches to next node on failure';
        case 'load-balance':
            return 'Distributes traffic based on node latency';
    }
}

export function getProxyTypeDescription(type: ProxyType): string {
    switch (type) {
        case 'vless':
            return 'VLESS - Lightweight protocol';
        case 'vmess':
            return 'VMess - Dynamic port protocol';
        case 'trojan':
            return 'Trojan - TLS camouflaged protocol';
        case 'shadowsocks':
            return 'Shadowsocks - Secure proxy protocol';
        case 'socks':
            return 'SOCKS5 - Socket Secure proxy';
        case 'http':
            return 'HTTP/HTTPS - Standard web proxy';
        case 'v2ray':
            return 'V2Ray - Multi-protocol proxy';
    }
}
