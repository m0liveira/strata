import { StyleSheet } from 'react-native';
import { Colors, CommonStyles, Typography } from "@/constants/global-styles";

export const styles = StyleSheet.create({
    ...CommonStyles,
    page: {
        ...CommonStyles.page,
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: Colors.white,
        width: '100%',
        height: '100%',
        paddingHorizontal: 0,
    },
    icon: {
        aspectRatio: 1,
        width: 24,
        top: '50%',
        marginTop: -12
    },
    text: {
        ...Typography.labelS,
        color: Colors.grey400
    },
    textGenerate: {
        ...Typography.h2,
        color: Colors.secondaryDark
    },
    ctaDisabled: {
        backgroundColor: Colors.grey100,
        borderColor: Colors.grey200
    },
    smallIcon: {
        aspectRatio: 1,
        height: 20,
        marginLeft: 10
    },
});