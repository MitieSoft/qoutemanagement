'use client';

import Sidebar from './Sidebar';
import Header from './Header';
import { User, Role } from '@/lib/types';

interface DashboardLayoutProps {
  children: React.ReactNode;
  user?: User;
  onLogout?: () => void;
}

export default function DashboardLayout({
  children,
  user,
  onLogout,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar userRole={user?.role || Role.ADMIN} />
      <div className="lg:pl-64">
        <Header user={user} onLogout={onLogout} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}

