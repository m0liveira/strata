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
}

export type PublicUser = {
    user_id: number;
    username: string;
    name: string;
    photo: string;
}