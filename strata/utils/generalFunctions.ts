import { Linking, Platform } from "react-native";

export const getMidnight = (date: Date | string | number = new Date()) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
};

export const getDayLabel = (locationDate: Date, todayMidnight: Date) => {
    const targetMidnight = getMidnight(locationDate);
    const diffDays = Math.round(
        (targetMidnight.getTime() - todayMidnight.getTime()) /
        (1000 * 60 * 60 * 24),
    );

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    return locationDate.toLocaleDateString("pt-PT", {
        day: "2-digit",
        month: "short",
    });
};

export const getTimeUntil = (scheduledTime: string | null) => {
    if (!scheduledTime) return "TBD";

    const diff = new Date(scheduledTime).getTime() - Date.now();
    if (diff < 0) return "Passed";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `In ${days}d`;
    if (hours > 0) return `In ${hours}:${mins.toString().padStart(2, "0")}`;
    return `In ${mins}m`;
};

export const openMapRoute = (locations: any[]) => {
    if (locations.length < 2) return;

    const sortedLocations = locations.sort((a, b) => a.day - b.day);

    const origin = encodeURIComponent(sortedLocations[0].name);
    const destination = encodeURIComponent(sortedLocations[sortedLocations.length - 1].name);

    const waypoints = sortedLocations.slice(1, -1).map(loc => encodeURIComponent(loc.name)).join('|');

    const url = Platform.select({
        ios: `maps://?saddr=${origin}&daddr=${destination}`,
        android: `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&waypoints=${waypoints}`
    });

    if (url) Linking.openURL(url);
};