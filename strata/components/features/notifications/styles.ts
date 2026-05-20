import { StyleSheet } from 'react-native';
import { BorderRadius, Colors, CommonStyles, Typography } from "@/constants/global-styles";

export const styles = StyleSheet.create<any>({
    ...CommonStyles,
    page: {
        ...CommonStyles.page,
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: Colors.white,
        width: '100%',
        minHeight: '100%',
    },
    header: {
        width: '100%',
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
        marginBottom: 90,
    },
    container: {
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 24
    },
    title: {
        ...Typography.bodyM,
        color: Colors.grey400,
    },
    itemContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: BorderRadius.xs,
        backgroundColor: Colors.grey100,
        borderColor: Colors.grey200,
        borderWidth: 1,
        width: '100%',
        height: 60,
        maxHeight: 60,
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    avatar: {
        borderRadius: BorderRadius.full,
        width: 30,
        height: 30,
    },
    textContainer: {
        flex: 1,
        marginLeft: 12,
        justifyContent: "center",
    },
    name: {
        ...Typography.bodyM,
        color: Colors.primaryDark,
    },
    handle: {
        ...Typography.labelS,
        color: Colors.grey400,
    },
    smallIcon:{
        aspectRatio: 1,
        width: 24,
    }
});