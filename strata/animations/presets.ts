import { SharedValue } from "react-native-reanimated";

export const slideHorizontal = (progress: SharedValue<number>, distance: number) => {
    "worklet";
    return {
        transform: [{ translateX: (1 - progress.value) * distance }],
    };
};

export const slideVertical = (progress: SharedValue<number>, distance: number) => {
    "worklet";
    return {
        transform: [{ translateY: (1 - progress.value) * distance }],
    };
};

export const slideDiagonal = (progress: SharedValue<number>, x: number, y: number) => {
    "worklet";
    return {
        transform: [
            { translateX: (progress.value - 1) * x },
            { translateY: (1 - progress.value) * y },
        ],
    };
};