import { View, Text } from "react-native";
import Animated, { SlideInDown } from "react-native-reanimated";
import { styles } from "./styles";
import { Colors } from "@/constants/global-styles";
import { WaveSVG } from "@/components/svgs";
import { StrataCTA, StrataFooter } from "@/components";
import { useRouter } from "expo-router";
import { usePageAnimations } from "@/hooks/animations/useGetStartedAnimations";

export default function GetStarted() {
  const router = useRouter();
  const { planeStyle, waveStyle, contentStyle, animateAndNavigate } =
    usePageAnimations();

  return (
    <View style={styles.page}>
      <Animated.View style={[styles.waveSvg, waveStyle]}>
        <WaveSVG
          colors={{
            primary: Colors.coral400,
            secondary: Colors.coral300,
            tertiary: Colors.coral200,
          }}
        />
      </Animated.View>

      <Animated.Image
        source={require("@/assets/images/plane-taking-off.png")}
        style={[styles.image, planeStyle]}
        resizeMode="contain"
      />

      <Animated.Text style={[styles.h1, contentStyle]}>
        Fly the world with Strata
      </Animated.Text>

      <Animated.View style={[styles.container, contentStyle]}>
        <StrataCTA
          text="Get Started"
          isDisabled={false}
          onPress={() =>
            animateAndNavigate(() => router.push("/pages/register"))
          }
        />

        <Text style={styles.p}>
          Already have an account?{" "}
          <Text
            style={styles.link}
            onPress={() =>
              animateAndNavigate(() => router.push("/pages/login"))
            }
          >
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
