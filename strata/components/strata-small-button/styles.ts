import { StyleSheet } from 'react-native';
import { Colors, BorderRadius, Typography } from "@/constants/global-styles";

export const styles = StyleSheet.create({
    button: {
        position: "absolute",
        bottom: 140,
        right: 40,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 12,
        backgroundColor: Colors.coral500,
        borderColor: Colors.coral400,
        borderWidth: 1,
        borderRadius: BorderRadius.full,
        boxShadow: '0 2px 16px rgba(247, 130, 94, 0.45)',
        width: 148,
        height: 48,
        paddingHorizontal: 24,
        paddingVertical: 12,
        overflow: 'hidden'
    },
    text: {
        ...Typography.cta,
        color: Colors.white,
    },
});