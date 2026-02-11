export type Role = 'SUPER_ADMIN' | 'ORG_ADMIN' | 'HR_MANAGER' | 'HIRING_MANAGER' | 'EMPLOYEE';

export type JDStatus = 'DRAFT' | 'IN_REVIEW' | 'APPROVED' | 'PUBLISHED' | 'ARCHIVED';

export interface User {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    role: Role;
    organizationId: string;
}
