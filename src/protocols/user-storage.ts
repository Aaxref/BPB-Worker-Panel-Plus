import type { UserManager } from './user-system';
import type { User, SubscriptionSession, UsageRecord, UserQuota } from './user-system';

export class UserStorage {
    private kv: KVNamespace;
    private userManager: UserManager;
    private readonly USERS_KEY = 'bpb_users';
    private readonly SESSIONS_KEY = 'bpb_sessions';
    private readonly USAGE_KEY = 'bpb_usage';
    private readonly QUOTAS_KEY = 'bpb_quotas';

    constructor(kv: KVNamespace) {
        this.kv = kv;
        this.userManager = new UserManager() as any;
    }

    async initialize(): Promise<void> {
        try {
            await this.loadFromStorage();
        } catch (error) {
            console.error('Failed to load user data from storage:', error);
        }
    }

    async saveToStorage(): Promise<void> {
        try {
            const data = this.userManager.exportData();
            await this.kv.put(this.USERS_KEY, data);
        } catch (error) {
            console.error('Failed to save user data to storage:', error);
        }
    }

    async loadFromStorage(): Promise<void> {
        try {
            const data = await this.kv.get(this.USERS_KEY, 'text');
            if (data) {
                this.userManager.importData(data);
            }
        } catch (error) {
            console.error('Failed to load user data from storage:', error);
        }
    }

    async createUser(userData: {
        username: string;
        email: string;
        password: string;
        role?: 'admin' | 'user' | 'viewer';
        maxConnections?: number;
        maxBandwidthGB?: number;
        expiresAt?: number;
        notes?: string;
    }): Promise<User> {
        const user = await this.userManager.createUser(userData);
        await this.saveToStorage();
        return user;
    }

    async authenticateUser(username: string, password: string): Promise<User | null> {
        return await this.userManager.authenticateUser(username, password);
    }

    async createSession(userId: string, options: {
        name: string;
        deviceType?: string;
        platform?: string;
        expiresAt?: number;
    }): Promise<SubscriptionSession> {
        const session = await this.userManager.createSession(userId, options);
        await this.saveToStorage();
        return session;
    }

    getSessionByToken(token: string): SubscriptionSession | null {
        return this.userManager.getSessionByToken(token);
    }

    async recordUsage(usage: Omit<UsageRecord, 'id' | 'timestamp'>): Promise<void> {
        this.userManager.recordUsage(usage);
        
        // Save periodically (every 10 records) to avoid excessive KV writes
        const userRecords = (this.userManager as any).usageRecords.get(usage.userId);
        if (userRecords && userRecords.length % 10 === 0) {
            await this.saveToStorage();
        }
    }

    getUser(userId: string): User | null {
        return this.userManager.getUser(userId);
    }

    getUserByUsername(username: string): User | null {
        return this.userManager.getUserByUsername(username);
    }

    getAllUsers(): User[] {
        return this.userManager.getAllUsers();
    }

    async updateUser(userId: string, updates: Partial<Omit<User, 'id' | 'username' | 'passwordHash' | 'createdAt'>>): Promise<User | null> {
        const user = this.userManager.updateUser(userId, updates);
        if (user) {
            await this.saveToStorage();
        }
        return user;
    }

    async suspendUser(userId: string, reason?: string): Promise<boolean> {
        const result = this.userManager.suspendUser(userId, reason);
        if (result) {
            await this.saveToStorage();
        }
        return result;
    }

    async activateUser(userId: string): Promise<boolean> {
        const result = this.userManager.activateUser(userId);
        if (result) {
            await this.saveToStorage();
        }
        return result;
    }

    async deleteUser(userId: string): Promise<boolean> {
        const result = this.userManager.deleteUser(userId);
        if (result) {
            await this.saveToStorage();
        }
        return result;
    }

    getSessions(userId?: string): SubscriptionSession[] {
        return this.userManager.getSessions(userId);
    }

    async deactivateSession(sessionId: string): Promise<boolean> {
        const result = this.userManager.deactivateSession(sessionId);
        if (result) {
            await this.saveToStorage();
        }
        return result;
    }

    async reactivateSession(sessionId: string): Promise<boolean> {
        const result = this.userManager.reactivateSession(sessionId);
        if (result) {
            await this.saveToStorage();
        }
        return result;
    }

    async deleteSession(sessionId: string): Promise<boolean> {
        const result = this.userManager.deleteSession(sessionId);
        if (result) {
            await this.saveToStorage();
        }
        return result;
    }

    async deactivateAllUserSessions(userId: string): Promise<void> {
        this.userManager.deactivateAllUserSessions(userId);
        await this.saveToStorage();
    }

    getUserUsage(userId: string): {
        totalRecords: number;
        totalBytes: number;
        totalRequests: number;
        byProtocol: Record<string, { count: number; bytes: number }>;
        recent: UsageRecord[];
    } {
        return this.userManager.getUserUsage(userId);
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
        return this.userManager.checkUserQuota(userId);
    }

    async incrementActiveConnections(userId: string): Promise<boolean> {
        const result = this.userManager.incrementActiveConnections(userId);
        if (result) {
            await this.saveToStorage();
        }
        return result;
    }

    async decrementActiveConnections(userId: string): Promise<void> {
        this.userManager.decrementActiveConnections(userId);
        await this.saveToStorage();
    }

    async resetUserBandwidth(userId: string): Promise<void> {
        this.userManager.resetUserBandwidth(userId);
        await this.saveToStorage();
    }

    getQuota(userId: string): UserQuota | null {
        return this.userManager.getQuota(userId);
    }

    async resetBandwidthForExpiredUsers(): Promise<number> {
        const users = this.getAllUsers();
        let resetCount = 0;

        for (const user of users) {
            const quota = this.getQuota(user.id);
            if (quota && Date.now() >= quota.resetAt) {
                this.resetUserBandwidth(user.id);
                resetCount++;
            }
        }

        if (resetCount > 0) {
            await this.saveToStorage();
        }

        return resetCount;
    }

    async deactiveExpiredSessions(): Promise<number> {
        const sessions = this.getSessions();
        let deactivatedCount = 0;
        const now = Date.now();

        for (const session of sessions) {
            if (session.expiresAt && session.expiresAt < now && session.isActive) {
                await this.deactivateSession(session.id);
                deactivatedCount++;
            }
        }

        return deactivatedCount;
    }

    async cleanup(): Promise<{
        bandwidthResets: number;
        sessionsDeactivated: number;
    }> {
        const bandwidthResets = await this.resetBandwidthForExpiredUsers();
        const sessionsDeactivated = await this.deactiveExpiredSessions();

        return {
            bandwidthResets,
            sessionsDeactivated
        };
    }

    getManager(): UserManager {
        return this.userManager;
    }

    async exportBackup(): Promise<string> {
        return this.userManager.exportData();
    }

    async importBackup(json: string): Promise<boolean> {
        const success = this.userManager.importData(json);
        if (success) {
            await this.saveToStorage();
        }
        return success;
    }
}

export function createUserStorage(kv: KVNamespace): UserStorage {
    return new UserStorage(kv);
}
