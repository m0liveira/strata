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
        width: 25,
    },
    bgIcon: {
        backgroundColor: Colors.grey200,
        borderRadius: BorderRadius.full,
        aspectRatio: 1,
        width: '12%',
    },
    filters: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 24,
        width: '100%',
    },
    cardContainer: {
        gap: 12,
        width: '100%',
    },
    creator: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 12,
    },
    avatar: {
        aspectRatio: 1,
        width: 24,
        borderRadius: BorderRadius.full
    },
    name: {
        ...Typography.labelM,
        color: Colors.secondaryDark
    }
});