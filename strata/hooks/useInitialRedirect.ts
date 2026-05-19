import { useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { getPendingFriends, getPendingTrips, getUserData } from "@/utils/StrataApiService";
import { user } from "@/utils/userService";
import { countryData, getFullCountriesData } from "@/utils/countriesApiService";

export const useInitialRedirect = () => {
    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const token = await SecureStore.getItemAsync("strata_user_token");

                if (!token) { router.replace("/pages/get-started"); }

                user.access_token = token as string;

                // #TODO: Implement new changes to data fetching and caching logic to the login and register flow.
                // #NOTE: Implement this new logic in a service file or utility file

                const [userData, pendingFriends, pendingTrips] = await Promise.all([
                    getUserData(),
                    getPendingFriends(),
                    getPendingTrips(),
                ]);

                Object.assign(user, {
                    ...userData,
                    pending_trips: pendingTrips,
                    pending_friends: pendingFriends.filter(
                        (friend: any) => friend.receiver_id === userData.user_id),
                });

                const cachedCountriesData = await AsyncStorage.getItem("countries_data");

                if (!cachedCountriesData) {
                    const countriesData = await getFullCountriesData();
                    countryData.countries = countriesData;
                    await AsyncStorage.setItem("countries_data", JSON.stringify(countriesData));
                } else {
                    countryData.countries = JSON.parse(cachedCountriesData);
                }

                router.replace("/(tabs)/dashboard");
            } catch (error) {
                console.error("Redirection error:", error);
                // TODO: Redirect to error page or show a toast notification here...
            } finally {
                // TODO: Hide splash screen here...
            }
        };

        checkAuthStatus();
    }, []);

    return {};
};