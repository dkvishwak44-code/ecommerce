'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';

// Quick-login demo accounts
const DEMO_ACCOUNTS = [
  { label: 'Staff',    email: 'staff@test.com',   role: 'staff'    },
  { label: 'Seller',      email: 'seller@test.com',     role: 'seller'      },
  { label: 'Moderator',   email: 'moderator@test.com',  role: 'moderator'   },
  { label: 'Admin',       email: 'admin@test.com',      role: 'admin'       },
  { label: 'Super Admin', email: 'superadmin@test.com', role: 'super_admin' },
];

export default function LoginPage() {
  const { login, isLoading, error, isLoggedIn } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      router.push('/dashboard');
    }
  }, [isLoggedIn, router]);

  async function handleSubmit(e) {
    e.preventDefault();
    await login(email, password);
    router.push('/dashboard');
  }

  async function handleQuickLogin(demoEmail) {
    await login(demoEmail, 'password');
    router.push('/dashboard');
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa' }}>
      <div style={{ width: 420, background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', padding: '2rem' }}>

        <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 4 }}>Sign in</h1>
        <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 24 }}>RBAC E-commerce Demo</p>

        {/* Quick login buttons */}
        <p style={{ fontSize: 12, color: '#9ca3af', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Quick login as:</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
          {DEMO_ACCOUNTS.map(acc => (
            <button
              key={acc.role}
              onClick={() => handleQuickLogin(acc.email)}
              style={{
                padding: '5px 12px', fontSize: 13, borderRadius: 20,
                border: '1px solid #d1d5db', background: '#f9fafb',
                cursor: 'pointer', color: '#374151',
              }}
            >
              {acc.label}
            </button>
          ))}
        </div>

        <div style={{ borderTop: '1px solid #e5e7eb', margin: '20px 0', textAlign: 'center', position: 'relative' }}>
          <span style={{ background: '#fff', padding: '0 12px', fontSize: 12, color: '#9ca3af', position: 'relative', zIndex: 1 }}>or enter manually</span>
        </div>

        {/* Manual login form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 4 }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="customer@test.com"
              required
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, outline: 'none' }}
            />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 4 }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="any password works in demo"
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, outline: 'none' }}
            />
          </div>

          {error && (
            <p style={{ fontSize: 13, color: '#ef4444', background: '#fef2f2', padding: '8px 12px', borderRadius: 8 }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              padding: '10px', background: '#2563eb', color: '#fff', border: 'none',
              borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: 'pointer',
              opacity: isLoading ? 0.6 : 1,
            }}
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
