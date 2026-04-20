// import { Model } from '@nozbe/watermelondb';
// import { text, field, date, readonly } from '@nozbe/watermelondb/decorators';

// export default class LocationModel extends Model {
//   static table = 'location';

//   @text('trip_id') trip_id!: string;
//   @text('name') name!: string;
//   @date('scheduled_time') scheduled_time?: Date;
//   @field('day') day!: number;
//   @text('ticket_url') ticket_url?: string;

//   @readonly @date('created_at') created_at!: Date;
//   @readonly @date('updated_at') updated_at!: Date;
// }