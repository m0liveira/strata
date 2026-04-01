import { StyleSheet } from "react-native";
import { BorderRadius, Colors } from "@/constants/global-styles";

export const styles = StyleSheet.create({
    container: {
        alignItems: 'flex-start',
    },
    input: {
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.grey100,
        borderRadius: BorderRadius.md,
        borderColor: Colors.grey200,
        borderWidth: 1,
        width: '100%',
        height: 90,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
        zIndex: 1,
    },
    iconBg: {
        position: 'absolute',
        top: 8,
        right: 8,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.white40,
        borderRadius: BorderRadius.full,
        width: 24,
        height: 24,
        zIndex: 2,
    },
    removeIcon: {
        width: 20,
        height: 20,
    },
    icon: {
        width: 48,
        height: 48,
    },
});