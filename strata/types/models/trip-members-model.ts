// import { Model } from '@nozbe/watermelondb';
// import { text, field, relation } from '@nozbe/watermelondb/decorators';

// export default class TripMemberModel extends Model {
//   static table = 'trip_members';

//   @field('user_id') user_id!: number;
//   @text('trip_id') trip_id!: string;
//   @field('personal_budget') personal_budget?: number;
//   @text('status') status!: string;

//   @relation('trips', 'trip_id') trip!: any;
// }