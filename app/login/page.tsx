'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Mock login - in production, call API
    const user = login(email, password);
    
    if (user) {
      router.push('/dashboard');
    } else {
      setError('Invalid email or password');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Quote Management System
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to your account
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Demo Accounts</h3>
              
              <div className="space-y-3">
                <div className="bg-white border border-blue-200 rounded-lg p-2">
                  <p className="text-sm font-semibold text-gray-900 mb-0">Admin Account:</p>
                  <p className="text-sm text-gray-700">admin@example.com</p>
                  <p className="text-sm text-gray-700">Password: admin123</p>
                </div>
                
                <div className="bg-white border border-blue-200 rounded-lg p-2">
                  <p className="text-sm font-semibold text-gray-900 mb-0">Sales Account:</p>
                  <p className="text-sm text-gray-700">sales@example.com</p>
                  <p className="text-sm text-gray-700">Password: sales123</p>
                </div>
                
                <div className="bg-white border border-blue-200 rounded-lg p-2">
                  <p className="text-sm font-semibold text-gray-900 mb-0">Finance Account:</p>
                  <p className="text-sm text-gray-700">finance@example.com</p>
                  <p className="text-sm text-gray-700">Password: finance123</p>
                </div>
                
                {/* <div className="bg-white border border-blue-200 rounded-lg p-3">
                  <p className="text-sm font-semibold text-gray-900 mb-1">Viewer Account:</p>
                  <p className="text-sm text-gray-700">viewer@example.com</p>
                  <p className="text-sm text-gray-700">Password: viewer123</p>
                </div> */}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

