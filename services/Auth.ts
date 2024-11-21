import PocketBase from 'pocketbase';

// Environment variables
const dbHost = process.env.EXPO_PUBLIC_DB_HOST ?? '';
const dbUser = process.env.EXPO_PUBLIC_DB_USER ?? '';
const dbPass = process.env.EXPO_PUBLIC_DB_PASS ?? '';

// Validasi environment variables
if (!dbHost || !dbUser || !dbPass) {
    throw new Error('Environment variables EXPO_PUBLIC_DB_HOST, EXPO_PUBLIC_DB_USER, and EXPO_PUBLIC_DB_PASS must be defined.');
}

// Initialize PocketBase
const pb = new PocketBase(dbHost);

class AuthManager {
    private static instance: AuthManager | null = null;
    private email: string;
    private password: string;

    private constructor(email: string, password: string) {
        this.email = email;
        this.password = password;
    }

    public static getInstance(): AuthManager {
        if (!AuthManager.instance) {
            AuthManager.instance = new AuthManager(dbUser, dbPass);
        }
        return AuthManager.instance;
    }

    /**
     * Ensure the user is authenticated.
     * If already authenticated, skip re-authentication.
     */
    private async ensureAuthenticated(): Promise<void> {
        if (!pb.authStore.isValid) {
            try {
                const authData = await pb.admins.authWithPassword(this.email, this.password);
                console.log('Authenticated successfully:', authData);
            } catch (error) {
                console.error('Authentication failed:', error);
                throw new Error('Authentication failed. Please check your credentials.');
            }
        }
    }

    /**
     * Fetch all records from a collection.
     * @param collectionName - The name of the PocketBase collection.
     * @param expand - Optionally expand relational fields.
     */
    public async fetchCollection(collectionName: string, expand: string = ''): Promise<any[]> {
        await this.ensureAuthenticated(); // Ensure authentication before fetching
        try {
            const records = await pb.collection(collectionName).getFullList(200, { expand });
            console.log(`Fetched ${records.length} records from ${collectionName}`);
            return records;
        } catch (error) {
            console.error(`Failed to fetch data from ${collectionName}:`, error);
            throw new Error(`Failed to fetch data from ${collectionName}.`);
        }
    }

    /**
     * Logout the current user and clear the session.
     */
    public logout(): void {
        pb.authStore.clear();
        console.warn('Logged out successfully');
    }
}

export default AuthManager.getInstance();
