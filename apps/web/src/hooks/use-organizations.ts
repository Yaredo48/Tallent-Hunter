import apiClient from '@/lib/api-client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useOrganizations() {
    return useQuery({
        queryKey: ['organizations'],
        queryFn: async () => {
            const response = await apiClient.get('/organizations');
            return response.data;
        },
    });
}

export function useOrganization(id: string) {
    return useQuery({
        queryKey: ['organizations', id],
        queryFn: async () => {
            const response = await apiClient.get(`/organizations/${id}`);
            return response.data;
        },
        enabled: !!id,
    });
}

export function useDepartments(orgId: string) {
    return useQuery({
        queryKey: ['organizations', orgId, 'departments'],
        queryFn: async () => {
            const response = await apiClient.get(`/organizations/${orgId}/departments`);
            return response.data;
        },
        enabled: !!orgId,
    });
}

export function useCreateDepartment(orgId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: { name: string; parentId?: string }) => {
            const response = await apiClient.post(`/organizations/${orgId}/departments`, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['organizations', orgId, 'departments'] });
        },
    });
}

export function useUpdateDepartment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: { name?: string; parentId?: string } }) => {
            const response = await apiClient.put(`/organizations/departments/${id}`, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['organizations'] });
        },
    });
}

export function useDeleteDepartment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const response = await apiClient.delete(`/organizations/departments/${id}`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['organizations'] });
        },
    });
}

export function useUpdateOrganization() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: { name?: string; logoUrl?: string } }) => {
            const response = await apiClient.patch(`/organizations/${id}`, data);
            return response.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['organizations', data.id] });
            queryClient.invalidateQueries({ queryKey: ['organizations'] });
        },
    });
}
