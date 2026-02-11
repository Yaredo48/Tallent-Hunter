'use client';

import { useEffect, useState } from 'react';
import { useSocket } from '@/components/providers/socket-provider';
import { useAuthStore } from '@/stores/auth-store';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

interface UserPresence {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
}

interface PresenceListProps {
    roomId: string;
}

export function PresenceList({ roomId }: PresenceListProps) {
    const { socket, isConnected } = useSocket();
    const { user } = useAuthStore();
    const [activeUsers, setActiveUsers] = useState<UserPresence[]>([]);

    useEffect(() => {
        if (!socket || !isConnected || !user) return;

        // Join the room
        socket.emit('joinRoom', {
            roomId,
            user: {
                userId: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
            },
        });

        // Listen for updates
        socket.on('presenceUpdate', (users: UserPresence[]) => {
            setActiveUsers(users);
        });

        return () => {
            socket.emit('leaveRoom');
            socket.off('presenceUpdate');
        };
    }, [socket, isConnected, roomId, user]);

    if (activeUsers.length <= 1) return null;

    return (
        <div className="flex items-center -space-x-2">
            <TooltipProvider>
                {activeUsers.map((u) => (
                    <Tooltip key={u.userId}>
                        <TooltipTrigger asChild>
                            <Avatar className="h-8 w-8 border-2 border-background ring-2 ring-primary/10 transition-transform hover:scale-110 cursor-default">
                                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-[10px]">
                                    {u.firstName[0]}{u.lastName[0]}
                                </AvatarFallback>
                            </Avatar>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p className="text-xs">{u.firstName} {u.lastName} {u.userId === user?.id && '(You)'}</p>
                        </TooltipContent>
                    </Tooltip>
                ))}
                <div className="ml-3 text-xs text-muted-foreground animate-pulse flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                    {activeUsers.length - 1} other{activeUsers.length - 1 !== 1 && 's'} viewing
                </div>
            </TooltipProvider>
        </div>
    );
}
