import { View, KeyboardAvoidingView, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import * as SecureStore from "expo-secure-store";
import Animated from "react-native-reanimated";
import { styles } from "./styles";
import { Colors } from "@/constants/global-styles";
import { WaveSVG } from "@/components/svgs";
import { ArrowIcon, EyeIcon, EyeOffIcon } from "@/components/icons";
import {
  StrataFooter,
  StrataHeader,
  StrataForm,
  StrataInput,
  StrataCTA,
  StrataToastAlert,
} from "@/components";
import { usePageAnimations } from "@/hooks/animations/useAuthAnimations";
import { Form } from "@/types/common";
import {
  passwordInputProperties,
  identifierInputProperties,
} from "@/utils/input-properties";
import { loginUser, getUserData } from "@/utils/StrataApiService";
import { user } from "@/utils/userService";

export default function Login() {
  const router = useRouter();
  const { invertedWaveStyle, contentStyle, animateAndNavigate } =
    usePageAnimations();
  const [identifier, setIdentifier] = useState<string>("");
  const [password, setPassword] = useState("");
  const [isPasswordHidden, setIsPasswordHidden] = useState<boolean>(true);
  const [response, setResponse] = useState<string>("");
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [toastType, setToastType] = useState<"error" | "success">("error");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  function displayToastNotification(response: string, type?: string) {
    setResponse(response);
    if (type !== null) setToastType("success");
    setIsVisible(true);
  }

  async function handleSubmit(form: Form) {
    setIsLoading(true);

    try {
      const result = await loginUser(form);
      user.access_token = result.access_token;

      try {
        const userData = await getUserData();
        Object.assign(user, userData);

        displayToastNotification("Logged in successfully!", "success");

        await SecureStore.setItemAsync("strata_user_token", user.access_token);

        animateAndNavigate(() => router.replace("/(tabs)/dashboard"));
      } catch (err: any) {
        displayToastNotification(err.message);
        setIsLoading(false);
      }
    } catch (error: any) {
      displayToastNotification(error.message);
      setIsLoading(false);
    }
  }

  const headerProps = [
    {
      icon: <ArrowIcon color={Colors.primaryDark} />,
      classname: styles.iconBg,
      onPress: () => animateAndNavigate(() => router.back()),
    },
  ];

  const formProps = [
    {
      element: (
        <StrataInput
          properties={{
            ...identifierInputProperties,
            value: identifier,
            onChangeText: setIdentifier,
          }}
        />
      ),
    },
    {
      element: (
        <StrataInput
          classname={{ container: styles.inputContainer, input: styles.input }}
          icon={{
            icon: isPasswordHidden ? (
              <EyeIcon color={Colors.grey400} />
            ) : (
              <EyeOffIcon color={Colors.grey400} />
            ),
            onPress: () => setIsPasswordHidden(!isPasswordHidden),
          }}
          properties={{
            ...passwordInputProperties,
            secureTextEntry: isPasswordHidden,
            value: password,
            onChangeText: setPassword,
          }}
        />
      ),
    },
    {
      element: (
        <StrataCTA
          classname={styles.button}
          text="Log in to Strata"
          isDisabled={!identifier || !password || isLoading}
          onPress={() => handleSubmit({ identifier, password })}
        />
      ),
    },
  ];

  return (
    <View style={styles.page}>
      <StrataToastAlert
        visible={isVisible}
        setVisible={setIsVisible}
        message={response}
        type={toastType}
      />

      <Animated.View style={[styles.waveSvg, invertedWaveStyle]}>
        <WaveSVG
          colors={{
            primary: Colors.coral400,
            secondary: Colors.coral300,
            tertiary: Colors.coral200,
          }}
        />
      </Animated.View>

      <KeyboardAvoidingView style={styles.view} behavior="padding">
        <Animated.View style={[styles.container, contentStyle]}>
          <StrataHeader icons={headerProps} />
        </Animated.View>

        <Animated.Image
          source={require("@/assets/images/passport.png")}
          style={[styles.image, contentStyle]}
          resizeMode="contain"
        />

        <Animated.Text style={[styles.h1, contentStyle]}>
          Fly the world with Strata
        </Animated.Text>

        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={[styles.container, contentStyle]}>
            <StrataForm elements={formProps} classname={styles.form} />
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>

      <StrataFooter />
    </View>
  );
}
