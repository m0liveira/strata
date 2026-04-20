import { View, Text, StyleProp, ViewStyle, Pressable } from "react-native";
import { styles } from "./styles";

type TabProps = {
  classname?: StyleProp<ViewStyle>;
  tabs: string[];
  activeTab: string;
  onTabPress: (tab: string) => void;
};

export function StrataTab(props: TabProps) {
  return (
    <View style={[styles.container, props.classname]}>
      {props.tabs.map((tabTitle, index) => {
        const isActive = props.activeTab === tabTitle;

        return (
          <Pressable
            style={[styles.tab, isActive && styles.activeTab]}
            key={index}
            onPress={() => props.onTabPress(tabTitle)}
          >
            <Text style={[styles.title, isActive && styles.activeTitle]}>
              {tabTitle}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
