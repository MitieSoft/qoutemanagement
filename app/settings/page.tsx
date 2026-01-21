'use client';

import DashboardLayout from '@/components/layouts/DashboardLayout';
import { getCurrentUser, logout } from '@/lib/auth';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import PricingSettings from './pricing/PricingSettings';
import SmtpSettings from './smtp/SmtpSettings';

export default function SettingsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(getCurrentUser());
  const [activeTab, setActiveTab] = useState<'pricing' | 'smtp'>('pricing');

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
    if (user?.role !== 'ADMIN') {
      router.push('/dashboard');
    }
  }, [user, router]);

  useEffect(() => {
    // Set active tab based on pathname
    if (pathname?.includes('/smtp')) {
      setActiveTab('smtp');
    } else {
      setActiveTab('pricing');
    }
  }, [pathname]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!user || user.role !== 'ADMIN') return null;

  return (
    <DashboardLayout user={user} onLogout={handleLogout}>
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="mt-1 text-sm text-gray-500">Manage system configuration</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <Link
              href="/settings/pricing"
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'pricing'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Pricing Settings
            </Link>
            <Link
              href="/settings/smtp"
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'smtp'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              SMTP Settings
            </Link>
          </nav>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'pricing' && <PricingSettings />}
          {activeTab === 'smtp' && <SmtpSettings />}
        </div>
      </div>
    </DashboardLayout>
  );
}

