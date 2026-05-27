import { StyleSheet } from 'react-native';
import { BorderRadius, Colors, CommonStyles, Typography } from "@/constants/global-styles";

export const styles = StyleSheet.create({
    ...CommonStyles,
    page: {
        ...CommonStyles.page,
        justifyContent: 'flex-start',
        gap: 40,
        backgroundColor: Colors.white,
        paddingHorizontal: 0,
        paddingVertical: 0,
    },
    tabContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        width: 'auto',
        paddingHorizontal: 40,
    },
    emptyStateContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        width: '100%',
        paddingHorizontal: 40,
        paddingTop: 40,
    },
    globe: {
        width: '100%',
        height: '100%',
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
        marginTop: 55,
    },
    icon: {
        aspectRatio: 1,
        width: 24,
    },
    bgIcon: {
        backgroundColor: Colors.grey200,
        borderRadius: BorderRadius.full,
        aspectRatio: 1,
        width: 32,
    },
    createTripButton: {
        marginBottom: 75,
    },
    disabled: {
        backgroundColor: Colors.grey100,
        borderColor: Colors.grey200
    },
    disabledText: {
        color: Colors.grey400
    },
    options: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 24,
        flex: 1,
        width: '100%',
    },
    dangerAction: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f96666',
        borderRadius: BorderRadius.md,
        borderWidth: 1,
        borderColor: '#ed6060',
        width: '100%',
        height: 54,
        paddingHorizontal: 24,
        paddingVertical: 12,
    },
    action: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.grey100,
        borderRadius: BorderRadius.md,
        borderColor: Colors.grey200,
        borderWidth: 1,
        width: '100%',
        height: 54,
        paddingHorizontal: 24,
        paddingVertical: 12,
    },
    dangerText: {
        ...Typography.cta,
        color: Colors.white,
    },
    optionsText: {
        ...Typography.cta,
        color: Colors.primaryDark,
    },
});