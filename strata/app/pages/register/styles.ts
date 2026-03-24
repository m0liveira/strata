import { StyleSheet } from 'react-native';
import { Colors, CommonStyles, Typography } from "@/constants/global-styles";

export const styles = StyleSheet.create({
    ...CommonStyles,
    page: {
        ...CommonStyles.page,
        position: "relative",
        paddingTop: 155,
        paddingBottom: 55,
    },
});