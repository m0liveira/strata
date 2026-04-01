import { StyleSheet } from "react-native";
import { BorderRadius, Colors, Typography } from "@/constants/global-styles";

export const styles = StyleSheet.create({
    container: {
        width: "100%",
    },
    suggestionsContainer: {
        backgroundColor: Colors.grey100,
        borderColor: Colors.grey200,
        borderWidth: 1,
        borderRadius: BorderRadius.md,
        marginTop: 12,
    },
    suggestionItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 24,
        paddingVertical: 12,
        gap: 24,
    },
    suggestionText: {
        ...Typography.bodyL,
        color: Colors.grey600,
    },
    flag: {
        width: 24,
        height: 16,
        borderRadius: 2,
    },
    icon:{
        width: 24,
        height: 24,
    },
    badgeWrapper: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 12,
        marginTop: 24,
    },
    badge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Colors.coral100,
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: BorderRadius.full,
        gap: 8,
        borderColor: Colors.coral200,
        borderWidth: 1,
    },
    badgeText: {
        ...Typography.labelS,
        color: Colors.coral900,
    },
    badgeIcon:{
        width: 16,
        height: 16,
    }
});