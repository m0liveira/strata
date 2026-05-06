import { StyleSheet } from 'react-native';
import { Colors, BorderRadius, Typography } from "@/constants/global-styles";

export const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: "flex-end",
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0, 0, 0, 0.25)",
    },
    sheet: {
        backgroundColor: Colors.white,
        borderTopLeftRadius: BorderRadius.lg,
        borderTopRightRadius: BorderRadius.lg,
        minHeight: 200,
        maxHeight: "90%",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -8 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 10,
    },
    handleContainer: {
        width: "100%",
        alignItems: "center",
        paddingTop: 24,
        paddingBottom: 48,
    },
    handle: {
        width: 50,
        height: 5,
        borderRadius: BorderRadius.full,
        backgroundColor: Colors.grey400,
    },
    scrollContainer: {
        width: "100%",
    },
    content: {
        paddingHorizontal: 40,
        paddingBottom: 48,
    },
});