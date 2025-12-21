import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

interface Profile {
  id: string;
  user_id: string;
  name: string | null;
  email: string | null;
  avatar_url: string | null;
}

interface AuthStore {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ error: Error | null }>;
  signup: (name: string, email: string, password: string) => Promise<{ error: Error | null }>;
  logout: () => Promise<void>;
  fetchProfile: (userId: string) => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  session: null,
  profile: null,
  isAuthenticated: false,
  isLoading: true,

  initialize: async () => {
    // Set up auth state listener FIRST
    supabase.auth.onAuthStateChange((event, session) => {
      set({
        session,
        user: session?.user ?? null,
        isAuthenticated: !!session?.user,
        isLoading: false,
      });

      // Fetch profile after auth state change
      if (session?.user) {
        setTimeout(() => {
          get().fetchProfile(session.user.id);
        }, 0);
      } else {
        set({ profile: null });
      }
    });

    // THEN check for existing session
    const { data: { session } } = await supabase.auth.getSession();
    set({
      session,
      user: session?.user ?? null,
      isAuthenticated: !!session?.user,
      isLoading: false,
    });

    if (session?.user) {
      await get().fetchProfile(session.user.id);
    }
  },

  fetchProfile: async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (!error && data) {
      set({ profile: data });
    }
  },

  login: async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error };
    }

    return { error: null };
  },

  signup: async (name: string, email: string, password: string) => {
    const redirectUrl = `${window.location.origin}/`;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          name,
        },
      },
    });

    if (error) {
      return { error };
    }

    return { error: null };
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({
      user: null,
      session: null,
      profile: null,
      isAuthenticated: false,
    });
  },
}));
