import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { env } from '../config/env';


interface SocketContextData {
    socket: Socket | null;
    isConnected: boolean;
    emit: (event: string, data?: any) => void;
}

const SocketContext = createContext<SocketContextData | undefined>(undefined);

export const SocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        // Removed unused existingSocket

        // If we already have a socket and token hasn't changed (simplified check), just return
        // Ideally we check if token changed. For now, assume mounting logic.

        let newSocket: Socket | null = null;

        if (token) {
            newSocket = io(env.VITE_API_BASE_URL?.replace('/api', ''), {
                auth: { token },
                autoConnect: true,
                withCredentials: true
            });

            newSocket.on('connect', () => {
                console.log('Socket connected');
                setIsConnected(true);
            });

            newSocket.on('disconnect', () => {
                console.log('Socket disconnected');
                setIsConnected(false);
            });

            newSocket.on('connect_error', (err) => {
                console.error('Socket connection error:', err);
                setIsConnected(false);
            });

            setSocket(newSocket);
        }

        return () => {
            if (newSocket) {
                newSocket.disconnect();
            }
        };
    }, []); // Run once on mount (reload required for token change for now, or use a complex auth listener)

    const emit = (event: string, data?: any) => {
        if (socket) {
            socket.emit(event, data);
        }
    };

    return (
        <SocketContext.Provider value={{ socket, isConnected, emit }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (context === undefined) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
};
