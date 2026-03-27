/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef } from "react";
import { Text, Animated } from "react-native";
import { styles } from "./styles";

type ToastProps = {
  message: string;
  visible: boolean;
  setVisible: (visible: boolean) => void;
  type?: "error" | "success";
};

export function StrataToastAlert({
  message,
  visible,
  setVisible,
  type = "error",
}: ToastProps) {
  const slideAnim = useRef(new Animated.Value(-150)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        Animated.timing(slideAnim, {
          toValue: -150,
          duration: 300,
          useNativeDriver: true,
        }).start(() => setVisible(false));
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible || !message) return null;

  const messagesArray = message
    ? message
        .replace("[Error: ", "")
        .replace("Error: ", "")
        .replace("]", "")
        .split(",")
    : [];

  const isError = type === "error";

  return (
    <Animated.View
      style={[
        styles.container,
        isError ? styles.errorContainer : styles.successContainer,
        { transform: [{ translateY: slideAnim }] },
      ]}
    >
      {messagesArray.map((msg, index) => (
        <Text
          key={index}
          style={[styles.text, isError ? styles.errorText : styles.successText]}
        >
          {msg.trim()}
        </Text>
      ))}
    </Animated.View>
  );
}
