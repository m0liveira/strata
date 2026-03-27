import { ScrollView, Text, View } from "react-native";
import { styles } from "./styles";
import { user } from "@/utils/userService";

export default function MyTrips() {
  return !user.trips ? (
    <ScrollView style={styles.page} contentContainerStyle={styles.scrollView}>
      <Text>Heloo</Text>
    </ScrollView>
  ) : (
    <View style={styles.page}>
      <Text>Heloo no trips</Text>
    </View>
  );
}
