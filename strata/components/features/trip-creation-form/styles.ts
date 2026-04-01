import { StyleSheet } from 'react-native';
import { BorderRadius, Colors, CommonStyles, Typography } from "@/constants/global-styles";

export const styles = StyleSheet.create({
    ...CommonStyles,
    page: {
        backgroundColor: Colors.blue100,
        flex: 1,
        width: '100%',
        paddingBottom: '40%',
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
        borderColor: Colors.primaryDark,
        borderWidth: 1,
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
    form:{
        paddingTop: 32,
    },
});