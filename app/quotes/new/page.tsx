'use client';

import DashboardLayout from '@/components/layouts/DashboardLayout';
import { getCurrentUser, logout } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { mockClients, mockProducts, createQuote } from '@/lib/mockData';
import { DiscountType, QuoteStatus } from '@/lib/types';
import { ArrowLeft, Plus, X } from 'lucide-react';
import Link from 'next/link';

interface QuoteItem {
  id: string;
  productId?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  vatRate: number;
  lineTotal: number;
}

export default function NewQuotePage() {
  const router = useRouter();
  const [user, setUser] = useState(getCurrentUser());
  const [formData, setFormData] = useState({
    clientId: '',
    currency: 'GBP',
    notes: '',
    validUntil: '',
    discountType: '' as DiscountType | '',
    discountValue: '',
    vatRate: '20',
  });
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
    if (user?.role === 'VIEWER') {
      router.push('/quotes');
    }
  }, [user, router]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const addItem = () => {
    const newItem: QuoteItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      vatRate: parseFloat(formData.vatRate),
      lineTotal: 0,
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const updateItem = (id: string, field: keyof QuoteItem, value: any) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          if (field === 'productId' && value) {
            const product = mockProducts.find((p) => p.id === value);
            if (product) {
              updated.description = product.name;
              updated.unitPrice = product.unitPrice;
              updated.vatRate = product.defaultVatRate;
            }
          }
          updated.lineTotal = updated.quantity * updated.unitPrice * (1 + updated.vatRate / 100);
          return updated;
        }
        return item;
      })
    );
  };

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    let discountAmount = 0;
    if (formData.discountType && formData.discountValue) {
      if (formData.discountType === DiscountType.PERCENTAGE) {
        discountAmount = (subtotal * parseFloat(formData.discountValue)) / 100;
      } else {
        discountAmount = parseFloat(formData.discountValue);
      }
    }
    const subtotalAfterDiscount = subtotal - discountAmount;
    const vatAmount = (subtotalAfterDiscount * parseFloat(formData.vatRate)) / 100;
    const total = subtotalAfterDiscount + vatAmount;
    return { subtotal, discountAmount, vatAmount, total };
  };

  const totals = calculateTotals();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clientId || items.length === 0) {
      alert('Please select a client and add at least one item');
      return;
    }
    setLoading(true);
    
    try {
      // Calculate totals
      const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
      let discountAmount = 0;
      if (formData.discountType && formData.discountValue) {
        if (formData.discountType === DiscountType.PERCENTAGE) {
          discountAmount = (subtotal * parseFloat(formData.discountValue)) / 100;
        } else {
          discountAmount = parseFloat(formData.discountValue);
        }
      }
      const subtotalAfterDiscount = subtotal - discountAmount;
      const vatAmount = (subtotalAfterDiscount * parseFloat(formData.vatRate)) / 100;
      const total = subtotalAfterDiscount + vatAmount;
      
      const newQuote = createQuote({
        clientId: formData.clientId,
        status: QuoteStatus.DRAFT,
        currency: formData.currency,
        notes: formData.notes || undefined,
        validUntil: formData.validUntil || undefined,
        subtotal,
        discountType: formData.discountType || undefined,
        discountValue: formData.discountValue ? parseFloat(formData.discountValue) : undefined,
        vatRate: parseFloat(formData.vatRate),
        vatAmount,
        total,
        createdById: user.id,
        items: items.map((item) => ({
          productId: item.productId,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          vatRate: item.vatRate,
          lineTotal: item.lineTotal,
        })),
      });
      
      setTimeout(() => {
        setLoading(false);
        router.push(`/quotes/${newQuote.id}`);
      }, 500);
    } catch (error) {
      setLoading(false);
      alert('Failed to create quote');
    }
  };

  if (!user || user.role === 'VIEWER') return null;

  return (
    <DashboardLayout user={user} onLogout={handleLogout}>
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link href="/quotes" className="text-gray-600 hover:text-gray-900">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">New Quote</h1>
            <p className="mt-1 text-sm text-gray-500">Create a new quote</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Client Selection */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Client Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="clientId" className="block text-sm font-medium text-gray-700">
                      Client *
                    </label>
                    <select
                      id="clientId"
                      required
                      value={formData.clientId}
                      onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">Select a client</option>
                      {mockClients.filter((c) => c.isActive).map((client) => (
                        <option key={client.id} value={client.id}>
                          {client.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
                      Currency
                    </label>
                    <select
                      id="currency"
                      value={formData.currency}
                      onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="GBP">GBP (£)</option>
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="validUntil" className="block text-sm font-medium text-gray-700">
                      Valid Until
                    </label>
                    <input
                      type="date"
                      id="validUntil"
                      value={formData.validUntil}
                      onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="vatRate" className="block text-sm font-medium text-gray-700">
                      VAT Rate (%)
                    </label>
                    <input
                      type="number"
                      id="vatRate"
                      step="0.01"
                      value={formData.vatRate}
                      onChange={(e) => setFormData({ ...formData, vatRate: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                      Notes
                    </label>
                    <textarea
                      id="notes"
                      rows={3}
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Items</h2>
                  <button
                    type="button"
                    onClick={addItem}
                    className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                  >
                    <Plus size={18} />
                    <span>Add Item</span>
                  </button>
                </div>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
                          <select
                            value={item.productId || ''}
                            onChange={(e) => updateItem(item.id, 'productId', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                          >
                            <option value="">Custom Item</option>
                            {mockProducts.filter((p) => p.isActive).map((product) => (
                              <option key={product.id} value={product.id}>
                                {product.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="md:col-span-3">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                          <input
                            type="number"
                            step="0.01"
                            value={item.quantity}
                            onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Unit Price</label>
                          <input
                            type="number"
                            step="0.01"
                            value={item.unitPrice}
                            onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">VAT Rate (%)</label>
                          <input
                            type="number"
                            step="0.01"
                            value={item.vatRate}
                            onChange={(e) => updateItem(item.id, 'vatRate', parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Line Total</label>
                          <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm font-medium">
                            £{item.lineTotal.toLocaleString()}
                          </div>
                        </div>
                        <div className="flex items-end">
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {items.length === 0 && (
                    <p className="text-center text-gray-500 py-8">No items added yet. Click "Add Item" to start.</p>
                  )}
                </div>
              </div>

              {/* Discount */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Discount</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="discountType" className="block text-sm font-medium text-gray-700">
                      Discount Type
                    </label>
                    <select
                      id="discountType"
                      value={formData.discountType}
                      onChange={(e) => setFormData({ ...formData, discountType: e.target.value as DiscountType })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">No Discount</option>
                      <option value={DiscountType.PERCENTAGE}>Percentage</option>
                      <option value={DiscountType.FIXED}>Fixed Amount</option>
                    </select>
                  </div>
                  {formData.discountType && (
                    <div>
                      <label htmlFor="discountValue" className="block text-sm font-medium text-gray-700">
                        Discount Value
                      </label>
                      <input
                        type="number"
                        id="discountValue"
                        step="0.01"
                        value={formData.discountValue}
                        onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                        placeholder={formData.discountType === DiscountType.PERCENTAGE ? 'e.g., 10' : 'e.g., 100'}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Summary Sidebar */}
            <div className="bg-white rounded-lg shadow p-6 h-fit">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Summary</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Subtotal</span>
                  <span className="text-sm font-medium text-gray-900">£{totals.subtotal.toLocaleString()}</span>
                </div>
                {totals.discountAmount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Discount</span>
                    <span className="text-sm font-medium text-gray-900">-£{totals.discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">VAT ({formData.vatRate}%)</span>
                  <span className="text-sm font-medium text-gray-900">£{totals.vatAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200">
                  <span className="text-base font-semibold text-gray-900">Total</span>
                  <span className="text-base font-bold text-gray-900">£{totals.total.toLocaleString()}</span>
                </div>
              </div>
              <div className="mt-6 flex flex-col space-y-2">
                <button
                  type="submit"
                  disabled={loading || items.length === 0}
                  className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Quote'}
                </button>
                <Link
                  href="/quotes"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-center"
                >
                  Cancel
                </Link>
              </div>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

