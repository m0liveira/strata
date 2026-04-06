import { StyleSheet } from 'react-native';
import { BorderRadius, Colors, CommonStyles, Typography } from "@/constants/global-styles";

export const styles = StyleSheet.create<any>({
    ...CommonStyles,
    calendar: {
        borderRadius: BorderRadius.md,
        borderWidth: 1,
        borderColor: Colors.grey200,
        padding: 24,
        backgroundColor: Colors.white,
    },
});