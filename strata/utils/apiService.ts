import { Form } from "@/types/common";

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