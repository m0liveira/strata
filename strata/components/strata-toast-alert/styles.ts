import { StyleSheet } from 'react-native';
import { BorderRadius, Typography } from "@/constants/global-styles";

export const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 60,
        left: 20,
        right: 20,
        padding: 16,
        borderRadius: BorderRadius.sm,
        zIndex: 999,
        borderWidth: 1,
    },
    errorContainer: {
        backgroundColor: '#fee2e2',
        borderColor: '#ef4444',
    },
    successContainer: {
        backgroundColor: '#dcfce3',
        borderColor: '#22c55e',
    },
    text: {
        ...Typography.bodyM,
        marginBottom: 8,
    },
    errorText: {
        color: '#991b1b',
    },
    successText: {
        color: '#166534',
    }
});