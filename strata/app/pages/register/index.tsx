import { View, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import Animated from "react-native-reanimated";
import { styles } from "./styles";
import { Colors } from "@/constants/global-styles";
import { usePageAnimations } from "@/hooks/animations/useAuthAnimations";
import { WaveSVG } from "@/components/svgs";
import { ArrowIcon, EyeIcon, EyeOffIcon } from "@/components/icons";
import StrataFooter from "@/components/strata-footer/StrataFooter";
import StrataHeader from "@/components/strata-header/StrataHeader";
import StrataForm from "@/components/strata-form/StrataForm";
import StrataInput from "@/components/strata-inputs/StrataInput";
import {
  nameInputProperties,
  usernameInputProperties,
  emailInputProperties,
  passwordInputProperties,
} from "@/utils/input-properties";
import { StrataCTA } from "@/components/strata-cta/StrataCTA";

export default function Register() {
  const router = useRouter();
  const { invertedWaveStyle, contentStyle, animateAndNavigate } =
    usePageAnimations();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);

  function handleSubmit() {
    console.log("Form data:", { name, username, email, password });
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
          isDisabled={!email || !password || !username || !name}
          onPress={handleSubmit}
          // animateAndNavigate(handleSubmit)
        />
      ),
    },
  ];

  return (
    <View style={styles.page}>
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
