import { StyleSheet } from 'react-native';
import { BorderRadius, Colors, CommonStyles, Typography } from "@/constants/global-styles";

export const styles = StyleSheet.create({
    ...CommonStyles,
    page: {
        ...CommonStyles.page,
        backgroundColor: Colors.white,
        paddingHorizontal: 40,
        paddingTop: 55,
        paddingBottom: 0,
    },
    scrollPage: {
        flex: 1,
        width: '100%',
        marginBottom: 90,
    },
    container: {
        width: '100%',
        flex: 1,
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        width: '100%',
        marginBottom: 34,
    },
    icon: {
        aspectRatio: 1,
        width: '8%',
    },
    bgIcon: {
        backgroundColor: Colors.grey200,
        borderRadius: BorderRadius.full,
        aspectRatio: 1,
        width: '12%',
    },
    createTripButton: {
        marginBottom: 75,
    },
    quickActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        minHeight: 86,
    },
    quickAction: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: BorderRadius.full,
        borderWidth: 1,
        aspectRatio: 1,
        width: 62,
    },
    bigIcon: {
        aspectRatio: 1,
        width: 30,
    },
    coralBg: {
        backgroundColor: Colors.coral100,
        borderColor: Colors.coral200
    },
    blueBg: {
        backgroundColor: Colors.blue100,
        borderColor: Colors.blue200
    },
    qAText: {
        ...Typography.labelM,
        color: Colors.grey600,
    }
});