// Type definitions matching the database schema

export enum Role {
  ADMIN = 'ADMIN',
  SALES = 'SALES',
  FINANCE = 'FINANCE',
  VIEWER = 'VIEWER',
}

export enum QuoteStatus {
  DRAFT = 'DRAFT',
  SENT = 'SENT',
  APPROVED = 'APPROVED',
  CONVERTED = 'CONVERTED',
  INVOICED = 'INVOICED',
  REJECTED = 'REJECTED',
}

export enum InvoiceStatus {
  DRAFT = 'DRAFT',
  SENT = 'SENT',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  CANCELLED = 'CANCELLED',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  FULFILLED = 'FULFILLED',
  CANCELLED = 'CANCELLED',
}

export enum DiscountType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED = 'FIXED',
}

export enum EntityType {
  QUOTE = 'QUOTE',
  ORDER = 'ORDER',
  INVOICE = 'INVOICE',
  CLIENT = 'CLIENT',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  password?: string; // Optional for backward compatibility, but should be set for all users
  createdAt: string;
  updatedAt: string;
}

export interface Client {
  id: string;
  name: string;
  contactName?: string;
  email: string;
  phone?: string;
  billingAddress?: string;
  shippingAddress?: string;
  vatNumber?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  sku?: string;
  unitPrice: number;
  defaultVatRate: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface QuoteItem {
  id: string;
  quoteId: string;
  productId?: string;
  product?: Product;
  description: string;
  quantity: number;
  unitPrice: number;
  discountType?: DiscountType;
  discountValue?: number;
  vatRate: number;
  lineTotal: number;
}

export interface Quote {
  id: string;
  quoteNumber: string;
  clientId: string;
  client?: Client;
  status: QuoteStatus;
  currency: string;
  notes?: string;
  validUntil?: string;
  subtotal: number;
  discountType?: DiscountType;
  discountValue?: number;
  vatRate: number;
  vatAmount: number;
  total: number;
  createdById?: string;
  createdBy?: User;
  approvedByClientAt?: string;
  convertedToOrderId?: string;
  items: QuoteItem[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId?: string;
  product?: Product;
  description: string;
  quantity: number;
  unitPrice: number;
  discountType?: DiscountType;
  discountValue?: number;
  vatRate: number;
  lineTotal: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  quoteId?: string;
  quote?: Quote;
  clientId: string;
  client?: Client;
  status: OrderStatus;
  currency: string;
  notes?: string;
  subtotal: number;
  discountType?: DiscountType;
  discountValue?: number;
  vatRate: number;
  vatAmount: number;
  total: number;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

export interface InvoiceItem {
  id: string;
  invoiceId: string;
  productId?: string;
  product?: Product;
  description: string;
  quantity: number;
  unitPrice: number;
  discountType?: DiscountType;
  discountValue?: number;
  vatRate: number;
  lineTotal: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  orderId?: string;
  order?: Order;
  quoteId?: string;
  quote?: Quote;
  clientId: string;
  client?: Client;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  currency: string;
  paymentTerms?: string;
  notes?: string;
  subtotal: number;
  discountType?: DiscountType;
  discountValue?: number;
  vatRate: number;
  vatAmount: number;
  total: number;
  createdAt: string;
  updatedAt: string;
  items: InvoiceItem[];
}

export interface Activity {
  id: string;
  entityType: EntityType;
  entityId: string;
  action: string;
  userId?: string;
  user?: User;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface EmailLog {
  id: string;
  entityType: EntityType;
  entityId: string;
  to: string;
  cc?: string;
  subject: string;
  status: 'SENT' | 'FAILED';
  sentAt: string;
  providerMessageId?: string;
  errorMessage?: string;
}

export interface TaxSetting {
  id: string;
  name: string;
  rate: number;
  isDefault: boolean;
}

export interface DiscountSetting {
  id: string;
  name: string;
  type: DiscountType;
  value: number;
  isDefault: boolean;
}

export interface SmtpSetting {
  id: string;
  host: string;
  port: number;
  secure: boolean; // true for SSL/TLS, false for STARTTLS
  username: string;
  password: string;
  fromEmail: string;
  fromName: string;
  isActive: boolean;
}

