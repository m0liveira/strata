import Svg, { Defs, Stop, Circle, LinearGradient } from "react-native-svg";
import { CommonStyles } from "@/constants/global-styles";

export const GlobeShadowSVG = () => {
  return (
    <Svg height="200" width="200" style={CommonStyles.glow}>
      <Defs>
        <LinearGradient id="glowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#ACE7A9" stopOpacity="1" />
          <Stop offset="50%" stopColor="#90E2F5" stopOpacity="1" />
          <Stop offset="100%" stopColor="#ACE7A9" stopOpacity="1" />
        </LinearGradient>
      </Defs>
      <Circle cx="105" cy="105" r="105" fill="url(#glowGrad)" />
    </Svg>
  );
};
