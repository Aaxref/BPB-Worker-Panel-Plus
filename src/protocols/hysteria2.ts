export interface Hysteria2Config {
    host: string;
    port: number;
    password: string;
    obfs?: string;
    sni?: string;
    skipCertVerify?: boolean;
    alpn?: string[];
    fingerprint?: string;
    pinSHA256?: string;
    enableBrutal?: boolean;
    upMbps?: number;
    downMbps?: number;
    name: string;
}

export function generateHysteria2URL(config: Hysteria2Config): string {
    let url = `hysteria2://${encodeURIComponent(config.password)}@${config.host}:${config.port}`;
    
    const params: string[] = [];
    
    if (config.sni) {
        params.push(`sni=${encodeURIComponent(config.sni)}`);
    }
    
    if (config.obfs) {
        params.push(`obfs=${encodeURIComponent(config.obfs)}`);
    }
    
    if (config.skipCertVerify) {
        params.push('insecure=1');
    }
    
    if (config.alpn && config.alpn.length > 0) {
        params.push(`alpn=${encodeURIComponent(config.alpn.join(','))}`);
    }
    
    if (config.fingerprint) {
        params.push(`fp=${encodeURIComponent(config.fingerprint)}`);
    }
    
    if (config.pinSHA256) {
        params.push(`pinsha256=${encodeURIComponent(config.pinSHA256)}`);
    }
    
    if (config.enableBrutal) {
        if (config.upMbps) {
            params.push(`upmbps=${config.upMbps}`);
        }
        if (config.downMbps) {
            params.push(`downmbps=${config.downMbps}`);
        }
    }
    
    if (params.length > 0) {
        url += `?${params.join('&')}`;
    }
    
    url += `#${encodeURIComponent(config.name)}`;
    return url;
}

export function parseHysteria2URL(url: string): Hysteria2Config | null {
    try {
        const parsed = new URL(url);
        
        if (parsed.protocol !== 'hysteria2:') {
            return null;
        }
        
        const hashIndex = url.indexOf('#');
        const name = hashIndex > -1 
            ? decodeURIComponent(url.slice(hashIndex + 1)) 
            : 'Hysteria2';
        
        const password = decodeURIComponent(parsed.username);
        const host = parsed.hostname;
        const port = parseInt(parsed.port, 10);
        
        const params = new URLSearchParams(parsed.search);
        
        return {
            host,
            port,
            password,
            obfs: params.get('obfs') || undefined,
            sni: params.get('sni') || undefined,
            skipCertVerify: params.get('insecure') === '1',
            alpn: params.get('alpn')?.split(','),
            fingerprint: params.get('fp') || undefined,
            pinSHA256: params.get('pinsha256') || undefined,
            enableBrutal: params.has('upmbps') || params.has('downmbps'),
            upMbps: params.get('upmbps') ? parseInt(params.get('upmbps')!, 10) : undefined,
            downMbps: params.get('downmbps') ? parseInt(params.get('downmbps')!, 10) : undefined,
            name
        };
    } catch {
        return null;
    }
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

export function generateObfsPassword(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return btoa(String.fromCharCode(...array));
}

export function getDefaultHysteria2Config(): Hysteria2Config {
    return {
        host: '',
        port: 443,
        password: generateObfsPassword(),
        obfs: 'salamander',
        sni: '',
        skipCertVerify: false,
        alpn: ['h3'],
        fingerprint: 'chrome',
        enableBrutal: true,
        upMbps: 10,
        downMbps: 50,
        name: 'BPB-Hysteria2'
    };
}
