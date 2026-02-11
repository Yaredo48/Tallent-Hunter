# Talent Architecture Engine 🚀

> **Enterprise-grade SaaS platform for AI-powered job description generation and management**

A production-ready, full-stack application built with modern technologies, featuring intelligent AI-powered job description generation, comprehensive organization management, and real-time collaboration capabilities.

[![CI](https://github.com/yourorg/talent-hunter/workflows/CI/badge.svg)](https://github.com/yourorg/talent-hunter/actions)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

---

## ✨ Features

### 🤖 AI-Powered Generation
- **Hugging Face Integration** - Free AI model (Mistral-7B-Instruct-v0.2)
- **Smart Prompt Engineering** - Context-aware job description generation
- **Automatic Fallbacks** - Template-based generation when AI is unavailable
- **Customizable Parameters** - Experience levels, skills, department context

### 🔐 Enterprise Authentication
- **JWT-based Authentication** - Secure token-based auth with refresh tokens
- **Role-Based Access Control (RBAC)** - 5 roles: Super Admin, Org Admin, HR Manager, Hiring Manager, Employee
- **Protected Routes** - Frontend and backend route protection
- **Session Management** - Persistent auth state with Zustand

### 🏢 Organization Management
- **Hierarchical Departments** - Unlimited depth organizational structure
- **Multi-tenant Support** - Organization-level data isolation
- **Member Management** - User assignments to departments
- **Visual Hierarchy** - Department tree visualization

### 📄 Job Description Management
- **CRUD Operations** - Create, read, update, delete job descriptions
- **Status Workflow** - Draft → In Review → Approved → Published → Archived
- **Version Control** - Track changes and revisions
- **AI Generation** - One-click AI-powered content creation
- **Structured Content** - Summary, responsibilities, qualifications, benefits

### 📊 Analytics Dashboard
- **Real-time Metrics** - JD counts, approval times, AI generation rates
- **Department Analytics** - Distribution across organization
- **Activity Timeline** - Recent updates and changes
- **Visual Charts** - Progress bars and trend indicators

### 🚀 Production-Ready DevOps
- **GitHub Actions CI/CD** - Automated testing, linting, and builds
- **Docker Deployment** - Multi-stage builds for API and web
- **Winston Logging** - Structured logs with daily rotation
- **Health Checks** - Service monitoring and auto-restart
- **SSL/HTTPS Ready** - Production deployment guides

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Shadcn/ui** - Beautiful component library
- **TanStack Query** - Data fetching and caching
- **Zustand** - Lightweight state management
- **React Hook Form + Zod** - Form validation

### Backend
- **NestJS** - Progressive Node.js framework
- **Prisma ORM** - Type-safe database client
- **PostgreSQL** - Primary database
- **Redis** - Caching and sessions
- **JWT** - Authentication tokens
- **Winston** - Application logging

### AI & Tools
- **Hugging Face Inference API** - Free AI models
- **Mistral-7B-Instruct** - Primary language model
- **Docker & Docker Compose** - Containerization
- **Turborepo** - Monorepo build system
- **pnpm** - Fast package manager

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- pnpm (recommended)

### 1. Clone and Install

```bash
git clone <your-repo>
cd Tallent-Hunter
pnpm install
```

### 2. Start Development Services

```bash
# Start PostgreSQL and Redis
docker-compose up -d

# Generate Prisma client
pnpm --filter @talent/database db:generate

# Push database schema
pnpm --filter @talent/database db:push
```

### 3. Configure Environment

**Backend (`apps/api/.env`):**
```bash
DATABASE_URL="postgresql://postgres:password@localhost:5432/talent_hunter?schema=public"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="your-secret-key"
REFRESH_TOKEN_SECRET="your-refresh-secret"
HUGGINGFACE_API_KEY="your-hf-key"  # Get from https://huggingface.co/settings/tokens
```

**Frontend (`apps/web/.env.local`):**
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 4. Create Test Organization

```bash
docker exec -it $(docker ps -q -f name=postgres) psql -U postgres -d talent_hunter
```

```sql
INSERT INTO "Organization" (id, name, slug, "createdAt", "updatedAt")
VALUES ('test-org-123', 'Test Organization', 'test-org', NOW(), NOW());
```

### 5. Start Development Servers

```bash
# Terminal 1 - Backend
cd apps/api
pnpm dev

# Terminal 2 - Frontend
cd apps/web
pnpm dev
```

### 6. Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001
- **Register:** Use organization ID `test-org-123`

---

## 📁 Project Structure

```
Tallent-Hunter/
├── apps/
│   ├── api/                    # NestJS Backend
│   │   ├── src/
│   │   │   ├── auth/          # Authentication & JWT
│   │   │   ├── users/         # User management
│   │   │   ├── organization/  # Org & departments
│   │   │   ├── job-description/ # JD CRUD & AI
│   │   │   ├── ai/            # Hugging Face integration
│   │   │   └── common/        # Guards, interceptors, logger
│   │   └── Dockerfile
│   └── web/                    # Next.js Frontend
│       ├── src/
│       │   ├── app/           # App Router pages
│       │   ├── components/    # React components
│       │   ├── hooks/         # Custom hooks
│       │   ├── stores/        # Zustand stores
│       │   └── lib/           # API client
│       └── Dockerfile
├── packages/
│   ├── database/              # Prisma schema & client
│   └── types/                 # Shared TypeScript types
├── .github/workflows/         # CI/CD pipelines
├── docker-compose.yml         # Development services
├── docker-compose.prod.yml    # Production deployment
└── docs/                      # Documentation

```

---

## 📖 Documentation

- **[Quick Start Guide](./QUICKSTART.md)** - Step-by-step setup instructions
- **[Development Guide](./DEVELOPMENT.md)** - Local development workflow
- **[Deployment Guide](./DEPLOYMENT.md)** - Production deployment
- **[AI Testing Guide](./AI_TESTING.md)** - AI integration testing
- **[Architecture](./docs/architecture.md)** - System design and diagrams
- **[Walkthrough](./brain/walkthrough.md)** - Complete feature documentation

---

## 🧪 Testing

```bash
# Lint all packages
pnpm lint

# Type check
pnpm type-check

# Run tests
pnpm test

# E2E tests (when configured)
pnpm test:e2e
```

---

## 🐳 Docker Deployment

### Development
```bash
pnpm docker:dev
```

### Production
```bash
pnpm docker:prod
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete production setup.

---

## 🔑 API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `GET /auth/profile` - Get user profile (protected)
- `POST /auth/refresh` - Refresh access token

### Organizations
- `GET /organizations` - List organizations
- `GET /organizations/:id` - Get organization
- `POST /organizations` - Create organization (Super Admin)
- `GET /organizations/:id/departments` - List departments
- `POST /organizations/:id/departments` - Create department

### Job Descriptions
- `GET /job-descriptions/organization/:id` - List JDs
- `GET /job-descriptions/:id` - Get JD details
- `POST /job-descriptions` - Create JD
- `POST /job-descriptions/generate` - AI-generate JD
- `PUT /job-descriptions/:id` - Update JD
- `DELETE /job-descriptions/:id` - Delete JD

---

## 🎯 Key Features Implemented

### ✅ Phase 1: System Architecture
- Monorepo structure with Turborepo
- Database schema with Prisma
- Docker development environment
- Architecture documentation

### ✅ Phase 2: Backend (NestJS)
- JWT authentication with RBAC
- Organization & department hierarchy
- Job description CRUD operations
- RESTful API design

### ✅ Phase 3: Frontend (Next.js)
- Login/Register with validation
- Protected dashboard layout
- Organization management UI
- Job description management
- Analytics dashboard
- Responsive design

### ✅ Phase 4: AI Integration
- Hugging Face Inference API
- Mistral-7B-Instruct model
- Prompt engineering templates
- Automatic fallback system
- Error handling

### ✅ Phase 5: DevOps
- GitHub Actions CI/CD
- Winston logging infrastructure
- Production Docker builds
- Health checks & monitoring
- Deployment automation

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **NestJS** - Progressive Node.js framework
- **Next.js** - React framework
- **Hugging Face** - Free AI models
- **Shadcn/ui** - Beautiful components
- **Prisma** - Next-generation ORM

---

## 📧 Support

For questions or issues:
- Check [Documentation](./docs/)
- Review [DEVELOPMENT.md](./DEVELOPMENT.md)
- Open an issue on GitHub

---

**Built with ❤️ using modern web technologies**


> Enterprise SaaS platform for AI-powered job description generation and management

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- pnpm (installed globally)

### Installation

```bash
# 1. Install dependencies
pnpm install

# 2. Start databases (PostgreSQL & Redis)
docker-compose up -d

# 3. Copy environment variables
cp .env.example apps/api/.env
cp .env.example apps/web/.env.local

# 4. Generate Prisma client
pnpm --filter @talent/database db:generate

# 5. Push database schema
pnpm --filter @talent/database db:push
```

### Development

```bash
# Run all services
pnpm dev

# Or run individually:
pnpm --filter api dev    # Backend → http://localhost:3001
pnpm --filter web dev    # Frontend → http://localhost:3000
```

## 📁 Project Structure

```
talent-hunter/
├── apps/
│   ├── api/                 # NestJS Backend
│   │   ├── src/
│   │   │   ├── auth/       # Authentication module
│   │   │   ├── organization/  # Org hierarchy module
│   │   │   ├── job-description/  # JD management
│   │   │   ├── users/      # User management
│   │   │   └── common/     # Guards, decorators
│   │   └── .env
│   └── web/                 # Next.js Frontend
│       ├── src/
│       │   ├── app/        # App router pages
│       │   ├── components/ # React components
│       │   ├── lib/        # Utilities & API client
│       │   └── stores/     # Zustand stores
│       └── .env.local
├── packages/
│   ├── database/           # Prisma schema
│   ├── types/              # Shared TypeScript types
│   └── config/             # Shared configs
├── docker-compose.yml
└── turbo.json
```

## 🔧 Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- React 18 + TypeScript
- Tailwind CSS + Shadcn/ui
- TanStack Query + Zustand
- React Hook Form + Zod

**Backend:**
- NestJS + TypeScript
- Prisma ORM
- PostgreSQL
- Redis
- JWT Authentication
- Passport.js

**Infrastructure:**
- Turborepo monorepo
- pnpm workspaces
- Docker Compose

## 📚 API Documentation

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login
- `GET /auth/profile` - Get current user (protected)

### Organizations
- `GET /organizations` - List all organizations
- `POST /organizations` - Create organization (SUPER_ADMIN)
- `GET /organizations/:orgId/departments` - List departments
- `POST /organizations/:orgId/departments` - Create department

### Job Descriptions
- `POST /job-descriptions` - Create JD
- `POST /job-descriptions/generate` - AI-generated JD
- `GET /job-descriptions/:id` - Get JD details
- `PUT /job-descriptions/:id` - Update JD

## 🛡️ User Roles

- `SUPER_ADMIN` - Platform administrator
- `ORG_ADMIN` - Organization administrator
- `HR_MANAGER` - HR team member
- `HIRING_MANAGER` - Department hiring manager
- `EMPLOYEE` - General employee

## 📝 Development Scripts

```bash
# Install dependencies
pnpm install

# Run dev servers
pnpm dev

# Build all apps
pnpm build

# Lint
pnpm lint

# Database operations
pnpm --filter @talent/database db:generate    # Generate Prisma client
pnpm --filter @talent/database db:push        # Push schema to DB
```

## 🔐 Environment Variables

### Backend (`apps/api/.env`)
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/talent_hunter?schema=public"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="1d"
REFRESH_TOKEN_SECRET="your-refresh-secret"
REFRESH_TOKEN_EXPIRES_IN="7d"
PORT=3001
```

### Frontend (`apps/web/.env.local`)
```env
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

## 📦 Package Management

This project uses **pnpm workspaces** for monorepo management. Use the `--filter` flag to target specific packages:

```bash
pnpm add <package> --filter api      # Add to backend
pnpm add <package> --filter web      # Add to frontend
pnpm add <package> --filter @talent/database  # Add to database package
```

## 🚧 Roadmap

- [x] Authentication & RBAC
- [x] Organization hierarchy
- [x] Job description CRUD
- [ ] Approval workflows
- [ ] AI integration (OpenAI GPT-4)
- [ ] Real-time collaboration
- [ ] Analytics dashboard
- [ ] CI/CD pipeline

## 📄 License

MIT License - See LICENSE file for details.
