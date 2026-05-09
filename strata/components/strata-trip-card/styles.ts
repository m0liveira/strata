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
        height: 134,
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
    infoContainer: {
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: 'row',
        width: '100%',
        height: 54,
        paddingHorizontal: 20,
        paddingVertical: 12,
    },
    iconContainer: {
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: 'row',
        gap: 9,
        height: '100%',
    },
    icon: {
        aspectRatio: 1,
        width: 24,
    },
    info: {
        justifyContent: "center",
        alignItems: "center",
    },
    label: {
        ...Typography.labelM,
        textTransform: 'capitalize',
        lineHeight: 16,
        color: Colors.secondaryDark,
    },
    category: {
        ...Typography.labelS,
        color: Colors.grey400,
    },
    current: {
        color: Colors.coral300,
        borderColor: Colors.coral300,
    },
    rating: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        backgroundColor: Colors.white40,
        borderRadius: BorderRadius.full,
        minWidth: 38,
        minHeight: 14,
        paddingHorizontal: 4,
        paddingVertical: 2,
    },
    ratingText: {
        ...Typography.labelS,
        color: Colors.white
    }
});