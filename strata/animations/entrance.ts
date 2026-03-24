import { withSpring } from "react-native-reanimated";

export const PlaneTakeOff = () => {
    "worklet";
    return {
        initialValues: {
            transform: [{ translateX: -800 }, { translateY: 400 }],
        },
        animations: {
            transform: [
                {
                    translateX: withSpring(0, {
                        damping: 37,
                        stiffness: 150,
                    }),
                },
                {
                    translateY: withSpring(0, {
                        damping: 37,
                        stiffness: 150,
                    }),
                },
            ],
        },
    };
};

export const WaveEntrance = () => {
    "worklet";
    return {
        initialValues: {
            transform: [{ translateY: -800 }, { scale: 1.2 }],
        },
        animations: {
            transform: [
                {
                    translateY: withSpring(0, {
                        damping: 35,
                        stiffness: 120,
                    }),
                },
                {
                    scale: withSpring(1, {
                        damping: 35,
                        stiffness: 60,
                    }),
                },
            ],
        },
    };
};