'use client';

import DashboardLayout from '@/components/layouts/DashboardLayout';
import { getCurrentUser, logout } from '@/lib/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getQuoteById, createOrderFromQuote } from '@/lib/mockData';
import { OrderStatus } from '@/lib/types';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewOrderPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const quoteId = searchParams.get('quoteId');
  const [user, setUser] = useState(getCurrentUser());
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    notes: '',
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
    if (user?.role === 'VIEWER') {
      router.push('/orders');
    }
  }, [user, router]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!user || user.role === 'VIEWER') return null;

  const quote = quoteId ? getQuoteById(quoteId) : null;

  if (!quote) {
    return (
      <DashboardLayout user={user} onLogout={handleLogout}>
        <div className="space-y-6">
          <div className="text-center py-12">
            <p className="text-gray-500">Quote not found</p>
            <Link href="/quotes" className="text-primary-600 hover:underline mt-4 inline-block">
              Back to Quotes
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Create order from quote
    const order = createOrderFromQuote(quote.id, user.id);
    
    setTimeout(() => {
      setLoading(false);
      if (order) {
        alert(`Order ${order.orderNumber} created successfully!`);
        router.push(`/orders/${order.id}`);
      } else {
        alert('Failed to create order');
      }
    }, 500);
  };

  return (
    <DashboardLayout user={user} onLogout={handleLogout}>
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link href={quoteId ? `/quotes/${quoteId}` : '/orders'} className="text-gray-600 hover:text-gray-900">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create Order from Quote</h1>
            <p className="mt-1 text-sm text-gray-500">
              Converting quote {quote.quoteNumber} to order
            </p>
          </div>
        </div>

        {/* Quote Summary */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quote Details</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Quote Number</p>
              <p className="font-medium text-gray-900">{quote.quoteNumber}</p>
            </div>
            <div>
              <p className="text-gray-500">Client</p>
              <p className="font-medium text-gray-900">{quote.client?.name}</p>
            </div>
            <div>
              <p className="text-gray-500">Status</p>
              <p className="font-medium text-gray-900">{quote.status}</p>
            </div>
            <div>
              <p className="text-gray-500">Total</p>
              <p className="font-medium text-gray-900">£{quote.total.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Order Items Preview */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
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
                {quote.items.map((item) => (
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
                  <span className="text-gray-900">£{quote.subtotal.toLocaleString()}</span>
                </div>
                {quote.discountValue && quote.discountType && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Discount{' '}
                      {quote.discountType === 'PERCENTAGE'
                        ? `(${quote.discountValue}%)`
                        : `(£${quote.discountValue})`}
                    </span>
                    <span className="text-gray-900">
                      -£
                      {(
                        quote.discountType === 'PERCENTAGE'
                          ? (quote.subtotal * quote.discountValue) / 100
                          : quote.discountValue
                      ).toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">VAT ({quote.vatRate}%)</span>
                  <span className="text-gray-900">£{quote.vatAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200">
                  <span className="text-base font-semibold text-gray-900">Total</span>
                  <span className="text-base font-bold text-gray-900">£{quote.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Information</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                Order Notes (Optional)
              </label>
              <textarea
                id="notes"
                rows={4}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                placeholder="Add any additional notes for this order..."
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <Link
              href={quoteId ? `/quotes/${quoteId}` : '/orders'}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-primary-600 text-white rounded-md text-sm hover:bg-primary-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Order'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

