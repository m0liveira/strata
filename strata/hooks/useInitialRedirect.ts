import { useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";

export const useInitialRedirect = () => {
    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const token = await SecureStore.getItemAsync("jwt_token");

                if (token) {
                    // TODO: Fetch user data from API here...
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