/**
 * Simple utility to manage admin session using localStorage.
 * For a production environment, use a more secure method like cookies or Supabase Auth.
 */

const ADMIN_SESSION_KEY = "lancerpay_admin_session";

export const adminAuth = {
  login: (username: string, password: string): boolean => {
    if (username === "admin" && password === "admin") {
      if (typeof window !== "undefined") {
        localStorage.setItem(ADMIN_SESSION_KEY, "true");
      }
      return true;
    }
    return false;
  },

  logout: (): void => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(ADMIN_SESSION_KEY);
    }
  },

  isLoggedIn: (): boolean => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(ADMIN_SESSION_KEY) === "true";
    }
    return false;
  },
};
