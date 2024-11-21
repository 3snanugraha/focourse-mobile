import PocketBase from 'pocketbase';

// Environment variables
const dbHost = process.env.EXPO_PUBLIC_DB_HOST ?? '';
const dbUser  = process.env.EXPO_PUBLIC_DB_USER ?? '';
const dbPass = process.env.EXPO_PUBLIC_DB_PASS ?? '';

// Validasi environment variables
if (!dbHost || !dbUser  || !dbPass) {
    throw new Error('Environment variables EXPO_PUBLIC_DB_HOST, EXPO_PUBLIC_DB_USER, and EXPO_PUBLIC_DB_PASS must be defined.');
}

// Initialize PocketBase
const pb = new PocketBase(dbHost);

class AuthManager {
    private static instance: AuthManager | null = null;
    private pb: PocketBase;
    private email: string;
    private password: string;
    public isAuthenticated = false;
    public token: string | null = null;
    public user: any = null; // Consider defining a specific type for user

    private constructor(email: string, password: string) {
        this.pb = pb;
        this.email = email;
        this.password = password;
    }

    public static getInstance(): AuthManager {
        if (!AuthManager.instance) {
            AuthManager.instance = new AuthManager(dbUser , dbPass);
        }
        return AuthManager.instance;
    }

    public async authenticate(): Promise<void> {
        if (!this.email || !this.password) {
            throw new Error('Email and password must be defined.');
        }

        try {
            const authData = await this.pb.admins.authWithPassword(this.email, this.password);
            this.isAuthenticated = this.pb.authStore.isValid;
            this.token = this.pb.authStore.token;
            this.user = this.pb.authStore.model;
            console.log('Authenticated as:', this.user);
        } catch (error) {
            console.error('Authentication failed:', error);
            throw new Error('Authentication failed. Please check your credentials.');
        }
    }

    public logout(): void {
        this.pb.authStore.clear();
        this.isAuthenticated = false;
        this.token = null;
        this.user = null;
        console.warn('Logged out successfully');
    }

    public getPocketBase(): PocketBase {
        return this.pb;
    }
}

export default AuthManager.getInstance();