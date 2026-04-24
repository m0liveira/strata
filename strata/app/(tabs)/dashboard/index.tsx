/* eslint-disable react-hooks/exhaustive-deps */
import { ScrollView, Text, View } from "react-native";
import { useState, useCallback, useEffect } from "react";
import { router, useFocusEffect, Tabs } from "expo-router";
import * as Crypto from "expo-crypto";
import { styles } from "@/styles/my-trips/styles";
import { user } from "@/utils/userService";
import { EmptyState } from "@/app/pages/empty-state";
import { Colors } from "@/constants/global-styles";
import { StrataHeader, StrataButton } from "@/components";
import { ArrowIcon, BellIcon, ChatBubbleIcon } from "@/components/icons";
import { TripCreationOptions, TripCreationForm } from "@/components/features/";
import { screenOptions } from "../_layout";
import {
  getUsersData,
  uploadImageToSupabase,
  deleteImageFromSupabase,
  pushChanges,
  inviteToTrip,
  getTripByID,
} from "@/utils/StrataApiService";
import { StrataTab } from "@/components/strata-tab/StrataTab";

export default function MyTrips() {
  const [isCreating, setisCreating] = useState(false);
  const [isManual, setisManual] = useState(true);
  const [creationStage, setCreationStage] = useState(0);
  const [currentTab, setCurrentTab] = useState("Overview");
  const [trip, setTrip] = useState<any>(null);

  const tabs = ["Overview", "Map", "Budget"];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

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
      let selectedTrip = null;

      if (user.trips?.length > 0) {
        const upcomingTrips = user.trips.filter((t) => {
          if (!t.start_date) return false;

          const referenceDate = t.end_date
            ? new Date(t.end_date)
            : new Date(t.start_date);
          return referenceDate >= today;
        });

        if (upcomingTrips.length > 0) {
          selectedTrip = upcomingTrips.sort((a, b) => {
            return (
              new Date(a.start_date).getTime() -
              new Date(b.start_date).getTime()
            );
          })[0];
        } else {
          const tripsWithoutDates = user.trips.filter((t) => !t.start_date);
          selectedTrip =
            tripsWithoutDates.length > 0 ? tripsWithoutDates[0] : null;
        }
      }

      setTrip(selectedTrip);

      if (selectedTrip && selectedTrip.trip_id) {
        const fetchTrip = async () => {
          try {
            const tripData = await getTripByID(selectedTrip.trip_id);
            setTrip(tripData);
          } catch (error) {
            console.error("Error fetching trip:", error);
          }
        };

        fetchTrip();
      }

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
        start_date: tripCoreData.start_date
          ? new Date(tripCoreData.start_date).toISOString()
          : tripCoreData.start_date,
        end_date: tripCoreData.end_date
          ? new Date(tripCoreData.end_date).toISOString()
          : tripCoreData.end_date,
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

      user.trips.push(myChanges.trips.created[0]);
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

      await handleCreateTrip(data);

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

  function renderTabContent() {
    // #TODO: Add real map and itinerary content here. For now, just placeholders.
    if (currentTab === "Map") {
      return <Text>Hello World</Text>;
    }

    if (currentTab === "Overview") {
      //   if (locations.length === 0) {
      //     return (
      //       <View style={styles.emptyStateContainer}>
      //         <EmptyState
      //           globeClassName={styles.globe}
      //           buttons={[
      //             <StrataButton
      //               key="add-spot"
      //               title="Add a Spot"
      //               text="What do you wish to see?"
      //               imageSource={require("@/assets/images/pin.png")}
      //               onPress={() => setisCreating(true)}
      //             />,
      //           ]}
      //         />
      //       </View>
      //     );
      //   }
      //   return <StrataLocationGroup locations={locations} />;
    }

    // if (currentTab.startsWith("Day")) {
    //   const dayNumber = parseInt(currentTab.split(" ")[1], 10);

    //   const dayLocations = locations
    //     .filter((loc: any) => loc.day === dayNumber)
    //     .sort((a: any, b: any) => {
    //       if (!a.scheduled_time && !b.scheduled_time) return 0;

    //       if (!a.scheduled_time) return 1;

    //       if (!b.scheduled_time) return -1;

    //       return (
    //         new Date(a.scheduled_time).getTime() -
    //         new Date(b.scheduled_time).getTime()
    //       );
    //     });

    //   if (dayLocations.length === 0) {
    //     return (
    //       <View style={styles.emptyStateContainer}>
    //         <EmptyState
    //           globeClassName={styles.globe}
    //           buttons={[
    //             <StrataButton
    //               key="add-spot"
    //               title="Add a Spot"
    //               text="What do you wish to see?"
    //               imageSource={require("@/assets/images/pin.png")}
    //               onPress={() => setisCreating(true)}
    //             />,
    //           ]}
    //         />
    //       </View>
    //     );
    //   }

    //   return <StrataLocationGroup locations={dayLocations} />;
    // }

    return null;
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
          trip?.members?.length > 1 && {
            flexDirection: "row",
            justifyContent: "space-between",
          },
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
              ? () => {} // #TODO: Add notification functionality
              : () =>
                  creationStage === 0
                    ? setisCreating(!isCreating)
                    : setCreationStage(creationStage - 1),
          },
          ...(trip?.members?.length > 1
            ? [
                {
                  icon: <ChatBubbleIcon color={Colors.primaryDark} />,
                  classname: styles.icon,
                  onPress: () => {},
                  // #TODO: Add chat functionality
                },
              ]
            : []),
        ]}
      />

      {trip || isCreating ? (
        <>
          {isCreating ? (
            renderCreationStage()
          ) : (
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={styles.scrollPage}
              contentContainerStyle={[
                styles.scrollView,
                { justifyContent: "flex-start", paddingTop: 10, gap: 40 },
              ]}
            >
              <StrataTab
                tabs={tabs}
                activeTab={currentTab}
                onTabPress={(tabTitle) => setCurrentTab(tabTitle)}
              />

              {renderTabContent()}
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
