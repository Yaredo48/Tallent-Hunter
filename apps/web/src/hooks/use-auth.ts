import apiClient from '@/lib/api-client';
import { useAuthStore } from '@/stores/auth-store';
import { useMutation } from '@tanstack/react-query';

interface LoginCredentials {
    email: string;
    password: string;
}

interface RegisterData extends LoginCredentials {
    firstName?: string;
    lastName?: string;
    organizationId: string;
}

export function useAuth() {
    const { setAuth, clearAuth } = useAuthStore();

    const loginMutation = useMutation({
        mutationFn: async (credentials: LoginCredentials) => {
            const response = await apiClient.post('/auth/login', credentials);
            return response.data;
        },
        onSuccess: (data) => {
            setAuth(data.user, data.accessToken, data.refreshToken);
        },
    });

    const registerMutation = useMutation({
        mutationFn: async (data: RegisterData) => {
            const response = await apiClient.post('/auth/register', data);
            return response.data;
        },
        onSuccess: (data) => {
            setAuth(data.user, data.accessToken, data.refreshToken);
        },
    });

    const logout = () => {
        clearAuth();
    };

    return {
        login: loginMutation.mutate,
        register: registerMutation.mutate,
        logout,
        isLoggingIn: loginMutation.isPending,
        isRegistering: registerMutation.isPending,
        loginError: loginMutation.error,
        registerError: registerMutation.error,
    };
}
