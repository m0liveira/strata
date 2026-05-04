import { StyleSheet } from 'react-native';
import { BorderRadius, Colors, CommonStyles, Typography } from "@/constants/global-styles";

export const styles = StyleSheet.create({
    ...CommonStyles,
    page: {
        ...CommonStyles.page,
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
    container: {
        width: '100%',
        flex: 1,
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        width: '100%',
        marginBottom: 34,
    },
    icon: {
        aspectRatio: 1,
        width: '8%',
    },
    bgIcon: {
        backgroundColor: Colors.grey200,
        borderRadius: BorderRadius.full,
        aspectRatio: 1,
        width: '12%',
    },
    createTripButton: {
        marginBottom: 75,
    },
    quickActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        minHeight: 86,
    },
    quickAction: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: BorderRadius.full,
        borderWidth: 1,
        aspectRatio: 1,
        width: 62,
    },
    bigIcon: {
        aspectRatio: 1,
        width: 30,
    },
    coralBg: {
        backgroundColor: Colors.coral100,
        borderColor: Colors.coral200
    },
    blueBg: {
        backgroundColor: Colors.blue100,
        borderColor: Colors.blue200
    },
    qAText: {
        ...Typography.labelM,
        color: Colors.grey600,
    },
    ctaText: {
        ...Typography.cta,
        color: Colors.white,
    },
    ctaDisabled: {
        backgroundColor: Colors.grey100,
        borderColor: Colors.grey200
    },
    smallIcon: {
        aspectRatio: 1,
        height: 20,
        marginLeft: 10
    },
    selectable: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        backgroundColor: Colors.grey100,
        borderColor: Colors.grey200,
        borderWidth: 1,
        borderRadius: BorderRadius.md,
        width: '100%',
        height: 67,
        paddingVertical: 12,
        paddingHorizontal: 24,
        marginBottom: 24
    },
    selectableTitle: {
        ...Typography.h3,
        color: Colors.primaryDark,
    },
    selectableText: {
        ...Typography.bodyS,
        color: Colors.grey400,
    },
    shiftContainer: {
        flexDirection: 'column',
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
    },
    location: {
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: "stretch",
        flexWrap: 'wrap',
        borderRadius: BorderRadius.md,
        boxShadow: '0 0 4px rgba(0, 0, 0, 0.1)',
        paddingVertical: 12,
        paddingHorizontal: 24,
        width: '80%',
        gap: 24,
    },
    left: {
        justifyContent: "space-between",
        alignItems: "flex-start",
    },
    right: {
        justifyContent: "space-between",
        alignItems: "flex-end",
        paddingBottom: 4,
    },
    text: {
        ...Typography.bodyL,
        color: Colors.primaryDark
    },
    labelM: {
        ...Typography.labelM,
        color: Colors.primaryDark
    },
    label: {
        ...Typography.labelS,
        color: Colors.grey400
    },
    select: {
        flexDirection: 'row',
        justifyContent: "center",
        alignItems: "center",
        gap: 16
    },
    optionsContainer: {
        flexDirection: 'column',
        justifyContent: "center",
        alignItems: "flex-start",
        borderTopWidth: 1,
        borderTopColor: Colors.grey200,
        width: '100%',
        paddingTop: 4
    },
    options: {
        ...Typography.bodyM,
        color: Colors.grey400,
    }
});