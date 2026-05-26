import { BorderRadius, Colors } from '@/constants/global-styles';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    page: {
        backgroundColor: Colors.white,
        flexGrow: 1,
        width: "100%",
        paddingHorizontal: 40,
        marginBottom: 90,
    },
    scrollContent: {
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 12,
    },
    iconGroup: {
        alignItems: "center",
        justifyContent: "flex-start",
        gap: 12,
        height: '100%',
        width: 24,
        paddingBottom: 150
    },
    icon: {
        aspectRatio: 1,
        width: 24,
    },
    bar: {
        backgroundColor: Colors.grey300,
        borderRadius: BorderRadius.full,
        width: 1,
        flex: 1,
        marginBottom: 16,
    },
    container: {
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        gap: 24,
        flex: 1,
        paddingTop: 5,
        marginBottom: 150
    },
});