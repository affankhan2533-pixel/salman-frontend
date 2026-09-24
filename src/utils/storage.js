/**
 * Safe Browser Storage Utility
 * Prevents DOMException / SecurityError crashes on iOS Safari, Private Browsing,
 * restricted iframe WebViews, or quota exceeded states.
 */

const memoryStorage = new Map();

export const safeSessionStorage = {
  getItem: (key) => {
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        return window.sessionStorage.getItem(key);
      }
    } catch {
      /* Fallback to memory storage if storage is blocked */
    }
    return memoryStorage.get(`session_${key}`) || null;
  },

  setItem: (key, value) => {
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        window.sessionStorage.setItem(key, value);
        return;
      }
    } catch {
      /* Fallback to memory storage if storage is blocked */
    }
    memoryStorage.set(`session_${key}`, String(value));
  },

  removeItem: (key) => {
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        window.sessionStorage.removeItem(key);
      }
    } catch {
      /* ignore */
    }
    memoryStorage.delete(`session_${key}`);
  },
};

export const safeLocalStorage = {
  getItem: (key) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
    } catch {
      /* Fallback to memory storage if storage is blocked */
    }
    return memoryStorage.get(`local_${key}`) || null;
  },

  setItem: (key, value) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
        return;
      }
    } catch {
      /* Fallback to memory storage if storage is blocked */
    }
    memoryStorage.set(`local_${key}`, String(value));
  },

  removeItem: (key) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch {
      /* ignore */
    }
    memoryStorage.delete(`local_${key}`);
  },
};
