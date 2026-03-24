import { View, Text } from "react-native";
import Animated, { SlideInDown, SlideInRight } from "react-native-reanimated";
import { styles } from "./styles";
import { Colors } from "@/constants/global-styles";
import { WaveSVG } from "@/components/svgs";
import { StrataCTA } from "@/components/strata-cta/StrataCTA";
import StrataFooter from "@/components/strata-footer/StrataFooter";
import { PlaneTakeOff, WaveEntrance } from "@/animations/index";
import { router } from "expo-router";

export default function GetStarted() {
  return (
    <View style={styles.page}>
      <Animated.View entering={WaveEntrance} style={styles.waveSvg}>
        <WaveSVG
          colors={{
            primary: Colors.coral400,
            secondary: Colors.coral300,
            tertiary: Colors.coral200,
          }}
        />
      </Animated.View>

      <Animated.Image
        entering={PlaneTakeOff}
        source={require("@/assets/images/plane-taking-off.png")}
        resizeMode="contain"
        style={styles.image}
      />

      <Animated.Text style={styles.h1} entering={SlideInRight.duration(350)}>
        Fly the world with Strata
      </Animated.Text>

      <Animated.View
        style={styles.container}
        entering={SlideInRight.duration(350)}
      >
        <StrataCTA
          text="Get Started"
          isDisabled={false}
          onPress={() => router.push("/pages/register")}
        />

        <Text style={styles.p}>
          Already have an account?{" "}
          <Text style={styles.link} onPress={() => router.push("/pages/login")}>
            Log in
          </Text>
        </Text>
      </Animated.View>

      <Animated.View style={styles.view} entering={SlideInDown.duration(350)}>
        <StrataFooter />
      </Animated.View>
    </View>
  );
}
