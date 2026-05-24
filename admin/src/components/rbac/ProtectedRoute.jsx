'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

/**
 * <ProtectedRoute> — Wraps a page/section and redirects if access is denied
 *
 * Props:
 *   permission   — required single permission
 *   permissions  — ALL of these must be present
 *   anyOf        — ANY of these must be present
 *   role         — required role
 *   roles        — any of these roles
 *   redirectTo   — where to redirect on failure (default: '/unauthorized')
 *   loginRedirect — where to redirect if not logged in (default: '/login')
 *   loadingComponent — JSX shown while auth loads
 *
 * Example:
 *   // pages/admin/users.jsx
 *   export default function UsersPage() {
 *     return (
 *       <ProtectedRoute permission="user.view" roles={['admin','super_admin']}>
 *         <UsersTable />
 *       </ProtectedRoute>
 *     );
 *   }
 */
export default function ProtectedRoute({
  permission,
  permissions,
  anyOf,
  role,
  roles,
  redirectTo    = '/unauthorized',
  loginRedirect = '/login',
  loadingComponent = null,
  children,
}) {
  const { isLoggedIn, isLoading, can, canAll, canAny, hasRole } = useAuth();
  const router = useRouter();

  // Compute access
  let allowed = isLoggedIn;
  if (allowed && permission)  allowed = can(permission);
  if (allowed && permissions) allowed = canAll(...permissions);
  if (allowed && anyOf)       allowed = canAny(...anyOf);
  if (allowed && role)        allowed = hasRole(role);
  if (allowed && roles)       allowed = hasRole(...roles);

  useEffect(() => {
    if (isLoading) return;
    if (!isLoggedIn) { router.replace(loginRedirect); return; }
    if (!allowed)   { router.replace(redirectTo);    return; }
  }, [isLoggedIn, isLoading, allowed]);

  if (isLoading) return loadingComponent;
  if (!isLoggedIn || !allowed) return null;

  return children;
}
