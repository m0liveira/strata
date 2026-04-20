// import { useEffect, useCallback } from 'react';
// import { io, Socket } from 'socket.io-client';
// import { database } from '@/types/models/database';
// import MessageModel from '@/types/models/message-model';
// import { syncDatabase } from '@/utils/StrataApiService';
// import { user } from '@/utils/userService';

// let socket: Socket;

// export function useTripSocket(tripId?: string) {
//     useEffect(() => {
//         socket = io(process.env.EXPO_PUBLIC_WSAPI_URL, {
//             auth: { token: user.access_token }
//         });

//         if (tripId) {
//             socket.emit('joinTrip', { tripId });
//         }

//         socket.on('syncNeeded', async (data) => {
//             if (!data.tripId || data.tripId === tripId) {
//                 await syncDatabase();
//             }
//         });

//         socket.on('newMessage', async (data) => {
//             if (database) {
//                 const db = database;
//                 await db.write(async () => {
//                     await db.get<MessageModel>('message').create((msg) => {
//                         msg._raw.id = data.message_id;
//                         msg.user_id = data.user_id;
//                         msg.chat_id = data.chat_id;
//                         msg.message = data.message;
//                     });
//                 });
//             }
//         });

//         return () => {
//             socket.disconnect();
//         };
//     }, [tripId]);

//     const sendMessage = useCallback((text: string) => {
//         if (socket && tripId) {
//             socket.emit('message', { tripId, message: text });
//         }
//     }, [tripId]);

//     return { sendMessage };
// }