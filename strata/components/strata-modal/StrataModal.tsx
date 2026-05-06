import React, { ReactNode, useRef, useEffect } from "react";
import {
  Modal,
  View,
  Pressable,
  ScrollView,
  Animated,
  PanResponder,
} from "react-native";
import { styles } from "./styles";

type BottomSheetProps = {
  isVisible: boolean;
  onClose: () => void;
  children: ReactNode;
};

export function StrataModal(props: BottomSheetProps) {
  const panY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (props.isVisible) {
      panY.setValue(0);
    }
  }, [props.isVisible, panY]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return (
          gestureState.dy > 0 &&
          Math.abs(gestureState.dy) > Math.abs(gestureState.dx)
        );
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          panY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100 || gestureState.vy > 1.5) {
          Animated.timing(panY, {
            toValue: 500,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            props.onClose();
          });
        } else {
          Animated.spring(panY, {
            toValue: 0,
            useNativeDriver: true,
            bounciness: 4,
          }).start();
        }
      },
    }),
  ).current;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={props.isVisible}
      onRequestClose={props.onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={props.onClose} />

        <Animated.View
          style={[styles.sheet, { transform: [{ translateY: panY }] }]}
        >
          <View style={styles.handleContainer} {...panResponder.panHandlers}>
            <View style={styles.handle} />
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.scrollContainer}
            contentContainerStyle={styles.content}
          >
            {props.children}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}
