import { StyleSheet } from 'react-native';
import { BorderRadius, Colors, CommonStyles, Typography } from "@/constants/global-styles";

export const styles = StyleSheet.create({
    ...CommonStyles,
    page: {
        ...CommonStyles.page,
        justifyContent: 'flex-start',
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
    header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 54,
    },
    icon: {
        aspectRatio: 1,
        width: 25,
    },
    profileContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: 40
    },
    container: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 12
    },
    avatar: {
        aspectRatio: 1,
        width: 60,
        height: 60,
        borderRadius: BorderRadius.full
    },
    textContainer: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    name: {
        ...Typography.bodyL,
        color: Colors.primaryDark
    },
    handle: {
        ...Typography.labelM,
        color: Colors.grey600
    },
    content: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        alignContent: 'flex-start',
        gap: 10,
        paddingTop: 40,
    },
    card: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 12,
        backgroundColor: Colors.grey100,
        borderRadius: BorderRadius.md,
        borderColor: Colors.grey200,
        borderWidth: 1,
        width: 151,
        height: 80,
        padding: 12
    },
    image: {
        aspectRatio: 1,
        width: 24,
        height: 24,
    },
    cardTextContainer: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    title: {
        ...Typography.labelS,
        color: Colors.grey600
    },
    text: {
        ...Typography.h3,
        color: Colors.primaryDark
    },
    socialContainer: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        width: '100%',
        gap: 12,
    },
    label: {
        ...Typography.bodyM,
        color: Colors.grey600
    },
    actionIcon: {
        aspectRatio: 1,
        width: 24,
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