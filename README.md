
  

# CIO Web Application Platform

  

A comprehensive personnel and organizational structure management platform developed for the Information and Communication Technology (ICT) Center.

  

This full-stack web application is designed to efficiently manage complex organizational data, including personnel records, agencies, and internal departments. It features a robust security architecture, comprehensive audit trails, and a scalable storage solution.

  

## Tech Stack

  

**Frontend (Admin Dashboard):**

- Framework: Next.js 14/15 (App Router)

- Language: TypeScript

- Styling: Tailwind CSS

- Icons/UI: Lucide React, Tailwind Components

  

**Backend (REST API):**

- Framework: NestJS

- ORM: Prisma

- Database: PostgreSQL

- Storage: MinIO (S3-compatible Object Storage for media assets)

- Authentication: JWT (JSON Web Token) with Refresh Tokens & Session Tracking

  

**Infrastructure:**

- Containerization: Docker & Docker Compose

  

**Key Features**

  

- Authentication and Authorization

- Secure login and session management.

- Role-Based Access Control (RBAC) to enforce strict data access policies.

- Personnel Management

- Full CRUD operations for personnel records.

- Seamless image uploading and serving via MinIO Object Storage.

- Version history and modification tracking (Modified By).

- Organizational Structure Management

- Hierarchical data management for Agencies and Departments.

- Advanced Search

- High-performance fuzzy search leveraging PostgreSQL pg_trgm extension for Thai language support.

- Security and Audit Trail

- Comprehensive system activity logging (Audit Trail) to monitor data changes.

- Security tracking for login attempts to detect and prevent unauthorized access.
  

## Getting Started

**Prerequisites**
-   Docker and Docker Compose
-   Node.js (v18+ recommended)

**1. Clone the repository**
```bash
git clone [your-repository-url]
cd cio-webapp
```

**2. Setup Infrastructure** Spin up the PostgreSQL database and MinIO storage containers:
```bash
docker-compose up -d
```

**3. Backend Setup**
```bash
cd backend
npm install
# Rename .env.example to .env and configure your database/MinIO credentials
npx prisma migrate dev
npm run dev
```

**4. Frontend Setup**
```bash
cd ../frontend-admin
npm install
# Configure environment variables in .env.local
npm run dev
```

### Project Status
**Note:** This project was developed during an internship to demonstrate advanced database design, scalable file storage implementation, and enterprise-level data security practices. It currently serves as an Archived/Portfolio project to showcase technical capabilities in full-stack development.
