import { StyleSheet } from 'react-native';
import { Colors, BorderRadius, Typography } from "@/constants/global-styles";

export const styles = StyleSheet.create({
    card: {
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        flexDirection: 'column',
        flexWrap: 'nowrap',
        backgroundColor: Colors.white,
        borderColor: Colors.grey200,
        borderWidth: 1,
        borderRadius: BorderRadius.md,
        width: '100%',
        overflow: 'hidden'
    },
    imageContainer: {
        width: '100%',
        height: 80,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
        zIndex: 1,
        overflow: 'hidden'
    },
    image: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
    },
    gradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: '100%',
    },
    tripContainer: {
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: 'row',
        flex: 1,
        width: '100%',
        padding: 20,
        paddingBottom: 2,
        zIndex: 1,
    },
    textContainer: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        zIndex: 2,
    },
    date: {
        ...Typography.labelS,
        color: Colors.grey400,
    },
    title: {
        ...Typography.h2,
        color: Colors.white,
    },
    iconBg: {
        backgroundColor: Colors.white70,
        borderRadius: BorderRadius.full,
        aspectRatio: 1,
        width: '12%',
        transform: [{ rotate: '180deg' }],
    },
    locationContainer: {
        justifyContent: "flex-start",
        alignItems: "center",
        flexDirection: 'column',
        width: '100%',
        paddingHorizontal: 20,
        paddingVertical: 12,
    },
    locations: {
        justifyContent: "space-between",
        alignItems: "flex-start",
        flexDirection: 'row',
        flex: 1,
        gap: 24,
        width: '100%',
    },
    iconGroup: {
        alignItems: "center",
        justifyContent: "flex-start",
        gap: 12,
        height: '100%',
        width: 24,
    },
    icon: {
        aspectRatio: 1,
        width: 24,
    },
    bar: {
        backgroundColor: Colors.grey300,
        borderRadius: BorderRadius.full,
        width: 1,
        flex: 1,
        marginBottom: 16,
    },
    container: {
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        gap: 16,
        flex: 1,
    },
    location: {
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: "stretch",
        width: '100%',
        gap: 24,
    },
    left: {
        justifyContent: "space-between",
        alignItems: "flex-start",
    },
    right: {
        justifyContent: "space-between",
        alignItems: "flex-end",
        paddingBottom: 4,
    },
    text: {
        ...Typography.bodyL,
        color: Colors.primaryDark
    },
    labelM: {
        ...Typography.labelM,
        color: Colors.primaryDark
    },
    label: {
        ...Typography.labelS,
        color: Colors.grey400
    },
    expandable: {
        flexDirection: 'row',
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
        paddingTop: 20,
        width: '100%',
        gap: 4,
    },
    expandText: {
        ...Typography.labelM,
        color: Colors.grey300
    },
    expandedIcon: {
        aspectRatio: 1,
        width: 32,
        transform: [{ rotate: "90deg" }],
    },
    nonExpandedIcon: {
        aspectRatio: 1,
        width: 32,
        transform: [{ rotate: "-90deg" }],
    },
    current: {
        color: Colors.coral300,
        borderColor: Colors.coral300,
    },
});