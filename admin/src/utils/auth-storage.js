// src/utils/auth.storage.js

const AUTH_KEY = "authState";

// ── Save ───────────────────────────────────────────────────────
export const saveAuthToStorage = ({ user, role, permissions,accessToken,store }) => {
  try {
    if (typeof window === "undefined") return;
    localStorage.setItem(AUTH_KEY, JSON.stringify({ user, role, permissions,accessToken,store }));
  } catch (err) {
    console.error("[AuthStorage] Save failed:", err);
  }
};



// ── Load ───────────────────────────────────────────────────────
export const loadAuthFromStorage = () => {
  try {
    if (typeof window === "undefined") return null;
    const data = localStorage.getItem(AUTH_KEY);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.error("[AuthStorage] Load failed:", err);
    return null;
  }
};

// ── Clear ──────────────────────────────────────────────────────
export const clearAuthFromStorage = () => {
  try {
    if (typeof window === "undefined") return;
    localStorage.removeItem(AUTH_KEY);
  } catch (err) {
    console.error("[AuthStorage] Clear failed:", err);
  }
};

// ── Update specific field ──────────────────────────────────────
export const updateAuthInStorage = (updates = {}) => {
  try {
    if (typeof window === "undefined") return;
    const existing = loadAuthFromStorage() || {};
    localStorage.setItem(AUTH_KEY, JSON.stringify({ ...existing, ...updates }));
  } catch (err) {
    console.error("[AuthStorage] Update failed:", err);
  }
};

// ── Check if session exists ────────────────────────────────────
export const hasAuthSession = () => {
  try {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem(AUTH_KEY);
  } catch {
    return false;
  }
};