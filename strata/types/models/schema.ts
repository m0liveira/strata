// import { appSchema, tableSchema } from '@nozbe/watermelondb';

// export const mySchema = appSchema({
//     version: 1,
//     tables: [
//         tableSchema({
//             name: 'trip',
//             columns: [
//                 { name: 'banner', type: 'string', isOptional: true },
//                 { name: 'name', type: 'string' },
//                 { name: 'visibility', type: 'string', isOptional: true },
//                 { name: 'start_date', type: 'number', isOptional: true },
//                 { name: 'end_date', type: 'number', isOptional: true },
//                 { name: 'budget_level', type: 'string' },
//                 { name: 'intensity_level', type: 'string' },
//                 { name: 'travel_style', type: 'string' },
//                 { name: 'rating', type: 'number', isOptional: true },
//                 { name: 'created_at', type: 'number' },
//                 { name: 'updated_at', type: 'number' },
//             ]
//         }),
//         tableSchema({
//             name: 'user',
//             columns: [
//                 { name: 'photo', type: 'string', isOptional: true },
//                 { name: 'name', type: 'string' },
//                 { name: 'username', type: 'string', isIndexed: true },
//                 { name: 'email', type: 'string', isIndexed: true },
//             ]
//         }),
//         tableSchema({
//             name: 'trip_members',
//             columns: [
//                 { name: 'user_id', type: 'number', isIndexed: true },
//                 { name: 'trip_id', type: 'string', isIndexed: true },
//                 { name: 'personal_budget', type: 'number', isOptional: true },
//                 { name: 'status', type: 'string' },
//             ]
//         }),
//         tableSchema({
//             name: 'destination',
//             columns: [
//                 { name: 'trip_id', type: 'string', isIndexed: true },
//                 { name: 'destination', type: 'string' },
//                 { name: 'created_at', type: 'number' },
//                 { name: 'updated_at', type: 'number' },
//             ]
//         }),
//         tableSchema({
//             name: 'location',
//             columns: [
//                 { name: 'trip_id', type: 'string', isIndexed: true },
//                 { name: 'name', type: 'string' },
//                 { name: 'scheduled_time', type: 'number', isOptional: true },
//                 { name: 'day', type: 'number' },
//                 { name: 'ticket_url', type: 'string', isOptional: true },
//                 { name: 'created_at', type: 'number' },
//                 { name: 'updated_at', type: 'number' },
//             ]
//         }),
//         tableSchema({
//             name: 'expense',
//             columns: [
//                 { name: 'trip_id', type: 'string', isIndexed: true },
//                 { name: 'user_id', type: 'number', isIndexed: true },
//                 { name: 'type', type: 'string' },
//                 { name: 'amount', type: 'number' },
//                 { name: 'created_at', type: 'number' },
//                 { name: 'updated_at', type: 'number' },
//             ]
//         }),
//         tableSchema({
//             name: 'chat',
//             columns: [
//                 { name: 'trip_id', type: 'string', isIndexed: true },
//                 { name: 'created_at', type: 'number' },
//                 { name: 'updated_at', type: 'number' },
//             ]
//         }),
//         tableSchema({
//             name: 'message',
//             columns: [
//                 { name: 'user_id', type: 'number', isIndexed: true },
//                 { name: 'chat_id', type: 'string', isIndexed: true },
//                 { name: 'message', type: 'string' },
//                 { name: 'created_at', type: 'number' },
//                 { name: 'updated_at', type: 'number' },
//             ]
//         }),
//     ]
// });