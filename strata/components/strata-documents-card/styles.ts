import { StyleSheet } from 'react-native';
import { Colors, BorderRadius, Typography } from "@/constants/global-styles";

export const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.white,
        borderRadius: BorderRadius.md,
        borderColor: Colors.grey200,
        borderWidth: 1,
        width: '100%',
        overflow: "hidden",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: Colors.blue100,
        paddingHorizontal: 20,
        paddingVertical: 12,
    },
    title: {
        ...Typography.h2,
        color: Colors.primaryDark,
    },
    headerButton: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.white40,
        borderRadius: BorderRadius.full,
        aspectRatio: 1,
        width: 32,
        height: 32,
    },
    iconSmall: {
        aspectRatio: 1,
        width: 36,
        transform: [{ rotate: "-180deg" }],
    },
    list: {
        paddingHorizontal: 20,
    },
    item: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.grey100,
    },
    itemLast: {
        borderBottomWidth: 0,
    },
    itemText: {
        flex: 1,
        ...Typography.bodyL,
        color: Colors.primaryDark,
        marginHorizontal: 16,
    },
    icon: {
        aspectRatio: 1,
        width: 20
    },
    emptyText: {
        ...Typography.bodyM,
        color: Colors.grey600,
        textAlign: "center",
        paddingVertical: 24,
    },
});