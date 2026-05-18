import { User } from "@/types/models/user-model";
import * as SecureStore from "expo-secure-store";

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
    trips: [],
    friends_profiles: [],
}

export const logout = async () => {
    await SecureStore.deleteItemAsync("strata_user_token");

    user.access_token = '';
    user.user_id = null;
    user.username = '';
    user.email = '';
    user.name = '';
    user.photo = '';
    user.pending_friends = [];
    user.friends = [];
    user.following = [];
    user.followers = [];
    user.trips = [];
    user.friends_profiles = [];
};