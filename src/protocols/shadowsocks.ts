export interface ShadowsocksConfig {
    host: string;
    port: number;
    password: string;
    method: 'aes-128-gcm' | 'aes-256-gcm' | 'chacha20-poly1305' | 'xchacha20-poly1305';
    plugin?: 'obfs' | 'v2ray-plugin';
    pluginOpts?: string;
    name: string;
}

const SS_METHODS = {
    'aes-128-gcm': 'aes-128-gcm',
    'aes-256-gcm': 'aes-256-gcm',
    'chacha20-poly1305': 'chacha20-ietf-poly1305',
    'xchacha20-poly1305': 'xchacha20-ietf-poly1305'
};

export function generateShadowsocksURL(config: ShadowsocksConfig): string {
    const method = SS_METHODS[config.method] || config.method;
    const userInfo = `${method}:${encodeURIComponent(config.password)}`;
    const base64UserInfo = btoa(userInfo);
    
    let url = `ss://${base64UserInfo}@${config.host}:${config.port}`;
    
    if (config.plugin) {
        const plugin = config.pluginOpts 
            ? `${config.plugin};${config.pluginOpts}` 
            : config.plugin;
        url += `?plugin=${encodeURIComponent(plugin)}`;
    }
    
    url += `#${encodeURIComponent(config.name)}`;
    return url;
}

export function parseShadowsocksURL(url: string): ShadowsocksConfig | null {
    try {
        const parsed = new URL(url);
        
        if (parsed.protocol !== 'ss:') {
            return null;
        }
        
        const hashIndex = url.indexOf('#');
        const name = hashIndex > -1 
            ? decodeURIComponent(url.slice(hashIndex + 1)) 
            : 'Shadowsocks';
        
        const withoutHash = url.slice(0, hashIndex > -1 ? hashIndex : url.length);
        const atIndex = withoutHash.indexOf('@');
        
        if (atIndex === -1) return null;
        
        const base64UserInfo = withoutHash.slice(3, atIndex);
        const hostPort = withoutHash.slice(atIndex + 1);
        const userInfo = atob(base64UserInfo);
        const colonIndex = userInfo.indexOf(':');
        
        if (colonIndex === -1) return null;
        
        const method = userInfo.slice(0, colonIndex);
        const password = decodeURIComponent(userInfo.slice(colonIndex + 1));
        
        const [host, portStr] = hostPort.split(':');
        const port = parseInt(portStr, 10);
        
        let plugin: ShadowsocksConfig['plugin'];
        let pluginOpts: string;
        
        if (parsed.searchParams.has('plugin')) {
            const pluginValue = parsed.searchParams.get('plugin')!;
            const semicolonIndex = pluginValue.indexOf(';');
            
            if (semicolonIndex > -1) {
                plugin = pluginValue.slice(0, semicolonIndex) as any;
                pluginOpts = pluginValue.slice(semicolonIndex + 1);
            } else {
                plugin = pluginValue as any;
            }
        }
        
        return {
            host,
            port,
            password,
            method: method as any,
            plugin,
            pluginOpts,
            name
        };
    } catch {
        return null;
    }
}

export function getSupportedMethods(): string[] {
    return Object.keys(SS_METHODS);
}

export function getDefaultShadowsocksConfig(): ShadowsocksConfig {
    return {
        host: '',
        port: 8388,
        password: '',
        method: 'chacha20-poly1305',
        name: 'BPB-Shadowsocks'
    };
}
