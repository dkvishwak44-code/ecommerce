'use client';
import { useAuth } from '@/hooks/useAuth';
import Can from '@/components/rbac/Can';

export default function TestPage() {
  const { user, role, permissions } = useAuth();

  return (
    <div style={{ padding: 40 }}>
      <h2>Logged in as: {user?.name} ({role})</h2>

      <Can permission="product.create">
        <p style={{ color: 'green' }}>✅ You CAN create products</p>
      </Can>

      <Can permission="product.delete">
        <p style={{ color: 'green' }}>✅ You CAN delete products</p>
      </Can>

      <Can permission="user.delete">
        <p style={{ color: 'green' }}>✅ You CAN delete users</p>
      </Can>

      <hr />
      <p>Your permissions:</p>
      <ul>
        {permissions.map(p => <li key={p}>{p}</li>)}
      </ul>
    </div>
  );
}