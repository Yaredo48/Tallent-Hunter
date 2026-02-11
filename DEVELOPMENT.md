# Talent Architecture Engine - Development Guide

## 🚀 Getting Started

### 1. Start the Database Services

```bash
docker-compose up -d
```

This starts:
- PostgreSQL on port 5432
- Redis on port 6379

### 2. Setup the Database

```bash
# Generate Prisma client
/home/yared/.npm-global/bin/pnpm --filter @talent/database db:generate

# Push schema to database (for development)
/home/yared/.npm-global/bin/pnpm --filter @talent/database db:push
```

### 3. Start Development Servers

**Backend (NestJS):**
```bash
cd apps/api
/home/yared/.npm-global/bin/pnpm dev
```
Backend will run on http://localhost:3001

**Frontend (Next.js):**
```bash
cd apps/web
/home/yared/.npm-global/bin/pnpm dev
```
Frontend will run on http://localhost:3000

### 4. Create an Organization (for testing)

Before you can register users, you need to create an organization. Use a tool like Postman or curl:

```bash
# First, create a super admin user directly in the database
# OR use this test organization ID: "test-org-123"
```

For testing, you can manually insert an organization:
```sql
INSERT INTO "Organization" (id, name, slug, "createdAt", "updatedAt")
VALUES ('test-org-123', 'Test Organization', 'test-org', NOW(), NOW());
```

### 5. Access the Application

1. Navigate to http://localhost:3000
2. You'll be redirected to `/login`
3. Click "Sign up" to create an account
4. Use organization ID: `test-org-123`
5. After registration, you'll be logged in and redirected to the dashboard

## 📁 Project Structure

```
apps/
├── api/                    # NestJS Backend
│   ├── src/
│   │   ├── auth/          # Authentication (JWT, RBAC)
│   │   ├── organization/  # Org & Department management
│   │   ├── job-description/  # JD CRUD & AI generation
│   │   ├── users/         # User management
│   │   └── common/        # Guards, decorators
│   └── .env
└── web/                    # Next.js Frontend
    ├── src/
    │   ├── app/
    │   │   ├── (auth)/    # Login, Register
    │   │   └── (dashboard)/  # Protected dashboard pages
    │   ├── components/    # React components
    │   ├── lib/           # API client
    │   ├── stores/        # Zustand state
    │   └── hooks/         # Custom hooks
    └── .env.local
```

## 🔧 Available Scripts

```bash
# Install all dependencies
/home/yared/.npm-global/bin/pnpm install

# Run all services (if turbo is configured)
/home/yared/.npm-global/bin/pnpm dev

# Run specific app
/home/yared/.npm-global/bin/pnpm --filter api dev
/home/yared/.npm-global/bin/pnpm --filter web dev

# Build for production
/home/yared/.npm-global/bin/pnpm build

# Database operations
/home/yared/.npm-global/bin/pnpm --filter @talent/database db:generate
/home/yared/.npm-global/bin/pnpm --filter @talent/database db:push
```

## 🎯 Testing the Application

### Test User Registration
1. Go to http://localhost:3000/register
2. Fill in the form with:
   - First Name: John
   - Last Name: Doe
   - Email: john@test.com
   - Password: password123
   - Organization ID: test-org-123
3. Click "Create Account"

### Test Login
1. Go to http://localhost:3000/login
2. Use credentials:
   - Email: john@test.com
   - Password: password123
3. Click "Sign In"

### Explore the Dashboard
- View stats cards
- Navigate through sidebar links
- Test user dropdown and logout

## 🔐 Environment Variables

**Backend (apps/api/.env):**
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/talent_hunter?schema=public"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="super-secret-change-me"
JWT_EXPIRES_IN="1d"
REFRESH_TOKEN_SECRET="another-super-secret"
REFRESH_TOKEN_EXPIRES_IN="7d"
PORT=3001
```

**Frontend (apps/web/.env.local):**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 📡 API Endpoints

### Authentication
- POST `/auth/register` - Register new user
- POST `/auth/login` - Login
- GET `/auth/profile` - Get current user (protected)

### Organizations
- GET `/organizations` - List all organizations
- GET `/organizations/:id` - Get organization details
- POST `/organizations` - Create organization (SUPER_ADMIN only)
- GET `/organizations/:orgId/departments` - List departments
- POST `/organizations/:orgId/departments` - Create department

### Job Descriptions
- POST `/job-descriptions` - Create JD
- POST `/job-descriptions/generate` - AI-generated JD
- GET `/job-descriptions/:id` - Get JD details
- GET `/job-descriptions/organization/:orgId` - List JDs by org
- PUT `/job-descriptions/:id` - Update JD

## 🛠️ Troubleshooting

**Database connection error:**
- Make sure Docker is running: `docker ps`
- Check if PostgreSQL is accessible: `docker-compose logs postgres`

**pnpm not found:**
- Use full path: `/home/yared/.npm-global/bin/pnpm`

**Port already in use:**
- Backend: Change PORT in `apps/api/.env`
- Frontend: Next.js will suggest a different port automatically

**Prisma client not generated:**
```bash
/home/yared/.npm-global/bin/pnpm --filter @talent/database db:generate
```

## 🎨 Features Implemented

✅ **Backend:**
- JWT Authentication with refresh tokens
- Role-based access control (RBAC)
- Organization & Department hierarchy
- Job Description CRUD operations
- Prisma ORM with PostgreSQL
- RESTful API architecture

✅ **Frontend:**
- Beautiful login/register pages
- Protected dashboard with auth guards
- Responsive sidebar navigation
- User profile dropdown
- Stats cards and quick actions
- TanStack Query for data fetching
- Zustand for state management
- Shadcn/ui component library

## 🚧 Next Steps

- [ ] Build Organization management UI
- [ ] Create JD creation/editing interface
- [ ] Implement AI generation integration
- [ ] Add approval workflow UI
- [ ] Build analytics dashboard
- [ ] Implement real-time features with WebSocket
