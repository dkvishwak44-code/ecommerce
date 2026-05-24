'use client';
import { useAuth } from '@/hooks/useAuth';

/**
 * <Can> — Render children only when the user has the required permission/role
 *
 * Props:
 *   permission  — single permission string e.g. "product.delete"
 *   permissions — array, ALL must pass:  ['product.edit', 'product.publish']
 *   anyOf       — array, ANY must pass:  ['order.manage', 'order.refund']
 *   role        — single role string     "admin"
 *   roles       — array of roles         ['admin', 'super_admin']
 *   not         — invert the check (show when user does NOT have permission)
 *   fallback    — JSX to render on failure (default: null)
 *
 * Examples:
 *   <Can permission="product.delete">
 *     <button>Delete</button>
 *   </Can>
 *
 *   <Can anyOf={['order.manage', 'order.refund']} fallback={<p>No access</p>}>
 *     <OrderActions />
 *   </Can>
 *
 *   <Can roles={['admin','super_admin']}>
 *     <AdminPanel />
 *   </Can>
 */
export default function Can({
  permission,
  permissions,
  anyOf,
  role,
  roles,
  not = false,
  fallback = null,
  children,
}) {
  const { can, canAll, canAny, hasRole } = useAuth();

  let allowed = true;

  if (permission)   allowed = allowed && can(permission);
  if (permissions)  allowed = allowed && canAll(...permissions);
  if (anyOf)        allowed = allowed && canAny(...anyOf);
  if (role)         allowed = allowed && hasRole(role);
  if (roles)        allowed = allowed && hasRole(...roles);

  // Invert if `not` prop is set
  if (not) allowed = !allowed;

  return allowed ? children : fallback;
}
