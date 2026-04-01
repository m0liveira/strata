import { StyleSheet } from 'react-native';
import { BorderRadius, Colors, CommonStyles, Typography } from "@/constants/global-styles";

export const styles = StyleSheet.create<any>({
    ...CommonStyles,
    page: {
        flex: 1,
        width: '100%',
    },
    scrollView: {
        ...CommonStyles.scrollView,
        justifyContent: 'flex-start',
    },
    trackerContainer: {
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 12,
        width: '100%',
        height: 24,
        marginBottom: 24,
    },
    tracker: {
        backgroundColor: Colors.coral200,
        height: '50%',
        width: '20%',
        borderRadius: BorderRadius.full,
    },
    activeTracker: {
        backgroundColor: Colors.coral500,
        width: '30%',
    },
    form: {
        paddingTop: 32,
    },
    generalGap: {
        marginBottom: 40,
    },
    enabledButton: {
        ...CommonStyles.button,
        backgroundColor: Colors.coral500,
        borderColor: Colors.coral500,

    },
    disabledButton: {
        ...CommonStyles.button,
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
        height: 36,
        transform: [{ rotate: '180deg' }],
    }
});