export interface VMessConfig {
    uuid: string;
    host: string;
    port: number;
    alterId: number;
    security: 'auto' | 'none' | 'aes-128-gcm' | 'chacha20-poly1305';
    network: 'tcp' | 'ws' | 'grpc' | 'http' | 'quic';
    path?: string;
    hostHeader?: string;
    tls?: boolean;
    sni?: string;
    alpn?: string[];
    allowInsecure?: boolean;
    fingerprint?: string;
    reality?: {
        publicKey: string;
        shortId: string;
        spiderX: string;
    };
    name: string;
}

export function generateVMessURL(config: VMessConfig): string {
    const vmessObj = {
        v: '2',
        ps: config.name,
        add: config.host,
        port: config.port.toString(),
        id: config.uuid,
        aid: config.alterId.toString(),
        scy: config.security,
        net: config.network,
        type: 'none',
        host: config.hostHeader || '',
        path: config.path || '',
        tls: config.tls ? 'tls' : '',
        sni: config.sni || '',
        alpn: config.alpn?.join(',') || '',
        fp: config.fingerprint || '',
    };
    
    const jsonStr = JSON.stringify(vmessObj);
    const base64Str = btoa(jsonStr);
    return `vmess://${base64Str}`;
}

export function parseVMessURL(url: string): VMessConfig | null {
    try {
        if (!url.startsWith('vmess://')) {
            return null;
        }
        
        const base64Str = url.slice(8);
        const jsonStr = atob(base64Str);
        const vmessObj = JSON.parse(jsonStr);
        
        return {
            uuid: vmessObj.id || '',
            host: vmessObj.add || '',
            port: parseInt(vmessObj.port || '443', 10),
            alterId: parseInt(vmessObj.aid || '0', 10),
            security: vmessObj.scy || 'auto',
            network: vmessObj.net || 'ws',
            path: vmessObj.path || '',
            hostHeader: vmessObj.host || '',
            tls: vmessObj.tls === 'tls',
            sni: vmessObj.sni || '',
            alpn: vmessObj.alpn ? vmessObj.alpn.split(',') : undefined,
            allowInsecure: false,
            fingerprint: vmessObj.fp || '',
            name: vmessObj.ps || 'VMess'
        };
    } catch {
        return null;
    }
}

export function getSupportedCiphers(): string[] {
    return ['auto', 'none', 'aes-128-gcm', 'chacha20-poly1305'];
}

export function getSupportedNetworks(): string[] {
    return ['tcp', 'ws', 'grpc', 'http', 'quic'];
}

export function getSupportedFingerprints(): string[] {
    return [
        'chrome',
        'firefox',
        'safari',
        'ios',
        'android',
        'edge',
        'random',
        'randomized'
    ];
}

export function getDefaultVMessConfig(): VMessConfig {
    return {
        uuid: '',
        host: '',
        port: 443,
        alterId: 0,
        security: 'auto',
        network: 'ws',
        path: '/vmess',
        hostHeader: '',
        tls: true,
        sni: '',
        alpn: ['h2', 'http/1.1'],
        allowInsecure: false,
        fingerprint: 'chrome',
        name: 'BPB-VMess'
    };
}

export function generateRealityConfig(config: VMessConfig): VMessConfig {
    return {
        ...config,
        tls: true,
        security: 'none',
        reality: {
            publicKey: '',
            shortId: '',
            spiderX: '/'
        }
    };
}
