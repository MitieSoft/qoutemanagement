import {
  User,
  Client,
  Product,
  Quote,
  Order,
  Invoice,
  Activity,
  EmailLog,
  TaxSetting,
  DiscountSetting,
  SmtpSetting,
  Role,
  QuoteStatus,
  InvoiceStatus,
  OrderStatus,
  DiscountType,
  EntityType,
  QuoteItem,
  OrderItem,
  InvoiceItem,
} from './types';
import {
  saveClients,
  saveProducts,
  saveQuotes,
  saveOrders,
  saveInvoices,
  saveUsers,
  saveActivities,
  saveEmailLogs,
  saveTaxSettings,
  saveDiscountSettings,
  saveSmtpSettings,
  loadClients,
  loadProducts,
  loadQuotes,
  loadOrders,
  loadInvoices,
  loadUsers,
  loadActivities,
  loadEmailLogs,
  loadTaxSettings,
  loadDiscountSettings,
  loadSmtpSettings,
} from './storage';
import {
  reconstructQuoteReferences,
  reconstructOrderReferences,
  reconstructInvoiceReferences,
  reconstructActivityReferences,
} from './mockDataHelpers';

// Re-export types for convenience
export { EntityType };
export type { Client };

// Default data
const defaultUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: Role.ADMIN,
    password: 'admin123', // Default password - change in production
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Sales Manager',
    email: 'sales@example.com',
    role: Role.SALES,
    password: 'sales123', // Default password - change in production
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '3',
    name: 'Finance Manager',
    email: 'finance@example.com',
    role: Role.FINANCE,
    password: 'finance123', // Default password - change in production
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '4',
    name: 'Viewer User',
    email: 'viewer@example.com',
    role: Role.VIEWER,
    password: 'viewer123', // Default password - change in production
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

const defaultClients: Client[] = [
  {
    id: '1',
    name: 'Acme Corporation',
    contactName: 'John Doe',
    email: 'john@acme.com',
    phone: '+44 20 1234 5678',
    billingAddress: '123 Business St, London, UK',
    shippingAddress: '123 Business St, London, UK',
    vatNumber: 'GB123456789',
    isActive: true,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: '2',
    name: 'Tech Solutions Ltd',
    contactName: 'Jane Smith',
    email: 'jane@techsolutions.com',
    phone: '+44 20 9876 5432',
    billingAddress: '456 Innovation Ave, Manchester, UK',
    shippingAddress: '456 Innovation Ave, Manchester, UK',
    vatNumber: 'GB987654321',
    isActive: true,
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z',
  },
  {
    id: '3',
    name: 'Global Enterprises',
    contactName: 'Bob Johnson',
    email: 'bob@globalent.com',
    phone: '+44 20 5555 1234',
    billingAddress: '789 Corporate Blvd, Birmingham, UK',
    shippingAddress: '789 Corporate Blvd, Birmingham, UK',
    vatNumber: 'GB555555555',
    isActive: true,
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-02-01T00:00:00Z',
  },
];

const defaultProducts: Product[] = [
  {
    id: '1',
    name: 'Web Development Service',
    description: 'Custom web development and design',
    sku: 'WEB-DEV-001',
    unitPrice: 5000.00,
    defaultVatRate: 20.00,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Mobile App Development',
    description: 'iOS and Android app development',
    sku: 'MOB-APP-001',
    unitPrice: 8000.00,
    defaultVatRate: 20.00,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '3',
    name: 'Consulting Hours',
    description: 'Technical consulting per hour',
    sku: 'CONS-HR-001',
    unitPrice: 150.00,
    defaultVatRate: 20.00,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '4',
    name: 'Hosting Service (Monthly)',
    description: 'Cloud hosting and maintenance',
    sku: 'HOST-MON-001',
    unitPrice: 200.00,
    defaultVatRate: 20.00,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '5',
    name: 'SEO Optimization Package',
    description: 'Search engine optimization services',
    sku: 'SEO-PKG-001',
    unitPrice: 2500.00,
    defaultVatRate: 20.00,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

const defaultQuotes: Quote[] = [
  {
    id: '1',
    quoteNumber: 'QT-2024-001',
    clientId: '1',
    status: QuoteStatus.APPROVED,
    currency: 'GBP',
    notes: 'Initial project quote',
    validUntil: '2024-03-15T00:00:00Z',
    subtotal: 15000.00,
    discountType: DiscountType.PERCENTAGE,
    discountValue: 10,
    vatRate: 20.00,
    vatAmount: 2700.00,
    total: 16200.00,
    createdById: '2',
    approvedByClientAt: '2024-02-10T00:00:00Z',
    items: [
      {
        id: '1',
        quoteId: '1',
        productId: '1',
        description: 'Web Development Service',
        quantity: 2,
        unitPrice: 5000.00,
        vatRate: 20.00,
        lineTotal: 12000.00,
      },
      {
        id: '2',
        quoteId: '1',
        productId: '3',
        description: 'Consulting Hours',
        quantity: 20,
        unitPrice: 150.00,
        vatRate: 20.00,
        lineTotal: 3600.00,
      },
    ],
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-02-10T00:00:00Z',
  },
  {
    id: '2',
    quoteNumber: 'QT-2024-002',
    clientId: '2',
    status: QuoteStatus.SENT,
    currency: 'GBP',
    notes: 'Mobile app development project',
    validUntil: '2024-03-20T00:00:00Z',
    subtotal: 8000.00,
    vatRate: 20.00,
    vatAmount: 1600.00,
    total: 9600.00,
    createdById: '2',
    items: [
      {
        id: '3',
        quoteId: '2',
        productId: '2',
        description: 'Mobile App Development',
        quantity: 1,
        unitPrice: 8000.00,
        vatRate: 20.00,
        lineTotal: 9600.00,
      },
    ],
    createdAt: '2024-02-05T00:00:00Z',
    updatedAt: '2024-02-05T00:00:00Z',
  },
  {
    id: '3',
    quoteNumber: 'QT-2024-003',
    clientId: '3',
    status: QuoteStatus.DRAFT,
    currency: 'GBP',
    notes: 'SEO and hosting package',
    validUntil: '2024-04-01T00:00:00Z',
    subtotal: 2700.00,
    discountType: DiscountType.FIXED,
    discountValue: 200.00,
    vatRate: 20.00,
    vatAmount: 500.00,
    total: 3000.00,
    createdById: '2',
    items: [
      {
        id: '4',
        quoteId: '3',
        productId: '5',
        description: 'SEO Optimization Package',
        quantity: 1,
        unitPrice: 2500.00,
        vatRate: 20.00,
        lineTotal: 3000.00,
      },
      {
        id: '5',
        quoteId: '3',
        productId: '4',
        description: 'Hosting Service (Monthly)',
        quantity: 1,
        unitPrice: 200.00,
        vatRate: 20.00,
        lineTotal: 240.00,
      },
    ],
    createdAt: '2024-02-10T00:00:00Z',
    updatedAt: '2024-02-10T00:00:00Z',
  },
];

const defaultOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    quoteId: '1',
    clientId: '1',
    status: OrderStatus.CONFIRMED,
    currency: 'GBP',
    notes: 'Order confirmed from approved quote',
    subtotal: 13500.00,
    discountType: DiscountType.PERCENTAGE,
    discountValue: 10,
    vatRate: 20.00,
    vatAmount: 2700.00,
    total: 16200.00,
    items: [
      {
        id: '1',
        orderId: '1',
        productId: '1',
        description: 'Web Development Service',
        quantity: 2,
        unitPrice: 5000.00,
        vatRate: 20.00,
        lineTotal: 12000.00,
      },
      {
        id: '2',
        orderId: '1',
        productId: '3',
        description: 'Consulting Hours',
        quantity: 20,
        unitPrice: 150.00,
        vatRate: 20.00,
        lineTotal: 3600.00,
      },
    ],
    createdAt: '2024-02-11T00:00:00Z',
    updatedAt: '2024-02-11T00:00:00Z',
  },
];

const defaultInvoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV-2024-001',
    orderId: '1',
    quoteId: '1',
    clientId: '1',
    status: InvoiceStatus.SENT,
    issueDate: '2024-02-12T00:00:00Z',
    dueDate: '2024-03-13T00:00:00Z',
    currency: 'GBP',
    paymentTerms: 'Net 30',
    notes: 'Invoice for approved order',
    subtotal: 13500.00,
    discountType: DiscountType.PERCENTAGE,
    discountValue: 10,
    vatRate: 20.00,
    vatAmount: 2700.00,
    total: 16200.00,
    items: [
      {
        id: '1',
        invoiceId: '1',
        productId: '1',
        description: 'Web Development Service',
        quantity: 2,
        unitPrice: 5000.00,
        vatRate: 20.00,
        lineTotal: 12000.00,
      },
      {
        id: '2',
        invoiceId: '1',
        productId: '3',
        description: 'Consulting Hours',
        quantity: 20,
        unitPrice: 150.00,
        vatRate: 20.00,
        lineTotal: 3600.00,
      },
    ],
    createdAt: '2024-02-12T00:00:00Z',
    updatedAt: '2024-02-12T00:00:00Z',
  },
  {
    id: '2',
    invoiceNumber: 'INV-2024-002',
    clientId: '2',
    status: InvoiceStatus.OVERDUE,
    issueDate: '2024-01-15T00:00:00Z',
    dueDate: '2024-02-14T00:00:00Z',
    currency: 'GBP',
    paymentTerms: 'Net 30',
    notes: 'Overdue invoice',
    subtotal: 5000.00,
    vatRate: 20.00,
    vatAmount: 1000.00,
    total: 6000.00,
    items: [
      {
        id: '3',
        invoiceId: '2',
        description: 'Custom Development Work',
        quantity: 1,
        unitPrice: 5000.00,
        vatRate: 20.00,
        lineTotal: 6000.00,
      },
    ],
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
];

const defaultActivities: Activity[] = [
  {
    id: '1',
    entityType: EntityType.QUOTE,
    entityId: '1',
    action: 'CREATED',
    userId: '2',
    timestamp: '2024-02-01T00:00:00Z',
  },
  {
    id: '2',
    entityType: EntityType.QUOTE,
    entityId: '1',
    action: 'STATUS_CHANGED',
    userId: '2',
    timestamp: '2024-02-05T00:00:00Z',
    metadata: { from: 'DRAFT', to: 'SENT' },
  },
  {
    id: '3',
    entityType: EntityType.QUOTE,
    entityId: '1',
    action: 'APPROVED',
    timestamp: '2024-02-10T00:00:00Z',
  },
  {
    id: '4',
    entityType: EntityType.ORDER,
    entityId: '1',
    action: 'CREATED',
    userId: '2',
    timestamp: '2024-02-11T00:00:00Z',
  },
  {
    id: '5',
    entityType: EntityType.INVOICE,
    entityId: '1',
    action: 'CREATED',
    userId: '3',
    timestamp: '2024-02-12T00:00:00Z',
  },
];

const defaultEmailLogs: EmailLog[] = [
  {
    id: '1',
    entityType: EntityType.QUOTE,
    entityId: '1',
    to: 'john@acme.com',
    subject: 'Quote QT-2024-001 from Your Company',
    status: 'SENT',
    sentAt: '2024-02-05T10:00:00Z',
    providerMessageId: 'msg-123',
  },
  {
    id: '2',
    entityType: EntityType.QUOTE,
    entityId: '2',
    to: 'jane@techsolutions.com',
    subject: 'Quote QT-2024-002 from Your Company',
    status: 'SENT',
    sentAt: '2024-02-05T14:30:00Z',
    providerMessageId: 'msg-124',
  },
  {
    id: '3',
    entityType: EntityType.INVOICE,
    entityId: '1',
    to: 'john@acme.com',
    subject: 'Invoice INV-2024-001 from Your Company',
    status: 'SENT',
    sentAt: '2024-02-12T09:00:00Z',
    providerMessageId: 'msg-125',
  },
];

const defaultTaxSettings: TaxSetting[] = [
  {
    id: '1',
    name: 'Standard VAT',
    rate: 20.00,
    isDefault: true,
  },
];

const defaultDiscountSettings: DiscountSetting[] = [
  {
    id: '1',
    name: '5% Discount',
    type: DiscountType.PERCENTAGE,
    value: 5,
    isDefault: false,
  },
  {
    id: '2',
    name: '10% Discount',
    type: DiscountType.PERCENTAGE,
    value: 10,
    isDefault: false,
  },
  {
    id: '3',
    name: '£100 Off',
    type: DiscountType.FIXED,
    value: 100,
    isDefault: false,
  },
];

const defaultSmtpSettings: SmtpSetting[] = [
  {
    id: '1',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    username: '',
    password: '',
    fromEmail: 'noreply@yourcompany.com',
    fromName: 'Your Company',
    isActive: false,
  },
];

// Load data from localStorage or use defaults
export let mockUsers: User[] = loadUsers(defaultUsers);
export let mockClients: Client[] = loadClients(defaultClients);
export let mockProducts: Product[] = loadProducts(defaultProducts);
let loadedQuotes: Quote[] = loadQuotes(defaultQuotes);
let loadedOrders: Order[] = loadOrders(defaultOrders);
let loadedInvoices: Invoice[] = loadInvoices(defaultInvoices);
let loadedActivities: Activity[] = loadActivities(defaultActivities);
export let mockEmailLogs: EmailLog[] = loadEmailLogs(defaultEmailLogs);
export let mockTaxSettings: TaxSetting[] = loadTaxSettings(defaultTaxSettings);
export let mockDiscountSettings: DiscountSetting[] = loadDiscountSettings(defaultDiscountSettings);
export let mockSmtpSettings: SmtpSetting[] = loadSmtpSettings(defaultSmtpSettings);

// Reconstruct references for quotes, orders, invoices, and activities
export let mockQuotes: Quote[] = reconstructQuoteReferences(loadedQuotes, mockClients, mockUsers, mockProducts);
export let mockOrders: Order[] = reconstructOrderReferences(loadedOrders, mockQuotes, mockClients, mockProducts);
export let mockInvoices: Invoice[] = reconstructInvoiceReferences(loadedInvoices, mockOrders, mockQuotes, mockClients, mockProducts);
export let mockActivities: Activity[] = reconstructActivityReferences(loadedActivities, mockUsers);

// Helper function to save all data
const saveAllData = () => {
  saveUsers(mockUsers);
  saveClients(mockClients);
  saveProducts(mockProducts);
  saveQuotes(mockQuotes);
  saveOrders(mockOrders);
  saveInvoices(mockInvoices);
  saveActivities(mockActivities);
  saveEmailLogs(mockEmailLogs);
  saveTaxSettings(mockTaxSettings);
  saveDiscountSettings(mockDiscountSettings);
  saveSmtpSettings(mockSmtpSettings);
};

// Helper functions for activity logging and status updates
export const logActivity = (
  entityType: EntityType,
  entityId: string,
  action: string,
  userId?: string,
  metadata?: Record<string, any>
): Activity => {
  const activity: Activity = {
    id: Date.now().toString(),
    entityType,
    entityId,
    action,
    userId,
    user: userId ? mockUsers.find((u) => u.id === userId) : undefined,
    timestamp: new Date().toISOString(),
    metadata,
  };
  mockActivities.unshift(activity);
  saveActivities(mockActivities);
  return activity;
};

export const updateQuoteStatus = (
  quoteId: string,
  newStatus: QuoteStatus,
  userId?: string
): boolean => {
  const quote = mockQuotes.find((q) => q.id === quoteId);
  if (!quote) return false;
  
  const oldStatus = quote.status;
  quote.status = newStatus;
  quote.updatedAt = new Date().toISOString();
  
  if (newStatus === QuoteStatus.APPROVED) {
    quote.approvedByClientAt = new Date().toISOString();
  }
  
  logActivity(EntityType.QUOTE, quoteId, 'STATUS_CHANGED', userId, {
    from: oldStatus,
    to: newStatus,
  });
  
  saveQuotes(mockQuotes);
  return true;
};

export const createOrderFromQuote = (
  quoteId: string,
  userId: string
): Order | null => {
  const quote = mockQuotes.find((q) => q.id === quoteId);
  if (!quote) return null;
  
  const orderNumber = `ORD-${new Date().getFullYear()}-${String(mockOrders.length + 1).padStart(3, '0')}`;
  const orderId = Date.now().toString();
  const orderItems: OrderItem[] = quote.items.map((item, index) => ({
    id: Date.now().toString() + index,
    orderId,
    productId: item.productId,
    description: item.description,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    discountType: item.discountType,
    discountValue: item.discountValue,
    vatRate: item.vatRate,
    lineTotal: item.lineTotal,
  }));
  
  const order: Order = {
    id: orderId,
    orderNumber,
    quoteId: quote.id,
    clientId: quote.clientId,
    status: OrderStatus.CONFIRMED,
    currency: quote.currency,
    notes: `Order created from quote ${quote.quoteNumber}`,
    subtotal: quote.subtotal,
    discountType: quote.discountType,
    discountValue: quote.discountValue,
    vatRate: quote.vatRate,
    vatAmount: quote.vatAmount,
    total: quote.total,
    items: orderItems,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  mockOrders.push(order);
  quote.convertedToOrderId = order.id;
  updateQuoteStatus(quoteId, QuoteStatus.CONVERTED, userId);
  logActivity(EntityType.ORDER, order.id, 'CREATED', userId, {
    fromQuote: quoteId,
  });
  
  // Reconstruct references
  mockOrders = reconstructOrderReferences(mockOrders, mockQuotes, mockClients, mockProducts);
  saveOrders(mockOrders);
  
  return mockOrders.find(o => o.id === orderId) || null;
};

export const createInvoiceFromOrder = (
  orderId: string,
  userId: string,
  paymentTerms: string = 'Net 30'
): Invoice | null => {
  const order = mockOrders.find((o) => o.id === orderId);
  if (!order) return null;
  
  const invoiceNumber = `INV-${new Date().getFullYear()}-${String(mockInvoices.length + 1).padStart(3, '0')}`;
  const issueDate = new Date();
  const dueDate = new Date(issueDate);
  dueDate.setDate(dueDate.getDate() + 30);
  
  const invoiceId = Date.now().toString();
  const invoiceItems: InvoiceItem[] = order.items.map((item, index) => ({
    id: Date.now().toString() + index,
    invoiceId,
    productId: item.productId,
    description: item.description,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    discountType: item.discountType,
    discountValue: item.discountValue,
    vatRate: item.vatRate,
    lineTotal: item.lineTotal,
  }));
  
  const invoice: Invoice = {
    id: invoiceId,
    invoiceNumber,
    orderId: order.id,
    quoteId: order.quoteId,
    clientId: order.clientId,
    status: InvoiceStatus.DRAFT,
    issueDate: issueDate.toISOString(),
    dueDate: dueDate.toISOString(),
    currency: order.currency,
    paymentTerms,
    notes: `Invoice created from order ${order.orderNumber}`,
    subtotal: order.subtotal,
    discountType: order.discountType,
    discountValue: order.discountValue,
    vatRate: order.vatRate,
    vatAmount: order.vatAmount,
    total: order.total,
    items: invoiceItems,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  mockInvoices.push(invoice);
  
  if (order.quoteId) {
    updateQuoteStatus(order.quoteId, QuoteStatus.INVOICED, userId);
  }
  
  logActivity(EntityType.INVOICE, invoice.id, 'CREATED', userId, {
    fromOrder: orderId,
  });
  
  // Reconstruct references
  mockInvoices = reconstructInvoiceReferences(mockInvoices, mockOrders, mockQuotes, mockClients, mockProducts);
  saveInvoices(mockInvoices);
  
  return mockInvoices.find(i => i.id === invoiceId) || null;
};

export const updateInvoiceStatus = (
  invoiceId: string,
  newStatus: InvoiceStatus,
  userId?: string
): boolean => {
  const invoice = mockInvoices.find((i) => i.id === invoiceId);
  if (!invoice) return false;
  
  const oldStatus = invoice.status;
  invoice.status = newStatus;
  invoice.updatedAt = new Date().toISOString();
  
  if (newStatus === InvoiceStatus.SENT) {
    const dueDate = new Date(invoice.dueDate);
    const today = new Date();
    if (dueDate < today) {
      invoice.status = InvoiceStatus.OVERDUE;
    }
  }
  
  logActivity(EntityType.INVOICE, invoiceId, 'STATUS_CHANGED', userId, {
    from: oldStatus,
    to: invoice.status,
  });
  
  saveInvoices(mockInvoices);
  return true;
};

export const sendEmail = (
  entityType: EntityType,
  entityId: string,
  to: string,
  cc: string,
  subject: string,
  body: string
): EmailLog => {
  const emailLog: EmailLog = {
    id: Date.now().toString(),
    entityType,
    entityId,
    to,
    cc: cc || undefined,
    subject,
    status: 'SENT',
    sentAt: new Date().toISOString(),
    providerMessageId: `msg-${Date.now()}`,
  };
  
  mockEmailLogs.unshift(emailLog);
  saveEmailLogs(mockEmailLogs);
  
  if (entityType === EntityType.QUOTE) {
    const quote = mockQuotes.find((q) => q.id === entityId);
    if (quote && quote.status === QuoteStatus.DRAFT) {
      updateQuoteStatus(entityId, QuoteStatus.SENT);
    }
  } else if (entityType === EntityType.INVOICE) {
    const invoice = mockInvoices.find((i) => i.id === entityId);
    if (invoice && invoice.status === InvoiceStatus.DRAFT) {
      updateInvoiceStatus(entityId, InvoiceStatus.SENT);
    }
  }
  
  logActivity(entityType, entityId, 'EMAIL_SENT', undefined, {
    to,
    subject,
  });
  
  return emailLog;
};

// Helper functions to get data by ID
export const getClientById = (id: string): Client | undefined => {
  return mockClients.find((c) => c.id === id);
};

export const getProductById = (id: string): Product | undefined => {
  return mockProducts.find((p) => p.id === id);
};

export const getQuoteById = (id: string): Quote | undefined => {
  return mockQuotes.find((q) => q.id === id);
};

export const getOrderById = (id: string): Order | undefined => {
  return mockOrders.find((o) => o.id === id);
};

export const getInvoiceById = (id: string): Invoice | undefined => {
  return mockInvoices.find((i) => i.id === id);
};

export const getActivitiesByEntity = (
  entityType: EntityType,
  entityId: string
): Activity[] => {
  return mockActivities.filter(
    (a) => a.entityType === entityType && a.entityId === entityId
  );
};

export const getEmailLogsByEntity = (
  entityType: EntityType,
  entityId: string
): EmailLog[] => {
  return mockEmailLogs.filter(
    (e) => e.entityType === entityType && e.entityId === entityId
  );
};

// ============================================
// CRUD Operations - Create, Update, Delete
// ============================================

// Client CRUD
export const createClient = (clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Client => {
  const newClient: Client = {
    ...clientData,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockClients.push(newClient);
  logActivity(EntityType.CLIENT, newClient.id, 'CREATED');
  saveClients(mockClients);
  return newClient;
};

export const updateClient = (id: string, clientData: Partial<Client>): Client | null => {
  const clientIndex = mockClients.findIndex((c) => c.id === id);
  if (clientIndex === -1) return null;
  
  mockClients[clientIndex] = {
    ...mockClients[clientIndex],
    ...clientData,
    updatedAt: new Date().toISOString(),
  };
  logActivity(EntityType.CLIENT, id, 'UPDATED');
  saveClients(mockClients);
  
  // Update references in quotes, orders, invoices
  mockQuotes = reconstructQuoteReferences(mockQuotes, mockClients, mockUsers, mockProducts);
  mockOrders = reconstructOrderReferences(mockOrders, mockQuotes, mockClients, mockProducts);
  mockInvoices = reconstructInvoiceReferences(mockInvoices, mockOrders, mockQuotes, mockClients, mockProducts);
  
  return mockClients[clientIndex];
};

export const deleteClient = (id: string): boolean => {
  const clientIndex = mockClients.findIndex((c) => c.id === id);
  if (clientIndex === -1) return false;
  
  mockClients.splice(clientIndex, 1);
  logActivity(EntityType.CLIENT, id, 'DELETED');
  saveClients(mockClients);
  
  // Update references
  mockQuotes = reconstructQuoteReferences(mockQuotes, mockClients, mockUsers, mockProducts);
  mockOrders = reconstructOrderReferences(mockOrders, mockQuotes, mockClients, mockProducts);
  mockInvoices = reconstructInvoiceReferences(mockInvoices, mockOrders, mockQuotes, mockClients, mockProducts);
  
  return true;
};

// Product CRUD
export const createProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Product => {
  const newProduct: Product = {
    ...productData,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockProducts.push(newProduct);
  logActivity(EntityType.CLIENT, newProduct.id, 'CREATED');
  saveProducts(mockProducts);
  
  // Update references
  mockQuotes = reconstructQuoteReferences(mockQuotes, mockClients, mockUsers, mockProducts);
  mockOrders = reconstructOrderReferences(mockOrders, mockQuotes, mockClients, mockProducts);
  mockInvoices = reconstructInvoiceReferences(mockInvoices, mockOrders, mockQuotes, mockClients, mockProducts);
  
  return newProduct;
};

export const updateProduct = (id: string, productData: Partial<Product>): Product | null => {
  const productIndex = mockProducts.findIndex((p) => p.id === id);
  if (productIndex === -1) return null;
  
  mockProducts[productIndex] = {
    ...mockProducts[productIndex],
    ...productData,
    updatedAt: new Date().toISOString(),
  };
  logActivity(EntityType.CLIENT, id, 'UPDATED');
  saveProducts(mockProducts);
  
  // Update references
  mockQuotes = reconstructQuoteReferences(mockQuotes, mockClients, mockUsers, mockProducts);
  mockOrders = reconstructOrderReferences(mockOrders, mockQuotes, mockClients, mockProducts);
  mockInvoices = reconstructInvoiceReferences(mockInvoices, mockOrders, mockQuotes, mockClients, mockProducts);
  
  return mockProducts[productIndex];
};

export const deleteProduct = (id: string): boolean => {
  const productIndex = mockProducts.findIndex((p) => p.id === id);
  if (productIndex === -1) return false;
  
  mockProducts.splice(productIndex, 1);
  logActivity(EntityType.CLIENT, id, 'DELETED');
  saveProducts(mockProducts);
  
  // Update references
  mockQuotes = reconstructQuoteReferences(mockQuotes, mockClients, mockUsers, mockProducts);
  mockOrders = reconstructOrderReferences(mockOrders, mockQuotes, mockClients, mockProducts);
  mockInvoices = reconstructInvoiceReferences(mockInvoices, mockOrders, mockQuotes, mockClients, mockProducts);
  
  return true;
};

// Quote CRUD
export const createQuote = (
  quoteData: Omit<Quote, 'id' | 'quoteNumber' | 'createdAt' | 'updatedAt' | 'items'> & {
    items: Omit<QuoteItem, 'id' | 'quoteId'>[];
    createdById: string;
  }
): Quote => {
  const quoteNumber = `QT-${new Date().getFullYear()}-${String(mockQuotes.length + 1).padStart(3, '0')}`;
  const quoteId = Date.now().toString();
  const quoteItems: QuoteItem[] = quoteData.items.map((item, index) => ({
    ...item,
    id: Date.now().toString() + index,
    quoteId,
  }));
  
  const newQuote: Quote = {
    id: quoteId,
    quoteNumber,
    ...quoteData,
    items: quoteItems,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  mockQuotes.push(newQuote);
  logActivity(EntityType.QUOTE, newQuote.id, 'CREATED', quoteData.createdById);
  
  // Reconstruct references
  mockQuotes = reconstructQuoteReferences(mockQuotes, mockClients, mockUsers, mockProducts);
  saveQuotes(mockQuotes);
  
  return mockQuotes.find(q => q.id === quoteId)!;
};

export const updateQuote = (id: string, quoteData: Partial<Quote>): Quote | null => {
  const quoteIndex = mockQuotes.findIndex((q) => q.id === id);
  if (quoteIndex === -1) return null;
  
  mockQuotes[quoteIndex] = {
    ...mockQuotes[quoteIndex],
    ...quoteData,
    updatedAt: new Date().toISOString(),
  };
  logActivity(EntityType.QUOTE, id, 'UPDATED');
  
  // Reconstruct references
  mockQuotes = reconstructQuoteReferences(mockQuotes, mockClients, mockUsers, mockProducts);
  saveQuotes(mockQuotes);
  
  return mockQuotes[quoteIndex];
};

export const deleteQuote = (id: string): boolean => {
  const quoteIndex = mockQuotes.findIndex((q) => q.id === id);
  if (quoteIndex === -1) return false;
  
  mockQuotes.splice(quoteIndex, 1);
  logActivity(EntityType.QUOTE, id, 'DELETED');
  
  // Reconstruct references
  mockQuotes = reconstructQuoteReferences(mockQuotes, mockClients, mockUsers, mockProducts);
  mockOrders = reconstructOrderReferences(mockOrders, mockQuotes, mockClients, mockProducts);
  mockInvoices = reconstructInvoiceReferences(mockInvoices, mockOrders, mockQuotes, mockClients, mockProducts);
  
  saveQuotes(mockQuotes);
  saveOrders(mockOrders);
  saveInvoices(mockInvoices);
  
  return true;
};

// Order CRUD
export const updateOrder = (id: string, orderData: Partial<Order>): Order | null => {
  const orderIndex = mockOrders.findIndex((o) => o.id === id);
  if (orderIndex === -1) return null;
  
  mockOrders[orderIndex] = {
    ...mockOrders[orderIndex],
    ...orderData,
    updatedAt: new Date().toISOString(),
  };
  logActivity(EntityType.ORDER, id, 'UPDATED');
  
  // Reconstruct references
  mockOrders = reconstructOrderReferences(mockOrders, mockQuotes, mockClients, mockProducts);
  mockInvoices = reconstructInvoiceReferences(mockInvoices, mockOrders, mockQuotes, mockClients, mockProducts);
  
  saveOrders(mockOrders);
  saveInvoices(mockInvoices);
  
  return mockOrders[orderIndex];
};

export const deleteOrder = (id: string): boolean => {
  const orderIndex = mockOrders.findIndex((o) => o.id === id);
  if (orderIndex === -1) return false;
  
  mockOrders.splice(orderIndex, 1);
  logActivity(EntityType.ORDER, id, 'DELETED');
  
  // Reconstruct references
  mockOrders = reconstructOrderReferences(mockOrders, mockQuotes, mockClients, mockProducts);
  mockInvoices = reconstructInvoiceReferences(mockInvoices, mockOrders, mockQuotes, mockClients, mockProducts);
  
  saveOrders(mockOrders);
  saveInvoices(mockInvoices);
  
  return true;
};

// Invoice CRUD
export const updateInvoice = (id: string, invoiceData: Partial<Invoice>): Invoice | null => {
  const invoiceIndex = mockInvoices.findIndex((i) => i.id === id);
  if (invoiceIndex === -1) return null;
  
  mockInvoices[invoiceIndex] = {
    ...mockInvoices[invoiceIndex],
    ...invoiceData,
    updatedAt: new Date().toISOString(),
  };
  logActivity(EntityType.INVOICE, id, 'UPDATED');
  
  // Reconstruct references
  mockInvoices = reconstructInvoiceReferences(mockInvoices, mockOrders, mockQuotes, mockClients, mockProducts);
  saveInvoices(mockInvoices);
  
  return mockInvoices[invoiceIndex];
};

export const deleteInvoice = (id: string): boolean => {
  const invoiceIndex = mockInvoices.findIndex((i) => i.id === id);
  if (invoiceIndex === -1) return false;
  
  mockInvoices.splice(invoiceIndex, 1);
  logActivity(EntityType.INVOICE, id, 'DELETED');
  
  // Reconstruct references
  mockInvoices = reconstructInvoiceReferences(mockInvoices, mockOrders, mockQuotes, mockClients, mockProducts);
  saveInvoices(mockInvoices);
  
  return true;
};

// User CRUD
export const createUser = (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): User => {
  const newUser: User = {
    ...userData,
    id: Date.now().toString(),
    // Ensure password is set (default to 'password123' if not provided)
    password: userData.password || 'password123',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockUsers.push(newUser);
  saveUsers(mockUsers);
  
  // Update references
  mockActivities = reconstructActivityReferences(mockActivities, mockUsers);
  mockQuotes = reconstructQuoteReferences(mockQuotes, mockClients, mockUsers, mockProducts);
  
  return newUser;
};

export const updateUser = (id: string, userData: Partial<User>): User | null => {
  const userIndex = mockUsers.findIndex((u) => u.id === id);
  if (userIndex === -1) return null;
  
  mockUsers[userIndex] = {
    ...mockUsers[userIndex],
    ...userData,
    updatedAt: new Date().toISOString(),
  };
  saveUsers(mockUsers);
  
  // Update references
  mockActivities = reconstructActivityReferences(mockActivities, mockUsers);
  mockQuotes = reconstructQuoteReferences(mockQuotes, mockClients, mockUsers, mockProducts);
  
  return mockUsers[userIndex];
};

export const deleteUser = (id: string): boolean => {
  const userIndex = mockUsers.findIndex((u) => u.id === id);
  if (userIndex === -1) return false;
  
  mockUsers.splice(userIndex, 1);
  saveUsers(mockUsers);
  
  // Update references
  mockActivities = reconstructActivityReferences(mockActivities, mockUsers);
  mockQuotes = reconstructQuoteReferences(mockQuotes, mockClients, mockUsers, mockProducts);
  
  return true;
};
