import { StyleSheet } from 'react-native';
import { BorderRadius, Colors, CommonStyles, Typography } from "@/constants/global-styles";

export const styles = StyleSheet.create({
    ...CommonStyles,
    page: {
        ...CommonStyles.page,
        position: "relative",
        paddingTop: 55,
        paddingBottom: 55,
    },
    waveSvg: {
        position: "absolute",
        top: '65%',
        bottom: 0,
        right: 0,
        width: '130%',
        zIndex: 0,
    },
    view: {
        flex: 1,
        width: '100%',
        gap: '7%',
    },
    container: {
        width: '100%',
    },
    iconBg: {
        backgroundColor: Colors.white40,
        borderRadius: BorderRadius.full,
        aspectRatio: 1,
        width: '12%',
    },
    image: {
        width: '100%',
        height: '17%',
    },
    h1: {
        ...Typography.displayXL,
        color: Colors.coral900,
        textAlign: 'center',
    },
    form: {
        paddingTop: 0
    },
    inputContainer: {
        marginTop: '10%'
    },
    input: {
        paddingRight: 72
    },
    button: {
        marginTop: '20%'
    },
});