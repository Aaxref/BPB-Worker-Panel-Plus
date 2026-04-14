export type FragmentMode = 'custom' | 'low' | 'medium' | 'high' | 'severe' | 'glider' | 'obfs' | 'random-packet';
export type Fingerprint = 'chrome' | 'firefox' | 'safari' | 'edge' | 'ios' | 'android' | 'random' | 'randomized' | 
    'chrome116' | 'chrome117' | 'chrome118' | 'chrome119' | 'chrome120' | 'chrome121' | 'chrome122' | 
    'chrome123' | 'chrome124' | 'chrome125' | 'chrome126' | 'chrome127' | 'chrome128' | 'chrome129' | 'chrome130';

export interface FragmentConfig {
    mode: FragmentMode;
    lengthMin: number;
    lengthMax: number;
    intervalMin: number;
    intervalMax: number;
    packets: 'tlshello' | '1-1' | '1-2' | '1-3' | '1-5';
    maxSplitMin?: number;
    maxSplitMax?: number;
}

export interface FingerprintConfig {
    enabled: boolean;
    fingerprint: Fingerprint;
}

export interface ObfuscationConfig {
    fragment: FragmentConfig;
    fingerprint: FingerprintConfig;
    enableECH: boolean;
    echServerName: string;
    http2: boolean;
    http3: boolean;
    grpc: boolean;
    grpcServiceName: string;
}

export const FRAGMENT_PRESETS: Record<FragmentMode, FragmentConfig> = {
    custom: {
        mode: 'custom',
        lengthMin: 100,
        lengthMax: 200,
        intervalMin: 1,
        intervalMax: 1,
        packets: 'tlshello'
    },
    low: {
        mode: 'low',
        lengthMin: 100,
        lengthMax: 200,
        intervalMin: 1,
        intervalMax: 1,
        packets: 'tlshello'
    },
    medium: {
        mode: 'medium',
        lengthMin: 50,
        lengthMax: 100,
        intervalMin: 1,
        intervalMax: 5,
        packets: 'tlshello'
    },
    high: {
        mode: 'high',
        lengthMin: 10,
        lengthMax: 20,
        intervalMin: 10,
        intervalMax: 20,
        packets: 'tlshello'
    },
    severe: {
        mode: 'severe',
        lengthMin: 1,
        lengthMax: 5,
        intervalMin: 1,
        intervalMax: 5,
        packets: 'tlshello'
    },
    glider: {
        mode: 'glider',
        lengthMin: 50,
        lengthMax: 150,
        intervalMin: 2,
        intervalMax: 10,
        packets: '1-2',
        maxSplitMin: 3,
        maxSplitMax: 5
    },
    obfs: {
        mode: 'obfs',
        lengthMin: 20,
        lengthMax: 100,
        intervalMin: 1,
        intervalMax: 3,
        packets: '1-3',
        maxSplitMin: 5,
        maxSplitMax: 10
    },
    'random-packet': {
        mode: 'random-packet',
        lengthMin: 10,
        lengthMax: 500,
        intervalMin: 0,
        intervalMax: 20,
        packets: '1-5',
        maxSplitMin: 2,
        maxSplitMax: 20
    }
};

export const FINGERPRINTS: Fingerprint[] = [
    'chrome',
    'firefox',
    'safari',
    'edge',
    'ios',
    'android',
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

export function getFragmentConfig(mode: FragmentMode): FragmentConfig {
    return FRAGMENT_PRESETS[mode] || FRAGMENT_PRESETS.low;
}

export function generateRandomFragmentSize(config: FragmentConfig): number {
    const min = config.lengthMin;
    const max = config.lengthMax;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateRandomFragmentInterval(config: FragmentConfig): number {
    const min = config.intervalMin;
    const max = config.intervalMax;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getFingerprintValue(fingerprint: Fingerprint): string {
    if (fingerprint === 'random') {
        const fingerprints = ['chrome', 'firefox', 'safari', 'edge', 'ios', 'android'];
        return fingerprints[Math.floor(Math.random() * fingerprints.length)];
    }
    if (fingerprint === 'randomized') {
        const version = Math.floor(Math.random() * 15) + 116;
        return `chrome${version}`;
    }
    return fingerprint;
}

export function getSupportedFragmentModes(): FragmentMode[] {
    return Object.keys(FRAGMENT_PRESETS) as FragmentMode[];
}

export function getSupportedFingerprints(): Fingerprint[] {
    return [...FINGERPRINTS];
}

export function getDefaultObfuscationConfig(): ObfuscationConfig {
    return {
        fragment: FRAGMENT_PRESETS.low,
        fingerprint: {
            enabled: true,
            fingerprint: 'chrome'
        },
        enableECH: false,
        echServerName: '',
        http2: true,
        http3: false,
        grpc: false,
        grpcServiceName: 'grpc'
    };
}

export function validateFragmentConfig(config: FragmentConfig): boolean {
    if (config.lengthMin < 1 || config.lengthMax < 1) return false;
    if (config.lengthMin > config.lengthMax) return false;
    if (config.intervalMin < 0 || config.intervalMax < 0) return false;
    if (config.intervalMin > config.intervalMax) return false;
    if (config.maxSplitMin && config.maxSplitMax && config.maxSplitMin > config.maxSplitMax) {
        return false;
    }
    return true;
}

export function generateNoisePacket(type: 'base64' | 'hex' | 'rand' | 'str', value: string): Uint8Array {
    switch (type) {
        case 'base64': {
            return new Uint8Array(atob(value).split('').map(c => c.charCodeAt(0)));
        }
        case 'hex': {
            const hex = value.replace(/\s/g, '');
            const bytes = new Uint8Array(hex.length / 2);
            for (let i = 0; i < hex.length; i += 2) {
                bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
            }
            return bytes;
        }
        case 'rand': {
            const [min, max] = value.split('-').map(Number);
            const length = Math.floor(Math.random() * (max - min + 1)) + min;
            const bytes = new Uint8Array(length);
            crypto.getRandomValues(bytes);
            return bytes;
        }
        case 'str': {
            return new TextEncoder().encode(value);
        }
        default:
            return new Uint8Array(0);
    }
}

export function generateRandomHex(length: number): string {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

export function generateRandomBase64(length: number): string {
    const array = new Uint8Array(Math.ceil(length * 3 / 4));
    crypto.getRandomValues(array);
    return btoa(String.fromCharCode(...array)).slice(0, length);
}
