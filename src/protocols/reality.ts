export interface RealityConfig {
    dest: string;
    serverNames: string[];
    privateKey: string;
    shortIds: string[];
    fingerprint: string;
    spiderX: string;
}

export interface RealityServerConfig {
    publicKey: string;
    shortId: string;
    spiderX: string;
    serverNames: string[];
}

export async function generateRealityKeyPair(): Promise<{
    privateKey: string;
    publicKey: string;
}> {
    const keyPair = await crypto.subtle.generateKey(
        { name: "X25519", namedCurve: "X25519" },
        true,
        ["deriveKey", "deriveBits"]
    );

    const privateKeyRaw = new Uint8Array(
        await crypto.subtle.exportKey("pkcs8", keyPair.privateKey)
    ).slice(-32);

    const publicKeyRaw = new Uint8Array(
        await crypto.subtle.exportKey("raw", keyPair.publicKey)
    );

    const base64Encode = (arr: Uint8Array) => btoa(String.fromCharCode(...arr));

    return {
        privateKey: base64Encode(privateKeyRaw),
        publicKey: base64Encode(publicKeyRaw)
    };
}

export function generateShortId(length: number = 8): string {
    const array = new Uint8Array(Math.ceil(length / 2));
    crypto.getRandomValues(array);
    return Array.from(array)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')
        .slice(0, length);
}

export function getSupportedFingerprints(): string[] {
    return [
        'chrome',
        'firefox',
        'safari',
        'ios',
        'android',
        'edge',
        'chrome116',
        'chrome117',
        'chrome118',
        'chrome119',
        'chrome120',
        'chrome121',
        'chrome122',
        'chrome123',
        'chrome124',
        'chrome125',
        'chrome126',
        'chrome127',
        'chrome128',
        'chrome129',
        'chrome130',
        'random',
        'randomized'
    ];
}

export function getCommonDestinations(): string[] {
    return [
        'www.microsoft.com:443',
        'www.apple.com:443',
        'www.google.com:443',
        'www.cloudflare.com:443',
        'www.amazon.com:443',
        'www.facebook.com:443',
        'www.twitter.com:443',
        'www.github.com:443',
        'www.reddit.com:443',
        'www.wikipedia.org:443'
    ];
}

export function getCommonServerNames(): string[] {
    return [
        'www.microsoft.com',
        'www.apple.com',
        'www.google.com',
        'www.cloudflare.com',
        'www.amazon.com',
        'www.facebook.com',
        'www.twitter.com',
        'www.github.com',
        'www.reddit.com',
        'www.wikipedia.org',
        'itunes.apple.com',
        'microsoft.com',
        'google.com',
        'cloudflare.com',
        'amazon.com'
    ];
}

export function getDefaultRealityConfig(): RealityConfig {
    return {
        dest: 'www.microsoft.com:443',
        serverNames: ['www.microsoft.com'],
        privateKey: '',
        shortIds: [''],
        fingerprint: 'chrome',
        spiderX: '/'
    };
}

export function getRealityClientConfig(serverConfig: RealityServerConfig, clientPrivateKey: string): {
    serverName: string;
    fingerprint: string;
    publicKey: string;
    shortId: string;
    spiderX: string;
    privateKey: string;
} {
    return {
        serverName: serverConfig.serverNames[0],
        fingerprint: 'chrome',
        publicKey: serverConfig.publicKey,
        shortId: serverConfig.shortId,
        spiderX: serverConfig.spiderX,
        privateKey: clientPrivateKey
    };
}

export function validatePublicKey(key: string): boolean {
    try {
        const decoded = atob(key);
        return decoded.length === 32;
    } catch {
        return false;
    }
}

export function validateShortId(id: string): boolean {
    if (id.length === 0) return true;
    const hexRegex = /^[0-9a-fA-F]+$/;
    return hexRegex.test(id) && (id.length === 8 || id.length === 16);
}
