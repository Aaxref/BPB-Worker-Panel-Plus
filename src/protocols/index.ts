export * from './shadowsocks';
export * from './vmess';
export * from './hysteria2';
export * from './tuic';
export * from './reality';
export * from './obfuscation';
export * from './bypass-rules';
export * from './dns-config';
export * from './warp';
export * from './chain-proxy';
export * from './filter-rules';
export * from './statistics';
export * from './backup';
export * from './user-system';
export * from './user-storage';

import { generateShadowsocksURL, parseShadowsocksURL, getDefaultShadowsocksConfig } from './shadowsocks';
import { generateVMessURL, parseVMessURL, getDefaultVMessConfig } from './vmess';
import { generateHysteria2URL, parseHysteria2URL, getDefaultHysteria2Config } from './hysteria2';
import { generateTUICURL, parseTUICURL, getDefaultTUICConfig } from './tuic';
import { generateRealityKeyPair, getDefaultRealityConfig } from './reality';
import { getFragmentConfig, getDefaultObfuscationConfig } from './obfuscation';
import { BYPASS_RULES, BLOCK_RULES, getBypassDomains, getBlockDomains } from './bypass-rules';
import { getDefaultDNSConfig, COMMON_DNS_SERVERS } from './dns-config';
import { getDefaultWarpProConfig, selectEndpoint } from './warp';
import { createProxyChain, getDefaultChainConfig } from './chain-proxy';
import { createFilterRule, getDefaultFilterConfig } from './filter-rules';
import { StatisticsManager, getDefaultMonitoringConfig } from './statistics';
import { BackupManager, getDefaultBackupOptions } from './backup';

export const ProtocolManager = {
    shadowsocks: {
        generate: generateShadowsocksURL,
        parse: parseShadowsocksURL,
        getDefault: getDefaultShadowsocksConfig
    },
    vmess: {
        generate: generateVMessURL,
        parse: parseVMessURL,
        getDefault: getDefaultVMessConfig
    },
    hysteria2: {
        generate: generateHysteria2URL,
        parse: parseHysteria2URL,
        getDefault: getDefaultHysteria2Config
    },
    tuic: {
        generate: generateTUICURL,
        parse: parseTUICURL,
        getDefault: getDefaultTUICConfig
    },
    reality: {
        generateKeyPair: generateRealityKeyPair,
        getDefault: getDefaultRealityConfig
    }
};

export const ObfuscationManager = {
    getFragmentConfig,
    getDefault: getDefaultObfuscationConfig
};

export const RoutingManager = {
    bypassRules: BYPASS_RULES,
    blockRules: BLOCK_RULES,
    getBypassDomains,
    getBlockDomains
};

export const DNSManager = {
    getDefault: getDefaultDNSConfig,
    commonServers: COMMON_DNS_SERVERS
};

export const WarpManager = {
    getDefault: getDefaultWarpProConfig,
    selectEndpoint
};

export const ChainManager = {
    createChain: createProxyChain,
    getDefault: getDefaultChainConfig
};

export const FilterManager = {
    createRule: createFilterRule,
    getDefault: getDefaultFilterConfig
};

export const StatisticsManagerClass = StatisticsManager;
export const BackupManagerClass = BackupManager;

export const DefaultConfigs = {
    monitoring: getDefaultMonitoringConfig(),
    backup: getDefaultBackupOptions()
};

export const SUPPORTED_PROTOCOLS = [
    'vless',
    'vmess',
    'trojan',
    'shadowsocks',
    'warp',
    'hysteria2',
    'tuic'
] as const;

export type SupportedProtocol = typeof SUPPORTED_PROTOCOLS[number];

export function isProtocolSupported(protocol: string): protocol is SupportedProtocol {
    return SUPPORTED_PROTOCOLS.includes(protocol as SupportedProtocol);
}

export function getProtocolDefaultConfig(protocol: SupportedProtocol): any {
    switch (protocol) {
        case 'shadowsocks':
            return getDefaultShadowsocksConfig();
        case 'vmess':
            return getDefaultVMessConfig();
        case 'hysteria2':
            return getDefaultHysteria2Config();
        case 'tuic':
            return getDefaultTUICConfig();
        default:
            return null;
    }
}
