'use client';

import DashboardLayout from '@/components/layouts/DashboardLayout';
import { getCurrentUser, logout } from '@/lib/auth';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getClientById, getActivitiesByEntity, getEmailLogsByEntity, mockQuotes, mockOrders, mockInvoices } from '@/lib/mockData';
import { EntityType } from '@/lib/types';
import { ArrowLeft, Edit, Mail, FileText, ShoppingCart, Receipt } from 'lucide-react';
import Link from 'next/link';
import { formatDate } from '@/lib/dateUtils';

export default function ClientDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [user, setUser] = useState(getCurrentUser());
  const clientId = params.id as string;

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!user) return null;

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

  const activities = getActivitiesByEntity(EntityType.CLIENT, clientId);
  const clientQuotes = mockQuotes.filter((q) => q.clientId === clientId);
  const clientOrders = mockOrders.filter((o) => o.clientId === clientId);
  const clientInvoices = mockInvoices.filter((i) => i.clientId === clientId);
  const canEdit = user.role !== 'VIEWER';

  return (
    <DashboardLayout user={user} onLogout={handleLogout}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href="/clients"
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{client.name}</h1>
              <p className="mt-1 text-sm text-gray-500">Client Details</p>
            </div>
          </div>
          {canEdit && (
            <Link
              href={`/clients/${client.id}/edit`}
              className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Edit size={20} />
              <span>Edit</span>
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Client Information</h2>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Contact Name</dt>
                  <dd className="mt-1 text-sm text-gray-900">{client.contactName || '-'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900">{client.email}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Phone</dt>
                  <dd className="mt-1 text-sm text-gray-900">{client.phone || '-'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">VAT Number</dt>
                  <dd className="mt-1 text-sm text-gray-900">{client.vatNumber || '-'}</dd>
                </div>
                <div className="md:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Billing Address</dt>
                  <dd className="mt-1 text-sm text-gray-900">{client.billingAddress || '-'}</dd>
                </div>
                <div className="md:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Shipping Address</dt>
                  <dd className="mt-1 text-sm text-gray-900">{client.shippingAddress || '-'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd className="mt-1">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        client.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {client.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </dd>
                </div>
              </dl>
            </div>

            {/* Related Documents */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Related Documents</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                      <FileText size={16} />
                      <span>Quotes ({clientQuotes.length})</span>
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {clientQuotes.slice(0, 5).map((quote) => (
                      <Link
                        key={quote.id}
                        href={`/quotes/${quote.id}`}
                        className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{quote.quoteNumber}</span>
                          <span className="text-sm text-gray-500">£{quote.total.toLocaleString()}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                      <ShoppingCart size={16} />
                      <span>Orders ({clientOrders.length})</span>
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {clientOrders.slice(0, 5).map((order) => (
                      <Link
                        key={order.id}
                        href={`/orders/${order.id}`}
                        className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{order.orderNumber}</span>
                          <span className="text-sm text-gray-500">£{order.total.toLocaleString()}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                      <Receipt size={16} />
                      <span>Invoices ({clientInvoices.length})</span>
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {clientInvoices.slice(0, 5).map((invoice) => (
                      <Link
                        key={invoice.id}
                        href={`/invoices/${invoice.id}`}
                        className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{invoice.invoiceNumber}</span>
                          <span className="text-sm text-gray-500">£{invoice.total.toLocaleString()}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Activity</h2>
            <div className="space-y-4">
              {activities.length > 0 ? (
                activities.map((activity) => (
                  <div key={activity.id} className="border-l-2 border-gray-200 pl-4 pb-4">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {activity.user?.name || 'System'} • {formatDate(activity.timestamp)}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No activity yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

