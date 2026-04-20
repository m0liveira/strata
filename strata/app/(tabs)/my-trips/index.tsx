import { ScrollView, Text, View } from "react-native";
import { useState, useCallback, useEffect } from "react";
import { router, useFocusEffect, Tabs } from "expo-router";
import * as Crypto from "expo-crypto";
import { styles } from "@/styles/my-trips/styles";
import { user } from "@/utils/userService";
import { EmptyState } from "@/app/pages/empty-state";
import { Colors } from "@/constants/global-styles";
import { StrataHeader, StrataButton } from "@/components";
import { ArrowIcon, BellIcon } from "@/components/icons";
import { TripCreationOptions, TripCreationForm } from "@/components/features/";
import { screenOptions } from "../_layout";
import {
  getUsersData,
  uploadImageToSupabase,
  deleteImageFromSupabase,
  pushChanges,
  inviteToTrip,
} from "@/utils/StrataApiService";

export default function MyTrips() {
  const [isCreating, setisCreating] = useState(false);
  const [isManual, setisManual] = useState(true);
  const [creationStage, setCreationStage] = useState(0);

  useEffect(() => {
    const loadProfiles = async () => {
      if (
        (!user.friends_profiles || user.friends_profiles.length === 0) &&
        user.friends?.length > 0
      ) {
        try {
          const profiles = await getUsersData(user.friends);
          user.friends_profiles = profiles;
        } catch (error) {
          console.error("Error:", error);
        }
      }
    };

    loadProfiles();
  }, []);

  useFocusEffect(
    useCallback(() => {
      return async () => {
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

  const handleCreateTrip = async (data: any) => {
    let finalBannerUrl = data.banner;
    let imageWasUploaded = false;

    try {
      if (data.banner && data.banner.startsWith("file://")) {
        finalBannerUrl = await uploadImageToSupabase(data.banner, "banners");
        imageWasUploaded = true;
      }

      const { destinations, selectedUsers, banner, ...tripCoreData } = data;

      const newTripId = Crypto.randomUUID();

      const createdDestinations = destinations.map((destination: string) => ({
        destination_id: Crypto.randomUUID(),
        trip_id: newTripId,
        destination,
      }));

      const formattedTripData = {
        ...tripCoreData,
        start_date: new Date(tripCoreData.start_date).toISOString(),
        end_date: new Date(tripCoreData.end_date).toISOString(),
      };

      const myChanges = {
        trips: {
          created: [
            {
              trip_id: newTripId,
              banner: finalBannerUrl,
              ...formattedTripData,
            },
          ],
          updated: [],
          deleted: [],
        },
        destinations: {
          created: createdDestinations,
          updated: [],
          deleted: [],
        },
      };

      await pushChanges(myChanges);

      for (const user of selectedUsers) {
        await inviteToTrip(newTripId, user);
      }
    } catch (error) {
      console.error(error);
      alert("Error creating trip. Please try again.");

      if (imageWasUploaded && finalBannerUrl) {
        try {
          await deleteImageFromSupabase(finalBannerUrl, "banners");
        } catch (cleanupError) {
          console.error(
            "Error during cleanup of uploaded image after failed trip creation:",
            cleanupError,
          );
        }
      }
    }
  };

  async function handleSubmit(data: any) {
    if (creationStage !== 3) {
      setCreationStage(creationStage + 1);
    } else {
      // #TODO: Save trip locally first...

      handleCreateTrip(data);

      setisCreating(false);
      setisManual(true);
      setCreationStage(0);
    }
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
      default:
        return (
          <TripCreationForm stage={creationStage} handleSubmit={handleSubmit} />
        );
    }
  }

  return (
    <View style={styles.page}>
      <Tabs.Screen
        options={{
          tabBarStyle:
            isCreating && creationStage !== 0
              ? { display: "none" }
              : screenOptions.tabBarStyle,
        }}
      />

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
              ? () => {} // #TODO: add notification functionality
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
            <ScrollView contentContainerStyle={styles.scrollView}>
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
