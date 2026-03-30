import { ScrollView, Text, View } from "react-native";
import { styles } from "./styles";
import { user } from "@/utils/userService";
import { EmptyState } from "@/app/pages/empty-state";
import { Colors } from "@/constants/global-styles";
import { StrataHeader, StrataButton } from "@/components";
import { BellIcon } from "@/components/icons";

export default function MyTrips() {
  return (
    <View style={styles.page}>
      {!user.trips ? (
        <ScrollView
          style={styles.page}
          contentContainerStyle={styles.scrollView}
        >
          <Text>Heloo</Text>
        </ScrollView>
      ) : (
        <View style={styles.container}>
          <StrataHeader
          classname={styles.header}
            icons={[
              {
                icon: <BellIcon color={Colors.primaryDark} />,
                classname: styles.icon,
                onPress: () => {},
              },
            ]}
          />

          <EmptyState
            title="No trips planned yet."
            subtitle="Start planning your next adventure or find inspiration from the community."
            buttons={[
              <StrataButton
                key="create-trip"
                title="Create Trip"
                text="Plan your dream trip!"
                imageSource={require("@/assets/images/plane-taking-off.png")}
                onPress={() => {
                  console.log("hello");
                }}
              />,
              <StrataButton
                key="discover-trip"
                title="Discover"
                text="Browse community itineraries."
                imageSource={require("@/assets/images/compass.png")}
                textclassname={{ color: Colors.blue900 }}
                classname={{
                  backgroundColor: Colors.blue100,
                  borderColor: Colors.blue200,
                }}
                blobclassname={{ backgroundColor: Colors.blue300 }}
                onPress={() => {
                  console.log("hello");
                }}
              />,
            ]}
          />
        </View>
      )}
    </View>
  );
}
