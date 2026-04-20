// import { database } from '@/types/models/database';
// import DestinationModel from '@/types/models/destination-model';
// import TripMemberModel from '@/types/models/trip-members-model';
// import TripModel from '@/types/models/trip-model';
// import { user } from './userService';

// // #TODO: Add CreateTrip Type to formData
// export const createTrip = async (formData: any) => {
//     try {
//         if (database) {
//             const db = database;
//             await db.write(async () => {
//                 const newTrip = await db.get<TripModel>('trip').create((trip) => {
//                     trip.name = formData.name;
//                     trip.banner = formData.banner;
//                     trip.visibility = formData.visibility || 'PRIVATE';
//                     trip.start_date = formData.start_date;
//                     trip.end_date = formData.end_date;
//                     trip.budget_level = formData.budget_level;
//                     trip.intensity_level = formData.intensity_level;
//                     trip.travel_style = formData.travel_style;
//                 });

//                 const memberBatch = [
//                     db.get<TripMemberModel>('trip_members').prepareCreate((member) => {
//                         member.trip_id = newTrip.id;
//                         member.user_id = user.user_id!;
//                         member.status = 'ACCEPTED';
//                     }),
//                     ...formData.selectedUsers.map((userId: number) =>
//                         db.get<TripMemberModel>('trip_members').prepareCreate((member) => {
//                             member.trip_id = newTrip.id;
//                             member.user_id = userId;
//                             member.status = 'PENDING';
//                         })
//                     )
//                 ];

//                 const destinationBatch = formData.destinations.map((destName: string) =>
//                     db.get<DestinationModel>('destination').prepareCreate((dest) => {
//                         dest.trip_id = newTrip.id;
//                         dest.destination = destName;
//                     })
//                 );

//                 await db.batch(...memberBatch, ...destinationBatch);
//             });
//         }
//     } catch (error) {
//         console.error("Error while saving locally:", error);
//         throw error;
//     }
// };

// NOTE: This file is currently out of use untill application build is stable and we can test the local database functionality. The code is not deleted to avoid losing the work done on it and to make it easier to integrate once ready to use.