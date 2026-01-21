## Quote Management System – Project Scope & Milestones

### Overview

This document defines the scope and phased milestones for building a **Quote → Order → Invoice** management system using:

- **Frontend**: Next.js (App Router) + Tailwind CSS  
- **Backend**: Node.js (API inside Next.js)  
- **Database**: PostgreSQL (via Prisma ORM recommended)

The system will support:

- Client & product management  
- Quote lifecycle (Draft → Sent → Approved → Converted → Invoiced)  
- Converting quotes into orders and invoices  
- VAT handling (default 20%) and discounts (fixed/percentage)  
- PDF export & email sending for quotes, orders, and invoices  
- Multiple user roles and permissions  
- Activity tracking & email history  
- Optional dashboard overview

---

## Milestone 1 – Project & Tech Setup

**Goal**: Working fullstack skeleton with DB connection, Tailwind, and basic API health check.

- **Tasks**
  - Initialize a Next.js TypeScript app (App Router).
  - Configure Tailwind CSS (including PostCSS and Autoprefixer).
  - Set up PostgreSQL connection (local or hosted).
  - Add Prisma (or another ORM) and create the initial `schema.prisma`.
  - Add base layout with a top navigation shell.
  - Create a simple health-check API route.

---

## Milestone 2 – Database Schema Design

**Goal**: Define all core entities and relations in the database.

- **Core entities**
  - **User & roles**
    - `User`: id, name, email, passwordHash, role, createdAt, updatedAt.
    - `Role` as enum: `ADMIN`, `SALES`, `FINANCE`, `VIEWER`.
  - **Client**
    - `Client`: id, name, contactName, email, phone, billingAddress, shippingAddress, vatNumber, isActive, createdAt, updatedAt.
  - **Product / Service**
    - `Product`: id, name, description, sku, unitPrice, defaultVatRate, isActive, createdAt, updatedAt.
  - **Settings (VAT & discounts)**
    - `TaxSetting`: id, name, rate, isDefault (default VAT 20%).
    - `DiscountSetting`: id, name, type (`PERCENTAGE`/`FIXED`), value, isDefault.
    - (Or a generic `Setting` table with key/value JSON).
  - **Quote / Order / Invoice**
    - `Quote`:
      - quoteNumber, clientId, status (enum), currency, notes, validUntil.
      - subtotal, discountType, discountValue, vatRate, vatAmount, total.
      - createdById, approvedByClientAt, convertedToOrderId.
    - `QuoteItem`:
      - quoteId, productId (optional), description, quantity, unitPrice, discountType, discountValue, vatRate, lineTotal.
    - `Order`:
      - orderNumber, quoteId, clientId, status, same monetary fields as Quote.
    - `OrderItem`:
      - orderId, productId (optional), description, quantity, unitPrice, discount data, vatRate, lineTotal.
    - `Invoice`:
      - invoiceNumber, orderId (optional), quoteId (optional), clientId.
      - status enum: `DRAFT`, `SENT`, `PAID`, `OVERDUE`, `CANCELLED`.
      - issueDate, dueDate, subtotal, discountType/value, vatRate, vatAmount, total, paymentTerms.
    - `InvoiceItem`:
      - invoiceId, productId (optional), description, quantity, unitPrice, discount data, vatRate, lineTotal.
  - **Activity & email**
    - `Activity`:
      - entityType (QUOTE, ORDER, INVOICE, CLIENT), entityId, action enum, userId, timestamp, metadata JSON.
    - `EmailLog`:
      - entityType, entityId, to, cc, subject, status, sentAt, providerMessageId, errorMessage (if any).
  - **Templates (branding)**
    - `Template`:
      - type (QUOTE, ORDER, INVOICE), name, isDefault, metadata JSON for branding options (logo, colors, footer text, etc.).

- **Example enum ideas**
  - `QuoteStatus`: `DRAFT`, `SENT`, `APPROVED`, `CONVERTED`, `INVOICED`, `REJECTED`.
  - `InvoiceStatus`: `DRAFT`, `SENT`, `PAID`, `OVERDUE`, `CANCELLED`.

---

## Milestone 3 – Authentication & Role-Based Access

**Goal**: Users can log in and access is restricted based on role.

- **Tasks**
  - Implement authentication (e.g., NextAuth with Credentials provider or custom JWT).
  - Store users with hashed passwords (bcrypt).
  - Define role capabilities:
    - **ADMIN**: full access, including settings, users, and templates.
    - **SALES**: manage clients and quotes; view their own orders/invoices.
    - **FINANCE**: manage invoices and payments; view all financial documents.
    - **VIEWER**: read-only access to assigned areas.
  - Add route protection via middleware for `/app` or `/dashboard` routes.
  - Add a simple login/logout UI.

---

## Milestone 4 – Client & Product Management

**Goal**: CRUD operations for clients and products with appropriate permissions.

- **Tasks**
  - **Client API**:
    - `POST /api/clients`, `GET /api/clients`, `GET /api/clients/:id`, `PUT /api/clients/:id`, `DELETE /api/clients/:id`.
  - **Product API**:
    - `POST /api/products`, `GET /api/products`, `GET /api/products/:id`, `PUT /api/products/:id`, `DELETE /api/products/:id`.
  - **UI pages**:
    - `/clients` list with search, pagination, and basic filters.
    - `/clients/new` and `/clients/[id]` for create/edit.
    - `/products` list and `/products/new`, `/products/[id]`.
  - **Permissions**:
    - `ADMIN`, `SALES`, `FINANCE`: create/edit.
    - `VIEWER`: read-only.
  - Log `Activity` for create, update, and delete actions.

---

## Milestone 5 – Tax & Discount Configuration

**Goal**: Central configuration for VAT and discount rules.

- **Tasks**
  - Implement `TaxSetting` with default VAT = **20%**.
  - Implement `DiscountSetting` presets (e.g., 5%, 10%, fixed amounts).
  - Create admin-only settings page:
    - `/settings/pricing` with controls for:
      - Default VAT rate.
      - Available discount presets.
  - APIs:
    - `GET /api/settings/tax`.
    - `GET /api/settings/discounts`.
    - `PUT /api/settings/tax` and `PUT /api/settings/discounts` (admin only).

---

## Milestone 6 – Quote Creation & Lifecycle

**Goal**: Full quote lifecycle with calculations and optional client approval.

- **Tasks**
  - **Quote UI**
    - `/quotes` list with filters by status: Draft, Sent, Approved, Converted, Invoiced.
    - `/quotes/new`:
      - Select or create client.
      - Add products/services and custom line items.
      - Apply line-level and header-level discounts.
      - Choose VAT rate (default from settings).
      - Add notes and validity date.
    - `/quotes/[id]` detail view with history and actions.
  - **Calculations**
    - For each line:
      - `lineBase = quantity × unitPrice`.
      - Apply line discount (fixed or %).
      - Apply line VAT (usually 20%) to get `lineTotal`.
    - At header level:
      - `subtotal = sum(lineBaseAfterDiscount)`.
      - Apply header discount (if any).
      - `vatAmount = (subtotalAfterDiscount) × vatRate`.
      - `total = subtotalAfterDiscount + vatAmount`.
  - **Status transitions**
    - `DRAFT` → `SENT` (when emailed or manually set).
    - `SENT` → `APPROVED` (client approves).
    - `APPROVED` → `CONVERTED` (order created).
    - `CONVERTED` / `INVOICED` (once invoice generated).
  - **Client approval (optional but useful)**
    - Generate a public link like `/public/quote/[token]`.
    - View-only quote page with “Approve Quote” button.
    - On approval:
      - Mark `Quote.status = APPROVED`.
      - Set `approvedByClientAt`.
      - Log `Activity`.

---

## Milestone 7 – Convert Quote to Order & Invoice

**Goal**: Seamless conversion from quote to order, and from order to invoice.

- **Tasks**
  - **Backend**
    - `POST /api/quotes/[id]/convert-to-order`:
      - Validate quote status (`APPROVED` or allowed `SENT` state).
      - Create `Order` record with:
        - Client, currency, monetary fields, notes.
        - All items cloned from the quote.
      - Set `Quote.status = CONVERTED`.
      - Store `Order.id` on `Quote.convertedToOrderId`.
    - `POST /api/orders/[id]/generate-invoice`:
      - Create `Invoice` from the order:
        - Copy all items and monetary values.
        - Set issueDate and dueDate (using payment terms).
      - If linked to a quote, mark `Quote.status = INVOICED`.
  - **UI**
    - On quote detail page:
      - Button “Convert to Order”.
    - On order detail page:
      - Button “Generate Invoice”.
  - Ensure VAT (20%) and discounts are preserved to maintain exact totals.

---

## Milestone 8 – Invoices (VAT, Discounts, Payments)

**Goal**: Full invoice management with VAT, discounts, and payment status.

- **Tasks**
  - **Invoice UI**
    - `/invoices` list with filters:
      - Draft, Sent, Paid, Overdue, Cancelled.
    - `/invoices/[id]` detail view:
      - Items, totals, client info, payment status.
  - **Status and payments**
    - Actions:
      - Mark as Sent.
      - Mark as Paid (with optional payment date).
      - Mark as Cancelled.
    - Automatically flag as `OVERDUE` when `dueDate` < today and status is still `SENT`.
  - **Calculations**
    - Confirm VAT default 20% (or from tax settings).
    - Apply discounts as per quote/order.
  - Log `Activity` for create and all status changes.

---

## Milestone 9 – PDF Generation & Branding

**Goal**: Branded PDFs for quotes, orders, and invoices.

- **Tasks**
  - Choose PDF strategy:
    - Server-side HTML-to-PDF with a headless browser (e.g., Puppeteer).
    - Or a Node PDF library (e.g., pdfkit) with programmatic layout.
  - Build HTML templates:
    - `QuotePdfTemplate`, `OrderPdfTemplate`, `InvoicePdfTemplate`.
    - Implement existing branding:
      - Logo, colors, fonts, header/footer, terms and conditions.
  - **API endpoints**
    - `GET /api/quotes/[id]/pdf`.
    - `GET /api/orders/[id]/pdf`.
    - `GET /api/invoices/[id]/pdf`.
  - **UI**
    - Add “Download PDF” or “View PDF” buttons on each detail page.
  - Optionally store a record of generated PDFs in `Activity` metadata.

---

## Milestone 10 – Email Sending & History

**Goal**: Send documents via email with attached PDFs and keep history.

- **Tasks**
  - Integrate an email solution:
    - Nodemailer with SMTP.
    - Or external provider (SendGrid, Mailgun, etc.).
  - **API endpoints**
    - `POST /api/quotes/[id]/send-email`.
    - `POST /api/orders/[id]/send-email`.
    - `POST /api/invoices/[id]/send-email`.
  - **Behavior**
    - Generate the PDF on-demand.
    - Compose email (subject, body, recipients).
    - Attach PDF.
    - Send and capture the result.
    - Write an `EmailLog` row:
      - entityType, entityId, to, cc, subject, status, sentAt, providerMessageId, error (if any).
  - **UI**
    - “Send by Email” button on each detail page.
    - Email history section showing all sent emails for that document.

---

## Milestone 11 – Activity Tracking

**Goal**: Basic audit trail for entities and user actions.

- **Tasks**
  - Implement a reusable backend helper:
    - `logActivity({ entityType, entityId, action, userId, metadata })`.
  - Log for:
    - Client/Product create/update/delete.
    - Quote creation, edits, and status changes.
    - Order/Invoice creation and status changes.
    - PDF generation and email sending.
  - **UI**
    - Add an “Activity” section on detail pages for Clients, Quotes, Orders, and Invoices.
    - Display user, action, date/time, and key metadata.

---

## Milestone 12 – Dashboard Overview (Optional)

**Goal**: Provide a high-level overview for quick reference.

- **Tasks**
  - Create `/dashboard` page:
    - Cards showing:
      - Number of quotes by status (Draft, Sent, Approved, Converted, Invoiced).
      - Recent invoices with their status (Paid, Overdue, etc.).
      - Total value of sent/approved quotes in the last 30 days.
      - Unpaid / overdue invoice totals.
  - Role-specific visibility:
    - Admin and Finance: financial summaries and overdue breakdown.
    - Sales: their quotes, approvals, and pipeline information.

---

## Milestone 13 – Security, Validation, Tests & Deployment

**Goal**: Harden the system and prepare for production deployment.

- **Validation**
  - Use a schema validation library (e.g., Zod) for all API inputs.
  - Validate:
    - Money values (non-negative, proper precision).
    - VAT ranges (e.g., 0–100%).
    - Discount rules (e.g., percentage 0–100; fixed not exceeding subtotal).
  - Validate allowed status transitions (e.g., cannot mark a cancelled invoice as paid).

- **Permissions**
  - Implement a centralized permission helper, e.g.:
    - `can(user, action, entity)` or `checkPermission(user, resource, operation)`.
  - Use it consistently in APIs and server components.

- **Testing**
  - Unit tests for:
    - VAT and discount calculations.
    - Quote → Order → Invoice conversion logic.
  - Integration or API tests for:
    - Auth and role-based access.
    - Email sending and status logging.

- **Deployment**
  - Deploy Next.js app (e.g., Vercel or similar host).
  - Provision PostgreSQL (e.g., Supabase, Railway, RDS).
  - Set environment variables for:
    - `DATABASE_URL`, auth secrets, email provider configuration, etc.
  - Run database migrations in CI/CD pipeline.

---

## Notes & Future Enhancements

- **Potential future features**
  - Multi-currency support.
  - More advanced reporting and analytics.
  - Integration with accounting systems (e.g., Xero, QuickBooks).
  - Reminder emails for overdue invoices.
  - File attachments on quotes/orders/invoices.

- This document should be updated as the project evolves to reflect any scope changes or additional milestones.


