export interface TUICConfig {
    host: string;
    port: number;
    uuid: string;
    password: string;
    ip?: string;
    heartbeat?: number;
    reduceRtt?: boolean;
    requestTimeout?: number;
    udpRelayMode?: 'native' | 'quic';
    congestionControl?: 'cubic' | 'bbr' | 'new_reno';
    sni?: string;
    alpn?: string[];
    disableSni?: boolean;
    enableZeroRtt?: boolean;
    name: string;
}

export function generateTUICURL(config: TUICConfig): string {
    const userInfo = `${config.uuid}:${config.password}`;
    const base64UserInfo = btoa(userInfo);
    
    let url = `tuic://${base64UserInfo}@${config.host}:${config.port}`;
    
    const params: string[] = [];
    
    if (config.sni) {
        params.push(`sni=${encodeURIComponent(config.sni)}`);
    }
    
    if (config.udpRelayMode) {
        params.push(`udp_relay_mode=${config.udpRelayMode}`);
    }
    
    if (config.congestionControl) {
        params.push(`congestion_control=${config.congestionControl}`);
    }
    
    if (config.alpn && config.alpn.length > 0) {
        params.push(`alpn=${encodeURIComponent(config.alpn.join(','))}`);
    }
    
    if (config.disableSni) {
        params.push('disable_sni=1');
    }
    
    if (config.enableZeroRtt) {
        params.push('enable_0rtt=1');
    }
    
    if (config.heartbeat) {
        params.push(`heartbeat=${config.heartbeat}`);
    }
    
    if (config.reduceRtt) {
        params.push('reduce_rtt=1');
    }
    
    if (config.requestTimeout) {
        params.push(`request_timeout=${config.requestTimeout}`);
    }
    
    if (params.length > 0) {
        url += `?${params.join('&')}`;
    }
    
    url += `#${encodeURIComponent(config.name)}`;
    return url;
}

export function parseTUICURL(url: string): TUICConfig | null {
    try {
        const parsed = new URL(url);
        
        if (parsed.protocol !== 'tuic:') {
            return null;
        }
        
        const hashIndex = url.indexOf('#');
        const name = hashIndex > -1 
            ? decodeURIComponent(url.slice(hashIndex + 1)) 
            : 'TUIC';
        
        const base64UserInfo = parsed.username;
        const userInfo = atob(base64UserInfo);
        const colonIndex = userInfo.indexOf(':');
        
        if (colonIndex === -1) return null;
        
        const uuid = userInfo.slice(0, colonIndex);
        const password = userInfo.slice(colonIndex + 1);
        
        const host = parsed.hostname;
        const port = parseInt(parsed.port, 10);
        
        const params = new URLSearchParams(parsed.search);
        
        return {
            host,
            port,
            uuid,
            password,
            sni: params.get('sni') || undefined,
            udpRelayMode: (params.get('udp_relay_mode') as any) || 'native',
            congestionControl: (params.get('congestion_control') as any) || 'bbr',
            alpn: params.get('alpn')?.split(','),
            disableSni: params.get('disable_sni') === '1',
            enableZeroRtt: params.get('enable_0rtt') === '1',
            heartbeat: params.get('heartbeat') ? parseInt(params.get('heartbeat')!, 10) : undefined,
            reduceRtt: params.get('reduce_rtt') === '1',
            requestTimeout: params.get('request_timeout') ? parseInt(params.get('request_timeout')!, 10) : undefined,
            name
        };
    } catch {
        return null;
    }
}

export function getSupportedCongestionControl(): string[] {
    return ['cubic', 'bbr', 'new_reno'];
}

export function getSupportedUdpRelayModes(): string[] {
    return ['native', 'quic'];
}

export function getDefaultTUICConfig(): TUICConfig {
    return {
        host: '',
        port: 443,
        uuid: '',
        password: '',
        udpRelayMode: 'native',
        congestionControl: 'bbr',
        sni: '',
        alpn: ['h3'],
        disableSni: false,
        enableZeroRtt: true,
        heartbeat: 10,
        reduceRtt: true,
        requestTimeout: 8,
        name: 'BPB-TUIC'
    };
}
