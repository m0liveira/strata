import { StyleSheet } from 'react-native';
import { BorderRadius, Colors, Typography } from "@/constants/global-styles";

export const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.grey100,
        borderWidth: 1,
        borderColor: Colors.grey200,
        borderRadius: BorderRadius.md,
        width: '100%',
    },
    input: {
        ...Typography.bodyL,
        color: Colors.primaryDark,
        width: '100%',
        paddingLeft: 24,
        paddingRight: 24,
        paddingVertical: 12,
    },
    icon: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        marginVertical: 'auto',
        right: 12,
        aspectRatio: 1,
        width: '9%',
    }
});