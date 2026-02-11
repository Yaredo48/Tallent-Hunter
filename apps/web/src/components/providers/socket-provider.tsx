'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/stores/auth-store';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

interface SocketContextType {
    socket: Socket | null;
    isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const { user } = useAuthStore();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!user) return;

        const socketInstance = io(SOCKET_URL, {
            transports: ['websocket'],
        });

        socketInstance.on('connect', () => {
            setIsConnected(true);
            console.log('Connected to socket server');
        });

        socketInstance.on('disconnect', () => {
            setIsConnected(false);
            console.log('Disconnected from socket server');
        });

        socketInstance.on('workflowAction', (data) => {
            console.log('Workflow notification received:', data);

            // Invalidate queries to refresh UI
            queryClient.invalidateQueries({ queryKey: ['job-description', data.workflowId] });
            queryClient.invalidateQueries({ queryKey: ['job-descriptions'] });

            // Show toast if the current user isn't the one who triggered it (conceptually)
            // Or just show it for important updates
            toast.info('Workflow Update', {
                description: `Status changed to ${data.status.replace('_', ' ')}`,
            });
        });

        setSocket(socketInstance);

        return () => {
            socketInstance.disconnect();
        };
    }, [user, queryClient]);

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
};
