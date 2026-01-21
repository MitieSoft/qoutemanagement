'use client';

import DashboardLayout from '@/components/layouts/DashboardLayout';
import { getCurrentUser, logout } from '@/lib/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getOrderById, createInvoiceFromOrder } from '@/lib/mockData';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewInvoicePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [user, setUser] = useState(getCurrentUser());
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    paymentTerms: 'Net 30',
    notes: '',
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
    if (user?.role === 'VIEWER') {
      router.push('/invoices');
    }
  }, [user, router]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!user || user.role === 'VIEWER') return null;

  const order = orderId ? getOrderById(orderId) : null;

  if (!order) {
    return (
      <DashboardLayout user={user} onLogout={handleLogout}>
        <div className="space-y-6">
          <div className="text-center py-12">
            <p className="text-gray-500">Order not found</p>
            <Link href="/orders" className="text-primary-600 hover:underline mt-4 inline-block">
              Back to Orders
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Create invoice from order
    const invoice = createInvoiceFromOrder(order.id, user.id, formData.paymentTerms);
    
    setTimeout(() => {
      setLoading(false);
      if (invoice) {
        alert(`Invoice ${invoice.invoiceNumber} created successfully!`);
        router.push(`/invoices/${invoice.id}`);
      } else {
        alert('Failed to create invoice');
      }
    }, 500);
  };

  // Calculate due date based on payment terms
  const calculateDueDate = (paymentTerms: string): string => {
    const issueDate = new Date();
    const days = paymentTerms === 'Net 15' ? 15 : paymentTerms === 'Net 30' ? 30 : paymentTerms === 'Net 60' ? 60 : 30;
    const dueDate = new Date(issueDate);
    dueDate.setDate(dueDate.getDate() + days);
    return dueDate.toISOString().split('T')[0];
  };

  return (
    <DashboardLayout user={user} onLogout={handleLogout}>
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link href={orderId ? `/orders/${orderId}` : '/invoices'} className="text-gray-600 hover:text-gray-900">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create Invoice from Order</h1>
            <p className="mt-1 text-sm text-gray-500">
              Generating invoice from order {order.orderNumber}
            </p>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Details</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Order Number</p>
              <p className="font-medium text-gray-900">{order.orderNumber}</p>
            </div>
            <div>
              <p className="text-gray-500">Client</p>
              <p className="font-medium text-gray-900">{order.client?.name}</p>
            </div>
            {order.quote && (
              <div>
                <p className="text-gray-500">Related Quote</p>
                <p className="font-medium text-gray-900">{order.quote.quoteNumber}</p>
              </div>
            )}
            <div>
              <p className="text-gray-500">Total</p>
              <p className="font-medium text-gray-900">£{order.total.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Invoice Items Preview */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Invoice Items</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unit Price
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    VAT Rate
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Line Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.description}</td>
                    <td className="px-4 py-3 text-sm text-right text-gray-900">{item.quantity}</td>
                    <td className="px-4 py-3 text-sm text-right text-gray-900">
                      £{item.unitPrice.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-gray-900">{item.vatRate}%</td>
                    <td className="px-4 py-3 text-sm text-right font-medium text-gray-900">
                      £{item.lineTotal.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="mt-6 border-t border-gray-200 pt-4">
            <div className="flex justify-end">
              <div className="w-64 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">£{order.subtotal.toLocaleString()}</span>
                </div>
                {order.discountValue && order.discountType && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Discount{' '}
                      {order.discountType === 'PERCENTAGE'
                        ? `(${order.discountValue}%)`
                        : `(£${order.discountValue})`}
                    </span>
                    <span className="text-gray-900">
                      -£
                      {(
                        order.discountType === 'PERCENTAGE'
                          ? (order.subtotal * order.discountValue) / 100
                          : order.discountValue
                      ).toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">VAT ({order.vatRate}%)</span>
                  <span className="text-gray-900">£{order.vatAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200">
                  <span className="text-base font-semibold text-gray-900">Total</span>
                  <span className="text-base font-bold text-gray-900">£{order.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Invoice Information</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="paymentTerms" className="block text-sm font-medium text-gray-700">
                Payment Terms *
              </label>
              <select
                id="paymentTerms"
                required
                value={formData.paymentTerms}
                onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="Net 15">Net 15</option>
                <option value="Net 30">Net 30</option>
                <option value="Net 60">Net 60</option>
                <option value="Due on Receipt">Due on Receipt</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">
                Due date will be calculated as: {calculateDueDate(formData.paymentTerms)}
              </p>
            </div>
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                Invoice Notes (Optional)
              </label>
              <textarea
                id="notes"
                rows={4}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                placeholder="Add any additional notes for this invoice..."
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <Link
              href={orderId ? `/orders/${orderId}` : '/invoices'}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-primary-600 text-white rounded-md text-sm hover:bg-primary-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Invoice'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

