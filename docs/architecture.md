# System Architecture: Talent Architecture Engine

## 1. High-Level Architecture

The system follows a microservices-inspired modular monorepo architecture, leveraging Next.js for the frontend and NestJS for the backend, with shared packages for database management and types.

```mermaid
graph TD
    User([User - HR/Manager]) <--> WebApp[Next.js Frontend]
    WebApp <--> APIGateway[NestJS API Gateway / Service]
    
    subgraph Backend Services
        APIGateway --> AuthService[Auth Service]
        APIGateway --> OrgService[Organization Service]
        APIGateway --> JDService[JD Generation Service]
        APIGateway --> WorkflowService[Workflow Engine]
    end
    
    JDService <--> AI[OpenAI / Claude API]
    
    AuthService <--> Redis[(Redis Cache/Session)]
    Backend Services <--> DB[(PostgreSQL - Prisma)]
    
    JDService --> Queue[BullMQ / Redis]
    Queue --> Worker[JD Background Worker]
```

## 2. Core Modules

### Authentication & RBAC
- JWT based authentication with sliding sessions.
- Roles: `SUPER_ADMIN`, `ORG_ADMIN`, `HR_MANAGER`, `HIRING_MANAGER`, `EMPLOYEE`.
- Permissions scoped to organization and department.

### Organization Hierarchy
- Recursive data structure for Departments and Teams.
- Versioned snapshots of organizational structure.
- HRIS sync capabilities.

### AI Job Description Engine
- Prompt engineering for role-specific standardization.
- Context-aware generation using organizational data.
- Collaborative editor (ProseMirror/Tiptap) with real-time sync.

### Workflow & Approvals
- State-machine based approval flows.
- History tracking for every change to a JD.

## 3. Tech Stack Requirements

| Component | Technology |
| :--- | :--- |
| **Frontend** | React 18, Next.js 14, Tailwind CSS, Shadcn/ui |
| **State Management** | Zustand |
| **Data Fetching** | TanStack Query |
| **Backend** | NestJS (Node.js 20+) |
| **ORM** | Prisma |
| **Database** | PostgreSQL |
| **Caching/Queue** | Redis |
| **AI** | OpenAI GPT-4, Anthropic Claude |
| **Infrastructure** | Docker, GitHub Actions |
