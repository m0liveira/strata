// import { Database } from '@nozbe/watermelondb';
// import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
// import { Platform } from 'react-native';
// import { mySchema } from './schema';
// import TripModel from './trip-model';
// import UserModel from './user-model';
// import TripMemberModel from './trip-members-model';
// import DestinationModel from './destination-model';
// import LocationModel from './location-model';
// import ExpenseModel from './expense-model';
// import ChatModel from './chat-model';
// import MessageModel from './message-model';

// const isExpoGo = typeof (global as any).expo !== 'undefined';

// const adapter = new SQLiteAdapter({
//     schema: mySchema,
//     jsi: false,
//     onSetUpError: error => {
//         console.error('Error configuring database:', error);
//     }
// });

// export const database = !isExpoGo ? new Database({
//     adapter,
//     modelClasses: [
//         TripModel,
//         UserModel,
//         TripMemberModel,
//         DestinationModel,
//         LocationModel,
//         ExpenseModel,
//         ChatModel,
//         MessageModel,
//     ],
// }) : null;