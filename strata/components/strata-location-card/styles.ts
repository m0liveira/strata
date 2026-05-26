import { StyleSheet } from 'react-native';
import { BorderRadius, Colors, Typography } from '@/constants/global-styles';

export const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderRadius: BorderRadius.sm,
        boxShadow: '0 0 4px rgba(0, 0, 0, 0.1)',
        width: '100%',
        minHeight: 64,
        gap: 24,
        padding: 12,
    },
    textContainer: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        maxWidth: '81%',
    },
    labelText: {
        ...Typography.labelM,
        textAlign: "left",
        color: Colors.grey400,
    },
    text: {
        ...Typography.bodyL,
        textAlign: "left",
    },
    icon: {
        aspectRatio: 1,
        width: 24,
    },
});