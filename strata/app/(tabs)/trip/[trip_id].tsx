import React, { useCallback, useEffect, useState } from "react";
import {
  router,
  Tabs,
  useFocusEffect,
  useLocalSearchParams,
} from "expo-router";
import { Pressable, Text, View, Alert } from "react-native";
import { styles } from "@/styles/trip/styles";
import { TripHeader } from "@/components/strata-trip-header/StrataTripHeader";
import {
  deleteImageFromSupabase,
  getSharedTripByID,
  getTripByID,
  LeaveTrip,
  pushChanges,
  updateBudget,
  uploadImageToSupabase,
  uploadTicketToSupabase,
} from "@/utils/StrataApiService";
import { StrataTab } from "@/components/strata-tab/StrataTab";
import { EmptyState } from "@/app/pages/empty-state";
import { StrataButton } from "@/components/strata-button/StrataButton";
import { SpotCreationForm } from "@/components/features/spot-creation-form/SpotCreationForm";
import { screenOptions } from "../_layout";
import { StrataHeader } from "@/components/strata-header/StrataHeader";
import { ArrowIcon } from "@/components/icons/ui-core/ArrowIcon";
import { Colors, Typography } from "@/constants/global-styles";
import * as Crypto from "expo-crypto";
import { StrataLocationGroup } from "@/components/strata-location-group/StrataLocationGroup";
import { StrataSmallButton } from "@/components/strata-small-button/StrataButton";
import { BookmarkIcon, TreePalmIcon } from "@/components/icons";
import { StrataModal } from "@/components/strata-modal/StrataModal";
import { StrataCalendar } from "@/components/strata-calendar/StrataCalendar";
import {
  StrataCTA,
  StrataForm,
  StrataInput,
  TripCreationForm,
} from "@/components";
import { user } from "@/utils/userService";
import { floatInputProperties } from "@/utils/input-properties";

export default function Trip() {
  const [trip, setTrip] = useState<any>(null);
  const [currentTab, setCurrentTab] = useState("");
  const [tabs, setTabs] = useState<string[]>([]);
  const [isCreating, setisCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [creationStage, setCreationStage] = useState(1);
  const [days, setDays] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalSettingsVisible, setModalSettingsVisible] = useState(false);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [disabled, setDisabled] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [isSettingBudget, setIsSettingBudget] = useState(false);
  const [budget, setBudget] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<any>(null);

  const { trip_id, origin, creator } = useLocalSearchParams() as {
    trip_id: string;
    origin?: string;
    creator?: string;
  };

  const isOneMemberOnly = trip?.members?.length === 1;

  let isActionOnGoing = false;

  const getDiffInDays = (
    startDate: string | Date,
    endDate: string | Date,
  ): number => {
    if (!startDate || !endDate) return 0;

    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();

    const diffInMilliseconds = end - start;
    return Math.round(diffInMilliseconds / (1000 * 60 * 60 * 24)) + 1;
  };

  useEffect(() => {
    const fetchTrip = async () => {
      setIsUpdated(false);

      const tripData =
        origin === "discover"
          ? await getSharedTripByID(trip_id)
          : await getTripByID(trip_id);

      setTrip(tripData);

      if (tripData?.start_date && tripData?.end_date) {
        const generatedTabs = Array.from(
          { length: getDiffInDays(tripData.start_date, tripData.end_date) },
          (_, i) => `Day ${i + 1}`,
        );

        setTabs(["Map", ...generatedTabs]);
        setCurrentTab(generatedTabs[0]);
        setDays(getDiffInDays(tripData.start_date, tripData.end_date));
      } else {
        setTabs(["Map", "Itinerary"]);
        setCurrentTab("Itinerary");
      }
    };

    fetchTrip();
  }, [origin, trip_id, isUpdated]);

  useFocusEffect(
    useCallback(() => {
      return async () => {
        setisCreating(false);
        setIsUpdating(false);
        setModalVisible(false);
        setModalSettingsVisible(false);
        setDisabled(false);
        setStartDate(null);
        setEndDate(null);
        renderTabContent();
        setCreationStage(1);
        setIsUpdated(false);
        setIsSettingBudget(false);
        setBudget("");
        setSelectedLocation(null);
      };
    }, []),
  );

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
    if (origin === "discover") return false;

    if (!locations || locations.length === 0) return false;

    if (currentTab === "Itinerary") return true;

    if (currentTab.startsWith("Day")) {
      const dayNumber = parseInt(currentTab.split(" ")[1], 10);
      return locations.some((loc: any) => loc.day === dayNumber);
    }

    return false;
  };

  const disableButton = () => {
    if ((startDate === null && endDate === null) || disabled) {
      return true;
    }

    return false;
  };

  const handleSaveTrip = async () => {
    setDisabled(true);

    const newTripId = Crypto.randomUUID();

    try {
      const { destinations, locations, deleted_at, ...tripData } = trip;

      const updatedTripData = {
        ...tripData,
        trip_id: newTripId,
        banner: "/assets/images/default-trip-banner.png",
        start_date: startDate ? new Date(startDate).toISOString() : null,
        end_date: endDate ? new Date(endDate).toISOString() : null,
        rating: 0,
        visibility: "private",
      };

      const updatedDestinations = destinations.map((d: any) => {
        const { deleted_at: dest_deleted_at, ...restD } = d;
        return {
          ...restD,
          destination_id: Crypto.randomUUID(),
          trip_id: updatedTripData.trip_id,
        };
      });

      const updatedLocations = locations.map((loc: any) => {
        const { deleted_at: loc_deleted_at, ...restLoc } = loc;

        let newScheduledTime = null;

        if (loc.scheduled_time && startDate) {
          const originalDate = new Date(loc.scheduled_time);
          const targetDate = new Date(startDate);

          targetDate.setUTCDate(targetDate.getUTCDate() + (loc.day - 1));

          targetDate.setUTCHours(
            originalDate.getUTCHours(),
            originalDate.getUTCMinutes(),
            originalDate.getUTCSeconds(),
          );

          newScheduledTime = targetDate.toISOString();
        }

        return {
          ...restLoc,
          location_id: Crypto.randomUUID(),
          trip_id: updatedTripData.trip_id,
          ticket_url: null,
          scheduled_time: newScheduledTime,
        };
      });

      const myChanges = {
        trips: {
          created: [
            {
              ...updatedTripData,
            },
          ],
          updated: [],
          deleted: [],
        },
        destinations: {
          created: updatedDestinations,
          updated: [],
          deleted: [],
        },
        locations: {
          created: updatedLocations,
          updated: [],
          deleted: [],
        },
      };

      await pushChanges(myChanges);

      user.trips.push(myChanges.trips.created[0]);
    } catch (error) {
      console.error(error);
      alert("Error saving trip. Please try again.");
    } finally {
      setModalVisible(false);
      setDisabled(false);
      setStartDate(null);
      setEndDate(null);

      router.push({
        pathname: "/trip/[trip_id]",
        params: {
          trip_id: newTripId,
          origin: "my-trips",
        },
      });
    }
  };

  const confirmDangerAction = () => {
    const actionText = !selectedLocation
      ? isOneMemberOnly
        ? "Delete"
        : "Leave"
      : "Delete";

    const name = !selectedLocation
      ? trip?.name || "Trip"
      : selectedLocation.name;

    Alert.alert(
      `${actionText} "${name}" `,
      `Are you sure you want to ${actionText.toLowerCase()} "${name}"? This action cannot be undone.`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: actionText,
          style: "destructive",
          onPress: () =>
            !selectedLocation
              ? handleTripDangerAction()
              : handleDeleteLocation(),
        },
      ],
    );
  };

  const handleTripDangerAction = async () => {
    if (isActionOnGoing) return;

    isActionOnGoing = true;

    try {
      if (!isOneMemberOnly) {
        const userExpenses = trip.expenses.filter(
          (expense: any) => expense.user_id === user.user_id,
        );

        const data = {
          expenses: {
            created: [],
            updated: [],
            deleted: userExpenses,
          },
        };

        await Promise.all([pushChanges(data), LeaveTrip(trip_id)]);

        user.trips = user.trips.filter((t: any) => t.trip_id !== trip_id);
      }

      const data = {
        trips: {
          created: [],
          updated: [],
          deleted: [trip_id],
        },
        locations: {
          created: [],
          updated: [],
          deleted: trip.locations
            ? trip.locations.map((l: any) => l.location_id)
            : [],
        },
        destinations: {
          created: [],
          updated: [],
          deleted: trip.destinations
            ? trip.destinations.map((d: any) => d.destination_id)
            : [],
        },
        expenses: {
          created: [],
          updated: [],
          deleted: trip.expenses
            ? trip.expenses.map((e: any) => e.expense_id)
            : [],
        },
      };

      await Promise.all([pushChanges(data), LeaveTrip(trip_id)]);

      user.trips = user.trips.filter((t: any) => t.trip_id !== trip_id);
    } catch (error) {
      console.error(error);
    } finally {
      isActionOnGoing = false;
      router.replace("/my-trips");
    }
  };

  const handleUpdateTrip = async (data: any) => {
    if (isActionOnGoing) return;

    isActionOnGoing = true;

    let finalBannerUrl = trip.banner;
    let imageWasUploaded = false;

    try {
      if (data.banner !== trip.banner) {
        if (trip.banner && !trip.banner.startsWith("/assets")) {
          await deleteImageFromSupabase(trip.banner, "banners");
        }

        if (data.banner && data.banner.startsWith("file://")) {
          finalBannerUrl = await uploadImageToSupabase(data.banner, "banners");
          imageWasUploaded = true;
        } else {
          finalBannerUrl = data.banner;
        }
      }

      const { destinations, selectedUsers, banner, ...tripCoreData } = data;

      const formattedTripData = {
        ...tripCoreData,
        start_date: tripCoreData.start_date
          ? new Date(tripCoreData.start_date).toISOString()
          : null,
        end_date: tripCoreData.end_date
          ? new Date(tripCoreData.end_date).toISOString()
          : null,
      };

      const oldDestinations = trip.destinations || [];
      const newDestinationsStrs = destinations || [];
      const oldDestinationsStrs = oldDestinations.map(
        (d: any) => d.destination,
      );

      const createdDestinations: any[] = [];
      const deletedDestinations: string[] = [];

      oldDestinations.forEach((oldDest: any) => {
        if (!newDestinationsStrs.includes(oldDest.destination)) {
          deletedDestinations.push(oldDest.destination_id);
        }
      });

      newDestinationsStrs.forEach((destStr: string) => {
        if (!oldDestinationsStrs.includes(destStr)) {
          createdDestinations.push({
            destination_id: Crypto.randomUUID(),
            trip_id: trip.trip_id,
            destination: destStr,
          });
        }
      });

      const oldDiffDays = getDiffInDays(trip.start_date, trip.end_date);
      const newDiffDays = getDiffInDays(
        formattedTripData.start_date,
        formattedTripData.end_date,
      );

      const updatedLocations: any[] = [];

      if (oldDiffDays > newDiffDays) {
        const currentLocations = trip.locations || [];

        currentLocations.forEach((loc: any) => {
          if (loc.day > newDiffDays) {
            const { deleted_at, created_at, updated_at, ...cleanLoc } = loc;

            updatedLocations.push({
              ...cleanLoc,
              day: 1,
              scheduled_time: null,
            });
          }
        });
      }

      const myChanges = {
        trips: {
          created: [],
          updated: [
            {
              trip_id: trip.trip_id,
              banner: finalBannerUrl,
              ...formattedTripData,
            },
          ],
          deleted: [],
        },
        destinations: {
          created: createdDestinations,
          updated: [],
          deleted: deletedDestinations,
        },
        locations: {
          created: [],
          updated: updatedLocations,
          deleted: [],
        },
      };

      await pushChanges(myChanges);

      const tripIndex = user.trips.findIndex(
        (t: any) => t.trip_id === trip.trip_id,
      );

      if (tripIndex !== -1) {
        const currentLocations = trip.locations || [];
        const nextLocations = currentLocations.map((loc: any) => {
          const changedLoc = updatedLocations.find(
            (ul) => ul.location_id === loc.location_id,
          );
          return changedLoc ? changedLoc : loc;
        });

        user.trips[tripIndex] = {
          ...user.trips[tripIndex],
          ...myChanges.trips.updated[0],
          destinations: [
            ...oldDestinations.filter(
              (d: any) => !deletedDestinations.includes(d.destination_id),
            ),
            ...createdDestinations,
          ],
          locations: nextLocations,
        };

        setTrip(user.trips[tripIndex]);
        setIsUpdated(true);
        isActionOnGoing = false;
      }
    } catch (error) {
      console.error(error);
      alert("Error updating trip. Please try again.");
      isActionOnGoing = false;

      if (imageWasUploaded && finalBannerUrl) {
        try {
          await deleteImageFromSupabase(finalBannerUrl, "banners");
        } catch (cleanupError) {
          console.error("Error cleaning up image:", cleanupError);
        }
      }
    }
  };

  async function handleEditAction(data: any) {
    if (creationStage !== 3) {
      setCreationStage(creationStage + 1);
    } else {
      await handleUpdateTrip(data);

      setIsUpdating(false);
      setCreationStage(1);
    }
  }

  const handleUpdateBudget = async () => {
    if (isActionOnGoing) return;

    isActionOnGoing = true;

    try {
      const bugetValue = budget !== "" ? parseFloat(budget) : null;

      await updateBudget(trip_id, bugetValue);

      setIsSettingBudget(false);
      setBudget("");
      isActionOnGoing = false;
    } catch (error) {
      console.error(error);
      isActionOnGoing = false;
      alert("Error updating trip. Please try again.");
    }
  };

  const handleDeleteLocation = async () => {
    if (isActionOnGoing) return;

    isActionOnGoing = true;

    try {
      if (selectedLocation.ticket_url) {
        await deleteImageFromSupabase(selectedLocation.ticket_url, "tickets");
      }

      const data = {
        locations: {
          created: [],
          updated: [],
          deleted: [selectedLocation.location_id],
        },
      };

      await pushChanges(data);

      const tripIndex = user.trips.findIndex((t: any) => t.trip_id === trip_id);

      if (tripIndex !== -1) {
        user.trips[tripIndex] = {
          ...user.trips[tripIndex],
          locations: (user.trips[tripIndex].locations || []).filter(
            (loc: any) => loc.location_id !== selectedLocation.location_id,
          ),
        };
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsUpdated(true);
      isActionOnGoing = false;
      setModalSettingsVisible(false);
      setSelectedLocation(null);
    }
  };

  const handleUpdateLocation = async (data: any) => {
    if (isActionOnGoing) return;

    isActionOnGoing = true;

    let finalTicketUrl = selectedLocation.ticket_url;
    let ticketWasUploaded = false;
    let formattedTimestamp = data.scheduled_time;

    try {
      if (data.ticket_url !== selectedLocation.ticket_url) {
        if (selectedLocation.ticket_url) {
          await deleteImageFromSupabase(selectedLocation.ticket_url, "tickets");
        }

        if (data.ticket_url) {
          finalTicketUrl = await uploadTicketToSupabase(
            data.ticket_url,
            "tickets",
          );
          ticketWasUploaded = true;
        } else {
          finalTicketUrl = null;
        }
      }

      if (data.scheduled_time) {
        const spotDate = new Date(trip.start_date);
        spotDate.setDate(spotDate.getDate() + (data.day - 1));
        const [hours, minutes] = data.scheduled_time.split(":");
        spotDate.setHours(Number(hours), Number(minutes), 0, 0);
        const pad = (n: number) => n.toString().padStart(2, "0");
        formattedTimestamp = `${spotDate.getFullYear()}-${pad(spotDate.getMonth() + 1)}-${pad(spotDate.getDate())}T${pad(spotDate.getHours())}:${pad(spotDate.getMinutes())}:00.000Z`;
      }

      const newData = {
        locations: {
          created: [],
          updated: [
            {
              location_id: selectedLocation.location_id,
              trip_id: trip_id,
              name: data.name,
              scheduled_time: formattedTimestamp,
              day: data.day,
              ticket_url: finalTicketUrl,
            },
          ],
          deleted: [],
        },
      };

      await pushChanges(newData);
    } catch (error) {
      console.error("Update error:", error);
      if (ticketWasUploaded && finalTicketUrl) {
        try {
          await deleteImageFromSupabase(finalTicketUrl, "tickets");
        } catch (cleanupError) {
          console.error("Error deleting file after failure:", cleanupError);
        }
      }
    } finally {
      setIsUpdated(true);
      isActionOnGoing = false;
      setModalSettingsVisible(false);
      setSelectedLocation(null);
      setisCreating(false);
    }
  };

  const handleLocationPress = (id: string | number) => {
    const selectedLocation = trip.locations.find(
      (loc: any) => loc.location_id === id,
    );

    setSelectedLocation(selectedLocation);
    setModalSettingsVisible(true);
  };

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
              buttons={
                origin === "discover"
                  ? []
                  : [
                      <StrataButton
                        key="add-spot"
                        title="Add a Spot"
                        text="What do you wish to see?"
                        imageSource={require("@/assets/images/pin.png")}
                        onPress={() => setisCreating(true)}
                      />,
                    ]
              }
            />
          </View>
        );
      }

      return (
        <StrataLocationGroup
          locations={locations}
          origin={origin}
          onPress={handleLocationPress}
        />
      );
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
              buttons={
                origin === "discover"
                  ? []
                  : [
                      <StrataButton
                        key="add-spot"
                        title="Add a Spot"
                        text="What do you wish to see?"
                        imageSource={require("@/assets/images/pin.png")}
                        onPress={() => setisCreating(true)}
                      />,
                    ]
              }
            />
          </View>
        );
      }

      return (
        <StrataLocationGroup
          locations={dayLocations}
          origin={origin}
          onPress={handleLocationPress}
        />
      );
    }

    return null;
  }

  return !isCreating && !isUpdating ? (
    <View style={styles.page}>
      <Tabs.Screen
        options={{
          tabBarStyle: isCreating
            ? { display: "flex" }
            : screenOptions.tabBarStyle,
        }}
      />

      {trip && (
        <TripHeader
          trip={trip}
          origin={origin}
          creator={creator}
          members={trip.members}
          onPress={() => setModalSettingsVisible(true)}
        />
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

      {origin === "discover" && (
        <>
          <StrataSmallButton
            text="Save Trip"
            icon={
              <BookmarkIcon
                color={Colors.white}
                classname={{ aspectRatio: 1, width: 18 }}
              />
            }
            onPress={() => setModalVisible(true)}
          />

          <StrataModal
            isVisible={modalVisible}
            onClose={() => setModalVisible(false)}
          >
            <StrataCalendar
              startDate={startDate}
              endDate={endDate}
              onRangeChange={({ start, end }) => {
                setStartDate(start);
                setEndDate(end);
              }}
              fixedRangeLength={
                getDiffInDays(trip?.start_date, trip?.end_date) === 0
                  ? 1
                  : getDiffInDays(trip?.start_date, trip?.end_date)
              }
            />

            <StrataCTA
              text="Save Trip"
              classname={[
                disableButton() && styles.disabled,
                { marginTop: 60 },
              ]}
              textclassname={[
                disableButton() && styles.disabledText,
                { ...Typography.cta },
              ]}
              isDisabled={disableButton()}
              onPress={handleSaveTrip}
            />
          </StrataModal>
        </>
      )}

      <StrataModal
        isVisible={modalSettingsVisible}
        onClose={() => {
          setModalSettingsVisible(false);
          setSelectedLocation(null);
        }}
      >
        <View style={styles.options}>
          {origin !== "discover" ? (
            isSettingBudget ? (
              <>
                <StrataHeader
                  classname={[
                    styles.header,
                    {
                      justifyContent: "flex-start",
                      alignItems: "flex-start",
                      marginTop: 0,
                    },
                  ]}
                  icons={[
                    {
                      icon: <ArrowIcon color={Colors.primaryDark} />,
                      classname: styles.bgIcon,
                      onPress: () => setIsSettingBudget(false),
                    },
                  ]}
                />

                <StrataForm
                  elements={[
                    {
                      label: "Trip Budget",
                      element: (
                        <StrataInput
                          properties={{
                            ...floatInputProperties,
                            value: budget,
                            onChangeText: setBudget,
                          }}
                        />
                      ),
                    },
                    {
                      element: (
                        <StrataCTA
                          text="Set Budget"
                          isDisabled={false}
                          onPress={handleUpdateBudget}
                          classname={{ marginTop: 40 }}
                          textclassname={{ ...Typography.cta }}
                        />
                      ),
                    },
                  ]}
                />
              </>
            ) : (
              <>
                {!selectedLocation && (
                  <Pressable
                    style={styles.action}
                    onPress={() => setIsSettingBudget(true)}
                  >
                    <Text style={styles.optionsText}>Trip Budget</Text>
                  </Pressable>
                )}

                <Pressable
                  style={styles.action}
                  onPress={() =>
                    !selectedLocation
                      ? setIsUpdating(true)
                      : setisCreating(true)
                  }
                >
                  <Text style={styles.optionsText}>
                    {!selectedLocation
                      ? `Edit "${trip?.name || "Trip"}"`
                      : `Edit "${selectedLocation.name}"`}
                  </Text>
                </Pressable>

                <Pressable
                  style={styles.dangerAction}
                  onPress={confirmDangerAction}
                >
                  <Text style={styles.dangerText}>
                    {!selectedLocation
                      ? isOneMemberOnly
                        ? `Delete "${trip?.name || "Trip"}"`
                        : `Leave "${trip?.name || "Trip"}"`
                      : `Delete "${selectedLocation.name}"`}
                  </Text>
                </Pressable>
              </>
            )
          ) : null}
        </View>
      </StrataModal>
    </View>
  ) : isUpdating ? (
    <View style={[styles.page, { paddingHorizontal: 40 }]}>
      <Tabs.Screen
        options={{
          tabBarStyle: isUpdating
            ? { display: "none" }
            : screenOptions.tabBarStyle,
        }}
      />

      <StrataHeader
        classname={[
          styles.header,
          isUpdating && { justifyContent: "flex-start" },
        ]}
        icons={[
          {
            icon: <ArrowIcon color={Colors.primaryDark} />,
            classname: !isUpdating ? styles.icon : styles.bgIcon,
            onPress: () =>
              creationStage === 1
                ? setIsUpdating(!isUpdating)
                : setCreationStage(creationStage - 1),
          },
        ]}
      />

      <TripCreationForm
        stage={creationStage}
        handleSubmit={handleEditAction}
        tripData={trip}
        hideInvite={true}
      />
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
        spotData={selectedLocation}
        handleSubmit={
          !selectedLocation ? handleSpotSubmit : handleUpdateLocation
        }
      />
    </View>
  );
}

// #TODO: Clean this page code up!!! a lot of messy code...
