import Svg, { Defs, RadialGradient, Stop, Circle } from "react-native-svg";
import { CommonStyles } from "@/constants/global-styles";

export const GlobeShadowSVG = () => {
  return (
    <Svg height="200" width="200" style={CommonStyles.glow}>
      <Defs>
        <RadialGradient id="glowGrad" cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor="#ACE7A9" stopOpacity="1" />
          <Stop offset="50%" stopColor="#90E2F5" stopOpacity="1" />
          <Stop offset="100%" stopColor="#ACE7A9" stopOpacity="1" />
        </RadialGradient>
      </Defs>
      <Circle cx="95" cy="95" r="95" fill="url(#glowGrad)" />
    </Svg>
  );
};
