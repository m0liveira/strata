// import { synchronize } from '@nozbe/watermelondb/sync';
// import { database } from '@/types/models/database';
import { File, Paths } from 'expo-file-system';
import { isAvailableAsync, shareAsync } from 'expo-sharing';
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

export const getUsersData = async (ids: number[] | number) => {
    if ((Array.isArray(ids) && ids.length === 0) || (!Array.isArray(ids) && typeof ids !== "number")) {
        return [];
    }

    try {
        const response = await fetch(`${API_URL}/user/id/${Array.isArray(ids) ? ids.join(',') : ids}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${user.access_token}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to get users data");
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const inviteToTrip = async (tripId: string, userId: number) => {
    try {
        const response = await fetch(`${API_URL}/trip-members/${tripId}/invite/${userId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${user.access_token}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to invite user to trip");
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const getTripByID = async (tripId: string) => {
    try {
        const response = await fetch(`${API_URL}/trips/${tripId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${user.access_token}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to get trip");
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
};

type TicketData = {
    uri: string;
    fileName: string;
    mimeType: string;
};

export const uploadTicketToSupabase = async (ticketData: TicketData, bucket: string) => {
    const formData = new FormData();

    formData.append('file', {
        uri: ticketData.uri,
        name: ticketData.fileName,
        type: ticketData.mimeType || 'application/octet-stream',
    } as any);

    formData.append('bucket', bucket);

    try {
        const response = await fetch(`${API_URL}/supabase/upload`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${user.access_token}`,
            },
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to upload ticket");
        }

        const data = await response.json();

        return data.url;
    } catch (error) {
        throw error;
    }
};

export const uploadImageToSupabase = async (imageUri: string, bucket: string) => {
    const filename = imageUri.split('/').pop() || `image-${Date.now()}.jpg`;
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image/jpeg`;

    const formData = new FormData();

    formData.append('file', {
        uri: imageUri,
        name: filename,
        type: type,
    } as any);

    formData.append('bucket', bucket);

    try {
        const response = await fetch(`${API_URL}/supabase/upload`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${user.access_token}`,
            },
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to upload image");
        }

        const data = await response.json();

        return data.url;
    } catch (error) {
        throw error;
    }
};

export const deleteImageFromSupabase = async (imageUri: string, bucket: string) => {
    try {
        const safeUrl = encodeURIComponent(imageUri);
        const safeBucket = encodeURIComponent(bucket);

        const response = await fetch(`${API_URL}/supabase/delete?url=${safeUrl}&bucket=${safeBucket}`, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${user.access_token}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to delete image");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
};

/**  @param lastPulledAt Last pull timestamp (0 to get everything). */
export const pullChanges = async (lastPulledAt: number = 0) => {
    try {
        const response = await fetch(`${API_URL}/sync/pull?lastPulledAt=${lastPulledAt}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.access_token}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`Pull Error: ${errorData}`);
        }

        const data = await response.json();

        return {
            changes: data.changes,
            timestamp: data.timestamp
        };
    } catch (error) {
        console.error("Error pulling changes:", error);
        throw error;
    }
};

/** @param changes The object with the changes (e.g., { trips: { created: [...] }, expenses: { updated: [...] } }) */
export const pushChanges = async (changes: any) => {
    const lastPulledAt = Math.floor(Date.now() / 1000);

    const payload = {
        lastPulledAt,
        changes
    };

    try {
        const response = await fetch(`${API_URL}/sync/push`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.access_token}`,
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`Push Error: ${errorData}`);
        }

        return true;
    } catch (error) {
        console.error("Error pushing changes:", error);
        throw error;
    }
};

export const ExportTrip = async (tripId: string) => {
    try {
        const url = `${API_URL}/trips/${tripId}/pdf`;

        const fileName = `strata-itinerary-${Date.now()}.pdf`;
        const file = new File(Paths.document, fileName);

        await File.downloadFileAsync(url, file, {
            headers: {
                'Authorization': `Bearer ${user.access_token}`,
            },
        });

        const canShare = await isAvailableAsync();
        if (canShare) {
            await shareAsync(file.uri, {
                mimeType: 'application/pdf',
                dialogTitle: 'Save your trip itinerary',
            });
        }

        return file.uri;
    } catch (error) {
        console.error("Download error:", error);
        throw error;
    }
};

// #NOTE: Uncomment and implement when ready to use WatermelonDB synchronization with the backend API
// export const syncDatabase = async () => {
// const token = user.access_token;

// await synchronize({
//     database,
//     pullChanges: async ({ lastPulledAt }) => {
//         const response = await fetch(
//             `${API_URL}/sync/pull?last_pulled_at=${lastPulledAt || 0}`,
//             {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             }
//         );

//         if (!response.ok) {
//             const errorData = await response.text();
//             throw new Error(`Pull Error: ${errorData}`);
//         }

//         const { changes, timestamp } = await response.json();
//         return { changes, timestamp };
//     },
//     pushChanges: async ({ changes, lastPulledAt }) => {
//         const response = await fetch(`${API_URL}/sync/push`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 Authorization: `Bearer ${token}`,
//             },
//             body: JSON.stringify({ changes, lastPulledAt }),
//         });

//         if (!response.ok) {
//             const errorData = await response.text();
//             throw new Error(`Push Error: ${errorData}`);
//         }
//     },
//     sendCreatedAsUpdated: true,
// });
// };