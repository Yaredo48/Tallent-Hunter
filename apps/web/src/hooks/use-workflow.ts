import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Types
export interface ApprovalAction {
    id: string;
    stepId: string;
    action: 'APPROVE' | 'REJECT' | 'REQUEST_CHANGES' | 'COMMENT';
    comment?: string;
    actorId: string;
    actor: {
        firstName: string;
        lastName: string;
        email: string;
    };
    createdAt: string;
}

export interface ApprovalStep {
    id: string;
    workflowId: string;
    order: number;
    approverId: string;
    approver: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
    };
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SKIPPED';
    actions: ApprovalAction[];
    dueDate?: string;
    createdAt: string;
    updatedAt: string;
}

export interface ApprovalWorkflow {
    id: string;
    jobDescriptionId: string;
    status: 'PENDING' | 'IN_PROGRESS' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
    currentStepOrder: number;
    steps: ApprovalStep[];
    jobDescription?: any;
    createdAt: string;
    updatedAt: string;
}

export const useWorkflow = (jobDescriptionId?: string) => {
    const queryClient = useQueryClient();

    const getWorkflow = useQuery({
        queryKey: ['workflow', jobDescriptionId],
        queryFn: async () => {
            if (!jobDescriptionId) return null;
            const { data } = await axios.get(`${API_URL}/workflows/job-description/${jobDescriptionId}`, {
                withCredentials: true,
            });
            return data as ApprovalWorkflow;
        },
        enabled: !!jobDescriptionId,
    });

    const getPendingApprovals = useQuery({
        queryKey: ['pending-approvals'],
        queryFn: async () => {
            const { data } = await axios.get(`${API_URL}/workflows/pending`, {
                withCredentials: true,
            });
            return data as ApprovalWorkflow[];
        },
    });

    const createWorkflow = useMutation({
        mutationFn: async (params: { jobDescriptionId: string; approverIds: string[] }) => {
            const { data } = await axios.post(`${API_URL}/workflows`, params, {
                withCredentials: true,
            });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['workflow'] });
            queryClient.invalidateQueries({ queryKey: ['job-descriptions'] });
        },
    });

    const approveStep = useMutation({
        mutationFn: async ({ workflowId, comment }: { workflowId: string; comment: string }) => {
            const { data } = await axios.post(`${API_URL}/workflows/${workflowId}/approve`, { comment }, {
                withCredentials: true,
            });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['workflow'] });
            queryClient.invalidateQueries({ queryKey: ['pending-approvals'] });
        },
    });

    const rejectStep = useMutation({
        mutationFn: async ({ workflowId, comment }: { workflowId: string; comment: string }) => {
            const { data } = await axios.post(`${API_URL}/workflows/${workflowId}/reject`, { comment }, {
                withCredentials: true,
            });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['workflow'] });
            queryClient.invalidateQueries({ queryKey: ['pending-approvals'] });
        },
    });

    const requestChanges = useMutation({
        mutationFn: async ({ workflowId, comment }: { workflowId: string; comment: string }) => {
            const { data } = await axios.post(`${API_URL}/workflows/${workflowId}/request-changes`, { comment }, {
                withCredentials: true,
            });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['workflow'] });
            queryClient.invalidateQueries({ queryKey: ['pending-approvals'] });
        },
    });

    return {
        getWorkflow,
        getPendingApprovals,
        createWorkflow,
        approveStep,
        rejectStep,
        requestChanges,
    };
};
