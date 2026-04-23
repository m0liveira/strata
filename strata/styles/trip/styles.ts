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
    }
});