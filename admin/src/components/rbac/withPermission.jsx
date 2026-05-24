'use client';
import ProtectedRoute from './ProtectedRoute';

/**
 * withPermission — Higher Order Component
 * Wraps a page component with permission checks
 *
 * Usage:
 *   const ProtectedUsersPage = withPermission(UsersPage, {
 *     permission: 'user.view',
 *     roles: ['admin', 'super_admin'],
 *   });
 *   export default ProtectedUsersPage;
 *
 * Or inline in Next.js page:
 *   export default withPermission(AdminPage, { permission: 'settings.manage' });
 */
export default function withPermission(Component, options = {}) {
  const WrappedComponent = (props) => (
    <ProtectedRoute {...options}>
      <Component {...props} />
    </ProtectedRoute>
  );

  WrappedComponent.displayName = `withPermission(${Component.displayName || Component.name})`;
  return WrappedComponent;
}
