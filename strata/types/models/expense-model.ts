// import { Model } from '@nozbe/watermelondb';
// import { text, field, readonly, date } from '@nozbe/watermelondb/decorators';

// export default class ExpenseModel extends Model {
//   static table = 'expense';

//   @text('trip_id') trip_id!: string;
//   @field('user_id') user_id!: number;
//   @text('type') type!: string;
//   @field('amount') amount!: number;

//   @readonly @date('created_at') created_at!: Date;
//   @readonly @date('updated_at') updated_at!: Date;
// }