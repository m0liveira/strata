import { StyleSheet } from 'react-native';
import { Colors, Typography, FontSizes } from "@/constants/global-styles";

export const styles = StyleSheet.create({
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flex: 1,
        width: '100%',
    },
    wrapper: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        height: '55%',
    },
    imageContainer: {
        position: "relative",
        alignItems: "center",
        justifyContent: "center",
        width: '100%',
        height: '65%',
    },
    image: {
        width: '100%',
        height: '100%',
        zIndex: 1,
    },
    textWrapper: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        width: '100%',
        gap: 16,
    },
    title: {
        ...Typography.h1,
        lineHeight: FontSizes.xxl * 1.4,
        color: Colors.primaryDark,
    },
    subtitle: {
        ...Typography.bodyM,
        color: Colors.secondaryDark,
        textAlign: 'center',
    },
    buttonContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        gap: '4%',
    },
});