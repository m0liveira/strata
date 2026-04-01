import { StyleSheet } from 'react-native';
import { Colors, Typography } from '@/constants/global-styles';

export const styles = StyleSheet.create({
    form: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        paddingTop: '20%',
    },
    label:{
        ...Typography.labelS,
        color: Colors.grey600,
        marginBottom: 12,
    }
});