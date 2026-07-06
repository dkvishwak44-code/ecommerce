'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Eye, EyeOff } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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

  const [showPassword, setShowPassword] = useState(false);

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
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>
            RBAC E-commerce Demo
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Demo Accounts */}
          <div className="flex flex-wrap gap-2 mb-6">
            {DEMO_ACCOUNTS.map((account) => (
              <Button
                key={account.email}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleQuickLogin(account.email)}
              >
                {account.label}
              </Button>
            ))}
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
          >
            {/* Email */}
            <div className="space-y-1">
              <Label htmlFor="email">
                Email
              </Label>

              <Input
                id="email"
                type="email"
                placeholder="admin@test.com"
                {...register('email')}
              />

              {errors.email && (
                <p className="text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1">
              <Label htmlFor="password">
                Password
              </Label>

              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="******"
                  {...register('password')}
                />

                <button
                  type="button"
                  aria-label={
                    showPassword
                      ? 'Hide password'
                      : 'Show password'
                  }
                  onClick={() =>
                    setShowPassword((prev) => !prev)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>

              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Login Error */}
            {error && (
              <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading
                ? 'Signing In...'
                : 'Sign In'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}