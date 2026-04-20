import { BorderRadius, Colors, Typography } from '@/constants/global-styles';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'center',
        width: '100%',
        height: 32,
        gap: 36,
    },
    tab: {
        borderRadius: 1,
        borderColor: 'transparent',
        borderWidth: 1,
        height: '100%',
    },
    title: {
        ...Typography.bodyL,
        color: Colors.grey600,
    },
    activeTab: {
        borderBottomColor: Colors.coral500,
    },
    activeTitle: {
        color: Colors.coral500,
    },
});