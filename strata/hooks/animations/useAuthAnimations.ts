/* eslint-disable react-hooks/exhaustive-deps */
import { useSharedValue, useAnimatedStyle, withSpring, withDelay } from "react-native-reanimated";
import { useCallback } from "react";
import { useFocusEffect } from "expo-router";
import { slideBottomToTop, slideWaveBottomToTop } from "@/animations/presets";

export function usePageAnimations() {
    const contentProgress = useSharedValue(0);
    const invertedWaveProgress = useSharedValue(0);

    const config = { damping: 38, stiffness: 125 };
    const exitConfig = { damping: 38, stiffness: 150 };

    useFocusEffect(
        useCallback(() => {
            invertedWaveProgress.value = withSpring(1, config);
            contentProgress.value = withDelay(350, withSpring(1, config));
        }, [])
    );

    const animateAndNavigate = (navigateFn: () => void) => {
        invertedWaveProgress.value = withDelay(350, withSpring(0, exitConfig));
        contentProgress.value = withSpring(0, exitConfig);

        setTimeout(() => {
            navigateFn();
        }, 600);
    };

    const contentStyle = useAnimatedStyle(() => slideBottomToTop(contentProgress, 800));

    const invertedWaveStyle = useAnimatedStyle(() => slideWaveBottomToTop(invertedWaveProgress, 800));

    return { contentStyle, invertedWaveStyle, animateAndNavigate };
}