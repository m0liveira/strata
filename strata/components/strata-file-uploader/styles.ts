import { StyleSheet } from "react-native";
import { BorderRadius, Colors, Typography } from "@/constants/global-styles";

export const styles = StyleSheet.create({
    container: {
        alignItems: 'flex-start',
    },
    inputContainer: {
        width: '100%',
    },
    input: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',
        gap: 24,
        backgroundColor: Colors.grey100,
        borderRadius: BorderRadius.md,
        borderColor: Colors.grey200,
        borderWidth: 1,
        width: '100%',
        height: 49,
        paddingVertical: 12,
        paddingHorizontal: 24,
        overflow: 'hidden',
    },
    inputText: {
        ...Typography.labelM,
        color: Colors.grey600,
    },
    icon: {
        aspectRatio: 1,
        width: 24,
    },
    file: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: Colors.white,
        borderRadius: BorderRadius.md,
        borderTopEndRadius: 0,
        borderTopStartRadius: 0,
        borderColor: Colors.grey200,
        borderWidth: 1,
        borderTopWidth: 0,
        width: '100%',
        height: 49,
        paddingVertical: 12,
        paddingHorizontal: 24,
        overflow: 'hidden',
    },
    fileText: {
        ...Typography.labelM,
        color: Colors.primaryDark,
    },
    removeIcon: {
        width: 20,
        height: 20,
    },
});