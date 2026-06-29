'use client';

import { useDispatch, useSelector } from 'react-redux';

import {
  loginUser,
  logoutUser,
  grantPermission,
  revokePermission,
  selectUser,
  selectRole,
  selectPermissions,
  selectIsLoggedIn,
  selectIsLoading,
  selectError,
} from '@/store/slices/authSlice';

import {
  checkPermission,
  checkAllPermissions,
  checkAnyPermission,
} from '@/lib/permissions';

export function useAuth() {
  const dispatch = useDispatch();

  const user = useSelector(selectUser);
  const role = useSelector(selectRole);
  const permissions = useSelector(selectPermissions);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);

  // Login
  const login = async (credentials) => {
    return dispatch(loginUser(credentials));
  };

  // Logout
  const logout = async () => {
    return dispatch(logoutUser());
  };

  // Permission checks
  const can = (permission) => {
    return checkPermission(permissions, permission);
  };

  const canAll = (...perms) => {
    return checkAllPermissions(permissions, perms);
  };

  const canAny = (...perms) => {
    return checkAnyPermission(permissions, perms);
  };

  const cannot = (permission) => {
    return !can(permission);
  };

  const hasRole = (...roles) => {
    return roles.includes(role);
  };

  // Admin permission management
  const grant = (permission) => {
    dispatch(grantPermission(permission));
  };

  const revoke = (permission) => {
    dispatch(revokePermission(permission));
  };

  return {
    user,
    role,
    permissions,
    isLoggedIn,
    isLoading,
    error,

    login,
    logout,

    can,
    canAll,
    canAny,
    cannot,
    hasRole,

    grant,
    revoke,
  };
}

// Single Permission Hook
export function usePermission(permission) {
  const permissions = useSelector(selectPermissions);
  return checkPermission(permissions, permission);
}

// Role Hook
export function useRole(...roles) {
  const role = useSelector(selectRole);
  return roles.includes(role);
}