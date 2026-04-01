import { ScrollView, Text, View } from "react-native";
import { styles } from "./styles";
import { useState, useCallback } from "react";
import { router, useFocusEffect } from "expo-router";
import { user } from "@/utils/userService";
import { EmptyState } from "@/app/pages/empty-state";
import { Colors } from "@/constants/global-styles";
import { StrataHeader, StrataButton } from "@/components";
import { ArrowIcon, BellIcon } from "@/components/icons";
import { TripCreationOptions, TripCreationForm } from "@/components/features/";

export default function MyTrips() {
  const [isCreating, setisCreating] = useState(false);
  const [isManual, setisManual] = useState(true);
  const [creationStage, setCreationStage] = useState(0);

  useFocusEffect(
    useCallback(() => {
      return () => {
        setisCreating(false);
        setisManual(true);
        setCreationStage(0);
      };
    }, []),
  );

  function advanceToForm(bool: boolean) {
    setisManual(bool);
    setCreationStage(1);
  }

  function renderCreationStage() {
    switch (creationStage) {
      case 0:
        return (
          <TripCreationOptions
            manualOnPress={() => advanceToForm(true)}
            generateOnPress={() => advanceToForm(false)}
          />
        );
      case 1:
        return <TripCreationForm stage={creationStage} />;
      case 2:
        return (
          <TripCreationOptions
            manualOnPress={() => advanceToForm(true)}
            generateOnPress={() => advanceToForm(false)}
          />
        );
      case 3:
        return (
          <TripCreationOptions
            manualOnPress={() => advanceToForm(true)}
            generateOnPress={() => advanceToForm(false)}
          />
        );
    }
  }

  return (
    <View style={styles.page}>
      <StrataHeader
        classname={[
          styles.header,
          isCreating && { justifyContent: "flex-start" },
        ]}
        icons={[
          {
            icon: !isCreating ? (
              <BellIcon color={Colors.primaryDark} />
            ) : (
              <ArrowIcon color={Colors.primaryDark} />
            ),
            classname: !isCreating ? styles.icon : styles.bgIcon,
            onPress: !isCreating
              ? // #TODO: add notification functionality
                () => {}
              : () =>
                  creationStage === 0
                    ? setisCreating(!isCreating)
                    : setCreationStage(creationStage - 1),
          },
        ]}
      />

      {!user.trips || isCreating ? (
        <>
          {isCreating ? (
            renderCreationStage()
          ) : (
            <ScrollView
              // style={styles.page}
              contentContainerStyle={styles.scrollView}
            >
              <Text>Heloo</Text>
            </ScrollView>
          )}
        </>
      ) : (
        <EmptyState
          title="No trips planned yet."
          subtitle="Start planning your next adventure or find inspiration from the community."
          buttons={[
            <StrataButton
              key="create-trip"
              title="Create Trip"
              text="Plan your dream trip!"
              imageSource={require("@/assets/images/plane-taking-off.png")}
              onPress={() => setisCreating(true)}
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
              onPress={() => router.push("/(tabs)/discover")}
            />,
          ]}
        />
      )}
    </View>
  );
}
