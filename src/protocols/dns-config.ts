export type DNSProtocol = 'tcp' | 'udp' | 'tls' | 'https' | 'quic' | 'dnscrypt';

export interface DNSServer {
    name: string;
    address: string;
    protocol: DNSProtocol;
    bootstrap?: string;
    ips?: string[];
}

export interface DNSConfig {
    localDNS: string;
    remoteDNS: string;
    remoteDNSProtocol: DNSProtocol;
    remoteDNSHost: string;
    antiSanctionDNS: string;
    warpRemoteDNS: string;
    customDNSServers: DNSServer[];
    enableDNSCache: boolean;
    fakeDNS: boolean;
    enableIPv6: boolean;
}

export const COMMON_DNS_SERVERS: DNSServer[] = [
    {
        name: 'Google DNS',
        address: '8.8.8.8',
        protocol: 'udp'
    },
    {
        name: 'Google DNS (DoH)',
        address: 'https://dns.google/dns-query',
        protocol: 'https'
    },
    {
        name: 'Google DNS (DoT)',
        address: 'dns.google',
        protocol: 'tls'
    },
    {
        name: 'Cloudflare DNS',
        address: '1.1.1.1',
        protocol: 'udp'
    },
    {
        name: 'Cloudflare DNS (DoH)',
        address: 'https://security.cloudflare-dns.com/dns-query',
        protocol: 'https'
    },
    {
        name: 'Cloudflare DNS (DoT)',
        address: 'security.cloudflare-dns.com',
        protocol: 'tls'
    },
    {
        name: 'AdGuard DNS',
        address: '94.140.14.14',
        protocol: 'udp'
    },
    {
        name: 'AdGuard DNS (DoH)',
        address: 'https://dns.adguard-dns.com/dns-query',
        protocol: 'https'
    },
    {
        name: 'AdGuard DNS (DoT)',
        address: 'dns.adguard-dns.com',
        protocol: 'tls'
    },
    {
        name: 'Quad9 DNS',
        address: '9.9.9.9',
        protocol: 'udp'
    },
    {
        name: 'Quad9 DNS (DoH)',
        address: 'https://dns.quad9.net/dns-query',
        protocol: 'https'
    },
    {
        name: 'Quad9 DNS (DoT)',
        address: 'dns.quad9.net',
        protocol: 'tls'
    },
    {
        name: 'OpenDNS',
        address: '208.67.222.222',
        protocol: 'udp'
    },
    {
        name: 'OpenDNS (DoH)',
        address: 'https://doh.opendns.com/dns-query',
        protocol: 'https'
    },
    {
        name: 'OpenDNS (DoT)',
        address: 'doh.opendns.com',
        protocol: 'tls'
    },
    {
        name: 'NextDNS',
        address: '45.90.28.167',
        protocol: 'udp'
    },
    {
        name: 'NextDNS (DoH)',
        address: 'https://dns.nextdns.io',
        protocol: 'https'
    },
    {
        name: 'Control D',
        address: '76.76.2.0',
        protocol: 'udp'
    },
    {
        name: 'Control D (DoH)',
        address: 'https://freedns.controld.com/p0',
        protocol: 'https'
    },
    {
        name: 'Mullvad DNS',
        address: '194.242.2.2',
        protocol: 'udp'
    },
    {
        name: 'Mullvad DNS (DoH)',
        address: 'https://dns.mullvad.net/dns-query',
        protocol: 'https'
    },
    {
        name: 'Mullvad DNS (DoT)',
        address: 'dns.mullvad.net',
        protocol: 'tls'
    },
    {
        name: 'SheCan DNS (Iran)',
        address: '178.22.122.100',
        protocol: 'udp'
    },
    {
        name: '403 DNS (Iran)',
        address: '10.202.10.202',
        protocol: 'udp'
    },
    {
        name: 'Radar DNS (Iran)',
        address: '10.202.10.10',
        protocol: 'udp'
    },
    {
        name: 'Electro DNS (Iran)',
        address: '78.157.42.100',
        protocol: 'udp'
    }
];

export const ANTI_SANCTION_DNS_SERVERS: DNSServer[] = [
    {
        name: 'Google (Public)',
        address: '8.8.8.8',
        protocol: 'udp'
    },
    {
        name: 'Google (DoH)',
        address: 'https://dns.google/dns-query',
        protocol: 'https'
    },
    {
        name: 'Cloudflare (Public)',
        address: '1.1.1.1',
        protocol: 'udp'
    },
    {
        name: 'Cloudflare (DoH)',
        address: 'https://security.cloudflare-dns.com/dns-query',
        protocol: 'https'
    },
    {
        name: 'Quad9',
        address: '9.9.9.9',
        protocol: 'udp'
    },
    {
        name: 'Quad9 (DoH)',
        address: 'https://dns.quad9.net/dns-query',
        protocol: 'https'
    },
    {
        name: 'OpenDNS',
        address: '208.67.222.222',
        protocol: 'udp'
    },
    {
        name: 'OpenDNS (DoH)',
        address: 'https://doh.opendns.com/dns-query',
        protocol: 'https'
    }
];

export const WARP_DNS_SERVERS = [
    '1.1.1.1',
    '8.8.8.8',
    '9.9.9.9',
    '208.67.222.222'
];

export function getDNSServersByProtocol(protocol: DNSProtocol): DNSServer[] {
    return COMMON_DNS_SERVERS.filter(server => server.protocol === protocol);
}

export function getDNSServerByName(name: string): DNSServer | undefined {
    return COMMON_DNS_SERVERS.find(server => 
        server.name.toLowerCase().includes(name.toLowerCase())
    );
}

export function getAntiSanctionDNSServers(): DNSServer[] {
    return ANTI_SANCTION_DNS_SERVERS;
}

export function getDefaultDNSConfig(): DNSConfig {
    return {
        localDNS: '223.5.5.5',
        remoteDNS: 'https://dns.google/dns-query',
        remoteDNSProtocol: 'https',
        remoteDNSHost: 'dns.google',
        antiSanctionDNS: '8.8.8.8',
        warpRemoteDNS: '1.1.1.1',
        customDNSServers: [],
        enableDNSCache: true,
        fakeDNS: false,
        enableIPv6: true
    };
}

export function parseDNSURL(url: string): { protocol: DNSProtocol; host: string; port?: number } | null {
    try {
        const parsed = new URL(url);
        
        let protocol: DNSProtocol;
        switch (parsed.protocol) {
            case 'tcp:':
                protocol = 'tcp';
                break;
            case 'udp:':
                protocol = 'udp';
                break;
            case 'tls:':
            case 'dtls:':
                protocol = 'tls';
                break;
            case 'https:':
                protocol = 'https';
                break;
            case 'quic:':
                protocol = 'quic';
                break;
            default:
                return null;
        }
        
        return {
            protocol,
            host: parsed.hostname,
            port: parsed.port ? parseInt(parsed.port, 10) : undefined
        };
    } catch {
        return null;
    }
}

export function formatDNSUrl(protocol: DNSProtocol, host: string, port?: number): string {
    const portStr = port ? `:${port}` : '';
    
    switch (protocol) {
        case 'https':
            return `https://${host}${portStr}/dns-query`;
        case 'tls':
            return `tls://${host}${portStr}`;
        case 'tcp':
            return `tcp://${host}${portStr}`;
        case 'udp':
            return `udp://${host}${portStr}`;
        case 'quic':
            return `quic://${host}${portStr}`;
        case 'dnscrypt':
            return `dnscrypt://${host}${portStr}`;
        default:
            return host;
    }
}

export function isValidDNSAddress(address: string): boolean {
    if (address.match(/^(\d{1,3}\.){3}\d{1,3}$/)) {
        return true;
    }
    
    if (address.match(/^\[([a-fA-F0-9:]+)\](:\d+)?$/)) {
        return true;
    }
    
    if (address.match(/^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)*[a-zA-Z]{2,}$/)) {
        return true;
    }
    
    try {
        new URL(address);
        return true;
    } catch {
        return false;
    }
}

export function resolveDNS(address: string, protocol: DNSProtocol = 'udp'): string {
    if (address.startsWith('http')) {
        return address;
    }
    
    if (isValidDNSAddress(address) && !address.includes('://')) {
        return formatDNSUrl(protocol, address);
    }
    
    return address;
}

export function getDNSCacheSettings(enableCache: boolean): any {
    return {
        enableCache,
        cacheSize: enableCache ? 4096 : 0,
        cacheTime: enableCache ? 300 : 0
    };
}
