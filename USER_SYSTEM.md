# User Management & Subscription Session System

## Overview

The enhanced BPB Worker Panel now includes a comprehensive user management and subscription session system. This allows you to:

- Create and manage multiple users
- Track usage per user (bandwidth, connections, requests)
- Generate subscription tokens for each session
- Set quotas and limits
- Monitor user activity
- Manage subscription sessions per device

## Features

### User Management

#### User Roles
- **Admin:** Full access to all features
- **User:** Standard access with personal settings
- **Viewer:** Read-only access

#### User Status
- **Active:** User can use the service
- **Suspended:** User temporarily blocked
- **Expired:** User account expired

#### User Quotas
- **Max Connections:** Maximum simultaneous connections per user
- **Max Bandwidth:** Monthly bandwidth limit in GB
- **Bandwidth Reset:** Automatic reset day (1-31 of each month)

### Subscription Sessions

Each user can have multiple subscription sessions (tokens) for different devices:
- Unique token per session
- Device type tracking (Android, iOS, Windows, etc.)
- Platform identification
- Expiration date support
- Activity tracking
- Usage statistics per session

### Usage Tracking

- **Connection-based tracking:** Each connection is recorded
- **Protocol statistics:** Track usage per protocol
- **Bandwidth monitoring:** Upload/download bytes
- **Success rate tracking:** Monitor connection quality
- **Recent activity:** Last 50 records per user

## API Reference

### UserManager Class

```typescript
import { UserManager } from '@/protocols';

const userManager = new UserManager();
```

#### Create User

```typescript
const user = await userManager.createUser({
    username: 'john_doe',
    email: 'john@example.com',
    password: 'SecurePass123',
    role: 'user',
    maxConnections: 5,
    maxBandwidthGB: 100,
    expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000), // 30 days
    notes: 'Premium user'
});

// User object:
{
    id: 'user_1234567890_abc123',
    username: 'john_doe',
    email: 'john@example.com',
    role: 'user',
    status: 'active',
    createdAt: 1713091200000,
    expiresAt: 1715676800000,
    maxConnections: 5,
    maxBandwidthGB: 100,
    usedBandwidthGB: 0,
    activeConnections: 0,
    notes: 'Premium user'
}
```

#### Authenticate User

```typescript
const user = await userManager.authenticateUser('john_doe', 'SecurePass123');
if (user) {
    console.log('User authenticated:', user.username);
} else {
    console.log('Invalid credentials');
}
```

#### Create Subscription Session

```typescript
const session = await userManager.createSession(userId, {
    name: 'My iPhone',
    deviceType: 'mobile',
    platform: 'iOS',
    expiresAt: Date.now() + (90 * 24 * 60 * 60 * 1000) // 90 days
});

// Session object:
{
    id: 'session_1234567890_xyz789',
    userId: 'user_1234567890_abc123',
    token: 'a1b2c3d4e5f6...',
    name: 'My iPhone',
    deviceType: 'mobile',
    platform: 'iOS',
    createdAt: 1713091200000,
    lastUsedAt: 1713094800000,
    expiresAt: 1715676800000,
    isActive: true,
    totalRequests: 150,
    totalBytes: 52428800,
    protocols: ['vless', 'trojan']
}
```

#### Get Session by Token

```typescript
const session = userManager.getSessionByToken('a1b2c3d4e5f6...');
if (session) {
    console.log('Session valid for user:', session.userId);
}
```

#### Record Usage

```typescript
userManager.recordUsage({
    userId: 'user_1234567890_abc123',
    sessionId: 'session_1234567890_xyz789',
    protocol: 'vless',
    bytesUp: 1024 * 1024, // 1MB
    bytesDown: 1024 * 1024 * 5, // 5MB
    duration: 300, // 5 minutes
    success: true,
    ipAddress: '1.2.3.4'
});
```

#### Check User Quota

```typescript
const quota = userManager.checkUserQuota(userId);

if (quota.allowed) {
    console.log('User can connect');
    console.log('Connections:', quota.connectionsUsed, '/', quota.connectionsMax);
    console.log('Bandwidth:', quota.bandwidthUsed.toFixed(2), 'GB /', quota.bandwidthMax, 'GB');
} else {
    console.log('Limit reached:', quota.reason);
}
```

#### Update User

```typescript
const updatedUser = userManager.updateUser(userId, {
    maxConnections: 10,
    maxBandwidthGB: 200,
    notes: 'Upgraded plan'
});
```

#### Suspend/Activate User

```typescript
// Suspend
userManager.suspendUser(userId, 'Payment overdue');

// Activate
userManager.activateUser(userId);
```

#### Get User Statistics

```typescript
const usage = userManager.getUserUsage(userId);

console.log('Total records:', usage.totalRecords);
console.log('Total bytes:', usage.totalBytes);
console.log('By protocol:', usage.byProtocol);
console.log('Recent activity:', usage.recent);
```

### UserStorage Class (KV Integration)

```typescript
import { UserStorage } from '@/protocols';

// Initialize with KV namespace
const userStorage = new UserStorage(env.kv);

// Load existing data from KV
await userStorage.initialize();
```

#### All UserManager methods are available with auto-save:

```typescript
// These automatically save to KV
const user = await userStorage.createUser({...});
const session = await userStorage.createSession(userId, {...});
await userStorage.recordUsage({...});

// Manual save
await userStorage.saveToStorage();

// Load from storage
await userStorage.loadFromStorage();
```

#### Cleanup Tasks

```typescript
// Reset bandwidth for users whose quota period has expired
// Deactivate expired sessions
const result = await userStorage.cleanup();

console.log('Bandwidth resets:', result.bandwidthResets);
console.log('Sessions deactivated:', result.sessionsDeactivated);
```

## Subscription URL Format

With user sessions, subscription URLs now include the session token:

```
https://your-domain.com/sub/session/{token}/path
```

Example:
```
https://worker.example.com/sub/session/a1b2c3d4e5f6g7h8i9j0/my-sub
```

## Quota Management

### Bandwidth Reset

Bandwidth quotas reset automatically on the specified day of each month:

```typescript
const quota = userStorage.getQuota(userId);
console.log('Next reset:', new Date(quota.resetAt).toLocaleDateString());
console.log('Reset day:', quota.resetDay);
```

### Connection Limits

Active connections are tracked in real-time:

```typescript
// Increment (when user connects)
const canConnect = await userStorage.incrementActiveConnections(userId);
if (!canConnect) {
    throw new Error('Connection limit reached');
}

// Decrement (when user disconnects)
await userStorage.decrementActiveConnections(userId);
```

## Usage Examples

### Example 1: Creating a New User with Session

```typescript
import { createUserStorage } from '@/protocols';

export async function handleUserSignup(request: Request, env: Env) {
    const userStorage = createUserStorage(env.kv);
    await userStorage.initialize();

    const { username, email, password, deviceName } = await request.json();

    // Create user
    const user = await userStorage.createUser({
        username,
        email,
        password,
        role: 'user',
        maxConnections: 3,
        maxBandwidthGB: 50
    });

    // Create default session
    const session = await userStorage.createSession(user.id, {
        name: deviceName || 'Default Device',
        platform: 'Web'
    });

    return Response.json({
        success: true,
        user: {
            id: user.id,
            username: user.username,
            email: user.email
        },
        session: {
            id: session.id,
            token: session.token,
            name: session.name
        },
        subscriptionUrl: `${new URL(request.url).origin}/sub/session/${session.token}/my-sub`
    });
}
```

### Example 2: Subscription Handler with Quota Check

```typescript
export async function handleSubscription(request: Request, env: Env) {
    const userStorage = createUserStorage(env.kv);
    await userStorage.initialize();

    const url = new URL(request.url);
    const token = url.pathname.split('/session/')[1]?.split('/')[0];

    // Get session by token
    const session = userStorage.getSessionByToken(token);
    if (!session) {
        return new Response('Invalid subscription token', { status: 401 });
    }

    // Check user quota
    const quota = userStorage.checkUserQuota(session.userId);
    if (!quota.allowed) {
        return new Response(`Quota exceeded: ${quota.reason}`, { status: 429 });
    }

    // Get user and generate configs
    const user = userStorage.getUser(session.userId);
    const configs = generateConfigsForUser(user, session);

    return new Response(configs, {
        headers: {
            'Content-Type': 'text/plain',
            'Content-Disposition': `attachment; filename="BPB-${user.username}.txt"`
        }
    });
}
```

### Example 3: Usage Tracking Middleware

```typescript
export async function withUsageTracking(
    request: Request,
    env: Env,
    userId: string,
    handler: () => Promise<Response>
) {
    const userStorage = createUserStorage(env.kv);
    
    // Get active session for user
    const sessions = userStorage.getSessions(userId).filter(s => s.isActive);
    const session = sessions[0];

    if (!session) {
        return handler();
    }

    const startTime = Date.now();
    const response = await handler();
    const duration = Date.now() - startTime;

    // Estimate usage (actual implementation would measure bytes)
    const estimatedBytes = response.headers.get('Content-Length') 
        ? parseInt(response.headers.get('Content-Length')!) 
        : 0;

    userStorage.recordUsage({
        userId,
        sessionId: session.id,
        protocol: 'vless', // or detect from request
        bytesUp: 0,
        bytesDown: estimatedBytes,
        duration,
        success: response.ok
    });

    return response;
}
```

### Example 4: Admin Dashboard API

```typescript
export async function handleAdminDashboard(request: Request, env: Env) {
    const userStorage = createUserStorage(env.kv);
    await userStorage.initialize();

    const users = userStorage.getAllUsers();
    
    const stats = users.map(user => {
        const quota = userStorage.checkUserQuota(user.id);
        const usage = userStorage.getUserUsage(user.id);
        
        return {
            username: user.username,
            email: user.email,
            role: user.role,
            status: user.status,
            connections: {
                used: quota.connectionsUsed,
                max: quota.connectionsMax
            },
            bandwidth: {
                used: quota.bandwidthUsed.toFixed(2),
                max: quota.bandwidthMax,
                resetAt: new Date(quota.bandwidthResetAt).toISOString()
            },
            usage: {
                totalRequests: usage.totalRequests,
                totalBytes: usage.totalBytes,
                byProtocol: usage.byProtocol
            }
        };
    });

    return Response.json({ users: stats });
}
```

## Best Practices

1. **Always initialize UserStorage:**
   ```typescript
   await userStorage.initialize();
   ```

2. **Check quotas before allowing connections:**
   ```typescript
   const quota = userStorage.checkUserQuota(userId);
   if (!quota.allowed) {
       return new Response(quota.reason, { status: 429 });
   }
   ```

3. **Track connections properly:**
   ```typescript
   // On connect
   if (!await userStorage.incrementActiveConnections(userId)) {
       throw new Error('Connection limit reached');
   }
   
   // On disconnect (ensure this always runs)
   await userStorage.decrementActiveConnections(userId);
   ```

4. **Use cleanup tasks:**
   ```typescript
   // Run periodically (e.g., cron job)
   await userStorage.cleanup();
   ```

5. **Backup user data:**
   ```typescript
   const backup = await userStorage.exportBackup();
   // Store backup somewhere safe
   ```

## Data Persistence

All user data is stored in Cloudflare KV:

- **Key:** `bpb_users` (JSON string with all data)
- **Auto-save:** Saves after every 10 usage records
- **Manual save:** Call `await userStorage.saveToStorage()`

## Security Considerations

1. **Password Hashing:** All passwords are hashed with SHA-256
2. **Session Tokens:** 256-bit random tokens
3. **Quota Enforcement:** Server-side validation
4. **Rate Limiting:** Implement additional rate limiting per user
5. **Audit Logs:** Consider adding audit logs for admin actions

## Migration Guide

### From Single-User to Multi-User

1. **Create admin user:**
   ```typescript
   const admin = await userStorage.createUser({
       username: 'admin',
       email: 'admin@example.com',
       password: 'SecureAdminPass123',
       role: 'admin',
       maxConnections: 100,
       maxBandwidthGB: 1000
   });
   ```

2. **Migrate existing settings:**
   ```typescript
   const existingUser = await userStorage.createUser({
       username: 'migrated_user',
       email: 'user@example.com',
       password: 'NewPass123',
       maxConnections: 10,
       maxBandwidthGB: 500
   });
   ```

3. **Update subscription URLs:**
   - Old: `/sub/path`
   - New: `/sub/session/{token}/path`

4. **Add quota checks to all endpoints**

## Troubleshooting

### User cannot connect despite having quota

```typescript
const quota = userStorage.checkUserQuota(userId);
console.log('Quota check:', quota);

const user = userStorage.getUser(userId);
console.log('User status:', user.status);
console.log('User expired:', user.expiresAt && user.expiresAt < Date.now());

const sessions = userStorage.getSessions(userId);
console.log('Active sessions:', sessions.filter(s => s.isActive).length);
```

### Bandwidth not resetting

```typescript
const quota = userStorage.getQuota(userId);
console.log('Reset day:', quota.resetDay);
console.log('Reset at:', new Date(quota.resetAt).toISOString());

// Manually trigger reset
await userStorage.resetUserBandwidth(userId);
```

### Session not working

```typescript
const session = userStorage.getSessionByToken(token);
console.log('Session:', session);
console.log('Is active:', session?.isActive);
console.log('Is expired:', session?.expiresAt && session.expiresAt < Date.now());
```

## API Endpoints (Suggested)

```
POST   /api/users/signup           - Create new user
POST   /api/users/login            - Authenticate user
GET    /api/users/profile          - Get user profile
PUT    /api/users/profile          - Update user profile
GET    /api/users/quota            - Get user quota info
GET    /api/users/sessions         - Get user sessions
POST   /api/users/sessions         - Create new session
DELETE /api/users/sessions/:id     - Delete session
GET    /api/users/usage            - Get usage statistics

GET    /api/admin/users            - List all users (admin)
POST   /api/admin/users            - Create user (admin)
PUT    /api/admin/users/:id        - Update user (admin)
DELETE /api/admin/users/:id        - Delete user (admin)
POST   /api/admin/users/:id/suspend - Suspend user (admin)
POST   /api/admin/users/:id/activate - Activate user (admin)

GET    /sub/session/{token}/{path} - Subscription endpoint
```

## License

GPL-3.0 - Same as BPB Worker Panel
