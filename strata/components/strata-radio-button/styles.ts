import { StyleSheet } from 'react-native';
import { BorderRadius, Colors, Typography } from '@/constants/global-styles';

export const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        borderColor: Colors.grey200,
        borderWidth: 1,
        borderRadius: BorderRadius.md,
        width: 94,
        height: 89,
        paddingHorizontal: 12,
        paddingVertical: 18,
    },
    selectedContainer: {
        backgroundColor: Colors.coral100,
        borderColor: Colors.coral200,
    },
    unselectedContainer: {
        backgroundColor: Colors.grey100,
        borderColor: Colors.grey200,
    },
    iconContainer: {
        width: 24,
        height: 24,
    },
    labelText: {
        ...Typography.bodyS,
        textAlign: "center",
    },
    selectedText: {
        color: Colors.coral900,
    },
    unselectedText: {
        color: Colors.grey400,
    },
});