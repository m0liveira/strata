import { StyleSheet } from 'react-native';
import { BorderRadius, Colors, CommonStyles, Typography } from "@/constants/global-styles";

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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 40,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.grey200,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
    title: {
        ...Typography.h2,
        color: Colors.primaryDark,
    },
    avatar: {
        borderColor: Colors.white,
        borderRadius: BorderRadius.full,
        borderWidth: 2,
        aspectRatio: 1,
        width: 22,
        height: 22,
    },
    iconBg: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.grey100,
        borderRadius: BorderRadius.full,
        aspectRatio: 1,
        width: 40,
    },
    icon: {
        aspectRatio: 1,
        width: 36,
    },
    scrollPage: {
        flex: 1,
        width: '100%',
    },
    container: {
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 32,
        width: '100%',
        paddingHorizontal: 24,
    },
    date: {
        ...Typography.labelM,
        textAlign: "center",
        color: Colors.grey400,
        marginVertical: 16,
    },
    messageContainer: {
        flexDirection: "column",
        gap: 10,
        width: '100%',
    },
    userContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6
    },
    user: {
        ...Typography.labelM,
        color: Colors.grey600
    },
    messageBubble: {
        alignSelf: 'flex-start',
        backgroundColor: Colors.grey100,
        borderRadius: 12,
        padding: 12,
        maxWidth: '85%',
        overflow: 'hidden'
    },
    text: {
        ...Typography.bodyL,
        color: Colors.primaryDark,
        flexShrink: 1,
    },
    time: {
        ...Typography.labelS,
        color: Colors.grey400,
        alignSelf: "flex-end",
        marginTop: 2,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTopColor: Colors.grey200,
        borderTopWidth: 1,
        width: '100%',
        paddingHorizontal: 24,
        paddingTop: 16,
    },
    chatIcon: {
        position: 'absolute',
        aspectRatio: 1,
        width: 24,
        top: 0,
        bottom: 0,
        marginVertical: "auto"
    }
});