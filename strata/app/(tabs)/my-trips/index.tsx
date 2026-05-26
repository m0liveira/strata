import { ScrollView, View } from "react-native";
import { useState, useCallback, useEffect, useMemo } from "react";
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
import { StrataTab } from "@/components/strata-tab/StrataTab";
import { TripCard } from "@/components/strata-trip-card/StrataTripCard";
import { Notifications } from "@/components/features/notifications/Notifications";
import { generateTrip } from "@/utils/aiService";
import { StrataGenerativePage } from "@/components/strata-generative-page/StrataGenerativePage";

export default function MyTrips() {
  const [isCreating, setisCreating] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isManual, setisManual] = useState(true);
  const [creationStage, setCreationStage] = useState(0);
  const [currentTab, setCurrentTab] = useState("Upcoming");
  const [trips, setTrips] = useState<any[]>([]);
  const [notificationVisible, setNotificationVisible] = useState(false);

  const tabs = ["Upcoming", "Past trips"];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  useEffect(() => {
    const loadProfiles = async () => {
      if (
        (!user.friends_profiles || user.friends_profiles.length === 0) &&
        user.friends?.length > 0
      ) {
        try {
          user.friends_profiles = await getUsersData(user.friends);
        } catch (error) {
          console.error("Error:", error);
        }
      }
    };
    loadProfiles();
  }, []);

  useFocusEffect(
    useCallback(() => {
      setTrips([...user.trips]);
      return () => {
        setisCreating(false);
        setisManual(true);
        setCreationStage(0);
        setIsGenerating(false);
      };
    }, []),
  );

  const upcomingTrips = useMemo(() => {
    return trips
      .filter(
        (trip) =>
          !trip.start_date ||
          !trip.end_date ||
          new Date(trip.end_date) >= today,
      )
      .sort((a, b) => {
        if (!a.start_date && !b.start_date) return 0;
        if (!a.start_date) return 1;
        if (!b.start_date) return -1;
        return (
          new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
        );
      });
  }, [trips]);

  const pastTrips = useMemo(() => {
    return trips
      .filter(
        (trip) =>
          trip.start_date && trip.end_date && new Date(trip.end_date) < today,
      )
      .sort(
        (a, b) =>
          new Date(b.end_date).getTime() - new Date(a.end_date).getTime(),
      );
  }, [trips]);

  const processTrip = async (data: any, isAI: boolean) => {
    let finalBannerUrl = data.banner;
    let imageWasUploaded = false;

    try {
      const newTripId = Crypto.randomUUID();

      const uploadTask = async () => {
        if (data.banner && data.banner.startsWith("file://")) {
          finalBannerUrl = await uploadImageToSupabase(data.banner, "banners");
          imageWasUploaded = true;
        }
      };

      let aiResult = null;

      if (isAI) {
        const [_, aiRes] = await Promise.all([
          uploadTask(),
          generateTrip(data),
        ]);
        aiResult = aiRes;
      } else {
        await uploadTask();
      }

      const { destinations, selectedUsers, banner, ...tripCoreData } = data;

      const createdDestinations = destinations.map((destination: string) => ({
        destination_id: Crypto.randomUUID(),
        trip_id: newTripId,
        destination,
      }));

      const createdLocations =
        aiResult?.locations?.map((loc: any) => {
          let safeDate = loc.scheduled_time;
          if (safeDate && !safeDate.includes("T")) {
            safeDate = new Date(safeDate.replace(" ", "T")).toISOString();
          } else if (safeDate) {
            safeDate = new Date(safeDate).toISOString();
          }
          return {
            ...loc,
            location_id: Crypto.randomUUID(),
            trip_id: newTripId,
            scheduled_time: safeDate || null,
          };
        }) || [];

      const myChanges = {
        trips: {
          created: [
            {
              trip_id: newTripId,
              banner: finalBannerUrl,
              ...tripCoreData,
              start_date: tripCoreData.start_date
                ? new Date(tripCoreData.start_date).toISOString()
                : tripCoreData.start_date,
              end_date: tripCoreData.end_date
                ? new Date(tripCoreData.end_date).toISOString()
                : tripCoreData.end_date,
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
        locations: { created: createdLocations, updated: [], deleted: [] },
      };

      await pushChanges(myChanges);

      if (selectedUsers?.length > 0) {
        await Promise.all(
          selectedUsers.map((user: any) => inviteToTrip(newTripId, user)),
        );
      }

      user.trips.push(myChanges.trips.created[0]);
      setTrips([...user.trips]);
    } catch (error) {
      console.error(error);
      alert("Error creating trip. Please try again.");
      if (imageWasUploaded && finalBannerUrl) {
        try {
          await deleteImageFromSupabase(finalBannerUrl, "banners");
        } catch (cleanupError) {
          console.error("Error during cleanup:", cleanupError);
        }
      }
    }
  };

  async function handleSubmit(data: any) {
    if (creationStage !== 3) {
      setCreationStage(creationStage + 1);
      return;
    }

    if (!isManual) setIsGenerating(true);

    await processTrip(data, !isManual);

    setisCreating(false);
    setisManual(true);
    setCreationStage(0);
    setIsGenerating(false);
  }

  if (notificationVisible) {
    return (
      <>
        <Tabs.Screen options={{ tabBarStyle: { display: "none" } }} />
        <Notifications
          pending={{ friends: user.pending_friends, trips: user.pending_trips }}
          setVisible={setNotificationVisible}
        />
      </>
    );
  }

  if (isGenerating) {
    return (
      <>
        <Tabs.Screen options={{ tabBarStyle: { display: "none" } }} />
        <StrataGenerativePage />
      </>
    );
  }

  const hideTabs = isCreating && creationStage !== 0;

  return (
    <View style={styles.page}>
      <Tabs.Screen
        options={{
          tabBarStyle: hideTabs
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
            hasNotification:
              (user.pending_friends.length > 0 ||
                user.pending_trips.length > 0) &&
              !isCreating,
            onPress: !isCreating
              ? () => setNotificationVisible(true)
              : () =>
                  creationStage === 0
                    ? setisCreating(!isCreating)
                    : setCreationStage(creationStage - 1),
          },
        ]}
      />

      {user.trips.length === 0 && !isCreating ? (
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
      ) : (
        <>
          {isCreating ? (
            creationStage === 0 ? (
              <TripCreationOptions
                manualOnPress={() => {
                  setisManual(true);
                  setCreationStage(1);
                }}
                generateOnPress={() => {
                  setisManual(false);
                  setCreationStage(1);
                }}
              />
            ) : (
              <TripCreationForm
                stage={creationStage}
                handleSubmit={handleSubmit}
              />
            )
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
                onTabPress={setCurrentTab}
              />

              {(currentTab === "Upcoming" ? upcomingTrips : pastTrips).map(
                (trip) => (
                  <TripCard
                    key={trip.trip_id}
                    trip={trip}
                    onPress={() =>
                      router.push({
                        pathname: "/trip/[trip_id]",
                        params: { trip_id: trip.trip_id, origin: "my-trips" },
                      })
                    }
                  />
                ),
              )}

              <StrataButton
                classname={styles.createTripButton}
                key="create-trip"
                title="Create Trip"
                text="Plan your dream trip!"
                imageSource={require("@/assets/images/plane-taking-off.png")}
                onPress={() => setisCreating(true)}
              />
            </ScrollView>
          )}
        </>
      )}
    </View>
  );
}
