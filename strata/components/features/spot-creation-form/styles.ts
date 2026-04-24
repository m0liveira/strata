import { StyleSheet } from 'react-native';
import { BorderRadius, Colors, CommonStyles, Typography } from "@/constants/global-styles";

export const styles = StyleSheet.create<any>({
    ...CommonStyles,
    page: {
        flex: 1,
        width: '100%',
    },
    form: {
        paddingTop: 32,
    },
    generalGap: {
        marginBottom: 40,
    },
    enabledButton: {
        ...CommonStyles.button,
        flexDirection: 'row',
        backgroundColor: Colors.coral500,
        borderColor: Colors.coral500,
    },
    disabledButton: {
        ...CommonStyles.button,
        flexDirection: 'row',
        backgroundColor: Colors.grey100,
        borderColor: Colors.grey200,
    },
    buttonText: {
        ...Typography.cta,
        color: Colors.white,
    },
    disabledButtonText: {
        ...Typography.cta,
        color: Colors.grey400,
    },
    icon: {
        aspectRatio: 1,
        width: 36,
        transform: [{ rotate: '180deg' }],
    },
    scrollRadioButton: {
        width: 91,
        height: 96,
    },
    scrollRadioButtonLabel: {
        ...Typography.bodyM,
    }
});