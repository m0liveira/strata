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

type Form = {
    identifier?: string;
    name?: string;
    username?: string;
    email?: string;
    password?: string;
}

export type { IconProps, SvgProps, Form };