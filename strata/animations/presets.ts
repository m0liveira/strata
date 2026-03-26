import { SharedValue } from "react-native-reanimated";

export const slideDiagonal = (progress: SharedValue<number>, x: number, y: number) => {
    "worklet";
    return {
        transform: [
            { translateX: (progress.value - 1) * x },
            { translateY: (1 - progress.value) * y },
        ],
    };
};

export const slideRightToLeft = (progress: SharedValue<number>, distance: number) => {
    "worklet";
    return {
        transform: [{ translateX: (1 - progress.value) * distance }],
    };
};

export const slideTopToBottom = (progress: SharedValue<number>, distance: number) => {
    "worklet";
    return {
        transform: [{ translateY: (1 - progress.value) * distance }],
    };
};

export const slideBottomToTop = (progress: SharedValue<number>, distance: number) => {
    "worklet";
    return {
        transform: [
            { translateY: (1 - progress.value) * distance },
        ],
    };
};

export const slideWaveBottomToTop = (progress: SharedValue<number>, distance: number) => {
    "worklet";
    return {
        transform: [
            { translateY: (1 - progress.value) * distance },
            { rotate: '180deg' }
        ],
    };
};