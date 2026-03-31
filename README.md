# Virtual Queue Management System (VQMS)

A robust, full-stack application for managing vendor and visitor queues efficiently. Built with modern web technologies, VQMS provides a seamless experience for both customers and business owners.

## 🚀 Idea & Vision
The core idea behind VQMS is to digitize the physical waiting experience. Customers can browse available stores, join queues remotely, and receive real-time updates on their status, while business owners can manage their queues, update store information, and monitor customer flow from a central dashboard.

## ✨ Key Features
### 🏢 For Business Owners
- **Store Customization**: Set store name, description, address, and max queue size.
- **Operating Hours**: Define open/close times and working days.
- **Live Queue Management**: Call next customer, skip, or mark as completed.
- **Real-time Analytics**: View today's completed tokens and current waiting count.

### � For Customers
- **Global Store Search**: Find and browse all registered stores.
- **One-Click Join**: Join a queue instantly if space is available.
- **Real-time Tracking**: See current serving token and your exact position in the queue.
- **Wait Protection**: Only one active token allowed per user across all stores to prevent queue spamming.

## �🛠 Tech Stack
- **Framework**: [Next.js](https://nextjs.org/) (App Router, Server Actions)
- **Authentication**: [Clerk](https://clerk.com/) (Auth & RBAC)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/) (Tailwind CSS, Radix UI)
- **Icons**: [Lucide React](https://lucide.dev/) & [Remix Icons](https://remixicon.com/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Testing**: [Vitest](https://vitest.dev/) & [React Testing Library](https://testing-library.com/)

## 🏗 Project Structure
```text
vqms/
├── app/                  # Next.js App Router
│   ├── api/              # Serverless API routes
│   │   ├── business/     # Business-specific endpoints (queue/store management)
│   │   ├── user/         # Customer-specific endpoints (joining/browsing)
│   │   └── webhooks/     # Clerk webhooks for user synchronization
│   ├── dashboard/        # Role-based dashboards (Business/User)
│   └── onboarding/       # User role selection & store setup
├── components/           # Reusable UI & Layout components
│   └── ui/               # Shadcn UI base components
├── lib/                  # Shared utilities & database client (prisma)
├── prisma/               # Database schema & migrations
└── public/               # Static assets
```

## 🔒 Role-Based Access Control (RBAC)
VQMS uses a two-tier RBAC system implemented via Clerk `publicMetadata` and Prisma's `Role` enum:

- **Customer (`USER`)**:
  - Browse available stores.
  - Join queues and receive tokens.
  - View real-time queue status and history.
- **Store Owner (`BUSINESS`)**:
  - Create and manage store details.
  - Monitor and manage active queues.
  - Call tokens and update status (WAITING, CALLED, COMPLETED).

## � API Reference
### Business Endpoints
- `GET /api/business/queue`: Fetch current active tokens and stats.
- `POST /api/business/queue`: Manage tokens (`CALL_NEXT`, `COMPLETE`, `SKIP`).
- `GET/POST /api/business/store`: Fetch or update store profile information.

### User Endpoints
- `GET /api/user/stores`: List all available stores for browsing.
- `POST /api/user/join-queue`: Join a specific store's queue (requires `storeId`).
- `GET /api/user/tokens`: Fetch current and past tokens for the logged-in user.

### Webhooks
- `POST /api/webhooks/clerk`: Syncs Clerk user creation/updates with the local Prisma database.

## 📂 Methodology
The project follows a standard Next.js 15+ methodology:
- **Server Actions**: Used for onboarding and role-based data updates.
- **Client-Side Fetching**: Used for real-time dashboard updates and interactive forms.
- **Schema-First Design**: Prisma schema defines the core relationships (User -> Store -> Queue -> Token).
- **Component-Driven UI**: Built with reusable, accessible components from Shadcn UI.

## 💾 Database Schema
- **User**: Clerk ID, email, role (USER/BUSINESS).
- **Store**: Linked to a BUSINESS user, includes metadata and queue settings.
- **Queue**: Linked to a Store, contains a collection of tokens.
- **Token**: Represents a customer's spot in a specific queue, with status tracking.

