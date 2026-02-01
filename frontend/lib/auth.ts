/**
 * Auth utility functions for managing authentication state
 */

export interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "officer";
}

/**
 * Get the stored token from localStorage
 */
export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};

/**
 * Get the stored user from localStorage
 */
export const getUser = (): User | null => {
  if (typeof window === "undefined") return null;
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!getToken();
};

/**
 * Check if user has a specific role
 */
export const hasRole = (role: "admin" | "officer"): boolean => {
  const user = getUser();
  return user?.role === role;
};

/**
 * Clear authentication data
 */
export const clearAuth = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

/**
 * Set authentication data
 */
export const setAuth = (token: string, user: User): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
};
