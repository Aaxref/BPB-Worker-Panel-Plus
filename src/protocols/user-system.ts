export type UserRole = 'admin' | 'user' | 'viewer';
export type UserStatus = 'active' | 'suspended' | 'expired';

export interface User {
    id: string;
    username: string;
    email: string;
    passwordHash: string;
    role: UserRole;
    status: UserStatus;
    createdAt: number;
    expiresAt?: number;
    lastLoginAt?: number;
    maxConnections: number;
    maxBandwidthGB: number;
    usedBandwidthGB: number;
    activeConnections: number;
    notes?: string;
}

export interface SubscriptionSession {
    id: string;
    userId: string;
    token: string;
    name: string;
    deviceType?: string;
    platform?: string;
    createdAt: number;
    lastUsedAt?: number;
    expiresAt?: number;
    ipAddress?: string;
    userAgent?: string;
    isActive: boolean;
    totalRequests: number;
    totalBytes: number;
    protocols: string[];
}

export interface UsageRecord {
    id: string;
    userId: string;
    sessionId: string;
    timestamp: number;
    protocol: string;
    bytesUp: number;
    bytesDown: number;
    duration: number;
    success: boolean;
    ipAddress?: string;
}

export interface UserQuota {
    userId: string;
    maxConnections: number;
    currentConnections: number;
    maxBandwidthGB: number;
    usedBandwidthGB: number;
    resetDay: number; // Day of month (1-31)
    resetAt: number;
}

export class UserManager {
    private users: Map<string, User> = new Map();
    private sessions: Map<string, SubscriptionSession> = new Map();
    private usageRecords: Map<string, UsageRecord[]> = new Map();
    private quotas: Map<string, UserQuota> = new Map();

    async createUser(userData: {
        username: string;
        email: string;
        password: string;
        role?: UserRole;
        maxConnections?: number;
        maxBandwidthGB?: number;
        expiresAt?: number;
        notes?: string;
    }): Promise<User> {
        const id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const passwordHash = await this.hashPassword(userData.password);

        const user: User = {
            id,
            username: userData.username,
            email: userData.email,
            passwordHash,
            role: userData.role || 'user',
            status: 'active',
            createdAt: Date.now(),
            expiresAt: userData.expiresAt,
            maxConnections: userData.maxConnections || 3,
            maxBandwidthGB: userData.maxBandwidthGB || 100,
            usedBandwidthGB: 0,
            activeConnections: 0,
            notes: userData.notes
        };

        this.users.set(id, user);
        this.initializeQuota(user);

        return user;
    }

    async authenticateUser(username: string, password: string): Promise<User | null> {
        const user = Array.from(this.users.values()).find(
            u => u.username === username || u.email === username
        );

        if (!user) return null;
        if (user.status !== 'active') return null;
        if (user.expiresAt && user.expiresAt < Date.now()) {
            user.status = 'expired';
            return null;
        }

        const isValid = await this.verifyPassword(password, user.passwordHash);
        if (!isValid) return null;

        user.lastLoginAt = Date.now();
        this.users.set(user.id, user);

        return user;
    }

    async createSession(userId: string, options: {
        name: string;
        deviceType?: string;
        platform?: string;
        expiresAt?: number;
    } = { name: 'Default Session' }): Promise<SubscriptionSession> {
        const user = this.users.get(userId);
        if (!user) throw new Error('User not found');
        if (user.status !== 'active') throw new Error('User is not active');

        const id = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const token = await this.generateSessionToken();

        const session: SubscriptionSession = {
            id,
            userId,
            token,
            name: options.name,
            deviceType: options.deviceType,
            platform: options.platform,
            createdAt: Date.now(),
            expiresAt: options.expiresAt,
            isActive: true,
            totalRequests: 0,
            totalBytes: 0,
            protocols: []
        };

        this.sessions.set(id, session);

        return session;
    }

    getSessionByToken(token: string): SubscriptionSession | null {
        const session = Array.from(this.sessions.values()).find(s => s.token === token);
        
        if (!session) return null;
        if (!session.isActive) return null;
        if (session.expiresAt && session.expiresAt < Date.now()) {
            session.isActive = false;
            return null;
        }

        session.lastUsedAt = Date.now();
        this.sessions.set(session.id, session);

        return session;
    }

    recordUsage(usage: Omit<UsageRecord, 'id' | 'timestamp'>): void {
        const user = this.users.get(usage.userId);
        if (!user) return;

        const id = `usage_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const record: UsageRecord = {
            id,
            timestamp: Date.now(),
            ...usage
        };

        if (!this.usageRecords.has(usage.userId)) {
            this.usageRecords.set(usage.userId, []);
        }

        const records = this.usageRecords.get(usage.userId)!;
        records.push(record);

        // Update user bandwidth usage
        const totalBytes = usage.bytesUp + usage.bytesDown;
        user.usedBandwidthGB += totalBytes / (1024 * 1024 * 1024);
        this.users.set(user.id, user);

        // Update session
        const session = this.sessions.get(usage.sessionId);
        if (session) {
            session.totalRequests++;
            session.totalBytes += totalBytes;
            session.lastUsedAt = Date.now();
            this.sessions.set(session.id, session);
        }

        // Keep only last 1000 records per user
        if (records.length > 1000) {
            records.shift();
        }
    }

    getUser(userId: string): User | null {
        return this.users.get(userId) || null;
    }

    getUserByUsername(username: string): User | null {
        return Array.from(this.users.values()).find(
            u => u.username === username || u.email === username
        ) || null;
    }

    getAllUsers(): User[] {
        return Array.from(this.users.values());
    }

    updateUser(userId: string, updates: Partial<Omit<User, 'id' | 'username' | 'passwordHash' | 'createdAt'>>): User | null {
        const user = this.users.get(userId);
        if (!user) return null;

        const updated = { ...user, ...updates };
        this.users.set(userId, updated);

        // Update quota if needed
        if (updates.maxConnections !== undefined || updates.maxBandwidthGB !== undefined) {
            const quota = this.quotas.get(userId);
            if (quota) {
                if (updates.maxConnections !== undefined) quota.maxConnections = updates.maxConnections;
                if (updates.maxBandwidthGB !== undefined) quota.maxBandwidthGB = updates.maxBandwidthGB;
                this.quotas.set(userId, quota);
            }
        }

        return updated;
    }

    suspendUser(userId: string, reason?: string): boolean {
        const user = this.users.get(userId);
        if (!user) return false;

        user.status = 'suspended';
        user.notes = reason ? `${user.notes || ''} [SUSPENDED: ${reason}]` : user.notes;
        this.users.set(userId, user);

        // Deactivate all sessions
        this.deactivateAllUserSessions(userId);

        return true;
    }

    activateUser(userId: string): boolean {
        const user = this.users.get(userId);
        if (!user) return false;

        user.status = 'active';
        this.users.set(userId, userId);

        return true;
    }

    deleteUser(userId: string): boolean {
        if (!this.users.has(userId)) return false;

        this.users.delete(userId);
        this.quotas.delete(userId);
        this.usageRecords.delete(userId);

        // Delete all user sessions
        Array.from(this.sessions.entries())
            .filter(([_, s]) => s.userId === userId)
            .forEach(([id, _]) => this.sessions.delete(id));

        return true;
    }

    getSessions(userId?: string): SubscriptionSession[] {
        if (userId) {
            return Array.from(this.sessions.values()).filter(s => s.userId === userId);
        }
        return Array.from(this.sessions.values());
    }

    deactivateSession(sessionId: string): boolean {
        const session = this.sessions.get(sessionId);
        if (!session) return false;

        session.isActive = false;
        this.sessions.set(sessionId, session);

        return true;
    }

    reactivateSession(sessionId: string): boolean {
        const session = this.sessions.get(sessionId);
        if (!session) return false;

        if (session.expiresAt && session.expiresAt < Date.now()) {
            return false;
        }

        session.isActive = true;
        this.sessions.set(sessionId, session);

        return true;
    }

    deleteSession(sessionId: string): boolean {
        return this.sessions.delete(sessionId);
    }

    deactivateAllUserSessions(userId: string): void {
        Array.from(this.sessions.entries())
            .filter(([_, s]) => s.userId === userId)
            .forEach(([id, s]) => {
                s.isActive = false;
                this.sessions.set(id, s);
            });
    }

    getUserUsage(userId: string): {
        totalRecords: number;
        totalBytes: number;
        totalRequests: number;
        byProtocol: Record<string, { count: number; bytes: number }>;
        recent: UsageRecord[];
    } {
        const records = this.usageRecords.get(userId) || [];
        const byProtocol: Record<string, { count: number; bytes: number }> = {};

        let totalBytes = 0;
        for (const record of records) {
            totalBytes += record.bytesUp + record.bytesDown;

            if (!byProtocol[record.protocol]) {
                byProtocol[record.protocol] = { count: 0, bytes: 0 };
            }
            byProtocol[record.protocol].count++;
            byProtocol[record.protocol].bytes += record.bytesUp + record.bytesDown;
        }

        return {
            totalRecords: records.length,
            totalBytes,
            totalRequests: records.length,
            byProtocol,
            recent: records.slice(-50).reverse()
        };
    }

    checkUserQuota(userId: string): {
        allowed: boolean;
        reason?: string;
        connectionsUsed: number;
        connectionsMax: number;
        bandwidthUsed: number;
        bandwidthMax: number;
        bandwidthResetAt: number;
    } {
        const user = this.users.get(userId);
        if (!user) {
            return { allowed: false, reason: 'User not found', connectionsUsed: 0, connectionsMax: 0, bandwidthUsed: 0, bandwidthMax: 0, bandwidthResetAt: 0 };
        }

        if (user.status !== 'active') {
            return {
                allowed: false,
                reason: `User status: ${user.status}`,
                connectionsUsed: user.activeConnections,
                connectionsMax: user.maxConnections,
                bandwidthUsed: user.usedBandwidthGB,
                bandwidthMax: user.maxBandwidthGB,
                bandwidthResetAt: this.getQuota(userId)?.resetAt || 0
            };
        }

        if (user.expiresAt && user.expiresAt < Date.now()) {
            user.status = 'expired';
            return {
                allowed: false,
                reason: 'User account expired',
                connectionsUsed: user.activeConnections,
                connectionsMax: user.maxConnections,
                bandwidthUsed: user.usedBandwidthGB,
                bandwidthMax: user.maxBandwidthGB,
                bandwidthResetAt: this.getQuota(userId)?.resetAt || 0
            };
        }

        const quota = this.quotas.get(userId);
        const connectionsExceeded = user.activeConnections >= user.maxConnections;
        const bandwidthExceeded = user.usedBandwidthGB >= user.maxBandwidthGB;

        if (connectionsExceeded && bandwidthExceeded) {
            return {
                allowed: false,
                reason: 'Connection and bandwidth limits exceeded',
                connectionsUsed: user.activeConnections,
                connectionsMax: user.maxConnections,
                bandwidthUsed: user.usedBandwidthGB,
                bandwidthMax: user.maxBandwidthGB,
                bandwidthResetAt: quota?.resetAt || 0
            };
        }

        if (connectionsExceeded) {
            return {
                allowed: false,
                reason: 'Connection limit exceeded',
                connectionsUsed: user.activeConnections,
                connectionsMax: user.maxConnections,
                bandwidthUsed: user.usedBandwidthGB,
                bandwidthMax: user.maxBandwidthGB,
                bandwidthResetAt: quota?.resetAt || 0
            };
        }

        if (bandwidthExceeded) {
            return {
                allowed: false,
                reason: 'Bandwidth limit exceeded',
                connectionsUsed: user.activeConnections,
                connectionsMax: user.maxConnections,
                bandwidthUsed: user.usedBandwidthGB,
                bandwidthMax: user.maxBandwidthGB,
                bandwidthResetAt: quota?.resetAt || 0
            };
        }

        return {
            allowed: true,
            connectionsUsed: user.activeConnections,
            connectionsMax: user.maxConnections,
            bandwidthUsed: user.usedBandwidthGB,
            bandwidthMax: user.maxBandwidthGB,
            bandwidthResetAt: quota?.resetAt || 0
        };
    }

    incrementActiveConnections(userId: string): boolean {
        const user = this.users.get(userId);
        if (!user) return false;

        const quota = this.checkUserQuota(userId);
        if (!quota.allowed || quota.connectionsUsed >= quota.connectionsMax) {
            return false;
        }

        user.activeConnections++;
        this.users.set(userId, user);

        return true;
    }

    decrementActiveConnections(userId: string): void {
        const user = this.users.get(userId);
        if (!user) return;

        if (user.activeConnections > 0) {
            user.activeConnections--;
            this.users.set(userId, user);
        }
    }

    resetUserBandwidth(userId: string): void {
        const user = this.users.get(userId);
        if (!user) return;

        user.usedBandwidthGB = 0;
        this.users.set(userId, user);

        // Reset quota
        const quota = this.quotas.get(userId);
        if (quota) {
            quota.usedBandwidthGB = 0;
            quota.resetAt = this.calculateNextResetDate(quota.resetDay);
            this.quotas.set(userId, quota);
        }
    }

    getQuota(userId: string): UserQuota | null {
        return this.quotas.get(userId) || null;
    }

    exportData(): string {
        const data = {
            users: Array.from(this.users.entries()),
            sessions: Array.from(this.sessions.entries()),
            usageRecords: Array.from(this.usageRecords.entries()),
            quotas: Array.from(this.quotas.entries()),
            exportedAt: new Date().toISOString()
        };

        return JSON.stringify(data, null, 2);
    }

    importData(json: string): boolean {
        try {
            const data = JSON.parse(json);
            
            if (data.users) this.users = new Map(data.users);
            if (data.sessions) this.sessions = new Map(data.sessions);
            if (data.usageRecords) this.usageRecords = new Map(data.usageRecords);
            if (data.quotas) this.quotas = new Map(data.quotas);

            return true;
        } catch {
            return false;
        }
    }

    reset(): void {
        this.users.clear();
        this.sessions.clear();
        this.usageRecords.clear();
        this.quotas.clear();
    }

    private async hashPassword(password: string): Promise<string> {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hash = await crypto.subtle.digest('SHA-256', data);
        return btoa(String.fromCharCode(...new Uint8Array(hash)));
    }

    private async verifyPassword(password: string, hash: string): Promise<boolean> {
        const passwordHash = await this.hashPassword(password);
        return passwordHash === hash;
    }

    private async generateSessionToken(): Promise<string> {
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        const token = Array.from(array)
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
        return token;
    }

    private initializeQuota(user: User): void {
        const quota: UserQuota = {
            userId: user.id,
            maxConnections: user.maxConnections,
            currentConnections: 0,
            maxBandwidthGB: user.maxBandwidthGB,
            usedBandwidthGB: 0,
            resetDay: new Date().getDate(),
            resetAt: this.calculateNextResetDate(new Date().getDate())
        };

        this.quotas.set(user.id, quota);
    }

    private calculateNextResetDate(day: number): number {
        const now = new Date();
        const resetDate = new Date(now.getFullYear(), now.getMonth() + 1, day);
        if (resetDate.getDate() !== day) {
            // Handle months with fewer days
            resetDate.setDate(0); // Last day of current month
        }
        return resetDate.getTime();
    }
}

export function createUserManager(): UserManager {
    return new UserManager();
}

export function generateRandomPassword(length: number = 16): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array)
        .map(b => chars[b % chars.length])
        .join('');
}

export function validateEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

export function validateUsername(username: string): boolean {
    const regex = /^[a-zA-Z0-9_-]{3,20}$/;
    return regex.test(username);
}

export function validatePassword(password: string): {
    valid: boolean;
    errors: string[];
} {
    const errors: string[] = [];

    if (password.length < 8) {
        errors.push('Password must be at least 8 characters');
    }

    if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
    }

    if (!/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
    }

    if (!/[0-9]/.test(password)) {
        errors.push('Password must contain at least one number');
    }

    return {
        valid: errors.length === 0,
        errors
    };
}
