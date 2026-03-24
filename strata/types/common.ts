import { StyleProp, ViewStyle } from "react-native";

type IconProps = {
    classname?: StyleProp<ViewStyle>;
    color?: string;
};

type SvgProps = {
    classname?: StyleProp<ViewStyle>;
    colors?: {
        primary?: string;
        secondary?: string;
        tertiary?: string;
    };
};

export type { IconProps, SvgProps };