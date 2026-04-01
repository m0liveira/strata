import { Form } from "@/types/common";
import { user } from "./userService";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const registerUser = async (form: Form) => {
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to register");
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const loginUser = async (form: Form) => {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to login");
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const getUserData = async () => {
    try {
        const response = await fetch(`${API_URL}/user/me`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${user.access_token}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to get user data");
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
};