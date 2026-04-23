import { StyleSheet } from 'react-native';
import { BorderRadius, Colors, Typography } from "@/constants/global-styles";

export const ITEM_HEIGHT = 34;
export const VISIBLE_ITEMS = 5;

export const styles = StyleSheet.create({
    container: {
        gap: 12,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        gap: 24,
    },
    checkbox: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "transparent",
        borderRadius: 6,
        borderWidth: 2,
        borderColor: Colors.grey300,
        width: 24,
        height: 24,
    },
    checkboxActive: {
        backgroundColor: Colors.coral500,
        borderColor: Colors.coral500,
    },
    title: {
        ...Typography.labelM,
        color: Colors.primaryDark,
    },
    pickerContainer: {
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        height: ITEM_HEIGHT * VISIBLE_ITEMS,
    },
    highlightBar: {
        position: "absolute",
        top: "50%",
        backgroundColor: Colors.coral100,
        borderRadius: BorderRadius.md,
        height: ITEM_HEIGHT + 8,
        width: 115,
        marginTop: -(ITEM_HEIGHT + 8) / 2,
    },
    wheelsWrapper: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-evenly",
        height: "100%",
    },
    wheelContainer: {
        height: "100%",
    },
    itemContainer: {
        height: ITEM_HEIGHT,
        justifyContent: "center",
        alignItems: "center",
    },
    itemText: {
        ...Typography.h2,
        color: Colors.grey400,
        textAlign: "center",
        lineHeight: ITEM_HEIGHT
    },
    itemTextSelected: {
        color: Colors.primaryDark,
    },
});