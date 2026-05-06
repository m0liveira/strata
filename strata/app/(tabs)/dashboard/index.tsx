/* eslint-disable react-hooks/exhaustive-deps */
import { Pressable, ScrollView, Text, View } from "react-native";
import { useState, useCallback, useEffect } from "react";
import { router, useFocusEffect, Tabs } from "expo-router";
import * as Crypto from "expo-crypto";
import { styles } from "@/styles/dashboard/styles";
import { user } from "@/utils/userService";
import { EmptyState } from "@/app/pages/empty-state";
import { Colors } from "@/constants/global-styles";
import { StrataHeader, StrataButton, StrataCTA } from "@/components";
import {
  AddUserIcon,
  ArrowIcon,
  BellIcon,
  CarretIcon,
  ChatBubbleIcon,
  ClockIcon,
  MailIcon,
  MinusIcon,
  PdfIcon,
  PlusIcon,
  ShareIcon,
  StrategyIcon,
} from "@/components/icons";
import { TripCreationOptions, TripCreationForm } from "@/components/features/";
import { screenOptions } from "../_layout";
import {
  getUsersData,
  uploadImageToSupabase,
  deleteImageFromSupabase,
  pushChanges,
  inviteToTrip,
  getTripByID,
  ExportTrip,
} from "@/utils/StrataApiService";
import { StrataTab } from "@/components/strata-tab/StrataTab";
import { StrataTripOverviewCard } from "@/components/strata-trip-overview-card/StrataTripOverviewCard";
import { StrataDocumentsCard } from "@/components/strata-documents-card/StrataDocumentsCard";
import { ClockForwardIcon } from "@/components/icons/ui-core/ClockForwardIcon";
import { StrataModal } from "@/components/strata-modal/StrataModal";
import { StrataSocialList } from "@/components/strata-social-list/StrataSocialList";
import { PublicUser } from "@/types/models/user-model";
import {
  getDayLabel,
  getMidnight,
  getTimeUntil,
} from "@/utils/generalFunctions";
import { StrataSchedule } from "@/components/strata-schedule/StrataSchedule";
import { BudgetScreen } from "@/components/screens/budget-screen/BudgetScreen";

export default function MyTrips() {
  const [isCreating, setisCreating] = useState(false);
  const [isManual, setisManual] = useState(true);
  const [creationStage, setCreationStage] = useState(0);
  const [currentTab, setCurrentTab] = useState("Overview");
  const [trip, setTrip] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentAction, setCurrentAction] = useState("");
  const [friends, setFriends] = useState<PublicUser[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedMethod, setSelectedMethod] = useState("Shift All");
  const [hour, setHour] = useState("00");
  const [minute, setMinute] = useState("30");
  const [selectedSpot, setSelectedSpot] = useState<any>({});
  const [isOpened, setIsOpened] = useState(false);

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

          setFriends(profiles);
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
        setModalVisible(false);
        setSelectedUsers([]);
        setSelectedMethod("Shift All");
        setHour("00");
        setMinute("30");
        setSelectedSpot({});
        setIsOpened(false);
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

  // #TODO: Put this repetetive functions from my-trips page in a utils file and call them here

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

  const quickActions = [
    {
      title: "Plan B",
      icon: <StrategyIcon classname={styles.bigIcon} color={Colors.coral500} />,
      onPress: () => {
        setModalVisible(true);
        setCurrentAction("Plan B");
      },
      classname: styles.coralBg,
    },
    {
      title: "Shift Trip",
      icon: (
        <ClockForwardIcon
          classname={[styles.bigIcon, { width: 24 }]}
          color={Colors.coral500}
        />
      ),
      onPress: () => {
        setModalVisible(true);
        setCurrentAction("Shift Trip");
      },
      classname: styles.coralBg,
    },
    {
      title: "Invite",
      icon: <AddUserIcon classname={styles.bigIcon} color={Colors.blue500} />,
      onPress: () => {
        setModalVisible(true);
        setCurrentAction("Invite");
      },
      classname: styles.blueBg,
    },
    {
      title: "Export",
      icon: <PdfIcon classname={styles.bigIcon} color={Colors.blue500} />,
      onPress: () => {
        setModalVisible(true);
        setCurrentAction("Export");
      },
      classname: styles.blueBg,
    },
  ];

  const toggleUser = (userId: number) => {
    const idStr = String(userId);
    setSelectedUsers((prev) =>
      prev.includes(idStr)
        ? prev.filter((id) => id !== idStr)
        : [...prev, idStr],
    );
  };

  function renderTabContent() {
    if (currentTab === "Overview") {
      return (
        <>
          <View style={styles.quickActions}>
            {quickActions.map((quickAction) => {
              return (
                <View
                  key={quickAction.title}
                  style={{ alignItems: "center", gap: 8 }}
                >
                  <Pressable
                    style={[styles.quickAction, quickAction.classname]}
                    onPress={quickAction.onPress}
                  >
                    {quickAction.icon}
                  </Pressable>

                  <Text style={styles.qAText}>{quickAction.title}</Text>
                </View>
              );
            })}
          </View>

          <StrataTripOverviewCard
            trip={trip}
            locations={trip?.locations || []}
            onPress={() =>
              router.push({
                pathname: "/trip/[trip_id]",
                params: {
                  trip_id: trip.trip_id,
                  origin: "dashboard",
                },
              })
            }
          />

          <StrataDocumentsCard
            locations={trip?.locations || []}
            tripStartDate={trip.start_date}
            classname={{ marginBottom: 40 }}
          />
        </>
      );
    }

    // #TODO: Add real map and itinerary content here. For now, just placeholders.
    if (currentTab === "Map") {
      return <Text>Hello World</Text>;
    }

    if (currentTab === "Budget") {
      return <BudgetScreen trip={trip} setTrip={setTrip} />;
    }

    return null;
  }

  function renderShiftComponent() {
    if (!trip?.locations || trip.locations.length === 0) {
      return <Text>Add locations to your trip!</Text>;
    }

    const scheduledLocations = trip.locations.filter(
      (loc: any) => loc.scheduled_time,
    );

    if (scheduledLocations.length === 0) {
      return <Text>No scheduled locations available.</Text>;
    }

    const todayMidnight = getMidnight();
    const now = Date.now();

    const locationsWithDates = scheduledLocations.map((loc: any) => {
      const parsedDate = new Date(loc.scheduled_time);
      return { ...loc, parsedDate };
    });

    const closestLocation =
      locationsWithDates
        .sort(
          (a: any, b: any) => a.parsedDate.getTime() - b.parsedDate.getTime(),
        )
        .find((loc: any) => loc.parsedDate.getTime() >= now) ||
      locationsWithDates[0];

    const activeSpot =
      selectedMethod !== "Shift All" && selectedSpot?.name
        ? selectedSpot
        : closestLocation;

    const shiftOffset =
      Number(hour) * 60 * 60 * 1000 + Number(minute) * 60 * 1000;
    const shiftedDate = new Date(activeSpot.parsedDate.getTime() + shiftOffset);

    return (
      <View style={styles.shiftContainer}>
        <View style={styles.location}>
          <View style={styles.left}>
            <Text style={styles.label}>
              {getDayLabel(activeSpot.parsedDate, todayMidnight)}
            </Text>

            {selectedMethod === "Shift All" ? (
              <Text style={styles.text}>{activeSpot.name}</Text>
            ) : (
              <Pressable
                style={styles.select}
                onPress={() => {
                  setIsOpened(!isOpened);
                }}
              >
                <Text style={styles.text}>{activeSpot.name}</Text>

                <CarretIcon
                  color={Colors.primaryDark}
                  classname={[
                    { aspectRatio: 1, width: 16 },
                    isOpened && { transform: [{ rotate: "180deg" }] },
                  ]}
                />
              </Pressable>
            )}
          </View>

          <View style={styles.right}>
            <Text style={styles.label}>
              {activeSpot.parsedDate.toLocaleTimeString("pt-PT", {
                hour: "2-digit",
                minute: "2-digit",
                timeZone: "UTC",
              })}
            </Text>
            <Text style={styles.labelM}>
              {getTimeUntil(activeSpot.scheduled_time)}
            </Text>
          </View>

          {isOpened && (
            <View style={styles.optionsContainer}>
              {locationsWithDates.map((loc: any) => {
                return (
                  <Pressable
                    key={loc.location_id}
                    style={{
                      width: "100%",
                      paddingVertical: 4,
                    }}
                    onPress={() => {
                      setSelectedSpot(loc);
                      setIsOpened(false);
                    }}
                  >
                    <Text style={styles.options}>{loc.name}</Text>
                  </Pressable>
                );
              })}
            </View>
          )}
        </View>

        <ArrowIcon
          color={Colors.grey300}
          classname={{
            aspectRatio: 1,
            width: 32,
            transform: [{ rotate: "-90deg" }],
          }}
        />

        <View style={[styles.location, { marginBottom: 8 }]}>
          <View style={styles.left}>
            <Text style={styles.label}>
              {getDayLabel(shiftedDate, todayMidnight)}
            </Text>
            <Text style={styles.text}>{activeSpot.name}</Text>
          </View>

          <View style={styles.right}>
            <Text style={styles.label}>
              {shiftedDate.toLocaleTimeString("pt-PT", {
                hour: "2-digit",
                minute: "2-digit",
                timeZone: "UTC",
              })}
            </Text>
            <Text style={styles.labelM}>
              {getTimeUntil(shiftedDate.toISOString())}
            </Text>
          </View>
        </View>

        <StrataSchedule
          isScheduled={true}
          onToggleSchedule={() => {
            return true;
          }}
          hideCheckbox={true}
          selectedHour={hour}
          selectedMinute={minute}
          onTimeChange={(h, m) => {
            setHour(h);
            setMinute(m);
          }}
          addLimit={true}
        />
      </View>
    );
  }

  const handleShiftSubmit = async () => {
    const shiftOffsetMs =
      Number(hour) * 60 * 60 * 1000 + Number(minute) * 60 * 1000;

    const now = Date.now();
    const scheduledLocations = trip.locations.filter(
      (loc: any) => loc.scheduled_time,
    );

    const closestLocation =
      scheduledLocations
        .map((loc: any) => {
          const timeStr = loc.scheduled_time.endsWith("Z")
            ? loc.scheduled_time
            : `${loc.scheduled_time}Z`;
          return {
            ...loc,
            parsedDate: new Date(timeStr),
          };
        })
        .sort(
          (a: any, b: any) => a.parsedDate.getTime() - b.parsedDate.getTime(),
        )
        .find((loc: any) => loc.parsedDate.getTime() >= now) ||
      scheduledLocations[0];

    const activeSpot =
      selectedMethod === "Shift From" && selectedSpot?.name
        ? selectedSpot
        : closestLocation;

    const targetDay = activeSpot?.day || 1;

    const activeTimeStr = activeSpot.scheduled_time.endsWith("Z")
      ? activeSpot.scheduled_time
      : `${activeSpot.scheduled_time}Z`;
    const thresholdTime = new Date(activeTimeStr).getTime();

    const updatedLocations = trip.locations
      .filter((loc: any) => {
        if (!loc.scheduled_time || loc.day !== targetDay) return false;

        if (selectedMethod === "Shift From") {
          const locTimeStr = loc.scheduled_time.endsWith("Z")
            ? loc.scheduled_time
            : `${loc.scheduled_time}Z`;
          return new Date(locTimeStr).getTime() >= thresholdTime;
        }

        return true;
      })
      .map((loc: any) => {
        const locTimeStr = loc.scheduled_time.endsWith("Z")
          ? loc.scheduled_time
          : `${loc.scheduled_time}Z`;
        const originalDate = new Date(locTimeStr);
        const newDate = new Date(originalDate.getTime() + shiftOffsetMs);

        const originalMidnight = new Date(originalDate).setUTCHours(0, 0, 0, 0);
        const newMidnight = new Date(newDate).setUTCHours(0, 0, 0, 0);

        const diffDays = Math.round(
          (newMidnight - originalMidnight) / (1000 * 60 * 60 * 24),
        );

        const { deleted_at, ...cleanLoc } = loc;

        return {
          ...cleanLoc,
          scheduled_time: newDate.toISOString(),
          day: (cleanLoc.day || 1) + diffDays,
          updated_at: new Date().toISOString(),
        };
      });

    try {
      await pushChanges({
        locations: {
          created: [],
          updated: updatedLocations,
          deleted: [],
        },
      });

      setModalVisible(false);
      setSelectedSpot({});
      setIsOpened(false);

      // #TODO: Update locations time in the overview screen
    } catch (error) {
      console.error("Error while shifting schedule:", error);
    }
  };

  // #TODO: Add Plan B action functionality
  function renderModalContent() {
    switch (currentAction) {
      case "Plan B":
        return <Text>Plan b</Text>;

      case "Shift Trip":
        const shiftButtons = [
          { title: "Shift All", text: "Delay full schedule" },
          {
            title: "Shift From",
            text: "Delay from specific time from the schedule",
          },
        ];

        return (
          <>
            {shiftButtons.map((btn) => (
              <Pressable
                key={btn.title}
                style={[
                  styles.selectable,
                  selectedMethod === btn.title && {
                    backgroundColor: Colors.coral100,
                    borderColor: Colors.coral200,
                  },
                ]}
                onPress={() => {
                  setSelectedMethod(btn.title);
                  setIsOpened(false);
                  setSelectedSpot({});
                }}
              >
                <Text
                  style={[
                    styles.selectableTitle,
                    selectedMethod === btn.title && {
                      color: Colors.coral900,
                    },
                  ]}
                >
                  {btn.title}
                </Text>
                <Text
                  style={[
                    styles.selectableText,
                    selectedMethod === btn.title && {
                      color: Colors.coral400,
                    },
                  ]}
                >
                  {btn.text}
                </Text>
              </Pressable>
            ))}

            {renderShiftComponent()}

            <StrataCTA
              classname={[styles.button, { marginTop: 48, marginBottom: 0 }]}
              text="Save"
              textclassname={[styles.ctaText]}
              icon={
                <ClockIcon color={Colors.white} classname={styles.smallIcon} />
              }
              isDisabled={false}
              onPress={async () => handleShiftSubmit()}
            />
          </>
        );

      case "Invite":
        return (
          <>
            <StrataSocialList
              users={friends}
              selectedIds={selectedUsers}
              onUserPress={(user) => toggleUser(user.user_id)}
              renderRightIcon={(user, isSelected) =>
                isSelected ? (
                  <MinusIcon
                    classname={styles.bigIcon}
                    color={Colors.coral500}
                  />
                ) : (
                  <PlusIcon
                    classname={styles.bigIcon}
                    color={Colors.primaryDark}
                  />
                )
              }
            />

            <StrataCTA
              classname={[
                styles.button,
                styles.ctaDisabled,
                { marginTop: 80, marginBottom: 0 },
              ]}
              text="Invite Link"
              textclassname={[styles.ctaText, { color: Colors.primaryDark }]}
              icon={
                <ShareIcon
                  color={Colors.primaryDark}
                  classname={styles.smallIcon}
                />
              }
              isDisabled={true}
              onPress={async () => {}}
            />

            <StrataCTA
              classname={[
                styles.button,
                selectedUsers.length === 0 && styles.ctaDisabled,
                { marginTop: 24, marginBottom: 0 },
              ]}
              text="Send Invite"
              textclassname={[
                styles.ctaText,
                selectedUsers.length === 0 && { color: Colors.primaryDark },
              ]}
              icon={
                <MailIcon
                  color={
                    selectedUsers.length === 0
                      ? Colors.primaryDark
                      : Colors.white
                  }
                  classname={styles.smallIcon}
                />
              }
              isDisabled={selectedUsers.length === 0}
              onPress={async () => {
                for (const user of selectedUsers) {
                  await inviteToTrip(trip.trip_id, Number(user));

                  setSelectedUsers([]);
                  setModalVisible(false);
                  // #TODO: Add notification for users added or errors
                }
              }}
            />
          </>
        );

      case "Export":
        return (
          <StrataButton
            title={trip.name}
            text="Export full trip!"
            imageSource={require("@/assets/images/pdf.png")}
            onPress={() => {
              try {
                ExportTrip(trip.trip_id);
                setModalVisible(false);
              } catch (error) {
                alert(error);
              }
            }}
          />
        );

      default:
        break;
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

              <StrataModal
                isVisible={modalVisible}
                onClose={() => setModalVisible(false)}
              >
                {renderModalContent()}
              </StrataModal>
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
