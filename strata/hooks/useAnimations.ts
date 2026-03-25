/* eslint-disable react-hooks/exhaustive-deps */
import { useSharedValue, useAnimatedStyle, withSpring, withDelay } from "react-native-reanimated";
import { useCallback } from "react";
import { useFocusEffect } from "expo-router";
import { slideHorizontal, slideVertical, slideDiagonal } from "@/animations/presets";

export function usePageAnimations() {
    const planeProgress = useSharedValue(0);
    const waveProgress = useSharedValue(0);
    const contentProgress = useSharedValue(0);

    const config = { damping: 38, stiffness: 120 };
    const exitConfig = { damping: 38, stiffness: 150 };

    useFocusEffect(
        useCallback(() => {
            planeProgress.value = 0;
            waveProgress.value = 0;
            contentProgress.value = 0;

            waveProgress.value = withSpring(1, config);
            planeProgress.value = withDelay(100, withSpring(1, config));
            contentProgress.value = withDelay(150, withSpring(1, config));
        }, [])
    );

    const animateAndNavigate = (navigateFn: () => void) => {
        waveProgress.value = withDelay(250, withSpring(0, exitConfig));
        contentProgress.value = withSpring(2, exitConfig);
        planeProgress.value = withSpring(2, exitConfig);

        setTimeout(() => {
            navigateFn();
        }, 600);
    };

    const planeStyle = useAnimatedStyle(() => slideDiagonal(planeProgress, 800, 400));
    const waveStyle = useAnimatedStyle(() => slideVertical(waveProgress, -800));
    const contentStyle = useAnimatedStyle(() => slideHorizontal(contentProgress, 400));

    return { planeStyle, waveStyle, contentStyle, animateAndNavigate };
}