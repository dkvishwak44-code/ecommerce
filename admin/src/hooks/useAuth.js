'use client';
import { useDispatch, useSelector } from 'react-redux';
import {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  grantPermission,
  revokePermission,
  selectUser,
  selectRole,
  selectPermissions,
  selectIsLoggedIn,
  selectIsLoading,
  selectError,
} from '@/store/slices/authSlice';
import { checkPermission, checkAllPermissions, checkAnyPermission } from '@/lib/permissions';


/**
 * useAuth — primary hook for auth + permission checks
 *
 * Usage:
 *   const { user, can, login, logout } = useAuth();
 *   if (can('product.delete')) { ... }
 */
export function useAuth() {
  const dispatch = useDispatch();

  const user        = useSelector(selectUser);
  const role        = useSelector(selectRole);
  const permissions = useSelector(selectPermissions);
  const isLoggedIn  = useSelector(selectIsLoggedIn);
  const isLoading   = useSelector(selectIsLoading);
  const error       = useSelector(selectError);

  // ── Actions ───────────────────────────────────────────────────────────────

  async function login(email, _password) {
    dispatch(loginStart());
    // Simulate async API call (replace with real fetch in production)
    await new Promise(r => setTimeout(r, 400));
    dispatch(loginSuccess({ email }));
  }

  function logoutUser() {
    dispatch(logout());
  }

  // ── Permission checks ─────────────────────────────────────────────────────

  /** Single permission check — 'product.view' */
  function can(permission) {
    return checkPermission(permissions, permission);
  }

  /** ALL permissions must be present */
  function canAll(...perms) {
    return checkAllPermissions(permissions, perms);
  }

  /** ANY permission from the list */
  function canAny(...perms) {
    return checkAnyPermission(permissions, perms);
  }

  /** Role check */
  function hasRole(...roles) {
    return roles.includes(role);
  }

  /** Cannot do — opposite of can */
  function cannot(permission) {
    return !can(permission);
  }

  // ── Admin helpers ─────────────────────────────────────────────────────────
  function grant(permission) {
    dispatch(grantPermission(permission));
  }

  function revoke(permission) {
    dispatch(revokePermission(permission));
  }

  return {
    // State
    user,
    role,
    permissions,
    isLoggedIn,
    isLoading,
    error,
    // Actions
    login,
    logout: logoutUser,
    // Permission helpers
    can,
    canAll,
    canAny,
    cannot,
    hasRole,
    // Admin
    grant,
    revoke,
  };
}

/**
 * usePermission — lightweight hook for a single permission check
 * Avoids subscribing to the full auth state when you only need one check
 *
 * Usage:
 *   const canDelete = usePermission('product.delete');
 */
export function usePermission(permission) {
  const permissions = useSelector(selectPermissions);
  return checkPermission(permissions, permission);
}

/**
 * useRole — returns true if user has one of the given roles
 *
 * Usage:
 *   const isAdmin = useRole('admin', 'super_admin');
 */
export function useRole(...roles) {
  const role = useSelector(selectRole);
  return roles.includes(role);
}
