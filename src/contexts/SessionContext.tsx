import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type SessionUser = {
  id: string;
  name?: string;
  email?: string;
  role?: string;
  avatar?: string;
  phoneNumber?: string;
  token?: string; // optional auth token
};

type SessionContextType = {
  user: SessionUser | null;
  setUser: (u: SessionUser | null) => void;
  clearUser: () => void;
};

const SessionContext = createContext<SessionContextType | undefined>(undefined);

const STORAGE_KEY = 'rs_current_user';

const readUserFromStorage = (): SessionUser | null => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read session user from storage', err);
    return null;
  }
};

export const SessionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<SessionUser | null>(() => readUserFromStorage());

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        setUserState(readUserFromStorage());
      }
    };

    const handleCustom = () => setUserState(readUserFromStorage());

    window.addEventListener('storage', handleStorage);
    window.addEventListener('rs_user_updated', handleCustom);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('rs_user_updated', handleCustom);
    };
  }, []);

  const setUser = (u: SessionUser | null) => {
    try {
      if (u) {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(u));
      } else {
        sessionStorage.removeItem(STORAGE_KEY);
      }
      // update state and notify same-tab listeners
      setUserState(u);
      window.dispatchEvent(new Event('rs_user_updated'));
    } catch (err) {
      console.error('Failed to set session user', err);
    }
  };

  const clearUser = () => setUser(null);

  return (
    <SessionContext.Provider value={{ user, setUser, clearUser }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used within SessionProvider');
  return ctx;
};

export default SessionContext;
