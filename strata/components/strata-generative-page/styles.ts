import { StyleSheet } from 'react-native';
import { Colors, BorderRadius, Typography } from "@/constants/global-styles";

export const styles = StyleSheet.create({
    page: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 40,
        flex: 1,
        backgroundColor: Colors.coral200,
        width: '100%',
    },
    image: {
        width: 80,
        height: 80,
    },
    text: {
        ...Typography.h1,
        color: Colors.coral900,
    },
});