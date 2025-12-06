import { Client, Account, Databases, Storage, ID, Query } from 'appwrite';

// Helper to safely access environment variables in Vite
const getEnvVar = (key: string) => {
  try {
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      // @ts-ignore
      return import.meta.env[key];
    }
  } catch (e) {
    console.warn('Error accessing import.meta.env', e);
  }
  return '';
};

const ENDPOINT = getEnvVar('VITE_APPWRITE_ENDPOINT') || 'https://cloud.appwrite.io/v1';
const PROJECT_ID = getEnvVar('VITE_APPWRITE_PROJECT_ID');

export const isAppwriteConfigured = !!(ENDPOINT && PROJECT_ID && PROJECT_ID !== 'placeholder');

const client = new Client();

if (isAppwriteConfigured) {
    client
        .setEndpoint(ENDPOINT)
        .setProject(PROJECT_ID);
}

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const appwrite = client;

// Configuration Constants
export const DATABASE_ID = getEnvVar('VITE_APPWRITE_DATABASE_ID') || 'edumark_db';
export const BUCKET_ID = getEnvVar('VITE_APPWRITE_BUCKET_ID') || 'documents';

// Collection IDs (Ensure these match your Appwrite setup)
export const COLLECTIONS = {
    PROFILES: 'profiles',
    ATTENDANCE: 'attendance_records',
    ASSIGNMENTS: 'assignments',
    FEES: 'fees',
    NOTICES: 'notices'
};

export { ID, Query };
