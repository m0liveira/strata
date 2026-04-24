import { StyleSheet } from 'react-native';
import { BorderRadius, Colors, Typography } from "@/constants/global-styles";

export const styles = StyleSheet.create({
    itemContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: BorderRadius.md,
        backgroundColor: "transparent",
        width: '100%',
        height: 60,
        maxHeight: 60,
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    itemSelected: {
        backgroundColor: Colors.coral100,
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
    textSelected: {
        color: Colors.coral900,
    },
    handleSelected: {
        color: Colors.coral400,
    },
    actionContainer: {
        padding: 8,
    },
});