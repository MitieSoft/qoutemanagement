'use client';

import { useParams, useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { mockQuotes } from '@/lib/mockData';
import { QuoteStatus } from '@/lib/types';
import { formatDate } from '@/lib/dateUtils';

export default function PublicQuotePage() {
  const params = useParams();
  const router = useRouter();
  const { token } = params as { token: string };
  const [approved, setApproved] = useState(false);

  // In this mock, we treat the token as the quote id or quoteNumber
  const quote = useMemo(
    () =>
      mockQuotes.find(
        (q) => q.id === token || q.quoteNumber.toLowerCase() === token.toLowerCase()
      ),
    [token]
  );

  if (!quote) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow p-6 text-center space-y-3">
          <h1 className="text-xl font-semibold text-gray-900">Quote not found</h1>
          <p className="text-sm text-gray-500">
            The quote link may be invalid or expired.
          </p>
        </div>
      </div>
    );
  }

  const isAlreadyApproved =
    quote.status === QuoteStatus.APPROVED ||
    quote.status === QuoteStatus.CONVERTED ||
    quote.status === QuoteStatus.INVOICED;

  const handleApprove = () => {
    if (isAlreadyApproved) return;
    setApproved(true);
    alert('Quote approval is mocked here. In production this would call an API.');
  };

  const statusLabel = isAlreadyApproved
    ? 'Approved'
    : quote.status === QuoteStatus.SENT
    ? 'Awaiting Approval'
    : quote.status;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="max-w-3xl w-full bg-white shadow-lg rounded-xl p-8 space-y-6">
        {/* Header / Branding */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quote {quote.quoteNumber}</h1>
            <p className="text-sm text-gray-500 mt-1">
              From Your Company • To {quote.client?.name}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">
              Issue Date:{' '}
              <span className="font-medium">
                {formatDate(quote.createdAt)}
              </span>
            </p>
            {quote.validUntil && (
              <p className="text-sm text-gray-500">
                Valid Until:{' '}
                <span className="font-medium">
                  {formatDate(quote.validUntil)}
                </span>
              </p>
            )}
            <span className="inline-flex mt-2 px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
              {statusLabel}
            </span>
          </div>
        </div>

        {/* Client details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-sm font-semibold text-gray-700 mb-1">Bill To</h2>
            <p className="text-sm text-gray-900">{quote.client?.name}</p>
            {quote.client?.contactName && (
              <p className="text-sm text-gray-700">{quote.client.contactName}</p>
            )}
            {quote.client?.billingAddress && (
              <p className="text-sm text-gray-500 mt-1">
                {quote.client.billingAddress}
              </p>
            )}
            {quote.client?.email && (
              <p className="text-sm text-gray-500 mt-1">{quote.client.email}</p>
            )}
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-700 mb-1">From</h2>
            <p className="text-sm text-gray-900">Your Company Ltd</p>
            <p className="text-sm text-gray-500">123 Business Street</p>
            <p className="text-sm text-gray-500">London, UK</p>
          </div>
        </div>

        {/* Items */}
        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-2">Items</h2>
          <div className="overflow-x-auto border rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Description
                  </th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                    Qty
                  </th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                    Unit Price
                  </th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {quote.items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-2 text-sm text-gray-900">
                      {item.description}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900 text-right">
                      {item.quantity}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900 text-right">
                      £{item.unitPrice.toLocaleString()}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900 text-right">
                      £{item.lineTotal.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary */}
        <div className="flex flex-col items-end space-y-1">
          <div className="flex justify-between w-full md:w-1/2">
            <span className="text-sm text-gray-600">Subtotal</span>
            <span className="text-sm font-medium text-gray-900">
              £{quote.subtotal.toLocaleString()}
            </span>
          </div>
          {quote.discountValue && quote.discountType && (
            <div className="flex justify-between w-full md:w-1/2">
              <span className="text-sm text-gray-600">
                Discount (
                {quote.discountType === 'PERCENTAGE'
                  ? `${quote.discountValue}%`
                  : `£${quote.discountValue}`}
                )
              </span>
              <span className="text-sm font-medium text-gray-900">
                -£
                {(
                  quote.discountType === 'PERCENTAGE'
                    ? (quote.subtotal * quote.discountValue) / 100
                    : quote.discountValue
                ).toLocaleString()}
              </span>
            </div>
          )}
          <div className="flex justify-between w-full md:w-1/2">
            <span className="text-sm text-gray-600">VAT ({quote.vatRate}%)</span>
            <span className="text-sm font-medium text-gray-900">
              £{quote.vatAmount.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between w-full md:w-1/2 border-t pt-2 mt-1">
            <span className="text-base font-semibold text-gray-900">Total</span>
            <span className="text-base font-bold text-gray-900">
              £{quote.total.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Approval section */}
        <div className="pt-4 border-t flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            {approved || isAlreadyApproved ? (
              <p className="text-sm text-green-700">
                This quote has been approved. Thank you for your confirmation.
              </p>
            ) : quote.status !== QuoteStatus.SENT ? (
              <p className="text-sm text-gray-500">
                This quote is not currently in a state that can be approved.
              </p>
            ) : (
              <p className="text-sm text-gray-500">
                By approving, you confirm that the details above are correct and you
                wish to proceed.
              </p>
            )}
          </div>
          <div className="flex items-center gap-3 justify-end">
            <button
              type="button"
              onClick={() => router.push('/')}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
            >
              Close
            </button>
            <button
              type="button"
              disabled={approved || isAlreadyApproved || quote.status !== QuoteStatus.SENT}
              onClick={handleApprove}
              className="px-4 py-2 bg-primary-600 text-white rounded-md text-sm hover:bg-primary-700 disabled:opacity-50"
            >
              {approved || isAlreadyApproved ? 'Already Approved' : 'Approve Quote'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


