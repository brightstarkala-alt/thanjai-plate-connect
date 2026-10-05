# Thanjai Plate Builder

Copy and paste this revised prompt into Lovable. It explicitly instructs Lovable not to create or assume Supabase details and to pause when Supabase configuration is required.

You are an expert full-stack developer and product designer.

Build a complete, functional, mobile-first MVP web application called:

THANJAI HEALTHY PLATE

Business location: Thanjavur, Tamil Nadu, India.

==================================================
CRITICAL INSTRUCTIONS
==================================================

1. Do not invent, assume, or create any Supabase project
   details, credentials, URLs, keys, or configuration.

2. Do not create your own Supabase project.

3. Do not use mock data for core functionality.

4. When you reach the stage requiring Supabase:
   - STOP implementation temporarily.
   - Clearly explain what Supabase information or action
     is required from me.
   - Ask me to provide or configure it through the
     appropriate secure Lovable integration.
   - Wait for my confirmation before continuing.

5. Do not ask me to paste secret keys into chat.
6. Do not expose secrets in frontend code.
7. Do not silently select important business rules.
8. Ask me whenever essential information is missing.

9. You may build the initial UI and project structure
   before Supabase connection, but clearly identify
   any temporary placeholders.

10. Do not claim a feature is functional until it is
    connected to the real backend and tested.

==================================================
TECHNOLOGY
==================================================

Frontend:
- React
- TypeScript
- Tailwind CSS
- Mobile-first responsive design

Backend/database:
- Supabase PostgreSQL
- Supabase Authentication
- Supabase Storage where needed
- Supabase Row Level Security

Hosting:
- Vercel-compatible

Timezone: Asia/Kolkata
Currency: INR (₹)

==================================================
BUSINESS
==================================================

Business name: Thanjai Healthy Plate
Location: Thanjavur, Tamil Nadu
Delivery timing: 6 AM–8 AM
Service area: Approximately 5 km
Default order cutoff: 10 PM on the previous day

There are exactly two fixed food box varieties:
- Box 1
- Box 2

The admin must be able to change their contents,
prices, availability, and date-specific menus.

==================================================
CUSTOMER FEATURES
==================================================

Customers must be able to:

- Register and log in.
- View available food boxes.
- Select delivery dates using a calendar.
- Choose Box 1 and/or Box 2.
- Select quantities for each delivery date.
- Add optional additional items.
- View applicable offers.
- Review the order total.
- Enter delivery details.
- View the business UPI QR code.
- Enter UTR/reference number.
- Optionally upload a payment screenshot.
- Submit the order for manual payment verification.
- View order status and order history.

Customers must only access their own data and orders.

==================================================
ADMIN FEATURES
==================================================

Create a secure admin dashboard.

The admin must be able to:

MENU AND BOXES:
- Edit Box 1 contents.
- Edit Box 2 contents.
- Change prices.
- Configure date-specific menus.
- Enable or disable boxes.

ADDITIONAL ITEMS:
- Add, edit, enable, and disable items.
- Change item prices.
- Configure availability.

OFFERS:
- Create offers and discounts.
- Configure validity dates.
- Enable or disable offers.

DELIVERY:
- Change the order cutoff time.
- Default cutoff: 10 PM previous day.
- Mark specific dates as no-service days.
- Configure available delivery dates.

ORDERS:
- View orders by delivery date.
- Filter by order and payment status.
- View customer and order details.
- Approve or reject UPI payments.
- Add internal verification notes.
- Export orders as CSV.

SETTINGS:
- Configure business information.
- Configure UPI ID.
- Upload/change UPI QR code.
- Configure delivery timing.
- Configure cutoff time.

==================================================
MANUAL UPI PAYMENT
==================================================

Do not integrate Razorpay or another payment gateway
in Version 1.

Payment flow:

Customer places order
→ UPI QR payment
→ Customer submits UTR
→ Payment verification pending
→ Admin checks payment
→ Admin approves or rejects
→ Order status is updated

Payment statuses:
- Pending Payment
- Verification Pending
- Paid
- Rejected
- Cancelled

Never mark a payment as successful based only on
a screenshot or frontend status.

==================================================
BUSINESS RULES
==================================================

1. The backend must validate cutoff time.
2. Customers cannot order after the cutoff.
3. Customers cannot order on no-service dates.
4. Existing orders must not be deleted when a date
   becomes unavailable.
5. Past orders must preserve the price and item details
   at the time the order was placed.
6. Customers cannot manipulate prices or discounts.
7. Admin-only actions must be protected.
8. Supabase RLS must protect customer and business data.

==================================================
DATABASE
==================================================

Propose a normalized and scalable database structure
including, where appropriate:

- businesses
- profiles
- business_members
- box_types
- menu_schedules
- additional_items
- offers
- service_availability
- customer_addresses
- orders
- order_items
- payments
- business_settings
- audit_logs

Support business_id for future multi-tenant expansion.

Before creating database tables or applying migrations:

1. Explain the proposed schema.
2. Identify required Supabase configuration.
3. STOP and ask me to connect my own Supabase project.
4. Wait for my confirmation.
5. Do not invent any Supabase details.

==================================================
IMPLEMENTATION PROCESS
==================================================

Follow these stages:

STAGE 1:
Create the initial UI, navigation, and project structure.

STAGE 2:
Explain the Supabase requirements and pause.
Ask me to connect my own Supabase project securely
through Lovable.

STAGE 3:
After I confirm the connection, propose and implement
the database schema and authentication.

STAGE 4:
Implement admin functionality.

STAGE 5:
Implement customer ordering.

STAGE 6:
Implement manual UPI payment verification.

STAGE 7:
Implement security rules, testing, and deployment.

At every stage:
- Explain what was completed.
- Identify anything requiring my approval.
- Do not invent missing details.
- Do not proceed past a required approval without asking.

Start with Stage 1 only.

This version tells Lovable to stop before Supabase setup and wait for your own project details.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/37cd5bda-9b9b-4bd1-9bab-413a028e0d8d).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
