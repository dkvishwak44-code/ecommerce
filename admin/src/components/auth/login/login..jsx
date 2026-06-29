'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { z } from 'zod';

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address'),

  password: z
    .string()
    .min(6, 'Password must be at least 6 characters'),
});

export default function LoginPage() {
  const router = useRouter();

  const {
    login,
    isLoading,
    error,
    isLoggedIn,
  } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    if (isLoggedIn) {
      router.push('/dashboard');
    }
  }, [isLoggedIn, router]);

  const onSubmit = async (data) => {
    const result = await login(data);

    if (!result.error) {
      router.push('/dashboard');
    }
  };

  const handleQuickLogin = async (email) => {
    setValue('email', email);
    setValue('password', 'password123');

    const result = await login({
      email,
      password: 'password123',
    });

    if (!result.error) {
      router.push('/dashboard');
    }
  };

  const DEMO_ACCOUNTS = [
    {
      label: 'Staff',
      email: 'staff@test.com',
    },
    {
      label: 'Seller',
      email: 'seller@test.com',
    },
    {
      label: 'Moderator',
      email: 'moderator@test.com',
    },
    {
      label: 'Admin',
      email: 'admin@test.com',
    },
    {
      label: 'Super Admin',
      email: 'superadmin@test.com',
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md bg-white border rounded-xl p-8 shadow-sm">

        <h1 className="text-2xl font-semibold">
          Sign In
        </h1>

        <p className="text-sm text-gray-500 mt-1 mb-6">
          RBAC E-commerce Demo
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          {DEMO_ACCOUNTS.map((account) => (
            <button
              key={account.email}
              type="button"
              onClick={() =>
                handleQuickLogin(account.email)
              }
              className="px-3 py-1 text-sm border rounded-full hover:bg-gray-100"
            >
              {account.label}
            </button>
          ))}
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <div>
            <label className="block mb-1 text-sm font-medium">
              Email
            </label>

            <input
              type="email"
              {...register('email')}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="admin@test.com"
            />

            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">
              Password
            </label>

            <input
              type="password"
              {...register('password')}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="******"
            />

            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white rounded-lg py-2 font-medium disabled:opacity-50"
          >
            {isLoading
              ? 'Signing In...'
              : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}