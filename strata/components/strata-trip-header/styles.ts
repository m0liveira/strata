import { StyleSheet } from 'react-native';
import { Colors, BorderRadius, Typography } from "@/constants/global-styles";

export const styles = StyleSheet.create({
    header: {
        justifyContent: "center",
        alignItems: "center",
        borderBottomStartRadius: BorderRadius.md,
        borderBottomEndRadius: BorderRadius.md,
        padding: 0,
        width: '100%',
        height: 169,
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
        width: "100%",
    },
    tripContainer: {
        justifyContent: "space-between",
        alignItems: "flex-end",
        flexDirection: 'column',
        flex: 1,
        width: '100%',
        paddingHorizontal: 40,
        paddingTop: 55,
        paddingBottom: 16,
        zIndex: 1,
    },
    iconsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-between",
        width: '100%',
        zIndex: 2,
    },
    iconBg: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.white70,
        borderRadius: BorderRadius.full,
        aspectRatio: 1,
        width: 32,
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-between",
        width: '100%',
        zIndex: 2,
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
    icon: {
        aspectRatio: 1,
        width: 24,
    },
    current: {
        color: Colors.coral300,
        borderColor: Colors.coral300,
    }
});