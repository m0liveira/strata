import { View, KeyboardAvoidingView, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import * as SecureStore from "expo-secure-store";
import Animated from "react-native-reanimated";
import { styles } from "@/styles/register/styles";
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
  nameInputProperties,
  usernameInputProperties,
  emailInputProperties,
  passwordInputProperties,
} from "@/utils/input-properties";
import { getUserData, loginUser, registerUser } from "@/utils/StrataApiService";
import { user } from "@/utils/userService";

export default function Register() {
  const router = useRouter();
  const { invertedWaveStyle, contentStyle, animateAndNavigate } =
    usePageAnimations();
  const [response, setResponse] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPasswordHidden, setIsPasswordHidden] = useState<boolean>(true);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [toastType, setToastType] = useState<"error" | "success">("error");

  function displayToastNotification(response: string, type?: string) {
    setResponse(response);
    if (type) setToastType("success");
    setIsVisible(true);
  }

  async function handleSubmit(form: Form) {
    setIsLoading(true);

    try {
      const result = await registerUser(form);

      const res = await loginUser({ identifier: username, password });
      user.access_token = res.access_token;

      const userData = await getUserData();
      Object.assign(user, userData);

      displayToastNotification(result.message, "success");

      await SecureStore.setItemAsync("strata_user_token", user.access_token);

      animateAndNavigate(() => router.replace("/(tabs)/dashboard"));
    } catch (error: any) {
      console.error(error);
      displayToastNotification(error.message);
    } finally {
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
            ...nameInputProperties,
            value: name,
            onChangeText: setName,
          }}
        />
      ),
    },
    {
      element: (
        <StrataInput
          classname={{ container: styles.inputContainer }}
          properties={{
            ...usernameInputProperties,
            value: username,
            onChangeText: setUsername,
          }}
        />
      ),
    },
    {
      element: (
        <StrataInput
          classname={{ container: styles.inputContainer }}
          properties={{
            ...emailInputProperties,
            value: email,
            onChangeText: setEmail,
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
          text="Join Strata"
          isDisabled={!email || !password || !username || !name || isLoading}
          onPress={() => handleSubmit({ name, username, email, password })}
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

        <Animated.Text style={[styles.h1, contentStyle]}>
          Join Strata
        </Animated.Text>

        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={[styles.container, contentStyle]}>
            <StrataForm elements={formProps} />
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>

      <StrataFooter />
    </View>
  );
}
