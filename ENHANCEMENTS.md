# BPB Worker Panel - Enhanced Version

## Overview

This enhanced version of BPB Worker Panel includes comprehensive protocol support, advanced anti-limitation features, and enterprise-grade management capabilities. The panel now supports **7 different protocols** with extensive customization options.

## 🚀 New Features

### 1. Protocol Support

#### Shadowsocks (SS)
- **Encryption Methods:**
  - AES-128-GCM
  - AES-256-GCM
  - Chacha20-Poly1305
  - XChaCha20-Poly1305
- **Plugin Support:**
  - Obfs
  - V2Ray-Plugin
- **Features:**
  - URL generation and parsing
  - Multiple encryption methods
  - Plugin configuration

#### VMess
- **Transport Protocols:**
  - TCP
  - WebSocket (WS)
  - gRPC
  - HTTP
  - QUIC
- **Features:**
  - Dynamic port support
  - TLS/Reality security
  - Multiple transport layers
  - Fingerprint obfuscation

#### Hysteria2
- **Features:**
  - QUIC-based protocol
  - Brutal congestion control
  - Obfuscation support (Salamander)
  - Bandwidth optimization
  - 0-RTT support
  - Custom fingerprint

#### TUIC v5
- **Features:**
  - QUIC-based protocol
  - Multiple congestion control algorithms:
    - CUBIC
    - BBR
    - New Reno
  - UDP relay modes
  - Zero-RTT handshake
  - Load balancing support

#### Reality Protocol
- **Features:**
  - TLS camouflage without certificates
  - Short ID authentication
  - Spider X configuration
  - Multiple fingerprint support
  - Public/Private key generation

### 2. Advanced Obfuscation & Anti-Limitation

#### Fragmentation Modes
- **Low:** 100-200 byte packets, 1ms interval
- **Medium:** 50-100 byte packets, 1-5ms interval
- **High:** 10-20 byte packets, 10-20ms interval
- **Severe:** 1-5 byte packets, 1-5ms interval
- **Glider:** Advanced pattern with max split (3-5)
- **Obfs:** Obfuscated pattern with max split (5-10)
- **Random-Packet:** 10-500 byte packets, 0-20ms interval, max split (2-20)

#### TLS Fingerprint Support
- Chrome (116-130)
- Firefox
- Safari
- Edge
- iOS
- Android
- Random
- Randomized

#### Transport Layer Enhancements
- **HTTP/2:** Enabled by default
- **HTTP/3 (QUIC):** Optional
- **gRPC:** Support for gRPC transport
- **Custom gRPC service name**

#### Noise Generation
- **Xray UDP Noise:**
  - Base64 noise packets
  - Random size noise
  - Hex noise
  - String noise
  - Configurable delay and count

### 3. Routing Rules

#### Enhanced Bypass Rules
- **Geographic:**
  - Iran
  - China
  - Russia
- **Services:**
  - OpenAI / ChatGPT
  - Google AI / Gemini
  - Microsoft / Office 365
  - Oracle / GitHub
  - Docker Hub
  - Adobe Creative Cloud
  - Epic Games
  - Steam
  - Discord
  - Spotify
  - Netflix
  - GitHub
  - Intel, AMD, NVIDIA
  - ASUS, HP, Lenovo
  - Telegram
  - WhatsApp
  - Zoom

#### Enhanced Block Rules
- **Ads:** Google Ads, Facebook Ads, etc.
- **Porn:** Major adult sites
- **Malware:** Known malware domains
- **Phishing:** Known phishing sites
- **Cryptominers:** Coin mining scripts
- **Gambling:** Betting and gambling sites
- **Social Media:** Facebook, Instagram, Twitter, TikTok, etc.
- **Tracking:** Tracking and telemetry domains
- **Telemetry:** Microsoft and system telemetry
- **QUIC:** Optional QUIC blocking

### 4. DNS Configuration

#### Supported DNS Protocols
- **UDP:** Traditional DNS
- **TCP:** DNS over TCP
- **TLS:** DNS over TLS (DoT)
- **HTTPS:** DNS over HTTPS (DoH)
- **QUIC:** DNS over QUIC
- **DNSCrypt:** Encrypted DNS

#### Pre-configured DNS Servers
- Google DNS (UDP, DoH, DoT)
- Cloudflare DNS (UDP, DoH, DoT)
- AdGuard DNS (UDP, DoH, DoT)
- Quad9 DNS (UDP, DoH, DoT)
- OpenDNS (UDP, DoH, DoT)
- NextDNS (UDP, DoH)
- Control D (UDP, DoH)
- Mullvad DNS (UDP, DoH, DoT)
- Iran-specific DNS (SheCan, 403, Radar, Electro)

### 5. Warp Pro Features

#### Enhanced Warp Configuration
- **Account Types:**
  - Free
  - Plus (with license key)
  - Team
- **Load Balancing:**
  - Round-robin
  - Random
  - Least-connection
  - Weighted
- **Endpoints:**
  - 6 pre-configured Cloudflare endpoints
  - Custom endpoint support
  - Priority-based selection
- **Advanced Options:**
  - MTU configuration
  - IPv6 support
  - Lazy mode
  - Noise injection
- **License Key Validation:** Automatic Warp+ license verification

### 6. Chain Proxy

#### Proxy Types
- VLESS
- VMess
- Trojan
- Shadowsocks
- SOCKS5
- HTTP/HTTPS
- V2Ray

#### Chain Modes
- **Serial:** Traffic passes through nodes in sequence
- **Parallel:** Traffic distributed across all nodes
- **Failover:** Automatic switching on failure
- **Load-Balance:** Distribution based on latency

#### Features
- Health checking
- Automatic failover
- Latency-based selection
- Priority configuration
- URL import/export

### 7. Filter Rules

#### Rule Types
- **Domain:** Exact or wildcard matching
- **IP:** IPv4/IPv6 addresses
- **CIDR:** IP range matching
- **Regex:** Pattern matching

#### Actions
- **Whitelist:** Allow specific traffic
- **Blacklist:** Block specific traffic

#### Features
- Priority-based evaluation
- Per-protocol scope
- Import/export rules
- Rule optimization
- Statistics

### 8. Connection Monitoring

#### Statistics Tracking
- **Per-Protocol Stats:**
  - Total connections
  - Active connections
  - Bytes uploaded/downloaded
  - Average latency
  - Success rate
  - Last used timestamp

- **Daily Statistics:**
  - Connections per day
  - Bandwidth usage
  - Protocol distribution

- **Alerts:**
  - High latency (>500ms)
  - Low success rate (<80%)
  - High error rate (>20%)

#### Monitoring Features
- Configurable retention period
- Active connection tracking
- Error tracking
- Export statistics

### 9. Backup & Restore

#### Backup Options
- Include/exclude specific data:
  - Settings
  - Filter rules
  - Chain configuration
  - Warp configuration
  - Monitoring configuration
  - Statistics

#### Features
- JSON and YAML formats
- Encryption (AES-256-GCM)
- Compression
- Scheduled backups (daily/weekly/monthly)
- Merge multiple backups
- Sensitive data redaction

#### Backup Operations
- Create backup
- Restore backup
- Import/Export
- Validate backup
- Get backup summary

### 10. User Management & Subscription Sessions 🆕

#### User System Features
- **Multi-User Support:** Create and manage multiple users
- **User Roles:** Admin, User, Viewer with different permissions
- **User Status:** Active, Suspended, Expired states
- **Authentication:** SHA-256 password hashing
- **Quota Management:**
  - Max connections per user
  - Monthly bandwidth limits
  - Automatic bandwidth reset
  - Real-time quota checking

#### Subscription Sessions
- **Multiple Sessions per User:** One token per device
- **Session Management:**
  - Create, activate, deactivate, delete sessions
  - Device type tracking (Android, iOS, Windows, etc.)
  - Platform identification
  - Expiration date support
- **Token-Based Authentication:** Secure 256-bit session tokens
- **Activity Tracking:**
  - Last used timestamp
  - Total requests per session
  - Total bytes per session
  - Protocols used per session

#### Usage Tracking
- **Connection Records:**
  - Per-connection logging
  - Protocol statistics
  - Bandwidth monitoring (up/down)
  - Success/failure tracking
  - IP address logging
- **User Statistics:**
  - Total connections
  - Total bandwidth used
  - Usage by protocol
  - Recent activity (last 50 records)

#### KV Storage Integration
- **Automatic Persistence:** All data stored in Cloudflare KV
- **Auto-Save:** Saves after every 10 usage records
- **Manual Save:** Explicit save option available
- **Backup/Restore:** Export and import user data
- **Cleanup Tasks:** Automatic bandwidth reset and session expiration

#### Security Features
- Password hashing (SHA-256)
- Secure session tokens (256-bit random)
- Server-side quota enforcement
- Session expiration handling
- User suspension capabilities

**For detailed documentation, see [USER_SYSTEM.md](USER_SYSTEM.md)**

## 📦 Module Structure

```
src/protocols/
├── index.ts                    # Main exports and managers
├── shadowsocks.ts             # Shadowsocks protocol
├── vmess.ts                   # VMess protocol
├── hysteria2.ts               # Hysteria2 protocol
├── tuic.ts                    # TUIC protocol
├── reality.ts                 # Reality protocol
├── obfuscation.ts             # Fragmentation & obfuscation
├── bypass-rules.ts            # Routing rules
├── dns-config.ts              # DNS configuration
├── warp.ts                    # Warp Pro features
├── chain-proxy.ts             # Chain proxy
├── filter-rules.ts            # Filter rules
├── statistics.ts              # Connection monitoring
├── backup.ts                  # Backup & restore
├── user-system.ts             # User management system
└── user-storage.ts            # KV storage integration
```

## 🔧 Usage Examples

### Using Protocol Managers

```typescript
import { ProtocolManager, WarpManager, ChainManager } from '@/protocols';

// Generate Shadowsocks URL
const ssConfig = ProtocolManager.shadowsocks.getDefault();
ssConfig.host = 'example.com';
ssConfig.port = 8388;
ssConfig.password = 'mypassword';
const ssUrl = ProtocolManager.shadowsocks.generate(ssConfig);

// Select Warp endpoint
const warpConfig = WarpManager.getDefault();
const endpoint = WarpManager.selectEndpoint(warpConfig);

// Create proxy chain
const chain = ChainManager.createChain(
    'My Chain',
    'failover',
    ['node_1', 'node_2', 'node_3']
);
```

### Statistics Monitoring

```typescript
import { StatisticsManager, createConnectionStats } from '@/protocols';

const statsManager = new StatisticsManager();

// Record connection
statsManager.recordConnection(createConnectionStats(
    'vless',
    'connected',
    1024,  // bytes up
    2048,  // bytes down
    30,    // duration
    45     // latency
));

// Get statistics
const vlessStats = statsManager.getProtocolStats('vless');
const totalStats = statsManager.getTotalStats();
const alerts = statsManager.checkAlerts();
```

### Backup & Restore

```typescript
import { BackupManager } from '@/protocols';

const backupManager = new BackupManager();

// Create backup
const backup = await backupManager.createBackup({
    settings: mySettings,
    filterRules: myFilterRules,
    chainConfig: myChainConfig
});

// Export backup
const backupJson = await backupManager.exportBackup(backup, 'json');

// Restore backup
const result = await backupManager.restoreBackup(backup);
```

## 🎯 Anti-Limitation Strategies

### 1. Protocol Diversity
- Multiple protocols reduce detection risk
- Each protocol has unique traffic patterns
- Failover between protocols

### 2. Traffic Obfuscation
- Fragmentation mimics normal web traffic
- TLS fingerprint matching
- Multiple transport layers
- Noise injection

### 3. Intelligent Routing
- Geographic bypass for restricted services
- Service-specific routing
- Load balancing across endpoints
- Automatic failover

### 4. Advanced DNS
- DoH/DoT for encrypted DNS
- Custom DNS servers
- Anti-sanction DNS
- DNS cache

### 5. Connection Management
- Health monitoring
- Latency optimization
- Error tracking
- Automatic reconnection

## 🛡️ Security Features

1. **Encrypted Backups:** AES-256-GCM encryption
2. **Sensitive Data Redaction:** Passwords and keys redacted in exports
3. **Filter Rules:** Whitelist/blacklist support
4. **Reality Protocol:** TLS without certificates
5. **TLS Fingerprint:** Mimic real browsers

## 📊 Performance Optimizations

1. **Warp Load Balancing:** Distribute traffic across endpoints
2. **Chain Proxy:** Optimize routing based on latency
3. **Hysteria2 Brutal:** Bandwidth optimization
4. **TUIC 0-RTT:** Faster connection establishment
5. **Connection Caching:** Reduce reconnection overhead

## 🔄 Migration Guide

### From Original BPB Panel

1. **Settings Migration:**
   - All original settings are compatible
   - New settings have defaults
   - Optional features can be enabled gradually

2. **Protocol Migration:**
   - VLESS and Trojan work as before
   - New protocols are opt-in
   - Config URLs remain valid

3. **Configuration Export:**
   - Use backup feature to export settings
   - Import into enhanced version
   - Verify all settings

## 📝 Configuration Files

### Environment Variables

Existing variables remain unchanged:
- `UUID`: VLESS UUID
- `TR_PASS`: Trojan password
- `PROXY_IP`: Proxy IP configuration
- `PREFIX`: NAT64 prefixes
- `SUB_PATH`: Subscription path
- `FALLBACK`: Fallback domain
- `DOH_URL`: DoH server URL

### New Settings

All new features are configured through the panel UI or by extending the Settings object.

## 🚧 Limitations & Considerations

1. **Worker Limits:**
   - 100K requests/day for VLESS/Trojan
   - Warp has no limit
   - Consider rate limiting

2. **Protocol Compatibility:**
   - Not all clients support all protocols
   - Check client compatibility before use
   - Some features require specific client versions

3. **Resource Usage:**
   - Multiple protocols increase resource usage
   - Monitoring requires storage
   - Backups consume KV storage

## 🔮 Future Enhancements

- [x] ~~Multi-user support~~ ✅ COMPLETED
- [ ] Custom geoip/geosite rule editor
- [ ] Visual proxy chain editor
- [ ] Real-time traffic visualization
- [ ] Advanced analytics dashboard
- [ ] User dashboard UI
- [ ] API for programmatic access
- [ ] Mobile-optimized UI

## 📄 License

GPL-3.0 - Same as original BPB Panel

## 🤝 Contributing

This is an enhanced version of BPB Panel. Contributions are welcome!

## 📧 Support

For issues and questions:
- Check the original BPB Panel documentation
- Review this enhancement guide
- Open an issue on GitHub

---

**Enhanced by:** Z.ai Code
**Based on:** BPB Worker Panel by bia-pain-bache
**Version:** 5.0.0+ (with User System)
