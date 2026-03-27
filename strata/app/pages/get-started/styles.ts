import { StyleSheet } from 'react-native';
import { Colors, CommonStyles, Typography } from "@/constants/global-styles";

export const styles = StyleSheet.create({
    ...CommonStyles,
    page: {
        ...CommonStyles.page,
        position: "relative",
        paddingTop: 155,
        paddingBottom: 55,
    },
    waveSvg: {
        position: "absolute",
        top: '-65%',
        left: 0,
        right: 0,
        bottom: 0,
        width: '130%',
        zIndex: 0,
    },
    image: {
        width: '100%',
        height: '25%',
    },
    h1: {
        ...Typography.displayXL,
        color: Colors.coral900,
        textAlign: 'center',
    },
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        gap: 24,
        width: '100%',
    },
    p: {
        ...Typography.bodyL,
        color: Colors.primaryDark,
        textAlign: 'center',
    },
    link: {
        ...Typography.bodyL,
        color: Colors.coral900,
        textAlign: 'center',
    },
    view: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    }
});