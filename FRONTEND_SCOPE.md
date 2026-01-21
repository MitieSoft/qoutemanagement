## Frontend Milestones – CRM UI (Next.js + Tailwind)

This document defines the **frontend-only** milestones for the Quote → Order → Invoice system.  
Backend/API/database responsibilities remain in `PROJECT_SCOPE.md`; here we focus on **pages, layouts, components, and UX**, following a **CRM pattern with a left sidebar**.

---

## F1 – Base App Shell & Left Sidebar Layout

**Goal**: Implement a CRM-style shell with a persistent left sidebar and top header.

- **Tasks**
  - Create a root layout that wraps all authenticated pages:
    - Left sidebar navigation.
    - Top header with app name, current section, and user menu.
    - Main content area with padding and scroll.
  - Sidebar sections (links):
    - Dashboard
    - Clients
    - Products
    - Quotes
    - Orders
    - Invoices
    - Settings (Pricing, Templates, Users – for Admin)
  - Visual behavior:
    - Highlight active link.
    - Hover states and focus states for accessibility.
    - Responsive:
      - Desktop: fixed sidebar.
      - Mobile: collapsible / slide-in menu.
  - Shared UI patterns:
    - Reusable page header (title, breadcrumbs, primary actions).
    - Base layout for loading/empty/error states.

---

## F2 – Authentication UI & Role-Aware Navigation

**Goal**: UI for login/logout and navigation that adapts to user roles.

- **Tasks**
  - **Pages**
    - `/login`:
      - Email and password fields with validation and error display.
      - Optional “remember me” checkbox.
    - Simple logout action (button in the header user menu).
  - Connect to auth backend (e.g. NextAuth or custom) to:
    - Retrieve current user and role on the client.
  - Role-aware sidebar:
    - **ADMIN**: see all menu items.
    - **SALES**: see Dashboard, Clients, Products, Quotes, Orders, Invoices; limited Settings.
    - **FINANCE**: see Dashboard, Clients, Quotes, Orders, Invoices; Finance settings.
    - **VIEWER**: read-only sections, no create/edit actions.
  - Unauthorized UI:
    - Consistent “No access / 403” view within the app shell.

---

## F3 – Dashboard UI

**Goal**: High-level overview for users when they log in.

- **Tasks**
  - `/dashboard` page with:
    - Summary cards (tiles) showing:
      - Counts of quotes by status: Draft, Sent, Approved, Converted, Invoiced.
      - Counts of invoices by status: Draft, Sent, Paid, Overdue, Cancelled.
      - Total value of sent/approved quotes (last 30 days).
      - Unpaid and overdue invoice totals.
    - Optional chart or bar visualization (simple to start).
  - Quick actions:
    - “New Quote”, “New Client” buttons in a prominent place.
  - Role-specific view:
    - Sales-focused metrics for Sales users (e.g., their quotes).
    - Financial metrics for Finance/Admin.

---

## F4 – Client Management UI

**Goal**: CRM-style client management with list, detail, and create/edit forms.

- **Tasks**
  - `/clients`:
    - Table with:
      - Client name, main contact, email, phone, active/inactive, last activity date.
    - Search by name, email, or contact.
    - Filters:
      - Active / inactive.
    - Pagination or infinite scroll for large client sets.
    - “New client” primary button (hidden for Viewer).
  - `/clients/new`:
    - Form fields:
      - Name, contact name, email, phone.
      - Billing address, shipping address.
      - VAT number, active flag.
    - Inline validation and error messages.
  - `/clients/[id]`:
    - Client overview card with key info.
    - Tabs or sections:
      - **Details**: editable form for client info (if role allows).
      - **Related**: recent quotes, orders, invoices for this client (linked lists).
      - **Activity**: timeline of actions involving this client.
    - Role behavior:
      - Viewer: read-only fields, no save/delete buttons.
      - Others: can edit, archive/deactivate, etc.

---

## F5 – Product / Service Management UI

**Goal**: Manage reusable products and services for quicker quoting.

- **Tasks**
  - `/products`:
    - Table with:
      - Name, SKU, unit price, default VAT rate, active flag.
    - Search by name/SKU.
    - Filter by active/inactive.
    - “New product” button.
  - `/products/new`:
    - Form fields:
      - Name, description, SKU.
      - Unit price, default VAT rate.
      - Active flag.
  - `/products/[id]`:
    - Edit form and basic usage summary (e.g., number of quotes using this product).
  - Reusable **ProductPicker** component:
    - Searchable dropdown or modal.
    - Displays name, SKU, price, VAT.
    - On selection, auto-fills line item fields in quote/order/invoice forms.

---

## F6 – Tax & Discount Settings UI (Admin)

**Goal**: Screens to configure VAT and discount presets.

- **Tasks**
  - `/settings/pricing` (Admin only):
    - **VAT section**:
      - Shows current default VAT rate (20% by default).
      - Simple form to update the default VAT rate.
    - **Discount Presets section**:
      - List existing presets:
        - Name, type (`PERCENTAGE` or `FIXED`), value, active flag.
      - Add/edit presets via modal or inline editing.
      - Delete or deactivate presets.
  - Role handling:
    - Non-admin users see a clean “No access” message.
  - Consistent feedback:
    - Success and error messages using toasts or inline alerts.

---

## F7 – Quotes UI (List, Create, Edit, Status)

**Goal**: Main interface for creating and managing quotes through their lifecycle.

- **Tasks**
  - `/quotes`:
    - Table with:
      - Quote number, client, status, total, created date, valid until, owner (optional).
    - Filters:
      - Status (Draft, Sent, Approved, Converted, Invoiced, Rejected).
      - Client.
      - Date range.
    - Search by quote number, client, or text.
    - “New Quote” button.
  - `/quotes/new`:
    - Form layout:
      - **Client selection** (autocomplete or dropdown).
      - **Items section**:
        - Add item rows with:
          - Product picker OR free-text description.
          - Quantity, unit price.
          - Line-level discount (type + value).
          - VAT rate (default from settings).
        - Dynamic add/remove rows.
      - **Header settings**:
        - Currency (if multi-currency later; single currency to start).
        - Header-level discount (type + value).
        - VAT rate (auto from settings, override if allowed).
        - Notes and validity date.
      - **Summary panel**:
        - Subtotal, total discounts, VAT amount, grand total.
    - Realtime calculations and validation.
  - `/quotes/[id]`:
    - Layout:
      - Main area: quote details and items (editable if allowed by status).
      - Side panel: status, totals, quick actions.
    - Actions (based on status and role):
      - Edit (Draft).
      - Mark as Sent.
      - Send via Email (opens modal).
      - Approve (internal).
      - Convert to Order.
      - Download PDF.
    - Tabs/sections:
      - **Details**.
      - **Activity** timeline.
      - **Emails** history.
  - Visual cues:
    - Status badges (colors per status).

---

## F8 – Public Quote Approval Page

**Goal**: Simple public-facing page where clients can view and approve quotes.

- **Tasks**
  - `/public/quote/[token]`:
    - Clean public layout (no CRM sidebar), with logo and minimal navigation.
    - Displays:
      - Quote number, date, client name.
      - Item list with quantities, prices, discounts, VAT, and totals.
      - Summary box with subtotal, VAT, total.
    - “Approve Quote” button:
      - Calls backend approval endpoint.
      - Shows success message on completion.
      - Disable/hide button for already approved or expired quotes.
    - States:
      - Approved already.
      - Expired quote.
      - Invalid or used token.

---

## F9 – Orders UI

**Goal**: Manage orders, typically created from quotes.

- **Tasks**
  - `/orders`:
    - Table with:
      - Order number, client, linked quote number, status, total, created date.
    - Filters and search similar to quotes.
  - `/orders/[id]`:
    - Display:
      - Basic header info (order number, client, linked quote).
      - Items table (usually read-only, copied from quote).
      - Totals and VAT breakdown.
    - Actions:
      - Generate Invoice.
      - Download PDF.
      - Send by Email.
    - Tabs:
      - Details, Activity, Emails.

---

## F10 – Invoices UI

**Goal**: Full invoice management, including payment status handling.

- **Tasks**
  - `/invoices`:
    - Table with:
      - Invoice number, client, status, total, issue date, due date.
    - Filters:
      - Status (Draft, Sent, Paid, Overdue, Cancelled).
      - Client, date range.
  - `/invoices/[id]`:
    - Sections:
      - Header: client info, invoice number, dates, payment terms.
      - Items: list with quantities, prices, discounts, VAT per line.
      - Totals: subtotal, discount total, VAT amount, grand total.
    - Actions:
      - Mark as Sent.
      - Mark as Paid (with optional payment info fields).
      - Mark as Cancelled.
      - Download PDF.
      - Send by Email.
    - Status badges and small timeline of payment events.
    - Activity and email history tabs.

---

## F11 – PDF Download Integration & Template Preview

**Goal**: Connect UI actions to backend PDF generation and allow basic template selection/preview.

- **Tasks**
  - Add “Download PDF” buttons:
    - On quote, order, and invoice detail pages.
  - Implement download behavior:
    - Call backend `GET /api/.../pdf`.
    - Trigger file download or open a new tab with the PDF.
  - Optional template management UI:
    - `/settings/templates` (Admin):
      - List templates by type (Quote, Order, Invoice).
      - Select default template via radio/select input.
      - “Preview” action to open a sample PDF in a new tab.

---

## F12 – Email Sending UI & History

**Goal**: User-friendly email sending flows and visibility into email history.

- **Tasks**
  - Reusable **EmailModal** component:
    - Inputs:
      - To (pre-filled from client, editable).
      - CC (optional).
      - Subject (with default patterns).
      - Message body (simple text area initially).
      - Checkbox or note indicating that the PDF is attached.
    - Handles loading, success, and error states.
  - Integrate EmailModal into:
    - Quote detail (“Send Quote by Email”).
    - Order detail.
    - Invoice detail.
  - Email history:
    - “Emails” tab for each entity:
      - List entries with: date, subject, recipients, status.
      - Detail view or expandable row to see full message body and any error note.

---

## F13 – Activity Timeline UI

**Goal**: Clear, reusable activity timeline for key entities.

- **Tasks**
  - **ActivityTimeline** component:
    - Accepts an array of activity events.
    - Renders:
      - Icon per action type (created, updated, status changed, email sent, etc.).
      - Title (e.g., “Status changed to Approved”).
      - User name, timestamp.
      - Optional metadata (e.g., “from Draft to Sent”).
  - Integrate ActivityTimeline UI into:
    - Clients.
    - Quotes.
    - Orders.
    - Invoices.
  - Support pagination or “Load more” for long histories.

---

## F14 – UX Polish, Validation & Role Visibility

**Goal**: Make the frontend cohesive, robust, and safe to use.

- **Tasks**
  - Form validation:
    - Consistent inline errors for required fields and invalid values.
    - Rules like:
      - Quantities and prices must be non-negative.
      - Due date cannot be before issue date.
      - Valid email formats for client and login forms.
  - Role-based visibility:
    - Hide or disable buttons for actions the current role cannot perform.
    - Optional tooltips explaining lack of permission.
  - State handling:
    - Loading spinners/skeletons for table and detail pages.
    - Friendly empty states when there is no data yet.
    - Clear, non-technical error messages on failures.
  - Confirmations:
    - Confirmation dialogs for destructive actions (delete client, cancel invoice, etc.).
  - Visual consistency:
    - Use a consistent design system for buttons, inputs, cards, tabs, and badges across all pages.

---

These milestones can be implemented sequentially or in parallel (e.g., F1–F3 first for the shell and dashboard, then domain-specific sections). Keep `PROJECT_SCOPE.md` and `FRONTEND_SCOPE.md` in sync as the project evolves.


