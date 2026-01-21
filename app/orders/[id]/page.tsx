'use client';

import DashboardLayout from '@/components/layouts/DashboardLayout';
import { getCurrentUser, logout } from '@/lib/auth';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  getOrderById,
  getActivitiesByEntity,
  getEmailLogsByEntity,
} from '@/lib/mockData';
import { EntityType } from '@/lib/types';
import { ArrowLeft, Mail, Download, Receipt } from 'lucide-react';
import Link from 'next/link';
import ActivityTimeline from '@/components/common/ActivityTimeline';
import EmailModal from '@/components/common/EmailModal';
import { generateOrderPDF } from '@/lib/pdfGenerator';

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [user, setUser] = useState(getCurrentUser());
  const [emailOpen, setEmailOpen] = useState(false);
  const orderId = params.id as string;

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

  const order = getOrderById(orderId);
  if (!order) {
    return (
      <DashboardLayout user={user} onLogout={handleLogout}>
        <div className="text-center py-12">
          <p className="text-gray-500">Order not found</p>
          <Link href="/orders" className="text-primary-600 hover:underline mt-4 inline-block">
            Back to Orders
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const activities = getActivitiesByEntity(EntityType.ORDER, orderId);
  const emailLogs = getEmailLogsByEntity(EntityType.ORDER, orderId);
  const canGenerateInvoice = user.role !== 'VIEWER';

  return (
    <DashboardLayout user={user} onLogout={handleLogout}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/orders" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{order.orderNumber}</h1>
              <p className="mt-1 text-sm text-gray-500">Order Details</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Info */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Information</h2>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Client</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    <Link href={`/clients/${order.clientId}`} className="text-primary-600 hover:underline">
                      {order.client?.name}
                    </Link>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Quote</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {order.quote ? (
                      <Link href={`/quotes/${order.quote.id}`} className="text-primary-600 hover:underline">
                        {order.quote.quoteNumber}
                      </Link>
                    ) : (
                      '-'
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd className="mt-1">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {order.status}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Currency</dt>
                  <dd className="mt-1 text-sm text-gray-900">{order.currency}</dd>
                </div>
                {order.notes && (
                  <div className="md:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">Notes</dt>
                    <dd className="mt-1 text-sm text-gray-900">{order.notes}</dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Items */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Items</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit Price</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">VAT Rate</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {order.items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-4 py-3 text-sm text-gray-900">{item.description}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{item.quantity}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">£{item.unitPrice.toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{item.vatRate}%</td>
                        <td className="px-4 py-3 text-sm text-gray-900 text-right">£{item.lineTotal.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Totals */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Summary</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Subtotal</span>
                  <span className="text-sm font-medium text-gray-900">£{order.subtotal.toLocaleString()}</span>
                </div>
                {order.discountValue && order.discountType && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      Discount ({order.discountType === 'PERCENTAGE' ? `${order.discountValue}%` : `£${order.discountValue}`})
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      -£{(
                        order.discountType === 'PERCENTAGE'
                          ? (order.subtotal * order.discountValue) / 100
                          : order.discountValue
                      ).toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">VAT ({order.vatRate}%)</span>
                  <span className="text-sm font-medium text-gray-900">£{order.vatAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200">
                  <span className="text-base font-semibold text-gray-900">Total</span>
                  <span className="text-base font-bold text-gray-900">£{order.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions</h2>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setEmailOpen(true)}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <Mail size={18} />
                  <span>Send Email</span>
                </button>
                <button
                  type="button"
                  onClick={() => order && generateOrderPDF(order)}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <Download size={18} />
                  <span>Download PDF</span>
                </button>
                {canGenerateInvoice && (
                  <Link
                    href={`/invoices/new?orderId=${order.id}`}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Receipt size={18} />
                    <span>Generate Invoice</span>
                  </Link>
                )}
              </div>
            </div>

            {/* Activity */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Activity</h2>
              <ActivityTimeline activities={activities} />
            </div>
          </div>
        </div>

        <EmailModal
          open={emailOpen}
          onClose={() => setEmailOpen(false)}
          defaultTo={order.client?.email || ''}
          defaultSubject={`Order ${order.orderNumber} from Your Company`}
          entityType={EntityType.ORDER}
          entityId={order.id}
        />
      </div>
    </DashboardLayout>
  );
}

