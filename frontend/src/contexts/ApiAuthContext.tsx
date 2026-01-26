import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { authApi, type User } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  session: null;
  isLoading: boolean;
  isAdmin: boolean;
  signUp: (
    email: string,
    password: string,
    fullName: string
  ) => Promise<{ error: Error | null }>;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAdmin = user?.role === 'admin';

  const refreshUser = useCallback(async () => {
    try {
      const response = await authApi.me();
      if (response.success) {
        setUser(response.data);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const signUp = async (
    email: string,
    password: string,
    fullName: string
  ) => {
    try {
      const response = await authApi.register(email, password, fullName);

      if (response.success) {
        localStorage.setItem('auth_token', response.data.token);
        setUser(response.data.user);
        return { error: null };
      }

      return { error: new Error('Registration failed') };
    } catch (error) {
      return { error: error as Error };
    }
  };

 const signIn = async (email: string, password: string) => {
  try {
    const response = await authApi.login(email, password);

    if (!response.success) {
      return { error: new Error(response.message) };
    }

    localStorage.setItem('token', response.data.token);
    setUser(response.data.user);

    return { error: null };
  } catch (error) {
    return { error: error as Error };
  }
};

  const signOut = async () => {
  try {
    await authApi.logout();
  } finally {
    localStorage.removeItem('token');
    setUser(null);
  }
};

  return (
    <AuthContext.Provider
      value={{
        user,
        session: null,
        isLoading,
        isAdmin,
        signUp,
        signIn,
        signOut,
        refreshUser,
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
