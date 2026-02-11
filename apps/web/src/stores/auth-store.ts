import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    role: string;
    organizationId: string;
}

interface AuthStore {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    setAuth: (user: User, accessToken: string, refreshToken: string) => void;
    clearAuth: () => void;
    isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            user: null,
            accessToken: null,
            refreshToken: null,
            setAuth: (user, accessToken, refreshToken) => {
                set({ user, accessToken, refreshToken });
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', refreshToken);
            },
            clearAuth: () => {
                set({ user: null, accessToken: null, refreshToken: null });
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
            },
            isAuthenticated: () => {
                return get().accessToken !== null;
            },
        }),
        {
            name: 'auth-storage',
        }
    )
);
