import { StyleSheet } from 'react-native';
import { Colors, Typography } from "@/constants/global-styles";

export const styles = StyleSheet.create({
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 16,
        width: '100%',
    },
    image: {
        aspectRatio: 1,
        width: 30,
        height: 30,
    },
    p: {
        ...Typography.bodyL,
        color: Colors.primaryDark,
    }
});