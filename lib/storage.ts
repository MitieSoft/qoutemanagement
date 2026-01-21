// LocalStorage utilities for persisting mock data across page refreshes

const STORAGE_KEYS = {
  CLIENTS: 'quote_management_clients',
  PRODUCTS: 'quote_management_products',
  QUOTES: 'quote_management_quotes',
  ORDERS: 'quote_management_orders',
  INVOICES: 'quote_management_invoices',
  USERS: 'quote_management_users',
  ACTIVITIES: 'quote_management_activities',
  EMAIL_LOGS: 'quote_management_email_logs',
  TAX_SETTINGS: 'quote_management_tax_settings',
  DISCOUNT_SETTINGS: 'quote_management_discount_settings',
  SMTP_SETTINGS: 'quote_management_smtp_settings',
} as const;

// Helper functions to save and load from localStorage
export const saveToStorage = <T>(key: string, data: T): void => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving to localStorage (${key}):`, error);
    }
  }
};

export const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  if (typeof window !== 'undefined') {
    try {
      const item = localStorage.getItem(key);
      if (item) {
        return JSON.parse(item) as T;
      }
    } catch (error) {
      console.error(`Error loading from localStorage (${key}):`, error);
    }
  }
  return defaultValue;
};

// Specific save functions for each data type
export const saveClients = (clients: any[]) => saveToStorage(STORAGE_KEYS.CLIENTS, clients);
export const saveProducts = (products: any[]) => saveToStorage(STORAGE_KEYS.PRODUCTS, products);
export const saveQuotes = (quotes: any[]) => saveToStorage(STORAGE_KEYS.QUOTES, quotes);
export const saveOrders = (orders: any[]) => saveToStorage(STORAGE_KEYS.ORDERS, orders);
export const saveInvoices = (invoices: any[]) => saveToStorage(STORAGE_KEYS.INVOICES, invoices);
export const saveUsers = (users: any[]) => saveToStorage(STORAGE_KEYS.USERS, users);
export const saveActivities = (activities: any[]) => saveToStorage(STORAGE_KEYS.ACTIVITIES, activities);
export const saveEmailLogs = (emailLogs: any[]) => saveToStorage(STORAGE_KEYS.EMAIL_LOGS, emailLogs);
export const saveTaxSettings = (taxSettings: any[]) => saveToStorage(STORAGE_KEYS.TAX_SETTINGS, taxSettings);
export const saveDiscountSettings = (discountSettings: any[]) => saveToStorage(STORAGE_KEYS.DISCOUNT_SETTINGS, discountSettings);
export const saveSmtpSettings = (smtpSettings: any[]) => saveToStorage(STORAGE_KEYS.SMTP_SETTINGS, smtpSettings);

// Specific load functions for each data type
export const loadClients = (defaultValue: any[]) => loadFromStorage(STORAGE_KEYS.CLIENTS, defaultValue);
export const loadProducts = (defaultValue: any[]) => loadFromStorage(STORAGE_KEYS.PRODUCTS, defaultValue);
export const loadQuotes = (defaultValue: any[]) => loadFromStorage(STORAGE_KEYS.QUOTES, defaultValue);
export const loadOrders = (defaultValue: any[]) => loadFromStorage(STORAGE_KEYS.ORDERS, defaultValue);
export const loadInvoices = (defaultValue: any[]) => loadFromStorage(STORAGE_KEYS.INVOICES, defaultValue);
export const loadUsers = (defaultValue: any[]) => loadFromStorage(STORAGE_KEYS.USERS, defaultValue);
export const loadActivities = (defaultValue: any[]) => loadFromStorage(STORAGE_KEYS.ACTIVITIES, defaultValue);
export const loadEmailLogs = (defaultValue: any[]) => loadFromStorage(STORAGE_KEYS.EMAIL_LOGS, defaultValue);
export const loadTaxSettings = (defaultValue: any[]) => loadFromStorage(STORAGE_KEYS.TAX_SETTINGS, defaultValue);
export const loadDiscountSettings = (defaultValue: any[]) => loadFromStorage(STORAGE_KEYS.DISCOUNT_SETTINGS, defaultValue);
export const loadSmtpSettings = (defaultValue: any[]) => loadFromStorage(STORAGE_KEYS.SMTP_SETTINGS, defaultValue);

// Clear all stored data (useful for reset)
export const clearAllStorage = (): void => {
  if (typeof window !== 'undefined') {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  }
};

