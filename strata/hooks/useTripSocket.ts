import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { user } from "@/utils/userService";

const SOCKET_URL = process.env.EXPO_PUBLIC_WSAPI_URL;

export function useTripSocket(
    tripId?: string,
    onSyncNeeded?: () => void,
    onNewMessage?: (msg: any) => void
) {
    const socketRef = useRef<Socket | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (!tripId) return;

        socketRef.current = io(SOCKET_URL, {
            transports: ["websocket"],
        });

        const socket = socketRef.current;

        socket.on("connect", () => {
            setIsConnected(true);
            socket.emit("joinTrip", { tripId });
        });

        socket.on("newMessage", (messageData) => {
            setMessages((prevMessages) => [...prevMessages, messageData]);
            if (onNewMessage) onNewMessage(messageData);
        });

        socket.on("syncNeeded", (data) => {
            if (data.tripId === tripId && onSyncNeeded) {
                onSyncNeeded();
            }
        });

        socket.on("disconnect", () => {
            setIsConnected(false);
        });

        return () => {
            socket.disconnect();
        };
    }, [tripId]);

    const sendMessage = useCallback((text: string) => {
        if (socketRef.current && text.trim() !== "") {
            socketRef.current.emit("message", { tripId, message: text });
        }
    }, [tripId]);

    return { isConnected, messages, sendMessage, setMessages };
}