import { StyleSheet } from 'react-native';
import { Colors, BorderRadius, Typography } from "@/constants/global-styles";

export const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.grey100,
        borderColor: Colors.grey200,
        borderWidth: 1,
        borderRadius: BorderRadius.md,
        width: '100%',
        padding: 20,
        marginBottom: 24,
    },
    container: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        borderBottomColor: Colors.grey400,
        borderBottomWidth: 1,
        paddingBottom: 12,
    },
    top: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    bottom: {
        gap: 6,
        marginTop: 12,
        borderBottomColor: 'transparent',
        borderBottomWidth: 0,
        paddingBottom: 0,
    },
    text: {
        ...Typography.bodyM,
        color: Colors.secondaryDark
    },
    title: {
        ...Typography.h1,
        color: Colors.primaryDark
    },
    label: {
        ...Typography.labelS,
        color: Colors.grey600
    },
    icon: {
        aspectRatio: 1,
        width: 32
    },
    iconSm: {
        aspectRatio: 1,
        width: 18
    },
    bgIcon: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.white40,
        borderRadius: BorderRadius.full,
        aspectRatio: 1,
        width: 36,
    },
    budgetContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        width: '100%',
        paddingTop: 12,
    },
    budgetText: {
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 4,
    },
    progressContainer: {
        flexDirection: 'column',
        flex: 1,
        gap: 4,
    },
    progressBar: {
        backgroundColor: Colors.grey200,
        borderRadius: BorderRadius.full,
        width: '100%',
        height: 14,
        overflow: 'hidden',
    },
    bar: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: Colors.coral500,
        borderRadius: BorderRadius.full,
        height: 14,
    },
    textContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
});