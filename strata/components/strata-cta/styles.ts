import { StyleSheet } from 'react-native';
import { Colors, BorderRadius, Typography } from "@/constants/global-styles";

export const styles = StyleSheet.create({
    button: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.coral500,
        borderColor: Colors.coral500,
        borderWidth: 1,
        borderRadius: BorderRadius.md,
        width: '100%',
        paddingHorizontal: 36,
        paddingVertical: 18,
        overflow: 'hidden'
    },
    text: {
        ...Typography.h2,
        color: Colors.white,
    }
});