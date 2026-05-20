import { BorderRadius } from '@/constants/global-styles';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
    },
    notificationDot: {
        position: 'absolute',
        top: -4,
        right: -4,
        width: 8,
        height: 8,
        backgroundColor: 'red',
        borderRadius: BorderRadius.full,
    }
});