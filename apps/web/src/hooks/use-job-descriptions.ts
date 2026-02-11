import apiClient from '@/lib/api-client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useJobDescriptions(orgId: string) {
    return useQuery({
        queryKey: ['job-descriptions', 'organization', orgId],
        queryFn: async () => {
            const response = await apiClient.get(`/job-descriptions/organization/${orgId}`);
            return response.data;
        },
        enabled: !!orgId,
    });
}

export function useJobDescription(id: string) {
    return useQuery({
        queryKey: ['job-descriptions', id],
        queryFn: async () => {
            const response = await apiClient.get(`/job-descriptions/${id}`);
            return response.data;
        },
        enabled: !!id,
    });
}

export function useCreateJobDescription() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: {
            title: string;
            content: any;
            organizationId: string;
            departmentId: string;
            templateId?: string;
            managerId?: string;
        }) => {
            const response = await apiClient.post('/job-descriptions', data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['job-descriptions'] });
        },
    });
}

export function useGenerateJobDescription() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: {
            title: string;
            departmentId: string;
            organizationId: string;
            templateId?: string;
        }) => {
            const response = await apiClient.post('/job-descriptions/generate', data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['job-descriptions'] });
        },
    });
}

export function useUpdateJobDescription() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: {
            id: string;
            data: { title?: string; content?: any; status?: string; managerId?: string };
        }) => {
            const response = await apiClient.put(`/job-descriptions/${id}`, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['job-descriptions'] });
        },
    });
}

export function useDeleteJobDescription() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const response = await apiClient.delete(`/job-descriptions/${id}`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['job-descriptions'] });
        },
    });
}

export function useSuggestContent() {
    return useMutation({
        mutationFn: async (data: { jobTitle: string; section: string; context?: string }) => {
            const response = await apiClient.post('/job-descriptions/ai/suggest', data);
            return response.data;
        },
    });
}

export function useRewriteContent() {
    return useMutation({
        mutationFn: async (data: { content: string; tone?: string }) => {
            const response = await apiClient.post('/job-descriptions/ai/rewrite', data);
            return response.data;
        },
    });
}

export function useSimilarJobDescriptions(id: string) {
    return useQuery({
        queryKey: ['job-descriptions', id, 'similar'],
        queryFn: async () => {
            const response = await apiClient.get(`/job-descriptions/${id}/similar`);
            return response.data;
        },
        enabled: !!id,
    });
}

export function useCandidateRecommendations(id: string) {
    return useQuery({
        queryKey: ['job-descriptions', id, 'recommendations'],
        queryFn: async () => {
            const response = await apiClient.get(`/job-descriptions/${id}/recommendations`);
            return response.data;
        },
        enabled: !!id,
    });
}
