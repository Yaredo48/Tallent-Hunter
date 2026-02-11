import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export function useTemplates() {
    const queryClient = useQueryClient();

    const getTemplates = useQuery({
        queryKey: ['templates'],
        queryFn: async () => {
            const { data } = await axios.get(`${API_URL}/templates`, {
                withCredentials: true,
            });
            return data;
        },
    });

    const createTemplate = useMutation({
        mutationFn: async (data: { name: string; content: any }) => {
            const { data: response } = await axios.post(`${API_URL}/templates`, data, {
                withCredentials: true,
            });
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['templates'] });
            toast.success('Template created successfully');
        },
    });

    const updateTemplate = useMutation({
        mutationFn: async ({ id, data }: { id: string; data: { name?: string; content?: any } }) => {
            const { data: response } = await axios.put(`${API_URL}/templates/${id}`, data, {
                withCredentials: true,
            });
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['templates'] });
            toast.success('Template updated successfully');
        },
    });

    const deleteTemplate = useMutation({
        mutationFn: async (id: string) => {
            await axios.delete(`${API_URL}/templates/${id}`, {
                withCredentials: true,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['templates'] });
            toast.success('Template deleted');
        },
    });

    return {
        getTemplates,
        createTemplate,
        updateTemplate,
        deleteTemplate,
    };
}
