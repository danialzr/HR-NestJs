# 🚀 Enterprise HR & Resources Planning (ERP) Backend

A sophisticated, modular backend architecture for Human Resources Management, built with **NestJS** and **TypeORM**. This system is engineered to handle complex organizational hierarchies, secure authentication flows, and real-time operational tracking.

## 🏗 System Architecture & Key Modules

### 🔐 Advanced Security & Auth (JWT + Refresh Tokens)
- **Multi-Layered Auth:** Secure Access & Refresh Token strategy.
- **Session Audit:** Refresh tokens track `userAgent` and `ipAddress` for security monitoring.
- **Token Rotation:** Automatic revocation of old tokens upon new session requests.
- **Hashing:** Industry-standard password hashing using `Bcrypt` (12 rounds).

### 👥 Organizational Hierarchy
- **Self-Referencing Relations:** Support for complex reporting lines (Manager-Employee hierarchy).
- **Subordinate Isolation:** Logic-level security ensuring managers can only access and manage their direct subordinates.
- **Departmental Logic:** Automated department assignment and active-member validation before deletion.

### ⏱ Attendance & Time Tracking
- **Smart Check-In/Out:** State-aware attendance system prevents overlapping sessions.
- **Dual Calendar Support:** Engineered for Persian (Jalali) dates (`jDate`) alongside UTC timestamps.
- **History & Reporting:** Advanced `QueryBuilder` for generating date-range reports.

### 📋 Task & Productivity Management
- **Ownership Flow:** Distinct separation between Task Creators and Assignees.
- **Dynamic Status Updates:** Role-based task management allowing employees to update progress and managers to oversee deadlines.

### 🛠 Professional Infrastructure
- **Standardized API Responses:** A global `TransformResponseInterceptor` ensures all client-side communications follow a unified, predictable structure.
- **Custom Response Messaging:** Integrated Farsi status messages for localized UX.
- **Database Integrity:** Strict `CASCADE` and `SET NULL` policies using TypeORM decorators.

## 🛠 Tech Stack
- **Framework:** NestJS
- **Database:** PostgreSQL (TypeORM)
- **Security:** Passport.js, JWT, Bcrypt
- **Optimization:** Eager/Lazy loading strategies for high-performance queries.

## 🚀 Installation

1. **Clone & Install:**
   ```bash
   git clone [https://github.com/danialzr/HR-NestJs.git](https://github.com/danialzr/HR-NestJs.git)
   npm install
2. Environment Configuration: Create a .env file with JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, and DATABASE_URL.
3. Database Migration: npx typeorm migration:run
4. Launch: npm run start:dev
