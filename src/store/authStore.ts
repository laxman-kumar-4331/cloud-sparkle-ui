import { create } from 'zustand';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

interface User {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ error: Error | null }>;
  signup: (name: string, email: string, password: string) => Promise<{ error: Error | null }>;
  logout: () => Promise<void>;
}

const callAuthFunction = async (body: Record<string, unknown>) => {
  const response = await fetch(`${SUPABASE_URL}/functions/v1/mongodb-auth`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }
  return data;
};

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  initialize: async () => {
    const storedToken = localStorage.getItem('auth_token');
    
    if (!storedToken) {
      set({ isLoading: false });
      return;
    }

    try {
      const data = await callAuthFunction({ action: 'verify', token: storedToken });
      set({
        user: data.user,
        token: storedToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch {
      localStorage.removeItem('auth_token');
      set({ isLoading: false });
    }
  },

  login: async (email: string, password: string) => {
    try {
      const data = await callAuthFunction({ action: 'login', email, password });
      
      localStorage.setItem('auth_token', data.token);
      set({
        user: data.user,
        token: data.token,
        isAuthenticated: true,
      });
      
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  },

  signup: async (name: string, email: string, password: string) => {
    try {
      const data = await callAuthFunction({ action: 'signup', name, email, password });
      
      localStorage.setItem('auth_token', data.token);
      set({
        user: data.user,
        token: data.token,
        isAuthenticated: true,
      });
      
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  },

  logout: async () => {
    const token = get().token;
    
    if (token) {
      try {
        await callAuthFunction({ action: 'logout', token });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
    
    localStorage.removeItem('auth_token');
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },
}));
