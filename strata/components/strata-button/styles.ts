import { StyleSheet } from 'react-native';
import { Colors, BorderRadius, Typography } from "@/constants/global-styles";

export const styles = StyleSheet.create({



    button: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        backgroundColor: Colors.coral100,
        borderColor: Colors.coral200,
        borderWidth: 1,
        borderRadius: BorderRadius.md,
        width: '100%',
        height: 80,
        paddingHorizontal: 20,
        paddingVertical: 24,
        overflow: 'hidden'
    },
    blob: {
        position: "absolute",
        left: -146,
        top: -15,
        backgroundColor: Colors.coral300,
        width: 217,
        height: 105,
        borderRadius: BorderRadius.full,
        transform: [{ rotate: '-10deg' }],
    },
    imageContainer: {
        width: 41,
        height: '100%',
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
        zIndex: 1,
    },
    image: {
        width: "100%",
        height: "100%",
    },
    textContainer: {
        flex: 1,
        justifyContent: "center",
        paddingLeft: 5,
        gap: 3,
        zIndex: 1,
    },
    title: {
        ...Typography.h3,
        color: Colors.primaryDark,
    },
    text: {
        ...Typography.bodyS,
        color: Colors.coral900,
    },
    iconBg: {
        backgroundColor: Colors.white40,
        borderRadius: BorderRadius.full,
        aspectRatio: 1,
        width: 32,
        transform: [{ rotate: '180deg' }],
    },
});