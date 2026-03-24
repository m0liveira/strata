import { useFonts } from "expo-font";

export const useLoadFonts = () => {
    const [fontsLoaded] = useFonts({
        Manrope100: require("@/assets/fonts/Manrope/Manrope-ExtraLight.ttf"),
        Manrope200: require("@/assets/fonts/Manrope/Manrope-Light.ttf"),
        Manrope300: require("@/assets/fonts/Manrope/Manrope-Regular.ttf"),
        Manrope400: require("@/assets/fonts/Manrope/Manrope-Medium.ttf"),
        Manrope500: require("@/assets/fonts/Manrope/Manrope-SemiBold.ttf"),
        Manrope600: require("@/assets/fonts/Manrope/Manrope-Bold.ttf"),
        Manrope700: require("@/assets/fonts/Manrope/Manrope-ExtraBold.ttf"),
    });

    return fontsLoaded;
};