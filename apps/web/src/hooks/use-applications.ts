import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export function useApplications() {
    const queryClient = useQueryClient();

    const getApplications = useQuery({
        queryKey: ['applications'],
        queryFn: async () => {
            const { data } = await axios.get(`${API_URL}/applications`, {
                withCredentials: true,
            });
            return data;
        },
    });

    const updateStatus = useMutation({
        mutationFn: async ({ id, status }: { id: string; status: string }) => {
            const { data } = await axios.patch(
                `${API_URL}/applications/${id}/status`,
                { status },
                { withCredentials: true }
            );
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['applications'] });
            toast.success('Status updated successfully');
        },
        onError: (error: any) => {
            toast.error('Failed to update status', {
                description: error.response?.data?.message || 'Unknown error',
            });
        },
    });

    const screenApplication = useMutation({
        mutationFn: async (id: string) => {
            const { data } = await axios.post(
                `${API_URL}/applications/${id}/screen`,
                {},
                { withCredentials: true }
            );
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['applications'] });
            toast.success('AI Screening completed');
        },
        onError: (error: any) => {
            toast.error('AI Screening failed', {
                description: error.response?.data?.message || 'Unknown error',
            });
        },
    });

    return {
        getApplications,
        updateStatus,
        screenApplication,
    };
}
