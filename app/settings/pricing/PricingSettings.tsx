'use client';

import { useState } from 'react';
import { mockTaxSettings, mockDiscountSettings } from '@/lib/mockData';
import { DiscountType } from '@/lib/types';

export default function PricingSettings() {
  const [taxRate, setTaxRate] = useState(mockTaxSettings[0]?.rate.toString() || '20');
  const [discounts, setDiscounts] = useState(mockDiscountSettings);
  const [loading, setLoading] = useState(false);

  const handleTaxSave = async () => {
    setLoading(true);
    // In production, call API to save tax settings
    setTimeout(() => {
      setLoading(false);
      alert('Tax settings saved!');
    }, 500);
  };

  const handleDiscountSave = async () => {
    setLoading(true);
    // In production, call API to save discount settings
    setTimeout(() => {
      setLoading(false);
      alert('Discount settings saved!');
    }, 500);
  };

  return (
    <div className="space-y-6">
      {/* VAT Settings */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">VAT Settings</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="taxRate" className="block text-sm font-medium text-gray-700">
              Default VAT Rate (%)
            </label>
            <input
              type="number"
              id="taxRate"
              step="0.01"
              value={taxRate}
              onChange={(e) => setTaxRate(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <button
            onClick={handleTaxSave}
            disabled={loading}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save VAT Settings'}
          </button>
        </div>
      </div>

      {/* Discount Presets */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Discount Presets</h2>
          <button
            onClick={() => {
              const newDiscount = {
                id: Date.now().toString(),
                name: 'New Discount',
                type: DiscountType.PERCENTAGE,
                value: 0,
                isDefault: false,
              };
              setDiscounts([...discounts, newDiscount]);
            }}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Add Discount
          </button>
        </div>
        <div className="space-y-4">
          {discounts.map((discount) => (
            <div key={discount.id} className="border border-gray-200 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={discount.name}
                    onChange={(e) => {
                      setDiscounts(
                        discounts.map((d) =>
                          d.id === discount.id ? { ...d, name: e.target.value } : d
                        )
                      );
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={discount.type}
                    onChange={(e) => {
                      setDiscounts(
                        discounts.map((d) =>
                          d.id === discount.id
                            ? { ...d, type: e.target.value as DiscountType }
                            : d
                        )
                      );
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value={DiscountType.PERCENTAGE}>Percentage</option>
                    <option value={DiscountType.FIXED}>Fixed Amount</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                  <input
                    type="number"
                    step="0.01"
                    value={discount.value}
                    onChange={(e) => {
                      setDiscounts(
                        discounts.map((d) =>
                          d.id === discount.id ? { ...d, value: parseFloat(e.target.value) || 0 } : d
                        )
                      );
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to remove this discount preset?')) {
                        setDiscounts(discounts.filter((d) => d.id !== discount.id));
                      }
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
          {discounts.length === 0 && (
            <p className="text-center text-gray-500 py-8">No discount presets. Click "Add Discount" to create one.</p>
          )}
        </div>
        <div className="mt-4">
          <button
            onClick={handleDiscountSave}
            disabled={loading}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Discount Presets'}
          </button>
        </div>
      </div>
    </div>
  );
}

