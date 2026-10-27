'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useLanguage } from './LanguageContext';
import { Locale } from '@/lib/i18n';

export interface UserProfile {
  id: string;
  full_name: string;
  phone?: string;
  language: Locale;
  state?: string;
  district?: string;
  village?: string;
  land_size_acres?: number;
  latitude?: number;
  longitude?: number;
}

export const DEFAULT_DEMO_PROFILE: UserProfile = {
  id: 'demo-farmer-id-789',
  full_name: 'Ramesh Patil (शेतकरी)',
  phone: '+91 98220 12345',
  language: 'mr',
  state: 'Maharashtra',
  district: 'Kolhapur',
  village: 'Shirol',
  land_size_acres: 4.5,
  latitude: 16.7050,
  longitude: 74.2433,
};

export const DEFAULT_DEMO_USER: User = {
  id: 'demo-farmer-id-789',
  app_metadata: { provider: 'demo' },
  user_metadata: {
    full_name: 'Ramesh Patil (शेतकरी)',
    phone: '+91 98220 12345',
  },
  aud: 'authenticated',
  created_at: new Date().toISOString(),
  email: 'ramesh.patil@agripulse.demo',
} as User;

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isOnboarded: boolean;
  isDemo: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  loginAsDemo: (customProfile?: Partial<UserProfile>) => void;
  updateDemoProfile: (updates: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { setLocale } = useLanguage();

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (data && !error) {
        setProfile(data as UserProfile);
        if (data.language && !localStorage.getItem('kisanmitra_lang')) {
          setLocale(data.language as Locale);
        }
      } else {
        setProfile(null);
      }
    } catch (err) {
      console.warn('Could not fetch user profile:', err);
    }
  };

  useEffect(() => {
    // 1. Check if demo session exists in localStorage
    if (typeof window !== 'undefined') {
      const savedDemo = localStorage.getItem('kisanmitra_demo_session');
      if (savedDemo) {
        try {
          const parsed = JSON.parse(savedDemo);
          if (parsed && parsed.profile) {
            setUser(parsed.user || DEFAULT_DEMO_USER);
            setProfile(parsed.profile);
            setIsDemo(true);
            setIsLoading(false);
            return;
          }
        } catch {
          localStorage.removeItem('kisanmitra_demo_session');
        }
      }
    }

    // 2. Check initial active Supabase session
    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchProfile(session.user.id);
        }
      })
      .catch((err) => {
        console.warn('Supabase getSession network error:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });

    // 3. Listen to live auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        if (currentSession?.user) {
          setIsDemo(false);
          if (typeof window !== 'undefined') {
            localStorage.removeItem('kisanmitra_demo_session');
          }
          await fetchProfile(currentSession.user.id);
        } else if (!isDemo) {
          setProfile(null);
        }
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loginAsDemo = (customProfile?: Partial<UserProfile>) => {
    const demoProf: UserProfile = {
      ...DEFAULT_DEMO_PROFILE,
      ...(customProfile || {}),
    };
    setUser(DEFAULT_DEMO_USER);
    setProfile(demoProf);
    setIsDemo(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('kisanmitra_demo_session', JSON.stringify({
        user: DEFAULT_DEMO_USER,
        profile: demoProf,
      }));
    }
  };

  const updateDemoProfile = (updates: Partial<UserProfile>) => {
    if (profile) {
      const updated = { ...profile, ...updates };
      setProfile(updated);
      if (typeof window !== 'undefined') {
        localStorage.setItem('kisanmitra_demo_session', JSON.stringify({
          user: user || DEFAULT_DEMO_USER,
          profile: updated,
        }));
      }
    }
  };

  const signOut = async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('kisanmitra_demo_session');
    }
    setIsDemo(false);
    setUser(null);
    setSession(null);
    setProfile(null);
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('SignOut warning:', err);
    }
  };

  const refreshProfile = async () => {
    if (isDemo && typeof window !== 'undefined') {
      const saved = localStorage.getItem('kisanmitra_demo_session');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed?.profile) setProfile(parsed.profile);
        } catch {}
      }
    } else if (user) {
      await fetchProfile(user.id);
    }
  };

  const isOnboarded = Boolean(profile && profile.state && profile.district);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        isLoading,
        isOnboarded,
        isDemo,
        signOut,
        refreshProfile,
        loginAsDemo,
        updateDemoProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

