export type RuleType = 'domain' | 'ip' | 'cidr' | 'regex';
export type RuleAction = 'whitelist' | 'blacklist';
export type RuleScope = 'all' | 'vless' | 'vmess' | 'trojan' | 'shadowsocks' | 'warp' | 'hysteria2' | 'tuic';

export interface FilterRule {
    id: string;
    name: string;
    type: RuleType;
    action: RuleAction;
    value: string;
    scope: RuleScope[];
    enabled: boolean;
    priority: number;
    createdAt: number;
    updatedAt: number;
    description?: string;
}

export interface FilterConfig {
    rules: FilterRule[];
    enableWhitelist: boolean;
    enableBlacklist: boolean;
    defaultAction: 'allow' | 'block';
    enableRegex: boolean;
    caseSensitive: boolean;
}

export const DEFAULT_BLOCKED_DOMAINS: string[] = [
    'malware-site.com',
    'phishing-site.net',
    'scam-site.org'
];

export const DEFAULT_BLOCKED_IPS: string[] = [
    '0.0.0.0/8',
    '127.0.0.0/8',
    '224.0.0.0/4'
];

export const DEFAULT_WHITELISTED_DOMAINS: string[] = [
    'localhost',
    '*.local',
    '*.internal'
];

export function createFilterRule(
    name: string,
    type: RuleType,
    action: RuleAction,
    value: string,
    scope: RuleScope[] = ['all'],
    priority: number = 100
): FilterRule {
    const now = Date.now();
    
    return {
        id: `rule_${now}_${Math.random().toString(36).substr(2, 9)}`,
        name,
        type,
        action,
        value,
        scope,
        enabled: true,
        priority,
        createdAt: now,
        updatedAt: now
    };
}

export function validateRuleValue(type: RuleType, value: string): boolean {
    switch (type) {
        case 'domain':
            return validateDomain(value);
        
        case 'ip':
            return validateIP(value);
        
        case 'cidr':
            return validateCIDR(value);
        
        case 'regex':
            return validateRegex(value);
        
        default:
            return false;
    }
}

export function validateDomain(domain: string): boolean {
    if (!domain || domain.length > 253) return false;
    
    const domainRegex = /^(\*\.)?([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,63}$/;
    return domainRegex.test(domain);
}

export function validateIP(ip: string): boolean {
    const ipv4Regex = /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)$/;
    const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
    
    return ipv4Regex.test(ip) || ipv6Regex.test(ip);
}

export function validateCIDR(cidr: string): boolean {
    const ipv4CidrRegex = /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\/(?:[0-9]|[1-2]\d|3[0-2])$/;
    const ipv6CidrRegex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}\/(?:[0-9]|[1-9]\d|1[0-2]\d)$/;
    
    return ipv4CidrRegex.test(cidr) || ipv6CidrRegex.test(cidr);
}

export function validateRegex(regex: string): boolean {
    try {
        new RegExp(regex);
        return true;
    } catch {
        return false;
    }
}

export function matchRule(rule: FilterRule, target: string, scope: RuleScope): boolean {
    if (!rule.enabled) return false;
    
    if (!rule.scope.includes('all') && !rule.scope.includes(scope)) {
        return false;
    }
    
    try {
        switch (rule.type) {
            case 'domain':
                if (rule.value.startsWith('*.')) {
                    const wildcard = rule.value.slice(2);
                    return target === wildcard || target.endsWith('.' + wildcard);
                }
                return target === rule.value;
            
            case 'ip':
                return target === rule.value;
            
            case 'cidr':
                return matchCIDR(rule.value, target);
            
            case 'regex':
                const flags = FilterConfig.caseSensitive ? 'g' : 'gi';
                const regex = new RegExp(rule.value, flags);
                return regex.test(target);
            
            default:
                return false;
        }
    } catch {
        return false;
    }
}

export function matchCIDR(cidr: string, ip: string): boolean {
    const [network, prefixLength] = cidr.split('/');
    const prefix = parseInt(prefixLength, 10);
    
    const ipNum = ipToNumber(ip);
    const networkNum = ipToNumber(network);
    
    if (ipNum === null || networkNum === null) return false;
    
    const mask = prefix === 0 ? 0 : (0xFFFFFFFF << (32 - prefix)) >>> 0;
    
    return (ipNum & mask) === (networkNum & mask);
}

function ipToNumber(ip: string): number | null {
    const parts = ip.split('.').map(Number);
    
    if (parts.length !== 4 || parts.some(p => isNaN(p) || p < 0 || p > 255)) {
        return null;
    }
    
    return (parts[0] << 24) + (parts[1] << 16) + (parts[2] << 8) + parts[3];
}

export function evaluateRules(
    rules: FilterRule[],
    target: string,
    scope: RuleScope,
    defaultAction: 'allow' | 'block' = 'allow'
): boolean {
    const enabledRules = rules.filter(r => r.enabled).sort((a, b) => b.priority - a.priority);
    
    for (const rule of enabledRules) {
        if (matchRule(rule, target, scope)) {
            return rule.action === 'whitelist';
        }
    }
    
    return defaultAction === 'allow';
}

export function getRulesByAction(rules: FilterRule[], action: RuleAction): FilterRule[] {
    return rules.filter(r => r.action === action && r.enabled);
}

export function getRulesByType(rules: FilterRule[], type: RuleType): FilterRule[] {
    return rules.filter(r => r.type === type && r.enabled);
}

export function getRulesByScope(rules: FilterRule[], scope: RuleScope): FilterRule[] {
    return rules.filter(r => 
        r.enabled && (r.scope.includes('all') || r.scope.includes(scope))
    );
}

export function getDefaultFilterConfig(): FilterConfig {
    return {
        rules: [],
        enableWhitelist: true,
        enableBlacklist: true,
        defaultAction: 'allow',
        enableRegex: false,
        caseSensitive: false
    };
}

export function importRulesFromText(text: string, action: RuleAction): FilterRule[] {
    const lines = text.split('\n')
        .map(line => line.trim())
        .filter(line => line && !line.startsWith('#'));
    
    const rules: FilterRule[] = [];
    
    for (const line of lines) {
        let type: RuleType = 'domain';
        let value = line;
        
        if (line.includes('/')) {
            type = 'cidr';
        } else if (/^\d+\.\d+\.\d+\.\d+$/.test(line)) {
            type = 'ip';
        } else if (line.startsWith('/') && line.endsWith('/')) {
            type = 'regex';
            value = line.slice(1, -1);
        } else if (line.startsWith('*.')) {
            type = 'domain';
        }
        
        if (validateRuleValue(type, value)) {
            rules.push(createFilterRule(
                `Imported ${type}`,
                type,
                action,
                value
            ));
        }
    }
    
    return rules;
}

export function exportRulesToText(rules: FilterRule[]): string {
    return rules
        .filter(r => r.enabled)
        .map(r => {
            let value = r.value;
            if (r.type === 'regex') {
                value = `/${value}/`;
            }
            return `${r.action === 'whitelist' ? '+' : '-'} ${value} # ${r.name}`;
        })
        .join('\n');
}

export function mergeRules(
    existing: FilterRule[],
    newRules: FilterRule[],
    overwrite: boolean = false
): FilterRule[] {
    const existingMap = new Map(existing.map(r => [r.value + r.type, r]));
    const result: FilterRule[] = [...existing];
    
    for (const rule of newRules) {
        const key = rule.value + rule.type;
        
        if (existingMap.has(key)) {
            if (overwrite) {
                const index = result.findIndex(r => r.id === existingMap.get(key)!.id);
                if (index !== -1) {
                    result[index] = rule;
                }
            }
        } else {
            result.push(rule);
        }
    }
    
    return result;
}

export function getRuleStatistics(rules: FilterRule[]): {
    total: number;
    enabled: number;
    disabled: number;
    byType: Record<RuleType, number>;
    byAction: Record<RuleAction, number>;
} {
    const enabled = rules.filter(r => r.enabled);
    
    return {
        total: rules.length,
        enabled: enabled.length,
        disabled: rules.length - enabled.length,
        byType: {
            domain: enabled.filter(r => r.type === 'domain').length,
            ip: enabled.filter(r => r.type === 'ip').length,
            cidr: enabled.filter(r => r.type === 'cidr').length,
            regex: enabled.filter(r => r.type === 'regex').length
        },
        byAction: {
            whitelist: enabled.filter(r => r.action === 'whitelist').length,
            blacklist: enabled.filter(r => r.action === 'blacklist').length
        }
    };
}

export function optimizeRules(rules: FilterRule[]): FilterRule[] {
    const seen = new Set<string>();
    const optimized: FilterRule[] = [];
    
    for (const rule of rules) {
        const key = `${rule.type}:${rule.value}:${rule.action}`;
        
        if (!seen.has(key)) {
            seen.add(key);
            optimized.push(rule);
        }
    }
    
    return optimized.sort((a, b) => b.priority - a.priority);
}

let FilterConfig: any = {
    caseSensitive: false
};
