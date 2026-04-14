<h1 align="center">BPB Worker Panel Plus</h1>

<p align="center">
  <strong>Enhanced version with full protocol support, user management, and anti-limitation features</strong>
</p>

### 🌏 Readme in [Farsi](README_fa.md)

<p align="center">
  <img src="docs/assets/images/panel-overview.jpg">
</p>
<br>

## Introduction

This is an enhanced version of the BPB Panel, aimed to provide a comprehensive user panel to access FREE, SECURE and PRIVATE **VPN/Proxy configs** and also a **private DoH** server. It ensures connectivity even when domains or Warp services are blocked by ISPs.

**This Plus version includes:**
- 🚀 **All major protocols**: VLESS, Trojan, Warp, Shadowsocks, VMess, Hysteria2, TUIC, Reality
- 👥 **User Management System**: Multi-user support with roles, sessions, and quota tracking
- 🛡️ **Anti-Limitation Features**: Fragmentation, TLS fingerprints, obfuscation
- 🔒 **Enhanced Security**: SHA-256 password hashing, secure session tokens, encrypted backups
- 📊 **Usage Monitoring**: Real-time connection tracking and statistics

Deployment options:
- **Workers** deployment
- **Pages** deployment

🌟 If you found **BPB Worker Panel Plus** valuable, Your donations make all the difference 🌟

### USDT (BEP20)

```text
0xbdf15d41C56f861f25b2b11C835bd45dfD5b792F
```

## Limitations

1. **UDP transport**: VLESS and Trojan protocols on workers do not handle **UDP** properly, so it is disabled by default (affecting features like Telegram video calls), UDP DNS is also unsupported. DoH is enabled by default for enhanced security.
2. **Request limit**: each worker supports 100K requests per day for VLESS and Trojan, suitable for 2-3 users. You can use limitless Warp configs.
3. **User storage**: User data is stored in Cloudflare KV, which has occasional consistency delays (up to 60 seconds for global replication).

## Project Structure

```
BPB-Worker-Panel-Plus/
├── src/
│   ├── protocols/
│   │   ├── shadowsocks.ts       # Shadowsocks implementation
│   │   ├── vmess.ts             # VMess protocol
│   │   ├── hysteria2.ts         # Hysteria2 protocol
│   │   ├── tuic.ts              # TUIC v5 protocol
│   │   ├── reality.ts           # Reality TLS camouflage
│   │   ├── obfuscation.ts       # Fragmentation & TLS fingerprints
│   │   ├── bypass-rules.ts      # Routing rules
│   │   ├── dns-config.ts        # DNS configuration
│   │   ├── chain-proxy.ts       # Chain proxy system
│   │   ├── filter-rules.ts      # Filter rules
│   │   ├── user-system.ts       # User management
│   │   ├── user-storage.ts      # KV storage integration
│   │   ├── statistics.ts        # Usage monitoring
│   │   ├── backup.ts            # Backup/restore
│   │   └── index.ts             # Main exports
│   └── types/
│       └── global.d.ts          # TypeScript definitions
├── ENHANCEMENTS.md              # Feature documentation
├── USER_SYSTEM.md               # User system guide
└── README.md                    # This file
```

## Documentation

- [Installation methods](https://bia-pain-bache.github.io/BPB-Worker-Panel/installation/wizard/)
- [Configuration](https://bia-pain-bache.github.io/BPB-Worker-Panel/configuration/)
- [How to use](https://bia-pain-bache.github.io/BPB-Worker-Panel/usage/)
- [FAQ](https://bia-pain-bache.github.io/BPB-Worker-Panel/faq/)
- [Enhancements Guide](ENHANCEMENTS.md)
- [User System Guide](USER_SYSTEM.md)

## Features

### Core Features
1. **Free and Private**: No costs involved and the server is private.
2. **Intuitive Panel:** Streamlined for effortless navigation, configuration and use.
3. **Password-protected panel:** Provides secure and private panel with password protection.
4. **Fully customizable:** Supports setting up clean IP-domains, Proxy IPs, DNS servers, choosing ports and protocols, Warp endpoints and more.

### Protocol Support
5. **Comprehensive Protocol Support:**
   - **VLESS** - Lightweight protocol with multiple transports
   - **Trojan** - Secure protocol disguised as HTTPS
   - **Warp/Warp+** - Cloudflare WireGuard-based VPN
   - **Shadowsocks** - Fast, secure proxy with multiple ciphers
   - **VMess** - V2Ray protocol with various transports
   - **Hysteria2** - QUIC-based high-performance protocol
   - **TUIC** - Lightweight UDP-based protocol
   - **Reality** - TLS camouflage for VLESS/VMess

### Anti-Limitation Features
6. **Advanced Fragmentation:** 8 fragmentation modes (http, chaos, random, et al.) for bypassing deep packet inspection
7. **TLS Fingerprinting:** 20+ TLS fingerprint profiles including Chrome, Firefox, Safari, iOS, Android
8. **Obfuscation Techniques:** Multiple obfuscation methods for enhanced stealth

### Networking Features
9. **Private DoH:** A ready to use DoH server, capable of customizing underlying DNS server with 6 DNS protocols (UDP, TCP, TLS, DoH, QUIC, DNSCrypt) and 25+ pre-configured servers
10. **Warp Pro configs:** Optimized Warp with load balancing and endpoint management
11. **Comprehensive Routing Rules:** 28+ bypass rules and 10+ block rules for Iran/China/Russia, QUIC, Porn, Ads, Malwares, Phishing and sanctions bypass
12. **Chain Proxy:** 4 chain modes (Serial, Parallel, Failover, Load-Balance) supporting VLESS, Trojan, Shadowsocks, SOCKS, HTTP
13. **Filter Rules:** Advanced filtering with regex and CIDR support

### User Management (NEW)
14. **Multi-User System:**
   - Role-based access control (Admin, User, Viewer)
   - SHA-256 password hashing for security
   - User registration and management
   - Usage quota tracking
15. **Session Management:**
   - Secure 256-bit session tokens
   - Session expiration and renewal
   - Subscription link per user
   - Usage tracking per session

### Monitoring & Backup (NEW)
16. **Connection Monitoring:** Real-time tracking of connections, data usage, and statistics
17. **Backup/Restore System:** AES-256-GCM encrypted configuration backups

### Client Compatibility
18. **Broad client compatibility:** Offers subscription links for Xray, Sing-box and Clash-Mihomo core clients.

## Limitations

1. **UDP transport**: VLESS and Trojan protocols on workers do not handle **UDP** properly, so it is disabled by default (affecting features like Telegram video calls), UDP DNS is also unsupported. DoH is enabled by default for enhanced security.
2. **Request limit**: each worker supports 100K requests per day for VLESS and Trojan, suitable for 2-3 users. You can use limitless Warp configs.

## Getting Started

- [Installation methods](https://bia-pain-bache.github.io/BPB-Worker-Panel/installation/wizard/)
- [Configuration](https://bia-pain-bache.github.io/BPB-Worker-Panel/configuration/)
- [How to use](https://bia-pain-bache.github.io/BPB-Worker-Panel/usage/)
- [FAQ](https://bia-pain-bache.github.io/BPB-Worker-Panel/faq/)

## New Features in This Plus Version

### 🚀 Extended Protocol Support
- **Shadowsocks** with multiple encryption methods (AES-128-GCM, AES-256-GCM, Chacha20-Poly1305, XChaCha20-Poly1305)
- **VMess** with WebSocket, gRPC, HTTP, and QUIC transports
- **Hysteria2** - QUIC-based protocol with Brutal congestion control
- **TUIC v5** - Lightweight UDP protocol with BBR/CUBIC/New Reno congestion control
- **Reality** - Advanced TLS camouflage for VLESS/VMess

### 👥 User Management System
- Multi-user support with role-based access (Admin/User/Viewer)
- Secure authentication with SHA-256 password hashing
- Individual subscription links per user
- Usage quota management and tracking
- User registration and profile management

### 📊 Session Management
- Secure 256-bit session tokens
- Session expiration and automatic renewal
- Per-session usage tracking
- Subscription links with session-based access

### 🛡️ Anti-Limitation & Security
- **8 Fragmentation Modes:** http, chaos, random, segment, noop, teredo, dtls, wireguard
- **20+ TLS Fingerprint Profiles:** Chrome, Firefox, Safari, iOS, Android, Edge, and more
- Advanced obfuscation techniques for deep packet inspection bypass
- Chain proxy with 4 modes for IP fixing and load balancing

### 🔧 Advanced Networking
- **6 DNS Protocols:** UDP, TCP, TLS, DoH, QUIC, DNSCrypt
- **25+ Pre-configured DNS Servers:** Cloudflare, Google, Quad9, OpenDNS, AdGuard, etc.
- Enhanced Warp Pro with load balancing and multiple endpoints
- 28+ bypass rules and 10+ block rules
- Filter rules with regex and CIDR support

### 💾 Backup & Monitoring
- AES-256-GCM encrypted configuration backups
- Real-time connection monitoring
- Usage statistics and data tracking
- Export/Import configuration

## Supported Clients

|       Client        |      Version      |  Fragment support  |  Warp Pro support  |
| :-----------------: | :---------------: | :----------------: | :----------------: |
|     **v2rayNG**     | 1.10.26 or higher | :heavy_check_mark: | :heavy_check_mark: |
|     **MahsaNG**     |   14 or higher    | :heavy_check_mark: | :heavy_check_mark: |
|     **v2rayN**      | 7.15.4 or higher  | :heavy_check_mark: | :heavy_check_mark: |
|   **v2rayN-PRO**    |   1.9 or higher   | :heavy_check_mark: | :heavy_check_mark: |
|    **Sing-box**     | 1.12.0 or higher  | :heavy_check_mark: |        :x:         |
|    **Streisand**    | 1.6.64 or higher  | :heavy_check_mark: | :heavy_check_mark: |
|   **Clash Meta**    |                   |        :x:         | :heavy_check_mark: |
| **Clash Verge Rev** |                   |        :x:         | :heavy_check_mark: |
|     **FLClash**     |                   |        :x:         | :heavy_check_mark: |
|   **AmneziaVPN**    |                   |        :x:         | :heavy_check_mark: |
|    **WG Tunnel**    |                   |        :x:         | :heavy_check_mark: |

## Environment variables

|   Variable   |               Usage                |     Mandatory      |
| :----------: | :--------------------------------: | :----------------: |
|   **UUID**   |             VLESS UUID             | :heavy_check_mark: |
| **TR_PASS**  |          Trojan Password           | :heavy_check_mark: |
| **ADMIN_PASS** |      Admin Panel Password (Plus)  | :heavy_check_mark: |
| **PROXY_IP** | Proxy IP or domain (VLESS, Trojan) |        :x:         |
|  **PREFIX**  |   NAT64 Prefixes (VLESS, Trojan)   |        :x:         |
| **SUB_PATH** |         Subscriptions' URI         |        :x:         |
| **FALLBACK** |  Fallback domain (VLESS, Trojan)   |        :x:         |
| **DOH_URL**  |              Core DOH              |        :x:         |

---

## Stargazers Over Time

[![Stargazers Over Time](https://starchart.cc/Aaxref/BPB-Worker-Panel-Plus.svg?variant=adaptive)](https://github.com/Aaxref/BPB-Worker-Panel-Plus)

---

### Special Thanks

- VLESS, Trojan [Cloudflare-workers/pages proxy script](https://github.com/yonggekkk/Cloudflare-workers-pages-vless) created by [yonggekkk](https://github.com/yonggekkk)
- CF-vless code author [3Kmfi6HP](https://github.com/3Kmfi6HP/EDtunnel)
- CF preferred IP program author [badafans](https://github.com/badafans/Cloudflare-IP-SpeedTest), [XIU2](https://github.com/XIU2/CloudflareSpeedTest)
