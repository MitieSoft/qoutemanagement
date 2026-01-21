'use client';

import DashboardLayout from '@/components/layouts/DashboardLayout';
import { getCurrentUser, logout } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { mockQuotes, mockInvoices, Quote, Invoice } from '@/lib/mockData';
import { QuoteStatus, InvoiceStatus } from '@/lib/types';
import { FileText, Receipt, TrendingUp, AlertCircle } from 'lucide-react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(getCurrentUser());
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check authentication first
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    setUser(currentUser);
    setQuotes(mockQuotes);
    setInvoices(mockInvoices);
  }, [router]);

  useEffect(() => {
    if (mounted && !user) {
      router.push('/login');
    }
  }, [user, mounted, router]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Don't render anything until mounted and user is confirmed
  if (!mounted || !user) {
    return null;
  }

  // Calculate statistics
  const quotesByStatus = {
    DRAFT: quotes.filter((q) => q.status === QuoteStatus.DRAFT).length,
    SENT: quotes.filter((q) => q.status === QuoteStatus.SENT).length,
    APPROVED: quotes.filter((q) => q.status === QuoteStatus.APPROVED).length,
    CONVERTED: quotes.filter((q) => q.status === QuoteStatus.CONVERTED).length,
    INVOICED: quotes.filter((q) => q.status === QuoteStatus.INVOICED).length,
  };

  const invoicesByStatus = {
    DRAFT: invoices.filter((i) => i.status === InvoiceStatus.DRAFT).length,
    SENT: invoices.filter((i) => i.status === InvoiceStatus.SENT).length,
    PAID: invoices.filter((i) => i.status === InvoiceStatus.PAID).length,
    OVERDUE: invoices.filter((i) => i.status === InvoiceStatus.OVERDUE).length,
    CANCELLED: invoices.filter((i) => i.status === InvoiceStatus.CANCELLED).length,
  };

  const totalQuotesValue = quotes
    .filter((q) => q.status === QuoteStatus.SENT || q.status === QuoteStatus.APPROVED)
    .reduce((sum, q) => sum + q.total, 0);

  const unpaidInvoices = invoices.filter(
    (i) => i.status === InvoiceStatus.SENT || i.status === InvoiceStatus.OVERDUE
  );
  const unpaidTotal = unpaidInvoices.reduce((sum, i) => sum + i.total, 0);
  const overdueTotal = invoices
    .filter((i) => i.status === InvoiceStatus.OVERDUE)
    .reduce((sum, i) => sum + i.total, 0);

  // Prepare chart data
  const quotesChartData = [
    { name: 'Draft', value: quotesByStatus.DRAFT, color: '#9CA3AF' },
    { name: 'Sent', value: quotesByStatus.SENT, color: '#3B82F6' },
    { name: 'Approved', value: quotesByStatus.APPROVED, color: '#10B981' },
    { name: 'Converted', value: quotesByStatus.CONVERTED, color: '#8B5CF6' },
    { name: 'Invoiced', value: quotesByStatus.INVOICED, color: '#6366F1' },
  ];

  const invoicesChartData = [
    { name: 'Draft', value: invoicesByStatus.DRAFT, color: '#9CA3AF' },
    { name: 'Sent', value: invoicesByStatus.SENT, color: '#3B82F6' },
    { name: 'Paid', value: invoicesByStatus.PAID, color: '#10B981' },
    { name: 'Overdue', value: invoicesByStatus.OVERDUE, color: '#EF4444' },
    { name: 'Cancelled', value: invoicesByStatus.CANCELLED, color: '#6B7280' },
  ];

  // Revenue trend data (last 6 months mock data)
  const revenueData = [
    { month: 'Aug', quotes: 12000, invoices: 8000 },
    { month: 'Sep', quotes: 15000, invoices: 12000 },
    { month: 'Oct', quotes: 18000, invoices: 15000 },
    { month: 'Nov', quotes: 22000, invoices: 18000 },
    { month: 'Dec', quotes: 25000, invoices: 20000 },
    { month: 'Jan', quotes: totalQuotesValue, invoices: unpaidTotal },
  ];

  // Status distribution for bar chart
  const statusBarData = [
    { status: 'Draft', quotes: quotesByStatus.DRAFT, invoices: invoicesByStatus.DRAFT },
    { status: 'Sent', quotes: quotesByStatus.SENT, invoices: invoicesByStatus.SENT },
    { status: 'Approved/Paid', quotes: quotesByStatus.APPROVED, invoices: invoicesByStatus.PAID },
    { status: 'Overdue', quotes: 0, invoices: invoicesByStatus.OVERDUE },
  ];

  const COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#EF4444', '#6366F1', '#9CA3AF'];

  return (
    <DashboardLayout user={user} onLogout={handleLogout}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Overview of your quotes and invoices
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Quotes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {quotes.length}
                </p>
              </div>
              <FileText className="h-8 w-8 text-primary-600" />
            </div>
            <div className="mt-4 text-xs text-gray-500">
              Draft: {quotesByStatus.DRAFT} | Sent: {quotesByStatus.SENT} | Approved: {quotesByStatus.APPROVED}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Invoices</p>
                <p className="text-2xl font-bold text-gray-900">
                  {invoices.length}
                </p>
              </div>
              <Receipt className="h-8 w-8 text-green-600" />
            </div>
            <div className="mt-4 text-xs text-gray-500">
              Sent: {invoicesByStatus.SENT} | Paid: {invoicesByStatus.PAID} | Overdue: {invoicesByStatus.OVERDUE}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Quotes Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  £{totalQuotesValue.toLocaleString()}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
            <div className="mt-4 text-xs text-gray-500">
              Sent & Approved quotes
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Overdue Invoices</p>
                <p className="text-2xl font-bold text-red-600">
                  £{overdueTotal.toLocaleString()}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <div className="mt-4 text-xs text-gray-500">
              {invoices.filter((i) => i.status === InvoiceStatus.OVERDUE).length} invoices
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <a
              href="/quotes/new"
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              New Quote
            </a>
            <a
              href="/clients/new"
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              New Client
            </a>
            <a
              href="/products/new"
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              New Product
            </a>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quotes Status Pie Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quotes by Status</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={quotesChartData.filter((d) => d.value > 0)}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {quotesChartData.filter((d) => d.value > 0).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Invoices Status Pie Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Invoices by Status</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={invoicesChartData.filter((d) => d.value > 0)}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {invoicesChartData.filter((d) => d.value > 0).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Trend Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `£${value.toLocaleString()}`} />
              <Legend />
              <Line
                type="monotone"
                dataKey="quotes"
                stroke="#3B82F6"
                strokeWidth={2}
                name="Quotes Value"
              />
              <Line
                type="monotone"
                dataKey="invoices"
                stroke="#10B981"
                strokeWidth={2}
                name="Invoices Value"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Status Comparison Bar Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Status Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statusBarData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="quotes" fill="#3B82F6" name="Quotes" />
              <Bar dataKey="invoices" fill="#10B981" name="Invoices" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Quotes</h2>
            <div className="space-y-3">
              {quotes.slice(0, 5).map((quote) => (
                <div
                  key={quote.id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div>
                    <p className="font-medium text-gray-900">{quote.quoteNumber}</p>
                    <p className="text-sm text-gray-500">{quote.client?.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">£{quote.total.toLocaleString()}</p>
                    <span
                      className={`inline-block px-2 py-1 text-xs rounded ${
                        quote.status === QuoteStatus.APPROVED
                          ? 'bg-green-100 text-green-800'
                          : quote.status === QuoteStatus.SENT
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {quote.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Invoices</h2>
            <div className="space-y-3">
              {invoices.slice(0, 5).map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div>
                    <p className="font-medium text-gray-900">{invoice.invoiceNumber}</p>
                    <p className="text-sm text-gray-500">{invoice.client?.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">£{invoice.total.toLocaleString()}</p>
                    <span
                      className={`inline-block px-2 py-1 text-xs rounded ${
                        invoice.status === InvoiceStatus.PAID
                          ? 'bg-green-100 text-green-800'
                          : invoice.status === InvoiceStatus.OVERDUE
                          ? 'bg-red-100 text-red-800'
                          : invoice.status === InvoiceStatus.SENT
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {invoice.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

