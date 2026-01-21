# Quote Management System - Frontend

A comprehensive Quote → Order → Invoice management system built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Client Management**: Full CRUD operations for client accounts
- **Product/Service Management**: Manage reusable products and services
- **Quote Lifecycle**: Create, edit, and track quotes through Draft → Sent → Approved → Converted → Invoiced
- **Order Management**: Convert approved quotes to orders
- **Invoice Management**: Generate invoices from orders with VAT (20%) and discounts
- **Role-Based Access**: Support for Admin, Sales, Finance, and Viewer roles
- **Dashboard**: Overview of quotes, invoices, and key metrics
- **Settings**: Configure VAT rates and discount presets (Admin only)
- **Activity Tracking**: View activity timeline for all entities
- **Email History**: Track sent emails for quotes, orders, and invoices

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Lucide React** (Icons)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Demo Users

The system includes mock authentication. You can log in with:

- **Admin**: `admin@example.com` / any password
- **Sales**: `sales@example.com` / any password
- **Finance**: `finance@example.com` / any password
- **Viewer**: `viewer@example.com` / any password

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── dashboard/          # Dashboard page
│   ├── clients/            # Client management pages
│   ├── products/           # Product management pages
│   ├── quotes/             # Quote management pages
│   ├── orders/             # Order management pages
│   ├── invoices/           # Invoice management pages
│   ├── settings/           # Settings pages
│   ├── login/              # Login page
│   └── layout.tsx          # Root layout
├── components/             # React components
│   └── layouts/            # Layout components (Sidebar, Header, DashboardLayout)
├── lib/                    # Utilities and data
│   ├── types.ts            # TypeScript type definitions
│   ├── mockData.ts         # Mock data matching database schema
│   └── auth.ts             # Mock authentication
└── public/                 # Static assets
```

## Mock Data

The application uses mock data that matches the database schema defined in `PROJECT_SCOPE.md`. All data is stored in memory and will reset on page refresh.

### Data Structure

- **Users**: 4 users with different roles
- **Clients**: 3 sample clients
- **Products**: 5 sample products/services
- **Quotes**: 3 sample quotes with various statuses
- **Orders**: 1 sample order
- **Invoices**: 2 sample invoices (one sent, one overdue)
- **Activities**: Sample activity logs
- **Email Logs**: Sample email history

## Features by Role

### Admin
- Full access to all features
- Can manage settings (VAT, discounts)
- Can create/edit/delete clients, products, quotes, orders, invoices

### Sales
- Can create and manage quotes
- Can view clients and products
- Can convert quotes to orders
- Limited access to financial data

### Finance
- Can manage invoices and payments
- Can view all financial documents
- Can mark invoices as paid
- Limited access to sales features

### Viewer
- Read-only access to all data
- Cannot create, edit, or delete anything

## Next Steps

This frontend is ready to be connected to a backend API. To integrate:

1. Replace mock data calls with API calls to your backend
2. Implement real authentication (replace `lib/auth.ts`)
3. Connect forms to API endpoints for create/update/delete operations
4. Implement PDF generation endpoints
5. Implement email sending functionality

## Development

### Build for Production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## Notes

- All monetary values are displayed in GBP (£) by default
- VAT is set to 20% by default (configurable in settings for Admin)
- Discounts can be percentage-based or fixed amounts
- The system supports the full quote lifecycle from draft to invoiced
- All pages are responsive and work on mobile devices

## License

This project is part of a quote management system.

