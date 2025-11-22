export type SessionUser = {
  id: string;
  name?: string;
  email?: string;
  role?: string;
  avatar?: string;
  phoneNumber?: string;
  token?: string;
};

const STORAGE_KEY = 'rs_current_user';

export const getSessionUser = (): SessionUser | null => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SessionUser;
  } catch (err) {
    console.error('getSessionUser error', err);
    return null;
  }
};

export const setSessionUser = (user: SessionUser | null) => {
  try {
    if (user) {
      // write to both storages so other tabs and components can read
      try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user)); } catch {}
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(user)); } catch {}
    } else {
      try { sessionStorage.removeItem(STORAGE_KEY); } catch {}
      try { localStorage.removeItem(STORAGE_KEY); } catch {}
    }
    // notify same-tab listeners
    window.dispatchEvent(new Event('rs_user_updated'));
  } catch (err) {
    console.error('setSessionUser error', err);
  }
};

export const clearSessionUser = () => setSessionUser(null);

// Listen for storage changes from other tabs/windows and propagate update event
try {
  window.addEventListener('storage', (e: StorageEvent) => {
    if (!e.key || e.key === STORAGE_KEY) {
      // forward as internal event so components can update
      window.dispatchEvent(new Event('rs_user_updated'));
    }
  });
} catch (err) {
  // ignore in environments where window isn't available
}

export default {
  getSessionUser,
  setSessionUser,
  clearSessionUser,
};
