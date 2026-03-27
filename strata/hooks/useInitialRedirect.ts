import { useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import { getUserData } from "@/utils/apiService";
import { user } from "@/utils/userService";

export const useInitialRedirect = () => {
    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const token = await SecureStore.getItemAsync("strata_user_token");

                if (token) {
                    user.access_token = token;

                    try {
                        const userData = await getUserData();
                        Object.assign(user, userData);
                    } catch (error: any) {
                        throw new Error(error);
                    }

                    router.replace("/(tabs)/home");
                } else {
                    router.replace("/pages/get-started");
                }
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