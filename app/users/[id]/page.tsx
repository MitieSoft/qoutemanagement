'use client';

import DashboardLayout from '@/components/layouts/DashboardLayout';
import { getCurrentUser, logout } from '@/lib/auth';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { mockUsers } from '@/lib/mockData';
import { Role, User } from '@/lib/types';
import Link from 'next/link';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';

export default function UserDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [currentUser] = useState(getCurrentUser());
  const [selectedRole, setSelectedRole] = useState<Role | ''>('');
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const userId = params.id as string;

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    } else if (currentUser.role !== Role.ADMIN) {
      router.push('/dashboard');
    }
  }, [currentUser, router]);

  const user: User | undefined = useMemo(
    () => mockUsers.find((u) => u.id === userId),
    [userId]
  );

  useEffect(() => {
    if (user) setSelectedRole(user.role);
  }, [user]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleSave = () => {
    if (!user || !selectedRole) return;
    
    // Validate password if provided
    if (newPassword) {
      if (newPassword.length < 6) {
        alert('Password must be at least 6 characters long');
        return;
      }
      if (newPassword !== confirmPassword) {
        alert('Passwords do not match');
        return;
      }
    }
    
    try {
      const updateData: any = {
        role: selectedRole as Role,
      };
      
      // Only update password if a new one is provided
      if (newPassword && newPassword.length >= 6 && newPassword === confirmPassword) {
        updateData.password = newPassword; // In production, this would be hashed before updating
      }
      
      updateUser(user.id, updateData);
      
      alert('User updated successfully!');
      window.location.reload();
    } catch (error) {
      alert('Failed to update user');
    }
  };

  if (!currentUser || currentUser.role !== Role.ADMIN) return null;

  if (!user) {
    return (
      <DashboardLayout user={currentUser} onLogout={handleLogout}>
        <div className="text-center py-12">
          <p className="text-gray-500">User not found</p>
          <Link
            href="/users"
            className="text-primary-600 hover:underline mt-4 inline-block"
          >
            Back to Users
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout user={currentUser} onLogout={handleLogout}>
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link href="/users" className="text-gray-600 hover:text-gray-900">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
            <p className="mt-1 text-sm text-gray-500">Manage user and role</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 space-y-4 max-w-lg">
          <div>
            <p className="text-sm font-medium text-gray-500">Email</p>
            <p className="text-sm text-gray-900">{user.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as Role)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-primary-500 focus:border-primary-500"
            >
              {Object.values(Role).map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
          
          {/* Password Change Section */}
          <div className="pt-4 border-t space-y-4">
            <h3 className="text-sm font-medium text-gray-900">Change Password</h3>
            <p className="text-xs text-gray-500">
              Leave blank to keep current password
            </p>
            
            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                New Password
              </label>
              <div className="relative">
                <input
                  id="newPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  minLength={6}
                  className="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md text-sm focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Leave blank to keep current"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {newPassword && (
                <p className="mt-1 text-xs text-gray-500">
                  Password must be at least 6 characters long
                </p>
              )}
            </div>
            
            {newPassword && (
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Re-enter new password"
                />
                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="mt-1 text-xs text-red-600">
                    Passwords do not match
                  </p>
                )}
              </div>
            )}
          </div>
          
          <div className="pt-4 flex justify-end space-x-3 border-t">
            <Link
              href="/users"
              className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 bg-primary-600 text-white rounded-md text-sm hover:bg-primary-700"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}


