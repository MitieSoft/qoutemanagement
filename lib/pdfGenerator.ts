import jsPDF from 'jspdf';
import { Quote, Order, Invoice } from './types';

// Helper function to format currency
const formatCurrency = (amount: number): string => {
  return `£${amount.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

// Helper function to format date
const formatDate = (dateString?: string): string => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Generate Quote PDF
export const generateQuotePDF = (quote: Quote): void => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let yPos = margin;

  // Header
  doc.setFontSize(20);
  doc.setTextColor(14, 165, 233); // primary-600
  doc.text('QUOTE', margin, yPos);
  
  yPos += 10;
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text(`Quote Number: ${quote.quoteNumber}`, margin, yPos);
  
  yPos += 5;
  doc.text(`Date: ${formatDate(quote.createdAt)}`, margin, yPos);
  
  if (quote.validUntil) {
    yPos += 5;
    doc.text(`Valid Until: ${formatDate(quote.validUntil)}`, margin, yPos);
  }

  // Client Information (right side)
  if (quote.client) {
    yPos = margin + 10;
    doc.setFontSize(12);
    doc.text('Bill To:', pageWidth - margin - 60, yPos);
    yPos += 7;
    doc.setFontSize(10);
    doc.text(quote.client.name, pageWidth - margin - 60, yPos);
    if (quote.client.contactName) {
      yPos += 5;
      doc.text(quote.client.contactName, pageWidth - margin - 60, yPos);
    }
    if (quote.client.email) {
      yPos += 5;
      doc.text(quote.client.email, pageWidth - margin - 60, yPos);
    }
    if (quote.client.billingAddress) {
      const addressLines = quote.client.billingAddress.split('\n');
      addressLines.forEach((line) => {
        yPos += 5;
        doc.text(line, pageWidth - margin - 60, yPos);
      });
    }
  }

  // Items Table
  yPos = margin + 50;
  doc.setFontSize(12);
  doc.text('Items', margin, yPos);
  yPos += 10;

  // Table Header
  doc.setFillColor(243, 244, 246); // gray-50
  doc.rect(margin, yPos - 5, pageWidth - 2 * margin, 8, 'F');
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Description', margin + 2, yPos);
  doc.text('Qty', margin + 100, yPos);
  doc.text('Price', margin + 120, yPos);
  doc.text('VAT', margin + 150, yPos);
  doc.text('Total', pageWidth - margin - 30, yPos, { align: 'right' });
  yPos += 8;

  doc.setFont('helvetica', 'normal');
  quote.items.forEach((item) => {
    if (yPos > 250) {
      doc.addPage();
      yPos = margin;
    }
    doc.text(item.description.substring(0, 40), margin + 2, yPos);
    doc.text(item.quantity.toString(), margin + 100, yPos);
    doc.text(formatCurrency(item.unitPrice), margin + 120, yPos);
    doc.text(`${item.vatRate}%`, margin + 150, yPos);
    doc.text(formatCurrency(item.lineTotal), pageWidth - margin - 2, yPos, { align: 'right' });
    yPos += 7;
  });

  // Totals
  yPos += 5;
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 8;

  doc.text('Subtotal:', pageWidth - margin - 50, yPos);
  doc.text(formatCurrency(quote.subtotal), pageWidth - margin - 2, yPos, { align: 'right' });
  yPos += 7;

  if (quote.discountValue && quote.discountType) {
    const discountLabel =
      quote.discountType === 'PERCENTAGE'
        ? `Discount (${quote.discountValue}%)`
        : `Discount (${formatCurrency(quote.discountValue)})`;
    doc.text(discountLabel, pageWidth - margin - 50, yPos);
    const discountAmount =
      quote.discountType === 'PERCENTAGE'
        ? (quote.subtotal * quote.discountValue) / 100
        : quote.discountValue;
    doc.text(`-${formatCurrency(discountAmount)}`, pageWidth - margin - 2, yPos, { align: 'right' });
    yPos += 7;
  }

  doc.text(`VAT (${quote.vatRate}%):`, pageWidth - margin - 50, yPos);
  doc.text(formatCurrency(quote.vatAmount), pageWidth - margin - 2, yPos, { align: 'right' });
  yPos += 7;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setDrawColor(200, 200, 200);
  doc.line(pageWidth - margin - 50, yPos - 2, pageWidth - margin, yPos - 2);
  doc.text('Total:', pageWidth - margin - 50, yPos);
  doc.text(formatCurrency(quote.total), pageWidth - margin - 2, yPos, { align: 'right' });

  // Notes
  if (quote.notes) {
    yPos += 15;
    if (yPos > 250) {
      doc.addPage();
      yPos = margin;
    }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('Notes:', margin, yPos);
    yPos += 7;
    doc.setFont('helvetica', 'normal');
    const notesLines = doc.splitTextToSize(quote.notes, pageWidth - 2 * margin);
    notesLines.forEach((line: string) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = margin;
      }
      doc.text(line, margin, yPos);
      yPos += 5;
    });
  }

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Page ${i} of ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
    doc.text(
      'Quote Management System',
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 5,
      { align: 'center' }
    );
  }

  // Download
  doc.save(`Quote-${quote.quoteNumber}.pdf`);
};

// Generate Order PDF
export const generateOrderPDF = (order: Order): void => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let yPos = margin;

  // Header
  doc.setFontSize(20);
  doc.setTextColor(14, 165, 233);
  doc.text('ORDER', margin, yPos);
  
  yPos += 10;
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text(`Order Number: ${order.orderNumber}`, margin, yPos);
  
  yPos += 5;
  doc.text(`Date: ${formatDate(order.createdAt)}`, margin, yPos);

  // Client Information
  if (order.client) {
    yPos = margin + 10;
    doc.setFontSize(12);
    doc.text('Bill To:', pageWidth - margin - 60, yPos);
    yPos += 7;
    doc.setFontSize(10);
    doc.text(order.client.name, pageWidth - margin - 60, yPos);
    if (order.client.contactName) {
      yPos += 5;
      doc.text(order.client.contactName, pageWidth - margin - 60, yPos);
    }
    if (order.client.email) {
      yPos += 5;
      doc.text(order.client.email, pageWidth - margin - 60, yPos);
    }
    if (order.client.billingAddress) {
      const addressLines = order.client.billingAddress.split('\n');
      addressLines.forEach((line) => {
        yPos += 5;
        doc.text(line, pageWidth - margin - 60, yPos);
      });
    }
  }

  // Items Table
  yPos = margin + 50;
  doc.setFontSize(12);
  doc.text('Items', margin, yPos);
  yPos += 10;

  doc.setFillColor(243, 244, 246);
  doc.rect(margin, yPos - 5, pageWidth - 2 * margin, 8, 'F');
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Description', margin + 2, yPos);
  doc.text('Qty', margin + 100, yPos);
  doc.text('Price', margin + 120, yPos);
  doc.text('VAT', margin + 150, yPos);
  doc.text('Total', pageWidth - margin - 30, yPos, { align: 'right' });
  yPos += 8;

  doc.setFont('helvetica', 'normal');
  order.items.forEach((item) => {
    if (yPos > 250) {
      doc.addPage();
      yPos = margin;
    }
    doc.text(item.description.substring(0, 40), margin + 2, yPos);
    doc.text(item.quantity.toString(), margin + 100, yPos);
    doc.text(formatCurrency(item.unitPrice), margin + 120, yPos);
    doc.text(`${item.vatRate}%`, margin + 150, yPos);
    doc.text(formatCurrency(item.lineTotal), pageWidth - margin - 2, yPos, { align: 'right' });
    yPos += 7;
  });

  // Totals
  yPos += 5;
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 8;

  doc.text('Subtotal:', pageWidth - margin - 50, yPos);
  doc.text(formatCurrency(order.subtotal), pageWidth - margin - 2, yPos, { align: 'right' });
  yPos += 7;

  if (order.discountValue && order.discountType) {
    const discountLabel =
      order.discountType === 'PERCENTAGE'
        ? `Discount (${order.discountValue}%)`
        : `Discount (${formatCurrency(order.discountValue)})`;
    doc.text(discountLabel, pageWidth - margin - 50, yPos);
    const discountAmount =
      order.discountType === 'PERCENTAGE'
        ? (order.subtotal * order.discountValue) / 100
        : order.discountValue;
    doc.text(`-${formatCurrency(discountAmount)}`, pageWidth - margin - 2, yPos, { align: 'right' });
    yPos += 7;
  }

  doc.text(`VAT (${order.vatRate}%):`, pageWidth - margin - 50, yPos);
  doc.text(formatCurrency(order.vatAmount), pageWidth - margin - 2, yPos, { align: 'right' });
  yPos += 7;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setDrawColor(200, 200, 200);
  doc.line(pageWidth - margin - 50, yPos - 2, pageWidth - margin, yPos - 2);
  doc.text('Total:', pageWidth - margin - 50, yPos);
  doc.text(formatCurrency(order.total), pageWidth - margin - 2, yPos, { align: 'right' });

  // Notes
  if (order.notes) {
    yPos += 15;
    if (yPos > 250) {
      doc.addPage();
      yPos = margin;
    }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('Notes:', margin, yPos);
    yPos += 7;
    doc.setFont('helvetica', 'normal');
    const notesLines = doc.splitTextToSize(order.notes, pageWidth - 2 * margin);
    notesLines.forEach((line: string) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = margin;
      }
      doc.text(line, margin, yPos);
      yPos += 5;
    });
  }

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Page ${i} of ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
    doc.text(
      'Quote Management System',
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 5,
      { align: 'center' }
    );
  }

  doc.save(`Order-${order.orderNumber}.pdf`);
};

// Generate Invoice PDF
export const generateInvoicePDF = (invoice: Invoice): void => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let yPos = margin;

  // Header
  doc.setFontSize(20);
  doc.setTextColor(14, 165, 233);
  doc.text('INVOICE', margin, yPos);
  
  yPos += 10;
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text(`Invoice Number: ${invoice.invoiceNumber}`, margin, yPos);
  
  yPos += 5;
  doc.text(`Issue Date: ${formatDate(invoice.issueDate)}`, margin, yPos);
  
  yPos += 5;
  doc.text(`Due Date: ${formatDate(invoice.dueDate)}`, margin, yPos);

  // Status badge
  yPos += 8;
  let statusColor: [number, number, number];
  if (invoice.status === 'PAID') {
    statusColor = [16, 185, 129];
  } else if (invoice.status === 'OVERDUE') {
    statusColor = [239, 68, 68];
  } else if (invoice.status === 'SENT') {
    statusColor = [59, 130, 246];
  } else {
    statusColor = [156, 163, 175];
  }
  doc.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
  doc.setDrawColor(0, 0, 0);
  doc.roundedRect(margin, yPos - 5, 30, 8, 2, 2, 'FD');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.text(invoice.status, margin + 15, yPos, { align: 'center' });
  doc.setTextColor(0, 0, 0);

  // Client Information
  if (invoice.client) {
    yPos = margin + 10;
    doc.setFontSize(12);
    doc.text('Bill To:', pageWidth - margin - 60, yPos);
    yPos += 7;
    doc.setFontSize(10);
    doc.text(invoice.client.name, pageWidth - margin - 60, yPos);
    if (invoice.client.contactName) {
      yPos += 5;
      doc.text(invoice.client.contactName, pageWidth - margin - 60, yPos);
    }
    if (invoice.client.email) {
      yPos += 5;
      doc.text(invoice.client.email, pageWidth - margin - 60, yPos);
    }
    if (invoice.client.billingAddress) {
      const addressLines = invoice.client.billingAddress.split('\n');
      addressLines.forEach((line) => {
        yPos += 5;
        doc.text(line, pageWidth - margin - 60, yPos);
      });
    }
  }

  // Payment Terms
  if (invoice.paymentTerms) {
    yPos += 10;
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(`Payment Terms: ${invoice.paymentTerms}`, pageWidth - margin - 60, yPos);
    doc.setTextColor(0, 0, 0);
  }

  // Items Table
  yPos = margin + 60;
  doc.setFontSize(12);
  doc.text('Items', margin, yPos);
  yPos += 10;

  doc.setFillColor(243, 244, 246);
  doc.rect(margin, yPos - 5, pageWidth - 2 * margin, 8, 'F');
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Description', margin + 2, yPos);
  doc.text('Qty', margin + 100, yPos);
  doc.text('Price', margin + 120, yPos);
  doc.text('VAT', margin + 150, yPos);
  doc.text('Total', pageWidth - margin - 30, yPos, { align: 'right' });
  yPos += 8;

  doc.setFont('helvetica', 'normal');
  invoice.items.forEach((item) => {
    if (yPos > 250) {
      doc.addPage();
      yPos = margin;
    }
    doc.text(item.description.substring(0, 40), margin + 2, yPos);
    doc.text(item.quantity.toString(), margin + 100, yPos);
    doc.text(formatCurrency(item.unitPrice), margin + 120, yPos);
    doc.text(`${item.vatRate}%`, margin + 150, yPos);
    doc.text(formatCurrency(item.lineTotal), pageWidth - margin - 2, yPos, { align: 'right' });
    yPos += 7;
  });

  // Totals
  yPos += 5;
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 8;

  doc.text('Subtotal:', pageWidth - margin - 50, yPos);
  doc.text(formatCurrency(invoice.subtotal), pageWidth - margin - 2, yPos, { align: 'right' });
  yPos += 7;

  if (invoice.discountValue && invoice.discountType) {
    const discountLabel =
      invoice.discountType === 'PERCENTAGE'
        ? `Discount (${invoice.discountValue}%)`
        : `Discount (${formatCurrency(invoice.discountValue)})`;
    doc.text(discountLabel, pageWidth - margin - 50, yPos);
    const discountAmount =
      invoice.discountType === 'PERCENTAGE'
        ? (invoice.subtotal * invoice.discountValue) / 100
        : invoice.discountValue;
    doc.text(`-${formatCurrency(discountAmount)}`, pageWidth - margin - 2, yPos, { align: 'right' });
    yPos += 7;
  }

  doc.text(`VAT (${invoice.vatRate}%):`, pageWidth - margin - 50, yPos);
  doc.text(formatCurrency(invoice.vatAmount), pageWidth - margin - 2, yPos, { align: 'right' });
  yPos += 7;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setDrawColor(200, 200, 200);
  doc.line(pageWidth - margin - 50, yPos - 2, pageWidth - margin, yPos - 2);
  doc.text('Total:', pageWidth - margin - 50, yPos);
  doc.text(formatCurrency(invoice.total), pageWidth - margin - 2, yPos, { align: 'right' });

  // Notes
  if (invoice.notes) {
    yPos += 15;
    if (yPos > 250) {
      doc.addPage();
      yPos = margin;
    }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('Notes:', margin, yPos);
    yPos += 7;
    doc.setFont('helvetica', 'normal');
    const notesLines = doc.splitTextToSize(invoice.notes, pageWidth - 2 * margin);
    notesLines.forEach((line: string) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = margin;
      }
      doc.text(line, margin, yPos);
      yPos += 5;
    });
  }

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Page ${i} of ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
    doc.text(
      'Quote Management System',
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 5,
      { align: 'center' }
    );
  }

  doc.save(`Invoice-${invoice.invoiceNumber}.pdf`);
};

