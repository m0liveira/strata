import { StyleSheet } from 'react-native';
import { BorderRadius, Colors, CommonStyles, Typography } from "@/constants/global-styles";

export const styles = StyleSheet.create({
    ...CommonStyles,
    page: {
        position: "relative",
        backgroundColor: Colors.white,
        paddingHorizontal: 40,
        paddingTop: 55,
        paddingBottom: '18%',
    },
});