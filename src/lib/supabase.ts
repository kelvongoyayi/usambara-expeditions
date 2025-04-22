import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storageKey: 'supabase.auth.token',
    // Handle invalid refresh token errors
    onAuthStateChange: (event, session) => {
      if (event === 'TOKEN_REFRESHED' || event === 'SIGNED_IN') {
        // Session is valid, do nothing
      } else if (event === 'SIGNED_OUT') {
        // Clear any local storage to ensure complete sign-out
        localStorage.removeItem('supabase.auth.token');
        sessionStorage.removeItem('supabase.auth.token');
      }
    }
  },
  global: {
    // Retry operations that fail due to network issues or similar problems
    fetch: async (url, options) => {
      const maxRetries = 3;
      let retries = 0;
      let lastError;
      
      while (retries < maxRetries) {
        try {
          return await fetch(url, options);
        } catch (error) {
          lastError = error;
          retries++;
          // Exponential backoff with a little randomness
          const delay = Math.pow(2, retries) * 100 + Math.random() * 100;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
      
      throw lastError;
    }
  }
});

// Helper to check if user is admin
export const isUserAdmin = async (): Promise<boolean> => {
  try {
    const { data } = await supabase.rpc('is_admin');
    return !!data;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

export const getUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const getUserProfile = async () => {
  const user = await getUser();
  if (!user) return null;

  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
  
  return data;
};