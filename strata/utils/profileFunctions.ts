import AsyncStorage from "@react-native-async-storage/async-storage";
import { user } from "./userService";

export const getWorldCompletion = async (tripsData: any[]) => {
    try {
        const cachedCountriesData = await AsyncStorage.getItem("countries_data");

        const countries = cachedCountriesData
            ? JSON.parse(cachedCountriesData)
            : [];

        const totalCountries = countries.length > 0 ? countries.length : 195;

        const visitedCountries = new Set();

        tripsData.forEach((trip) => {
            if (trip.destinations && Array.isArray(trip.destinations)) {
                trip.destinations.forEach((dest: any) => {
                    const destName =
                        typeof dest === "string" ? dest : dest?.destination;

                    if (destName) {
                        const destLower = destName.toLowerCase();

                        const matchedCountry = countries.find(
                            (c: any) =>
                                c.country.toLowerCase() === destLower ||
                                (c.cities &&
                                    c.cities.some(
                                        (city: string) => city.toLowerCase() === destLower,
                                    )),
                        );

                        if (matchedCountry) {
                            visitedCountries.add(matchedCountry.iso3);
                        }
                    }
                });
            }
        });

        const percentage = (visitedCountries.size / totalCountries) * 100;
        return parseFloat(percentage.toFixed(2));
    } catch (error) {
        console.error("Error calculating world completion:", error);
        return 0;
    }
};

export const getSharedTripsData = (tripsData: any[]) => {
    let totalShared: number = 0;
    let totalRating: number = 0.0;
    let sharedTrips: any[] = [];

    tripsData.forEach((trip) => {
        if (trip.visibility.toLowerCase() !== "private") {
            totalShared += 1;
            sharedTrips.push(trip);

            if (trip.rating) {
                totalRating += trip.rating;
            }
        }
    });

    let averageRating =
        totalShared > 0 ? Math.min(totalRating / totalShared, 5) : 0;

    return { totalShared, averageRating, sharedTrips };
};

export const getDaysAbroad = (tripsData: any[]) => {
    let totalDays = 0;

    tripsData.forEach((trip) => {
        if (trip.start_date && trip.end_date) {
            const start = new Date(trip.start_date).getTime();
            const end = new Date(trip.end_date).getTime();

            const diffInDays =
                Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1;

            if (diffInDays > 0) {
                totalDays += diffInDays;
            }
        }
    });

    return totalDays;
};

export const getTravelBuddies = (TripsData: any[]) => {
    const buddiesMap = new Map();

    TripsData.forEach((trip) => {
        if (trip.members && Array.isArray(trip.members)) {
            trip.members.forEach((member: any) => {
                const buddy = member.user;

                if (buddy && buddy.username !== user.username) {
                    if (buddiesMap.has(buddy.username)) {
                        buddiesMap.get(buddy.username).tripsShared += 1;
                    } else {
                        buddiesMap.set(buddy.username, {
                            ...buddy,
                            tripsShared: 1,
                        });
                    }
                }
            });
        }
    });

    return Array.from(buddiesMap.values())
        .sort((a, b) => b.tripsShared - a.tripsShared)
        .slice(0, 4);
};