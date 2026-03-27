type User = {
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
}

export const user: User = {
    access_token: '',
    user_id: null,
    username: '',
    email: '',
    name: '',
    photo: '',
    pending_friends: [],
    friends: [],
    following: [],
    followers: [],
    trips: []
}