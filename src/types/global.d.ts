declare global {
    interface GlobalConfig {
        readonly userID: string;
        readonly TrPass: string;
        readonly pathName: string;
        readonly fallbackDomain: string;
        readonly dohURL: string;
    }

    interface HttpConfig {
        readonly panelVersion: string;
        readonly defaultHttpPorts: number[];
        readonly defaultHttpsPorts: number[];
        readonly hostName: string;
        readonly client: string;
        readonly urlOrigin: string;
        readonly subPath: string;
    }

    interface WsConfig {
        readonly defaultProxyIPs: string[];
        readonly defaultPrefixes: string[];
        readonly envProxyIPs: string;
        readonly envPrefixes: string;
        wsProtocol?: "vl" | "tr";
        proxyMode?: "proxyip" | "prefix";
        panelIPs?: string[];
    }

    interface Env {
        readonly UUID: string;
        readonly TR_PASS: string;
        readonly PROXY_IP: string;
        readonly PREFIX: string;
        readonly FALLBACK: string;
        readonly DOH_URL: string;
        readonly kv: KVNamespace;
    }

    interface WarpAccount {
        privateKey: string;
        publicKey: string;
        warpIPv6: string;
        reserved: string;
        accountType?: 'free' | 'plus' | 'team';
    }

    interface DnsHost {
        host: string;
        isDomain: boolean;
        ipv4: string[];
        ipv6: string[];
    }

    interface DnsResult {
        ipv4: string[];
        ipv6: string[];
    }

    interface XrUdpNoise {
        type: "rand" | "str" | "base64" | "hex";
        packet: string;
        delay: string;
        applyTo: "ip" | "ipv4" | "ipv6";
        count: number;
    }

    interface Settings {
        localDNS: string;
        antiSanctionDNS: string;
        fakeDNS: boolean;
        enableIPv6: boolean;
        allowLANConnection: boolean;
        logLevel: "none" | "warning" | "error" | "info" | "debug";
        remoteDNS: string;
        remoteDnsHost: DnsHost;
        proxyIPMode: "proxyip" | "prefix";
        proxyIPs: string[];
        prefixes: string[];
        outProxy: string;
        outProxyParams: any;
        cleanIPs: string[];
        customCdnAddrs: string[];
        customCdnHost: string;
        customCdnSni: string;
        bestVLTRInterval: number;
        VLConfigs: boolean;
        TRConfigs: boolean;
        VMConfigs: boolean;
        SSConfigs: boolean;
        HYConfigs: boolean;
        TUConfigs: boolean;
        ports: number[];
        fingerprint: Fingerprint;
        enableTFO: boolean;
        fragmentMode: "custom" | "low" | "medium" | "high" | "severe" | "glider" | "obfs" | "random-packet";
        fragmentLengthMin: number;
        fragmentLengthMax: number;
        fragmentIntervalMin: number;
        fragmentIntervalMax: number;
        fragmentPackets: "tlshello" | "1-1" | "1-2" | "1-3" | "1-5";
        fragmentMaxSplitMin?: number;
        fragmentMaxSplitMax?: number;
        enableECH: boolean;
        echServerName: string;
        enableHttp2: boolean;
        enableHttp3: boolean;
        enableGrpc: boolean;
        grpcServiceName: string;
        bypassIran: boolean;
        bypassChina: boolean;
        bypassRussia: boolean;
        bypassOpenAi: boolean;
        bypassGoogleAi: boolean;
        bypassMicrosoft: boolean;
        bypassOracle: boolean;
        bypassDocker: boolean;
        bypassAdobe: boolean;
        bypassEpicGames: boolean;
        bypassIntel: boolean;
        bypassAmd: boolean;
        bypassNvidia: boolean;
        bypassAsus: boolean;
        bypassHp: boolean;
        bypassLenovo: boolean;
        bypassSteam: boolean;
        bypassDiscord: boolean;
        bypassSpotify: boolean;
        bypassNetflix: boolean;
        bypassGithub: boolean;
        bypassTelegram: boolean;
        bypassWhatsApp: boolean;
        bypassZoom: boolean;
        blockAds: boolean;
        blockPorn: boolean;
        blockUDP443: boolean;
        blockMalware: boolean;
        blockPhishing: boolean;
        blockCryptominers: boolean;
        blockGambling: boolean;
        blockSocialMedia: boolean;
        blockTracking: boolean;
        blockTelemetry: boolean;
        customBypassRules: string[];
        customBlockRules: string[];
        customBypassSanctionRules: string[];
        warpRemoteDNS: string;
        warpEndpoints: string[];
        bestWarpInterval: number;
        warpLicenseKey: string;
        warpAccountType: 'free' | 'plus' | 'team';
        warpLoadBalancing: boolean;
        warpLoadBalancingMode: 'round-robin' | 'random' | 'least-conn' | 'weighted';
        xrayUdpNoises: XrUdpNoise[];
        knockerNoiseMode: string;
        noiseCountMin: number;
        noiseCountMax: number;
        noiseSizeMin: number;
        noiseSizeMax: number;
        noiseDelayMin: number;
        noiseDelayMax: number;
        amneziaNoiseCount: number;
        amneziaNoiseSizeMin: number;
        amneziaNoiseSizeMax: number;
        panelVersion: string;
        ssPassword: string;
        ssMethod: 'aes-128-gcm' | 'aes-256-gcm' | 'chacha20-poly1305' | 'xchacha20-poly1305';
        vmessUUID: string;
        vmessAlterId: number;
        hysteria2Password: string;
        hysteria2Obfs: string;
        tuicUUID: string;
        tuicPassword: string;
        realityPublicKey: string;
        realityShortId: string;
        enableFilterRules: boolean;
        enableWhitelist: boolean;
        enableBlacklist: boolean;
        enableMonitoring: boolean;
        monitoringRetentionDays: number;
        enableBackup: boolean;
        backupSchedule: 'daily' | 'weekly' | 'manual';
        chainProxyEnabled: boolean;
        chainProxyMode: 'serial' | 'parallel' | 'failover' | 'load-balance';
    }

    var settings: Settings;
    var globalConfig: GlobalConfig;
    var httpConfig: HttpConfig;
    var wsConfig: WsConfig;
    var dict: {
        readonly _VL_: string;
        readonly _VL_CAP_: string;
        readonly _VM_: string;
        readonly _TR_: string;
        readonly _TR_CAP_: string;
        readonly _SS_: string;
        readonly _V2_: string;
        readonly _project_: string;
        readonly _website_: string;
        readonly _public_proxy_ip_: string;
    };

    interface GeoAsset {
        rule: boolean;
        type: string;
        geosite: string;
        geoip?: string;
        geositeURL?: string;
        geoipURL?: string;
        dns?: string;
        format?: string;
    }

    const __VERSION__: string;
    const __ERROR_HTML_CONTENT__: string;
    const __ICON__: string;
    const __PANEL_HTML_CONTENT__: string;
    const __LOGIN_HTML_CONTENT__: string;
    const __SECRETS_HTML_CONTENT__: string;
    const __PROXY_IP_HTML_CONTENT__: string;

    interface Array<T> {
        concatIf<T>(condition: boolean, concat: T | T[]): T[];
    }

    interface Object {
        omitEmpty<T>(): T | undefined;
    }
}

export { };
