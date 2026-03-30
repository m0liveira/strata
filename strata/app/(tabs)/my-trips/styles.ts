import { StyleSheet } from 'react-native';
import { BorderRadius, Colors, CommonStyles, Typography } from "@/constants/global-styles";

export const styles = StyleSheet.create({
    ...CommonStyles,
    page: {
        ...CommonStyles.page,
        backgroundColor: Colors.white,
        paddingHorizontal: 40,
        paddingTop: 55,
        paddingBottom: '35%',
    },
    container: {
        width: '100%',
        flex: 1,
    },
    header: {
        borderWidth: 1,
        borderColor: Colors.coral900,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        width: '100%',
        marginBottom: 30,
    },
    icon: {
        aspectRatio: 1,
        width: '8%',
    },
});