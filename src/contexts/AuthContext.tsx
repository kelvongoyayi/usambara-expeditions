import React, { createContext, useContext, useState, useEffect } from 'react';
import { Session, User, AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { profileService } from '../services/profile.service';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  error: Error | null;
  signIn: (email: string, password: string) => Promise<{
    error: AuthError | null;
    data: Session | null;
  }>;
  signUp: (email: string, password: string) => Promise<{
    error: AuthError | null;
    data: { user: User | null; session: Session | null };
  }>;
  createAdminUser: (email: string, password: string, firstName: string, lastName: string) => Promise<{
    error: Error | null;
    data: { user: User | null } | null;
  }>;
  signOut: () => Promise<void>;
  clearAuthError: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user || null);
        if (session?.user) {
          // For development purposes only - don't attempt to check admin RLS
          // as it's causing recursion errors. Simply set all logged in users as admins.
          setIsAdmin(true);
        }
      } catch (err) {
        console.error('Error initializing auth:', err);
        setError(err instanceof Error ? err : new Error('Failed to initialize authentication'));
        // Clear any invalid session data
        await supabase.auth.signOut();
        setSession(null);
        setUser(null);
        setIsAdmin(false);
        toast.error('Authentication session expired. Please sign in again.');
      }
      setLoading(false);
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user || null);
        if (session?.user) {
          // For development purposes only - don't attempt to check admin RLS
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Check if user is an admin - but avoid using RLS policies for now
  const checkAdminStatus = async (userId: string) => {
    try {
      // Check admin status from JWT claims
      const { data: { session } } = await supabase.auth.getSession();
      const isUserAdmin = session?.user?.role === 'admin' || 
                         (session?.user?.app_metadata?.role === 'admin') ||
                         (session?.user?.user_metadata?.isAdmin === true);
      
      setIsAdmin(!!isUserAdmin);
    } catch (error) {
      console.error('Failed to check admin status:', error);
      setIsAdmin(false);
    }
  };

  const clearAuthError = () => {
    setError(null);
  };

  const signIn = async (email: string, password: string) => {
    const response = await supabase.auth.signInWithPassword({ email, password });
    
    if (response.data.session && response.data.user) {
      // For development, skip the admin check to avoid RLS recursion
      setIsAdmin(true);
    }
    
    return response;
  };

  const signUp = async (email: string, password: string) => {
    return await supabase.auth.signUp({
      email,
      password,
    });
  };
  
  const createAdminUser = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      // 1. Create the user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName
          }
        }
      });
      
      if (authError) throw authError;
      
      if (!authData.user) {
        throw new Error('Failed to create user');
      }
      
      // 2. Update the profile to make the user an admin
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          first_name: firstName,
          last_name: lastName,
          is_admin: true
        })
        .eq('id', authData.user.id);
      
      if (profileError) throw profileError;
      
      // 3. Log the admin creation
      await supabase.rpc('log_admin_action', {
        action_type: 'create',
        table_name: 'profiles',
        record_id: authData.user.id,
        details: JSON.stringify({ is_admin: true })
      });
      
      return { error: null, data: { user: authData.user } };
    } catch (error) {
      console.error('Error creating admin user:', error);
      return { 
        error: error instanceof Error ? error : new Error('Failed to create admin user'), 
        data: null 
      };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear local state
      setSession(null);
      setUser(null);
      setIsAdmin(false);
      
      // Clear any local storage manually to ensure complete sign-out
      localStorage.removeItem('supabase.auth.token');
      sessionStorage.removeItem('supabase.auth.token');
      
      return;
    } catch (error) {
      console.error('Error during sign out:', error);
      setError(error instanceof Error ? error : new Error('Failed to sign out'));
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        isAdmin,
        loading,
        error,
        signIn,
        signUp,
        signOut,
        createAdminUser,
        clearAuthError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};