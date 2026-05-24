import { createSlice } from '@reduxjs/toolkit';
import { getPermissionsForRole, checkPermission, checkAllPermissions, checkAnyPermission } from '@/lib/permissions';
import { DUMMY_USERS } from '@/data/dummy';

// ─── Initial State ──────────────────────────────────────────────────────────
const initialState = {
  user: null,
  role: null,
  permissions: [],      // e.g. ['product.view', 'product.create', ...]
  isLoggedIn: false,
  isLoading: false,
  error: null,
};

// ─── Slice ──────────────────────────────────────────────────────────────────
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {

    loginStart(state) {
      state.isLoading = true;
      state.error = null;
    },

    loginSuccess(state, action) {
      const { email } = action.payload;

      // Simulate DB lookup
      const found = DUMMY_USERS.find(u => u.email === email);
      if (!found) {
        state.error = 'User not found';
        state.isLoading = false;
        return;
      }

      state.user = {
        id:     found.id,
        name:   found.name,
        email:  found.email,
        avatar: found.avatar,
        status: found.status,
      };
      state.role        = found.role;
      state.permissions = getPermissionsForRole(found.role); // dot-notation array
      state.isLoggedIn  = true;
      state.isLoading   = false;
      state.error       = null;

      // Persist to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('authState', JSON.stringify({
          user: state.user,
          role: state.role,
          permissions: state.permissions,
        }));
      }
    },

    loginFailure(state, action) {
      state.error     = action.payload;
      state.isLoading = false;
    },

    logout(state) {
      state.user        = null;
      state.role        = null;
      state.permissions = [];
      state.isLoggedIn  = false;
      state.error       = null;

      // Clear from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authState');
      }
    },

    // Dynamically add a permission (super admin feature)
    grantPermission(state, action) {
      const perm = action.payload;
      if (!state.permissions.includes(perm)) {
        state.permissions.push(perm);
      }
    },

    // Revoke a permission
    revokePermission(state, action) {
      state.permissions = state.permissions.filter(p => p !== action.payload);
      if (typeof window !== 'undefined') {
        const saved = JSON.parse(localStorage.getItem('authState') || '{}');
        localStorage.setItem('authState', JSON.stringify({ ...saved, permissions: state.permissions }));
      }
    },

    // Restore session on app load
    restoreSession(state, action) {
      const saved = action.payload;
      if (saved) {
        state.user = saved.user;
        state.role = saved.role;
        state.permissions = saved.permissions;
        state.isLoggedIn = true;
      }
    },

  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  grantPermission,
  revokePermission,
  restoreSession,
} = authSlice.actions;

export default authSlice.reducer;

// ─── Selectors ──────────────────────────────────────────────────────────────
export const selectUser        = (state) => state.auth.user;
export const selectRole        = (state) => state.auth.role;
export const selectPermissions = (state) => state.auth.permissions;
export const selectIsLoggedIn  = (state) => state.auth.isLoggedIn;
export const selectIsLoading   = (state) => state.auth.isLoading;
export const selectError       = (state) => state.auth.error;

// Check a single permission — memoized selector factory
export const selectCan = (permission) => (state) =>
  checkPermission(state.auth.permissions, permission);

// Check ALL permissions at once
export const selectCanAll = (...permissions) => (state) =>
  checkAllPermissions(state.auth.permissions, permissions);

// Check ANY of the permissions
export const selectCanAny = (...permissions) => (state) =>
  checkAnyPermission(state.auth.permissions, permissions);

// Check role
export const selectHasRole = (...roles) => (state) =>
  roles.includes(state.auth.role);
