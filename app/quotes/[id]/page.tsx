'use client';

import DashboardLayout from '@/components/layouts/DashboardLayout';
import { getCurrentUser, logout } from '@/lib/auth';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  getQuoteById,
  getActivitiesByEntity,
  getEmailLogsByEntity,
  updateQuoteStatus,
} from '@/lib/mockData';
import { EntityType, QuoteStatus } from '@/lib/types';
import {
  ArrowLeft,
  Mail,
  Download,
  CheckCircle,
  ShoppingCart,
} from 'lucide-react';
import Link from 'next/link';
import ActivityTimeline from '@/components/common/ActivityTimeline';
import EmailModal from '@/components/common/EmailModal';
import { generateQuotePDF } from '@/lib/pdfGenerator';
import { formatDate } from '@/lib/dateUtils';

export default function QuoteDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [user, setUser] = useState(getCurrentUser());
  const [emailOpen, setEmailOpen] = useState(false);
  const quoteId = params.id as string;

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

  const quote = getQuoteById(quoteId);
  if (!quote) {
    return (
      <DashboardLayout user={user} onLogout={handleLogout}>
        <div className="text-center py-12">
          <p className="text-gray-500">Quote not found</p>
          <Link href="/quotes" className="text-primary-600 hover:underline mt-4 inline-block">
            Back to Quotes
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const activities = getActivitiesByEntity(EntityType.QUOTE, quoteId);
  const emailLogs = getEmailLogsByEntity(EntityType.QUOTE, quoteId);
  const canEdit = user.role !== 'VIEWER' && quote.status === QuoteStatus.DRAFT;
  const canConvert = quote.status === QuoteStatus.APPROVED && user.role !== 'VIEWER';

  const getStatusColor = (status: QuoteStatus) => {
    switch (status) {
      case QuoteStatus.DRAFT:
        return 'bg-gray-100 text-gray-800';
      case QuoteStatus.SENT:
        return 'bg-blue-100 text-blue-800';
      case QuoteStatus.APPROVED:
        return 'bg-green-100 text-green-800';
      case QuoteStatus.CONVERTED:
        return 'bg-purple-100 text-purple-800';
      case QuoteStatus.INVOICED:
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout user={user} onLogout={handleLogout}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/quotes" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{quote.quoteNumber}</h1>
              <p className="mt-1 text-sm text-gray-500">Quote Details</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span
              className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(
                quote.status
              )}`}
            >
              {quote.status}
            </span>
            {canEdit && (
              <Link
                href={`/quotes/${quote.id}/edit`}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Edit
              </Link>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quote Info */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quote Information</h2>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Client</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    <Link href={`/clients/${quote.clientId}`} className="text-primary-600 hover:underline">
                      {quote.client?.name}
                    </Link>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Currency</dt>
                  <dd className="mt-1 text-sm text-gray-900">{quote.currency}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Valid Until</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {formatDate(quote.validUntil)}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Created By</dt>
                  <dd className="mt-1 text-sm text-gray-900">{quote.createdBy?.name || '-'}</dd>
                </div>
                {quote.notes && (
                  <div className="md:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">Notes</dt>
                    <dd className="mt-1 text-sm text-gray-900">{quote.notes}</dd>
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
                    {quote.items.map((item) => (
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
                  <span className="text-sm font-medium text-gray-900">£{quote.subtotal.toLocaleString()}</span>
                </div>
                {quote.discountValue && quote.discountType && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      Discount ({quote.discountType === 'PERCENTAGE' ? `${quote.discountValue}%` : `£${quote.discountValue}`})
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      -£{(
                        quote.discountType === 'PERCENTAGE'
                          ? (quote.subtotal * quote.discountValue) / 100
                          : quote.discountValue
                      ).toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">VAT ({quote.vatRate}%)</span>
                  <span className="text-sm font-medium text-gray-900">£{quote.vatAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200">
                  <span className="text-base font-semibold text-gray-900">Total</span>
                  <span className="text-base font-bold text-gray-900">£{quote.total.toLocaleString()}</span>
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
                  onClick={() => quote && generateQuotePDF(quote)}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <Download size={18} />
                  <span>Download PDF</span>
                </button>
                {quote.status === QuoteStatus.SENT && user.role !== 'VIEWER' && (
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Mark this quote as approved?')) {
                        updateQuoteStatus(quote.id, QuoteStatus.APPROVED, user.id);
                        alert('Quote marked as approved!');
                        window.location.reload();
                      }
                    }}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <CheckCircle size={18} />
                    <span>Mark as Approved</span>
                  </button>
                )}
                {canConvert && (
                  <Link
                    href={`/orders/new?quoteId=${quote.id}`}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <ShoppingCart size={18} />
                    <span>Convert to Order</span>
                  </Link>
                )}
              </div>
            </div>

            {/* Activity */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Activity</h2>
              <ActivityTimeline activities={activities} />
            </div>

            {/* Email History */}
            {emailLogs.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Email History</h2>
                <div className="space-y-3">
                  {emailLogs.map((email) => (
                    <div key={email.id} className="border border-gray-200 rounded-lg p-3">
                      <p className="text-sm font-medium text-gray-900">{email.subject}</p>
                      <p className="text-xs text-gray-500 mt-1">To: {email.to}</p>
                      <p className="text-xs text-gray-500">
                        {formatDate(email.sentAt)} •{' '}
                        <span className={email.status === 'SENT' ? 'text-green-600' : 'text-red-600'}>
                          {email.status}
                        </span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <EmailModal
          open={emailOpen}
          onClose={() => setEmailOpen(false)}
          defaultTo={quote.client?.email || ''}
          defaultSubject={`Quote ${quote.quoteNumber} from Your Company`}
          entityType={EntityType.QUOTE}
          entityId={quote.id}
        />
      </div>
    </DashboardLayout>
  );
}

