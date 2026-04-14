interface WarpKeys {
    publicKey: string;
    privateKey: string;
}

export interface WarpEndpoint {
    host: string;
    port: number;
    priority: number;
    enabled: boolean;
}

export interface WarpProConfig {
    licenseKey?: string;
    accountType: 'free' | 'plus' | 'team';
    enableLoadBalancing: boolean;
    loadBalancingMode: 'round-robin' | 'random' | 'least-conn' | 'weighted';
    endpoints: WarpEndpoint[];
    mtu: number;
    enableIPv6: boolean;
    enableLazy: boolean;
    enableNoise: boolean;
}

export async function fetchWarpAccounts(env: Env, count: number = 2): Promise<WarpAccount[]> {
    const WarpAccounts: WarpAccount[] = [];
    const apiBaseUrl = 'https://api.cloudflareclient.com/v0a4005/reg';
    const warpKeys: WarpKeys[] = [];

    for (let i = 0; i < count; i++) {
        warpKeys.push(await generateKeyPair());
    }

    const fetchAccount = async (key: WarpKeys, licenseKey?: string): Promise<any> => {
        try {
            const headers: Record<string, string> = {
                'User-Agent': 'insomnia/8.6.1',
                'Content-Type': 'application/json'
            };

            const body: any = {
                install_id: "",
                fcm_token: "",
                tos: new Date().toISOString(),
                type: "Android",
                model: 'PC',
                locale: 'en_US',
                warp_enabled: true,
                key: key.publicKey
            };

            if (licenseKey) {
                body['license'] = licenseKey;
            }

            const response = await fetch(apiBaseUrl, {
                method: 'POST',
                headers,
                body: JSON.stringify(body)
            });

            return await response.json();
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            throw new Error(`Failed to get warp configs: ${message}`);
        }
    };

    for (const key of warpKeys) {
        const { config, account } = await fetchAccount(key);
        const accountType = account?.account_type || 'free';

        WarpAccounts.push({
            privateKey: key.privateKey,
            warpIPv6: `${config.interface.addresses.v6}/128`,
            reserved: config.client_id,
            publicKey: config.peers[0].public_key,
            accountType: accountType
        });
    }

    await env.kv.put('warpAccounts', JSON.stringify(WarpAccounts));
    return WarpAccounts;
}

async function generateKeyPair(): Promise<WarpKeys> {
    const keyPair = await crypto.subtle.generateKey(
        { name: "X25519", namedCurve: "X25519" },
        true,
        ["deriveBits"]
    );

    const pkcs8 = await crypto.subtle.exportKey("pkcs8", keyPair.privateKey);
    const privateKeyRaw = new Uint8Array(pkcs8).slice(-32);

    const publicKeyRaw = new Uint8Array(
        await crypto.subtle.exportKey("raw", keyPair.publicKey)
    );

    const base64Encode = (arr: Uint8Array) => btoa(String.fromCharCode(...arr));

    return {
        publicKey: base64Encode(publicKeyRaw),
        privateKey: base64Encode(privateKeyRaw)
    };
}

export const DEFAULT_WARP_ENDPOINTS: WarpEndpoint[] = [
    { host: 'engage.cloudflareclient.com', port: 2408, priority: 1, enabled: true },
    { host: '162.159.192.1', port: 2408, priority: 2, enabled: true },
    { host: '162.159.193.1', port: 2408, priority: 3, enabled: true },
    { host: '162.159.195.1', port: 2408, priority: 4, enabled: true },
    { host: '188.114.96.1', port: 2408, priority: 5, enabled: true },
    { host: '188.114.97.1', port: 2408, priority: 6, enabled: true }
];

export function getDefaultWarpProConfig(): WarpProConfig {
    return {
        licenseKey: '',
        accountType: 'free',
        enableLoadBalancing: true,
        loadBalancingMode: 'random',
        endpoints: DEFAULT_WARP_ENDPOINTS,
        mtu: 1280,
        enableIPv6: true,
        enableLazy: true,
        enableNoise: false
    };
}

export function selectEndpoint(config: WarpProConfig): WarpEndpoint | null {
    const enabledEndpoints = config.endpoints.filter(ep => ep.enabled);
    
    if (enabledEndpoints.length === 0) {
        return null;
    }

    switch (config.loadBalancingMode) {
        case 'random':
            return enabledEndpoints[Math.floor(Math.random() * enabledEndpoints.length)];
        
        case 'round-robin':
            const index = Math.floor(Date.now() / 60000) % enabledEndpoints.length;
            return enabledEndpoints[index];
        
        case 'weighted':
            const totalWeight = enabledEndpoints.reduce((sum, ep) => sum + ep.priority, 0);
            let random = Math.random() * totalWeight;
            for (const ep of enabledEndpoints) {
                random -= ep.priority;
                if (random <= 0) return ep;
            }
            return enabledEndpoints[0];
        
        case 'least-conn':
            return enabledEndpoints.reduce((min, ep) => 
                ep.priority < min.priority ? ep : min
            );
        
        default:
            return enabledEndpoints[0];
    }
}

export async function validateWarpLicense(licenseKey: string): Promise<boolean> {
    try {
        const response = await fetch('https://api.cloudflareclient.com/v0a4005/reg', {
            method: 'POST',
            headers: {
                'User-Agent': 'insomnia/8.6.1',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                install_id: "",
                fcm_token: "",
                tos: new Date().toISOString(),
                type: "Android",
                model: 'PC',
                locale: 'en_US',
                warp_enabled: true,
                license: licenseKey,
                key: (await generateKeyPair()).publicKey
            })
        });

        const data = await response.json();
        return data.account?.account_type === 'plus' || data.account?.account_type === 'team';
    } catch {
        return false;
    }
}

export function generateWarpConfigURL(
    account: WarpAccount,
    endpoint: WarpEndpoint,
    config: WarpProConfig
): string {
    const url = new URL('wireguard://');
    url.searchParams.set('public_key', account.publicKey);
    url.searchParams.set('private_key', account.privateKey);
    url.searchParams.set('endpoint', `${endpoint.host}:${endpoint.port}`);
    url.searchParams.set('allowed_ip', '0.0.0.0/0');
    url.searchParams.set('allowed_ip', '::/0');
    
    if (config.enableIPv6) {
        url.searchParams.set('address', account.warpIPv6);
    }
    
    url.searchParams.set('mtu', config.mtu.toString());
    
    if (account.reserved) {
        url.searchParams.set('reserved', account.reserved);
    }
    
    if (config.enableLazy) {
        url.searchParams.set('lazy', '1');
    }
    
    if (config.enableNoise) {
        url.searchParams.set('noise', '1');
    }
    
    return url.toString();
}