'use client';

import DashboardLayout from '@/components/layouts/DashboardLayout';
import { getCurrentUser, logout } from '@/lib/auth';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  getInvoiceById,
  getActivitiesByEntity,
  getEmailLogsByEntity,
  updateInvoiceStatus,
} from '@/lib/mockData';
import { EntityType, InvoiceStatus } from '@/lib/types';
import { ArrowLeft, Mail, Download, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import ActivityTimeline from '@/components/common/ActivityTimeline';
import EmailModal from '@/components/common/EmailModal';
import { generateInvoicePDF } from '@/lib/pdfGenerator';
import { formatDate } from '@/lib/dateUtils';

export default function InvoiceDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [user, setUser] = useState(getCurrentUser());
  const [emailOpen, setEmailOpen] = useState(false);
  const invoiceId = params.id as string;

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

  const invoice = getInvoiceById(invoiceId);
  if (!invoice) {
    return (
      <DashboardLayout user={user} onLogout={handleLogout}>
        <div className="text-center py-12">
          <p className="text-gray-500">Invoice not found</p>
          <Link href="/invoices" className="text-primary-600 hover:underline mt-4 inline-block">
            Back to Invoices
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const activities = getActivitiesByEntity(EntityType.INVOICE, invoiceId);
  const emailLogs = getEmailLogsByEntity(EntityType.INVOICE, invoiceId);
  const canEdit = user.role !== 'VIEWER';

  const getStatusColor = (status: InvoiceStatus) => {
    switch (status) {
      case InvoiceStatus.DRAFT:
        return 'bg-gray-100 text-gray-800';
      case InvoiceStatus.SENT:
        return 'bg-blue-100 text-blue-800';
      case InvoiceStatus.PAID:
        return 'bg-green-100 text-green-800';
      case InvoiceStatus.OVERDUE:
        return 'bg-red-100 text-red-800';
      case InvoiceStatus.CANCELLED:
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout user={user} onLogout={handleLogout}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/invoices" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{invoice.invoiceNumber}</h1>
              <p className="mt-1 text-sm text-gray-500">Invoice Details</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span
              className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(
                invoice.status
              )}`}
            >
              {invoice.status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Invoice Info */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Invoice Information</h2>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Client</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    <Link href={`/clients/${invoice.clientId}`} className="text-primary-600 hover:underline">
                      {invoice.client?.name}
                    </Link>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Order</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {invoice.order ? (
                      <Link href={`/orders/${invoice.order.id}`} className="text-primary-600 hover:underline">
                        {invoice.order.orderNumber}
                      </Link>
                    ) : (
                      '-'
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Issue Date</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {formatDate(invoice.issueDate)}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Due Date</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {formatDate(invoice.dueDate)}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Payment Terms</dt>
                  <dd className="mt-1 text-sm text-gray-900">{invoice.paymentTerms || '-'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Currency</dt>
                  <dd className="mt-1 text-sm text-gray-900">{invoice.currency}</dd>
                </div>
                {invoice.notes && (
                  <div className="md:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">Notes</dt>
                    <dd className="mt-1 text-sm text-gray-900">{invoice.notes}</dd>
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
                    {invoice.items.map((item) => (
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
                  <span className="text-sm font-medium text-gray-900">£{invoice.subtotal.toLocaleString()}</span>
                </div>
                {invoice.discountValue && invoice.discountType && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      Discount ({invoice.discountType === 'PERCENTAGE' ? `${invoice.discountValue}%` : `£${invoice.discountValue}`})
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      -£{(
                        invoice.discountType === 'PERCENTAGE'
                          ? (invoice.subtotal * invoice.discountValue) / 100
                          : invoice.discountValue
                      ).toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">VAT ({invoice.vatRate}%)</span>
                  <span className="text-sm font-medium text-gray-900">£{invoice.vatAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200">
                  <span className="text-base font-semibold text-gray-900">Total</span>
                  <span className="text-base font-bold text-gray-900">£{invoice.total.toLocaleString()}</span>
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
                  onClick={() => invoice && generateInvoicePDF(invoice)}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <Download size={18} />
                  <span>Download PDF</span>
                </button>
                {canEdit && invoice.status === InvoiceStatus.SENT && (
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Mark this invoice as paid?')) {
                        updateInvoiceStatus(invoice.id, InvoiceStatus.PAID, user.id);
                        alert('Invoice marked as paid!');
                        window.location.reload();
                      }
                    }}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <CheckCircle size={18} />
                    <span>Mark as Paid</span>
                  </button>
                )}
                {canEdit && invoice.status !== InvoiceStatus.CANCELLED && invoice.status !== InvoiceStatus.PAID && (
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Are you sure you want to cancel this invoice?')) {
                        updateInvoiceStatus(invoice.id, InvoiceStatus.CANCELLED, user.id);
                        alert('Invoice cancelled!');
                        window.location.reload();
                      }
                    }}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <XCircle size={18} />
                    <span>Cancel Invoice</span>
                  </button>
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
          defaultTo={invoice.client?.email || ''}
          defaultSubject={`Invoice ${invoice.invoiceNumber} from Your Company`}
          entityType={EntityType.INVOICE}
          entityId={invoice.id}
        />
      </div>
    </DashboardLayout>
  );
}

