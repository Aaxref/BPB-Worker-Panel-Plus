export interface BypassRule {
    name: string;
    domains: string[];
    ips: string[];
    geosite?: string;
    geoip?: string;
}

export interface BlockRule {
    name: string;
    domains: string[];
    ips: string[];
    geosite?: string;
    geoip?: string;
}

export const BYPASS_RULES: BypassRule[] = [
    {
        name: 'Iran',
        domains: [],
        ips: [],
        geosite: 'ir',
        geoip: 'ir'
    },
    {
        name: 'China',
        domains: [],
        ips: [],
        geosite: 'cn',
        geoip: 'cn'
    },
    {
        name: 'Russia',
        domains: [],
        ips: [],
        geosite: 'ru',
        geoip: 'ru'
    },
    {
        name: 'OpenAI',
        domains: [
            'openai.com',
            'chatgpt.com',
            'chat.openai.com',
            'api.openai.com',
            'oaistatic.com',
            'oaiusercontent.com',
            'auth0.com'
        ],
        ips: [],
        geosite: 'openai',
        geoip: ''
    },
    {
        name: 'Google AI',
        domains: [
            'google.com',
            'googleapis.com',
            'googleusercontent.com',
            'gemini.google.com',
            'bard.google.com',
            'ai.google.com',
            'generativeai.google.com'
        ],
        ips: [],
        geosite: 'google',
        geoip: 'google'
    },
    {
        name: 'Microsoft',
        domains: [
            'microsoft.com',
            'microsoftonline.com',
            'office.com',
            'office365.com',
            'outlook.com',
            'live.com',
            'hotmal.com',
            'skype.com',
            'teams.microsoft.com',
            'onedrive.com',
            'sharepoint.com'
        ],
        ips: [],
        geosite: 'microsoft',
        geoip: ''
    },
    {
        name: 'Oracle',
        domains: [
            'oracle.com',
            'oraclecloud.com',
            'github.com',
            'githubusercontent.com'
        ],
        ips: [],
        geosite: '',
        geoip: ''
    },
    {
        name: 'Docker',
        domains: [
            'docker.com',
            'docker.io',
            'hub.docker.com',
            'registry-1.docker.io'
        ],
        ips: [],
        geosite: '',
        geoip: ''
    },
    {
        name: 'Adobe',
        domains: [
            'adobe.com',
            'adobe.io',
            'adobeexchange.com',
            'behance.net'
        ],
        ips: [],
        geosite: '',
        geoip: ''
    },
    {
        name: 'Epic Games',
        domains: [
            'epicgames.com',
            'unrealengine.com',
            'fortnite.com',
            'epicgames.dev'
        ],
        ips: [],
        geosite: '',
        geoip: ''
    },
    {
        name: 'Steam',
        domains: [
            'steampowered.com',
            'steamstatic.com',
            'steamcommunity.com',
            'steamcdn-a.akamaihd.net',
            'steamuserimages-a.akamaihd.net',
            'steamcontent.com',
            'steamserver.net'
        ],
        ips: [],
        geosite: 'steam',
        geoip: ''
    },
    {
        name: 'Discord',
        domains: [
            'discord.com',
            'discordapp.com',
            'discord.gg',
            'discord.media',
            'discordstatus.com'
        ],
        ips: [],
        geosite: 'discord',
        geoip: ''
    },
    {
        name: 'Spotify',
        domains: [
            'spotify.com',
            'scdn.co',
            'spotifycdn.com',
            'spotifyjobs.com',
            'spotifydesign.com',
            'spotifyforartists.com'
        ],
        ips: [],
        geosite: 'spotify',
        geoip: ''
    },
    {
        name: 'Netflix',
        domains: [
            'netflix.com',
            'nflxext.com',
            'nflximg.com',
            'nflximg.net',
            'nflxso.net',
            'nflxvideo.net'
        ],
        ips: [],
        geosite: 'netflix',
        geoip: ''
    },
    {
        name: 'GitHub',
        domains: [
            'github.com',
            'githubusercontent.com',
            'githubassets.com',
            'github.io',
            'gist.github.com',
            'raw.githubusercontent.com',
            'api.github.com'
        ],
        ips: [],
        geosite: 'github',
        geoip: ''
    },
    {
        name: 'Intel',
        domains: [
            'intel.com',
            'intelcontent.com',
            'intellinuxgraphics.com'
        ],
        ips: [],
        geosite: '',
        geoip: ''
    },
    {
        name: 'AMD',
        domains: [
            'amd.com',
            'amdk5.com',
            'amdlabs.com',
            'amd.com.edgekey.net'
        ],
        ips: [],
        geosite: '',
        geoip: ''
    },
    {
        name: 'NVIDIA',
        domains: [
            'nvidia.com',
            'nvidiagrid.net',
            'geforce.com',
            'geforce.cn',
            'geforce-now.com'
        ],
        ips: [],
        geosite: '',
        geoip: ''
    },
    {
        name: 'ASUS',
        domains: [
            'asus.com',
            'asustor.com',
            'asuswebstorage.com'
        ],
        ips: [],
        geosite: '',
        geoip: ''
    },
    {
        name: 'HP',
        domains: [
            'hp.com',
            'hpstore.com',
            'hpe.com'
        ],
        ips: [],
        geosite: '',
        geoip: ''
    },
    {
        name: 'Lenovo',
        domains: [
            'lenovo.com',
            'lenovocloud.com',
            'lenovopress.com',
            'motorola.com'
        ],
        ips: [],
        geosite: '',
        geoip: ''
    },
    {
        name: 'Telegram',
        domains: [
            'telegram.org',
            't.me',
            'tdesktop.com',
            'telegra.ph',
            'telegram.me',
            'telegram.dog'
        ],
        ips: [],
        geosite: 'telegram',
        geoip: 'telegram'
    },
    {
        name: 'WhatsApp',
        domains: [
            'whatsapp.com',
            'whatsapp.net',
            'whatsapp.biz',
            'web.whatsapp.com'
        ],
        ips: [],
        geosite: 'whatsapp',
        geoip: ''
    },
    {
        name: 'Zoom',
        domains: [
            'zoom.us',
            'zoomgov.com',
            'zopim.com'
        ],
        ips: [],
        geosite: 'zoom',
        geoip: ''
    }
];

export const BLOCK_RULES: BlockRule[] = [
    {
        name: 'Ads',
        domains: [
            'doubleclick.net',
            'googleadservices.com',
            'googlesyndication.com',
            'google-analytics.com',
            'googletagmanager.com',
            'facebook.com/tr',
            'connect.facebook.net',
            'amazon-adsystem.com',
            'adnxs.com',
            'outbrain.com',
            'taboola.com'
        ],
        ips: [],
        geosite: 'category-ads',
        geoip: ''
    },
    {
        name: 'Porn',
        domains: [
            'pornhub.com',
            'xvideos.com',
            'xnxx.com',
            'redtube.com',
            'youporn.com',
            'tube8.com',
            'spankbang.com',
            'brazzers.com',
            'adultfriendfinder.com'
        ],
        ips: [],
        geosite: 'category-porn',
        geoip: ''
    },
    {
        name: 'Malware',
        domains: [],
        ips: [],
        geosite: 'category-anti-malware',
        geoip: ''
    },
    {
        name: 'Phishing',
        domains: [],
        ips: [],
        geosite: 'category-phishing',
        geoip: ''
    },
    {
        name: 'Cryptominers',
        domains: [
            'coinhive.com',
            'jsecoin.com',
            'authedmine.com'
        ],
        ips: [],
        geosite: '',
        geoip: ''
    },
    {
        name: 'Gambling',
        domains: [
            'bet365.com',
            'pokerstars.com',
            '888.com',
            'williamhill.com',
            'ladbrokes.com',
            'betfair.com',
            'paddy power.com',
            'unibet.com',
            'bwin.com',
            'partypoker.com'
        ],
        ips: [],
        geosite: 'category-gambling',
        geoip: ''
    },
    {
        name: 'Social Media',
        domains: [
            'facebook.com',
            'instagram.com',
            'twitter.com',
            'x.com',
            'tiktok.com',
            'snapchat.com',
            'pinterest.com',
            'linkedin.com',
            'reddit.com',
            'tumblr.com',
            'threads.net'
        ],
        ips: [],
        geosite: 'category-social-networking',
        geoip: ''
    },
    {
        name: 'Tracking',
        domains: [
            'track.admaster.com.cn',
            'track.uc.cn',
            'track.tiara.daum.net',
            'trackflex.com',
            'tracking.m6r.eu',
            'tracking.host',
            'tracking.pro',
            'tracking.smi2.net',
            'tracking.website',
            'tracking01.com',
            'trackingsystem.com',
            'trackingsoft.com',
            'trackit.com',
            'trackjs.com',
            'tracklogistics.com'
        ],
        ips: [],
        geosite: '',
        geoip: ''
    },
    {
        name: 'Telemetry',
        domains: [
            'vortex.data.microsoft.com',
            'vortex-win.data.microsoft.com',
            'telecommand.telemetry.microsoft.com',
            'telecommand.telemetry.microsoft.com.nsatc.net',
            'oca.telemetry.microsoft.com',
            'oca.telemetry.microsoft.com.nsatc.net',
            'compatexchange.cloudapp.net',
            'ssw.live.com',
            'ssw.live.com.nsatc.net',
            'watson.telemetry.microsoft.com',
            'watson.telemetry.microsoft.com.nsatc.net',
            'redirection.telemetry.microsoft.com',
            'redirection.telemetry.microsoft.com.nsatc.net'
        ],
        ips: [],
        geosite: '',
        geoip: ''
    },
    {
        name: 'QUIC',
        domains: [],
        ips: [],
        geosite: '',
        geoip: ''
    }
];

export function getBypassRuleByName(name: string): BypassRule | undefined {
    return BYPASS_RULES.find(rule => rule.name.toLowerCase() === name.toLowerCase());
}

export function getBlockRuleByName(name: string): BlockRule | undefined {
    return BLOCK_RULES.find(rule => rule.name.toLowerCase() === name.toLowerCase());
}

export function getAllBypassRuleNames(): string[] {
    return BYPASS_RULES.map(rule => rule.name);
}

export function getAllBlockRuleNames(): string[] {
    return BLOCK_RULES.map(rule => rule.name);
}

export function getBypassDomains(): string[] {
    return BYPASS_RULES.flatMap(rule => rule.domains);
}

export function getBlockDomains(): string[] {
    return BLOCK_RULES.flatMap(rule => rule.domains);
}

export function getBypassGeosites(): string[] {
    return BYPASS_RULES
        .map(rule => rule.geosite)
        .filter(Boolean) as string[];
}

export function getBlockGeosites(): string[] {
    return BLOCK_RULES
        .map(rule => rule.geosite)
        .filter(Boolean) as string[];
}

export function getBypassGeoips(): string[] {
    return BYPASS_RULES
        .map(rule => rule.geoip)
        .filter(Boolean) as string[];
}

export function getBlockGeoips(): string[] {
    return BLOCK_RULES
        .map(rule => rule.geoip)
        .filter(Boolean) as string[];
}
