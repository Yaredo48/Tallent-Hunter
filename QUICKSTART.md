# Quick Start Guide

## Prerequisites
- Docker and Docker Compose
- Node.js 20+
- pnpm (installed globally)

## 1. Start Database Services

```bash
cd /home/yared/Documents/GenAIProject/Tallent-Hunter
docker-compose up -d
```

Verify services are running:
```bash
docker-compose ps
```

## 2. Install Dependencies

```bash
/home/yared/.npm-global/bin/pnpm install
```

## 3. Setup Database

```bash
# Generate Prisma client
/home/yared/.npm-global/bin/pnpm --filter @talent/database db:generate

# Push schema to database
/home/yared/.npm-global/bin/pnpm --filter @talent/database db:push
```

## 4. Create Test Organization

Connect to PostgreSQL and create a test organization:

```bash
docker exec -it $(docker ps -q -f name=postgres) psql -U postgres -d talent_hunter
```

Then run:
```sql
INSERT INTO "Organization" (id, name, slug, "createdAt", "updatedAt")
VALUES ('test-org-123', 'Test Organization', 'test-org', NOW(), NOW());
```

Exit with `\q`

## 5. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd apps/api
/home/yared/.npm-global/bin/pnpm dev
```
Backend will be available at http://localhost:3001

**Terminal 2 - Frontend:**
```bash
cd apps/web
/home/yared/.npm-global/bin/pnpm dev
```
Frontend will be available at http://localhost:3000

## 6. Test the Application

1. Open http://localhost:3000 in your browser
2. Click "Sign up" on the login page
3. Fill in the registration form:
   - First Name: John
   - Last Name: Doe
   - Email: john@test.com
   - Password: password123
   - Organization ID: test-org-123
4. Click "Create Account"
5. You'll be automatically logged in and redirected to the dashboard

## 7. Explore Features

### Dashboard
- View stats cards showing JD metrics
- Quick actions for creating JDs and departments

### Organizations
- View organization details
- Create departments with hierarchy
- Manage department structure

### Job Descriptions
- Generate JDs with AI (uses placeholder data currently)
- View JDs in table format
- Filter by status (Draft, In Review, Approved, Published)

### Analytics
- View metrics and trends
- Department distribution
- Recent activity

## Troubleshooting

**Docker not running:**
```bash
sudo systemctl start docker
```

**Port already in use:**
- Backend: Edit `PORT` in `apps/api/.env`
- Frontend: Next.js will suggest an alternative port

**Database connection error:**
```bash
docker-compose logs postgres
```

**pnpm command not found:**
Use full path: `/home/yared/.npm-global/bin/pnpm`

## API Testing

You can test the API directly using curl:

```bash
# Register a user
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User",
    "organizationId": "test-org-123"
  }'

# Login
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Get organizations (requires auth token)
curl http://localhost:3001/organizations \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Next Steps

- Integrate real OpenAI API for JD generation
- Add approval workflow functionality
- Implement real-time collaboration
- Setup production deployment
