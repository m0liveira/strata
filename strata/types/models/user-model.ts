// import { Model } from '@nozbe/watermelondb';
// import { text } from '@nozbe/watermelondb/decorators';

export type User = {
    access_token: string;
    user_id: number | null;
    username: string;
    email: string;
    name: string;
    photo: string;
    pending_friends: number[];
    friends: number[];
    following: number[];
    followers: number[];
    trips: any[];
    friends_profiles?: PublicUser[],
    pending_trips: any[],
}

export type PublicUser = {
    user_id: number;
    username: string;
    name: string;
    photo: string;
}

// export default class UserModel extends Model {
//     static table = 'user';

//     @text('photo') photo?: string;
//     @text('name') name!: string;
//     @text('username') username!: string;
//     @text('email') email!: string;
// }