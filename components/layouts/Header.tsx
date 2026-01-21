'use client';

import { User, LogOut } from 'lucide-react';
import { useState } from 'react';
import { User as UserType } from '@/lib/types';

interface HeaderProps {
  user?: UserType;
  onLogout?: () => void;
}

export default function Header({ user, onLogout }: HeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center justify-between px-6 lg:pl-72">
      <div className="flex-1">
        {/* Breadcrumbs or page title can go here */}
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <User size={20} className="text-gray-600" />
            <span className="text-sm font-medium text-gray-700">
              {user?.name || 'User'}
            </span>
            <span className="text-xs text-gray-500">({user?.role})</span>
          </button>
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
              <div className="px-4 py-2 border-b border-gray-200">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

