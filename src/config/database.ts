/**
 * ZULF BRAND LAB - Database & Backend Sync Configuration
 *
 * This application is configured to run out-of-the-box in local-first storage mode.
 * To connect a live persistent cloud backend (Supabase or Firebase Firestore),
 * update the configuration below with your project credentials.
 */

export interface DatabaseConfig {
  provider: 'local-storage' | 'supabase' | 'firebase';
  supabase?: {
    url: string;
    anonKey: string;
    tableName: string;
  };
  firebase?: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    collectionName: string;
  };
}

export const dbConfig: DatabaseConfig = {
  // Switch to 'supabase' or 'firebase' when deploying with cloud credentials
  provider: (import.meta.env.VITE_DB_PROVIDER as 'local-storage' | 'supabase' | 'firebase') || 'local-storage',
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || '',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
    tableName: 'survey_responses',
  },
  firebase: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
    collectionName: 'brand_lab_responses',
  },
};
