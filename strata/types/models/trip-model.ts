// import { Model } from '@nozbe/watermelondb';
// import { text, field, date, readonly } from '@nozbe/watermelondb/decorators';

// export default class TripModel extends Model {
//     static table = 'trip';

//     @text('banner') banner!: string;
//     @text('name') name!: string;
//     @text('visibility') visibility!: string;
//     @date('start_date') start_date?: Date;
//     @date('end_date') end_date?: Date;
//     @text('budget_level') budget_level!: string;
//     @text('intensity_level') intensity_level!: string;
//     @text('travel_style') travel_style!: string;
//     @field('rating') rating?: number;

//     @readonly @date('created_at') created_at?: Date;
//     @readonly @date('updated_at') updated_at?: Date;
// }

export type Trip = {
    trip_id: string;
    banner: string;
    name: string;
    visibility: string;
    start_date: string;
    end_date: string;
    budget_level: string;
    intensity_level: string;
    travel_style: string;
    rating?: number;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string;
}