import React, { useCallback, useEffect, useState } from "react";
import { Tabs, useFocusEffect, useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";
import { styles } from "@/styles/trip/styles";
import { TripHeader } from "@/components/strata-trip-header/StrataTripHeader";
import {
  deleteImageFromSupabase,
  getTripByID,
  pushChanges,
  uploadTicketToSupabase,
} from "@/utils/StrataApiService";
import { StrataTab } from "@/components/strata-tab/StrataTab";
import { EmptyState } from "@/app/pages/empty-state";
import { StrataButton } from "@/components/strata-button/StrataButton";
import { SpotCreationForm } from "@/components/features/spot-creation-form/SpotCreationForm";
import { screenOptions } from "../_layout";
import { StrataHeader } from "@/components/strata-header/StrataHeader";
import { ArrowIcon } from "@/components/icons/ui-core/ArrowIcon";
import { Colors } from "@/constants/global-styles";
import * as Crypto from "expo-crypto";
import { StrataLocationGroup } from "@/components/strata-location-group/StrataRadioButtonGroup";
import { StrataSmallButton } from "@/components/strata-small-button/StrataButton";
import { TreePalmIcon } from "@/components/icons";

export default function Trip() {
  const [trip, setTrip] = useState<any>(null);
  const [currentTab, setCurrentTab] = useState("");
  const [tabs, setTabs] = useState<string[]>([]);
  const [isCreating, setisCreating] = useState(false);
  const [days, setDays] = useState(0);

  const { trip_id, origin } = useLocalSearchParams() as {
    trip_id: string;
    origin?: string;
  };

  useEffect(() => {
    const fetchTrip = async () => {
      const tripData = await getTripByID(trip_id);
      setTrip(tripData);

      if (tripData?.start_date && tripData?.end_date) {
        const start = new Date(tripData.start_date).getTime();
        const end = new Date(tripData.end_date).getTime();

        const diffInMilliseconds = end - start;
        const diffInDays =
          Math.round(diffInMilliseconds / (1000 * 60 * 60 * 24)) + 1;

        const generatedTabs = Array.from(
          { length: diffInDays },
          (_, i) => `Day ${i + 1}`,
        );

        setTabs(["Map", ...generatedTabs]);
        setCurrentTab(generatedTabs[0]);
        setDays(diffInDays);
      } else {
        setTabs(["Map", "Itinerary"]);
        setCurrentTab("Itinerary");
      }
    };

    fetchTrip();
  }, [trip_id]);

  useFocusEffect(
    useCallback(() => {
      return async () => {
        setisCreating(false);
        renderTabContent();
      };
    }, []),
  );

  function renderTabContent() {
    // #TODO: Add real map and itinerary content here. For now, just placeholders.
    if (currentTab === "Map") {
      return <Text>Hello World</Text>;
    }

    const locations = trip?.locations || [];

    if (currentTab === "Itinerary") {
      if (locations.length === 0) {
        return (
          <View style={styles.emptyStateContainer}>
            <EmptyState
              globeClassName={styles.globe}
              buttons={[
                <StrataButton
                  key="add-spot"
                  title="Add a Spot"
                  text="What do you wish to see?"
                  imageSource={require("@/assets/images/pin.png")}
                  onPress={() => setisCreating(true)}
                />,
              ]}
            />
          </View>
        );
      }

      return <StrataLocationGroup locations={locations} />;
    }

    if (currentTab.startsWith("Day")) {
      const dayNumber = parseInt(currentTab.split(" ")[1], 10);

      const dayLocations = locations
        .filter((loc: any) => loc.day === dayNumber)
        .sort((a: any, b: any) => {
          if (!a.scheduled_time && !b.scheduled_time) return 0;

          if (!a.scheduled_time) return 1;

          if (!b.scheduled_time) return -1;

          return (
            new Date(a.scheduled_time).getTime() -
            new Date(b.scheduled_time).getTime()
          );
        });

      if (dayLocations.length === 0) {
        return (
          <View style={styles.emptyStateContainer}>
            <EmptyState
              globeClassName={styles.globe}
              buttons={[
                <StrataButton
                  key="add-spot"
                  title="Add a Spot"
                  text="What do you wish to see?"
                  imageSource={require("@/assets/images/pin.png")}
                  onPress={() => setisCreating(true)}
                />,
              ]}
            />
          </View>
        );
      }

      return <StrataLocationGroup locations={dayLocations} />;
    }

    return null;
  }

  const createSpot = async (data: any) => {
    let finalTicketUrl = null;
    let ticketWasUploaded = false;
    let formattedTimestamp = data.scheduled_time;

    try {
      if (data.ticket_url) {
        finalTicketUrl = await uploadTicketToSupabase(
          data.ticket_url,
          "tickets",
        );
        ticketWasUploaded = true;
      }

      if (data.scheduled_time) {
        const spotDate = new Date(trip.start_date);
        spotDate.setDate(spotDate.getDate() + (data.day - 1));
        const [hours, minutes] = data.scheduled_time.split(":");
        spotDate.setHours(Number(hours), Number(minutes), 0, 0);
        const pad = (n: number) => n.toString().padStart(2, "0");
        formattedTimestamp = `${spotDate.getFullYear()}-${pad(spotDate.getMonth() + 1)}-${pad(spotDate.getDate())}T${pad(spotDate.getHours())}:${pad(spotDate.getMinutes())}:00.000Z`;
      }

      const newLocationId = Crypto.randomUUID();

      const myChanges = {
        locations: {
          created: [
            {
              location_id: newLocationId,
              trip_id: trip_id,
              name: data.name,
              scheduled_time: formattedTimestamp,
              day: data.day,
              ticket_url: finalTicketUrl,
            },
          ],
          updated: [],
          deleted: [],
        },
      };

      setTrip({
        ...trip,
        locations: [...(trip.locations || []), myChanges.locations.created[0]],
      });

      await pushChanges(myChanges);
    } catch (error) {
      console.error(error);
      alert("Error adding spot. Please try again.");

      if (ticketWasUploaded && finalTicketUrl) {
        try {
          await deleteImageFromSupabase(finalTicketUrl, "tickets");
        } catch (cleanupError) {
          console.error("Error deleting file after failure:", cleanupError);
        }
      }
    }
  };

  async function handleSpotSubmit(data: any) {
    // #TODO: Save trip locally first...

    await createSpot(data);

    setisCreating(false);
  }

  const shouldShowAddSpotButton = (currentTab: string, locations: any[]) => {
    if (!locations || locations.length === 0) return false;

    if (currentTab === "Itinerary") return true;

    if (currentTab.startsWith("Day")) {
      const dayNumber = parseInt(currentTab.split(" ")[1], 10);
      return locations.some((loc: any) => loc.day === dayNumber);
    }

    return false;
  };

  return !isCreating ? (
    <View style={styles.page}>
      <Tabs.Screen
        options={{
          tabBarStyle: isCreating
            ? { display: "flex" }
            : screenOptions.tabBarStyle,
        }}
      />

      {trip && (
        <TripHeader trip={trip} origin={origin} members={trip.members} />
      )}

      <StrataTab
        classname={styles.tabContainer}
        tabs={tabs}
        activeTab={currentTab}
        onTabPress={(tabTitle) => setCurrentTab(tabTitle)}
      />

      {renderTabContent()}

      {shouldShowAddSpotButton(currentTab, trip?.locations || []) && (
        <StrataSmallButton
          text="Add Spot"
          icon={
            <TreePalmIcon
              color={Colors.white}
              classname={{ aspectRatio: 1, width: 18 }}
            />
          }
          onPress={() => setisCreating(!isCreating)}
        />
      )}
    </View>
  ) : (
    <View style={[styles.page, { paddingHorizontal: 40 }]}>
      <Tabs.Screen
        options={{
          tabBarStyle: isCreating
            ? { display: "none" }
            : screenOptions.tabBarStyle,
        }}
      />

      <StrataHeader
        classname={[styles.header, { justifyContent: "flex-start" }]}
        icons={[
          {
            icon: <ArrowIcon color={Colors.primaryDark} />,
            classname: styles.bgIcon,
            onPress: () => setisCreating(!isCreating),
          },
        ]}
      />

      <SpotCreationForm
        days={currentTab.startsWith("Day") ? days : 1}
        selectedDay={
          currentTab.startsWith("Day")
            ? parseInt(currentTab.split(" ")[1], 10)
            : 1
        }
        handleSubmit={handleSpotSubmit}
      />
    </View>
  );
}
