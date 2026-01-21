'use client';

import DashboardLayout from '@/components/layouts/DashboardLayout';
import { getCurrentUser, logout } from '@/lib/auth';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getClientById, updateClient } from '@/lib/mockData';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function EditClientPage() {
  const router = useRouter();
  const params = useParams();
  const [user, setUser] = useState(getCurrentUser());
  const clientId = params.id as string;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    contactName: '',
    email: '',
    phone: '',
    billingAddress: '',
    shippingAddress: '',
    vatNumber: '',
    isActive: true,
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
    if (user?.role === 'VIEWER') {
      router.push(`/clients/${clientId}`);
    }
  }, [user, router, clientId]);

  useEffect(() => {
    const client = getClientById(clientId);
    if (client) {
      setFormData({
        name: client.name,
        contactName: client.contactName || '',
        email: client.email,
        phone: client.phone || '',
        billingAddress: client.billingAddress || '',
        shippingAddress: client.shippingAddress || '',
        vatNumber: client.vatNumber || '',
        isActive: client.isActive,
      });
    }
  }, [clientId]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const updated = updateClient(clientId, {
        name: formData.name,
        contactName: formData.contactName || undefined,
        email: formData.email,
        phone: formData.phone || undefined,
        billingAddress: formData.billingAddress || undefined,
        shippingAddress: formData.shippingAddress || undefined,
        vatNumber: formData.vatNumber || undefined,
        isActive: formData.isActive,
      });
      
      if (updated) {
        setTimeout(() => {
          setLoading(false);
          router.push(`/clients/${clientId}`);
        }, 500);
      } else {
        setLoading(false);
        alert('Client not found');
      }
    } catch (error) {
      setLoading(false);
      alert('Failed to update client');
    }
  };

  if (!user || user.role === 'VIEWER') return null;

  const client = getClientById(clientId);
  if (!client) {
    return (
      <DashboardLayout user={user} onLogout={handleLogout}>
        <div className="text-center py-12">
          <p className="text-gray-500">Client not found</p>
          <Link href="/clients" className="text-primary-600 hover:underline mt-4 inline-block">
            Back to Clients
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout user={user} onLogout={handleLogout}>
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link href={`/clients/${clientId}`} className="text-gray-600 hover:text-gray-900">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Client</h1>
            <p className="mt-1 text-sm text-gray-500">Update client information</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Client Name *
              </label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <label htmlFor="contactName" className="block text-sm font-medium text-gray-700">
                Contact Name
              </label>
              <input
                type="text"
                id="contactName"
                value={formData.contactName}
                onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email *
              </label>
              <input
                type="email"
                id="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="billingAddress" className="block text-sm font-medium text-gray-700">
                Billing Address
              </label>
              <textarea
                id="billingAddress"
                rows={3}
                value={formData.billingAddress}
                onChange={(e) => setFormData({ ...formData, billingAddress: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="shippingAddress" className="block text-sm font-medium text-gray-700">
                Shipping Address
              </label>
              <textarea
                id="shippingAddress"
                rows={3}
                value={formData.shippingAddress}
                onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <label htmlFor="vatNumber" className="block text-sm font-medium text-gray-700">
                VAT Number
              </label>
              <input
                type="text"
                id="vatNumber"
                value={formData.vatNumber}
                onChange={(e) => setFormData({ ...formData, vatNumber: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <label className="flex items-center space-x-2 mt-6">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm font-medium text-gray-700">Active</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t">
            <Link
              href={`/clients/${clientId}`}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

