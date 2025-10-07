type StorageKey = "auth" | "user";

export default {
  get(key: StorageKey) {
    return localStorage.getItem(key) || sessionStorage.getItem(key);
  },

  set(key: StorageKey, value: string, rememberMe: boolean = false) {
    if (rememberMe) {
      localStorage.setItem(key, value);
    } else {
      sessionStorage.setItem(key, value);
    }
  },
  remove(key: StorageKey) {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  },
  clear() {
    localStorage.clear();
    sessionStorage.clear();
  },
};
