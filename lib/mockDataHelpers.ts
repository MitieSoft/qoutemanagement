// Helper functions to reconstruct references when loading from localStorage
import { Client, Product, User, Quote, Order, Invoice } from './types';

export const reconstructQuoteReferences = (quotes: Quote[], clients: Client[], users: User[], products: Product[]): Quote[] => {
  return quotes.map(quote => ({
    ...quote,
    client: clients.find(c => c.id === quote.clientId),
    createdBy: quote.createdById ? users.find(u => u.id === quote.createdById) : undefined,
    items: quote.items.map(item => ({
      ...item,
      product: item.productId ? products.find(p => p.id === item.productId) : undefined,
    })),
  }));
};

export const reconstructOrderReferences = (orders: Order[], quotes: Quote[], clients: Client[], products: Product[]): Order[] => {
  return orders.map(order => ({
    ...order,
    quote: order.quoteId ? quotes.find(q => q.id === order.quoteId) : undefined,
    client: clients.find(c => c.id === order.clientId),
    items: order.items.map(item => ({
      ...item,
      product: item.productId ? products.find(p => p.id === item.productId) : undefined,
    })),
  }));
};

export const reconstructInvoiceReferences = (
  invoices: Invoice[],
  orders: Order[],
  quotes: Quote[],
  clients: Client[],
  products: Product[]
): Invoice[] => {
  return invoices.map(invoice => ({
    ...invoice,
    order: invoice.orderId ? orders.find(o => o.id === invoice.orderId) : undefined,
    quote: invoice.quoteId ? quotes.find(q => q.id === invoice.quoteId) : undefined,
    client: clients.find(c => c.id === invoice.clientId),
    items: invoice.items.map(item => ({
      ...item,
      product: item.productId ? products.find(p => p.id === item.productId) : undefined,
    })),
  }));
};

export const reconstructActivityReferences = (activities: any[], users: User[]): any[] => {
  return activities.map(activity => ({
    ...activity,
    user: activity.userId ? users.find(u => u.id === activity.userId) : undefined,
  }));
};

