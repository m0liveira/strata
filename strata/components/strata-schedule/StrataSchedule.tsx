/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useEffect, useMemo } from "react";
import {
  View,
  Text,
  Pressable,
  NativeSyntheticEvent,
  NativeScrollEvent,
  StyleProp,
  ViewStyle,
  ScrollView,
  FlatList,
  Animated,
} from "react-native";
import { styles, ITEM_HEIGHT, VISIBLE_ITEMS } from "./styles";
import { Colors } from "@/constants/global-styles";
import { CheckmarkIcon } from "@/components/icons/";

type WheelPickerProps = {
  data: string[];
  selectedValue: string;
  onValueChange: (value: string) => void;
};

const WheelPicker = (props: WheelPickerProps) => {
  const flatListRef = useRef<FlatList>(null);
  const spacerCount = Math.floor(VISIBLE_ITEMS / 2);
  const spacers = Array(spacerCount).fill("");

  const scrollY = useRef(new Animated.Value(0)).current;

  const displayData = useMemo(() => {
    const loopedData = [...props.data, ...props.data, ...props.data];
    return [...spacers, ...loopedData, ...spacers];
  }, [props.data]);

  const snapOffsets = useMemo(
    () => displayData.map((_, index) => index * ITEM_HEIGHT),
    [displayData],
  );

  useEffect(() => {
    const N = props.data.length;
    const index = props.data.indexOf(props.selectedValue);

    if (index >= 0 && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToOffset({
          offset: (N + index) * ITEM_HEIGHT,
          animated: false,
        });
      }, 50);
    }
  }, []);

  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const N = props.data.length;

    if (offsetY < 0) return;

    let scrollIndex = Math.round(offsetY / ITEM_HEIGHT);

    if (scrollIndex < 0) scrollIndex = 0;
    if (scrollIndex >= N * 3) scrollIndex = N * 3 - 1;

    const realIndex = scrollIndex % N;

    props.onValueChange(props.data[realIndex]);

    if (scrollIndex < N || scrollIndex >= N * 2) {
      const middleIndex = N + realIndex;
      flatListRef.current?.scrollToOffset({
        offset: middleIndex * ITEM_HEIGHT,
        animated: false,
      });
    }
  };

  return (
    <View style={[styles.wheelContainer, { width: 140 }]}>
      <ScrollView
        horizontal
        scrollEnabled={false}
        contentContainerStyle={{ width: "100%" }}
      >
        <Animated.FlatList
          ref={flatListRef}
          data={displayData}
          keyExtractor={(_, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          snapToOffsets={snapOffsets}
          snapToAlignment="center"
          decelerationRate="fast"
          onMomentumScrollEnd={handleScrollEnd}
          nestedScrollEnabled={true}
          keyboardShouldPersistTaps="handled"
          onTouchStart={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          onTouchEnd={(e) => e.stopPropagation()}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true },
          )}
          scrollEventThrottle={16}
          getItemLayout={(_, index) => ({
            length: ITEM_HEIGHT,
            offset: ITEM_HEIGHT * index,
            index,
          })}
          contentContainerStyle={{ paddingVertical: 0 }}
          bounces={false}
          initialNumToRender={15}
          maxToRenderPerBatch={10}
          windowSize={5}
          renderItem={({ item, index }) => {
            const isSpacer = item === "";

            const itemCenterPos = (index - 2) * ITEM_HEIGHT;

            const inputRange = [
              itemCenterPos - 2 * ITEM_HEIGHT,
              itemCenterPos - 1 * ITEM_HEIGHT,
              itemCenterPos,
              itemCenterPos + 1 * ITEM_HEIGHT,
              itemCenterPos + 2 * ITEM_HEIGHT,
            ];

            const opacity = scrollY.interpolate({
              inputRange,
              outputRange: [0.25, 0.5, 1, 0.5, 0.25],
              extrapolate: "clamp",
            });

            const scale = scrollY.interpolate({
              inputRange,
              outputRange: [0.75, 0.85, 1, 0.85, 0.75],
              extrapolate: "clamp",
            });

            return (
              <View style={styles.itemContainer}>
                {!isSpacer && (
                  <Animated.Text
                    style={[
                      styles.itemText,
                      { color: Colors.primaryDark },
                      { opacity, transform: [{ scale }] },
                    ]}
                  >
                    {item}
                  </Animated.Text>
                )}
              </View>
            );
          }}
        />
      </ScrollView>
    </View>
  );
};

type StrataScheduleProps = {
  classname?: StyleProp<ViewStyle>;
  isScheduled: boolean;
  onToggleSchedule: (val: boolean) => void;
  hideCheckbox?: boolean;
  selectedHour: string;
  selectedMinute: string;
  onTimeChange: (hour: string, minute: string) => void;
  addLimit?: boolean;
};

export function StrataSchedule(props: StrataScheduleProps) {
  const times = useMemo(() => {
    const arr = [];

    if (!props.addLimit) {
      for (let h = 0; h < 24; h++) {
        for (let m = 0; m < 60; m++) {
          arr.push(
            `${h.toString().padStart(2, "0")} : ${m.toString().padStart(2, "0")}`,
          );
        }
      }
    } else {
      for (let h = 0; h <= 4; h++) {
        const maxM = h === 4 ? 0 : 59;

        for (let m = 0; m <= maxM; m++) {
          arr.push(
            `${h.toString().padStart(2, "0")} : ${m.toString().padStart(2, "0")}`,
          );
        }
      }
    }

    return arr;
  }, []);

  const currentSelectedTime = `${props.selectedHour} : ${props.selectedMinute}`;

  return (
    <View style={[styles.container, props.classname]}>
      {!props.hideCheckbox && (
        <Pressable
          style={styles.header}
          onPress={() => props.onToggleSchedule(!props.isScheduled)}
        >
          <Pressable
            style={[
              styles.checkbox,
              props.isScheduled && styles.checkboxActive,
            ]}
            onPress={() => props.onToggleSchedule(!props.isScheduled)}
          >
            {props.isScheduled && <CheckmarkIcon color={Colors.white} />}
          </Pressable>
          <Text style={styles.title}>Set Scheduled time</Text>
        </Pressable>
      )}

      {props.isScheduled && (
        <View style={styles.pickerContainer}>
          <View style={styles.highlightBar} pointerEvents="none" />

          <View style={styles.wheelsWrapper}>
            <WheelPicker
              data={times}
              selectedValue={currentSelectedTime}
              onValueChange={(timeStr) => {
                const [h, m] = timeStr.split(" : ");
                props.onTimeChange(h, m);
              }}
            />
          </View>
        </View>
      )}
    </View>
  );
}
