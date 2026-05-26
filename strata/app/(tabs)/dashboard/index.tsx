/* eslint-disable react-hooks/exhaustive-deps */
import { Pressable, ScrollView, Text, View } from "react-native";
import { useState, useCallback, useEffect, useMemo } from "react";
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
  getChatMessages,
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
  openMapRoute,
} from "@/utils/generalFunctions";
import { StrataSchedule } from "@/components/strata-schedule/StrataSchedule";
import { BudgetScreen } from "@/components/screens/budget-screen/BudgetScreen";
import { useTripSocket } from "@/hooks/useTripSocket";
import { Notifications } from "@/components/features/notifications/Notifications";
import { Chat } from "@/components/features/chat/Chat";
import { generateTrip } from "@/utils/aiService";
import { StrataGenerativePage } from "@/components/strata-generative-page/StrataGenerativePage";

export default function MyTrips() {
  const [isCreating, setisCreating] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
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

  const [notificationVisible, setNotificationVisible] = useState(false);
  const [chatVisible, setChatVisible] = useState(false);
  const [chatMessages, setChatMessages] = useState<any>([]);

  const tabs = ["Overview", "Map", "Budget"];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayMidnight = getMidnight();

  // 2. Efeitos
  // Carrega os perfis de amigos apenas uma vez na montagem
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
          console.error("Error loading profiles:", error);
        }
      } else {
        setFriends(user.friends_profiles || []);
      }
    };
    loadProfiles();
  }, []);

  useEffect(() => {
    if (trip?.trip_id) {
      getChatMessages(trip.trip_id).then(setChatMessages);
    }
  }, [trip?.trip_id]);

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
          selectedTrip = upcomingTrips.sort(
            (a, b) =>
              new Date(a.start_date).getTime() -
              new Date(b.start_date).getTime(),
          )[0];
        } else {
          const tripsWithoutDates = user.trips.filter((t) => !t.start_date);
          selectedTrip =
            tripsWithoutDates.length > 0 ? tripsWithoutDates[0] : null;
        }
      }

      setTrip(selectedTrip);

      if (selectedTrip?.trip_id) {
        getTripByID(selectedTrip.trip_id).then(setTrip).catch(console.error);
      }

      return () => {
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
        setNotificationVisible(false);
        setChatVisible(false);
        setIsGenerating(false);
      };
    }, []),
  );

  const isGroupTrip = trip?.members && trip.members.length > 1;

  const { isConnected, messages, sendMessage, clearMessages } = useTripSocket(
    isGroupTrip ? trip?.trip_id : undefined,
    user.access_token,
    async () => {
      if (trip?.trip_id) {
        const tripData = await getTripByID(trip.trip_id);
        setTrip(tripData);
      }
    },
    (newMessage: any) => {
      setChatMessages((prevMessages: any[]) => {
        const exists = prevMessages.some(
          (msg) => msg.message_id === newMessage.message_id,
        );
        if (exists) return prevMessages;

        return [...prevMessages, newMessage];
      });
    },
  );

  const scheduledLocations = useMemo(() => {
    return trip?.locations?.filter((loc: any) => loc.scheduled_time) || [];
  }, [trip?.locations]);

  const activeSpotInfo = useMemo(() => {
    if (scheduledLocations.length === 0) return null;

    const now = Date.now();
    const locationsWithDates = scheduledLocations.map((loc: any) => ({
      ...loc,
      parsedDate: new Date(
        loc.scheduled_time.endsWith("Z")
          ? loc.scheduled_time
          : `${loc.scheduled_time}Z`,
      ),
    }));

    const closest =
      locationsWithDates
        .sort(
          (a: any, b: any) => a.parsedDate.getTime() - b.parsedDate.getTime(),
        )
        .find((loc: any) => loc.parsedDate.getTime() >= now) ||
      locationsWithDates[0];

    const active =
      selectedMethod !== "Shift All" && selectedSpot?.name
        ? {
            ...selectedSpot,
            parsedDate: new Date(
              selectedSpot.scheduled_time.endsWith("Z")
                ? selectedSpot.scheduled_time
                : `${selectedSpot.scheduled_time}Z`,
            ),
          }
        : closest;

    const shiftOffset =
      Number(hour) * 60 * 60 * 1000 + Number(minute) * 60 * 1000;
    const shiftedDate = new Date(active.parsedDate.getTime() + shiftOffset);

    return { locationsWithDates, closest, active, shiftedDate, shiftOffset };
  }, [scheduledLocations, selectedMethod, selectedSpot, hour, minute]);

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

      const formattedNewTrip = {
        trip_id: newTripId,
        banner: finalBannerUrl,
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
          created: [formattedNewTrip],
          updated: [],
          deleted: [],
        },
        destinations: {
          created: createdDestinations,
          updated: [],
          deleted: [],
        },
        locations: {
          created: createdLocations,
          updated: [],
          deleted: [],
        },
      };

      await pushChanges(myChanges);

      if (selectedUsers?.length > 0) {
        await Promise.all(
          selectedUsers.map((u: any) => inviteToTrip(newTripId, u)),
        );
      }

      user.trips.push(formattedNewTrip);

      setTrip({
        ...formattedNewTrip,
        destinations: createdDestinations,
        locations: createdLocations,
        members: [user],
      });
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

  const handleShiftSubmit = async () => {
    if (!activeSpotInfo) return;

    const { active, shiftOffset } = activeSpotInfo;
    const targetDay = active.day || 1;
    const thresholdTime = active.parsedDate.getTime();

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
        const newDate = new Date(originalDate.getTime() + shiftOffset);

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
        locations: { created: [], updated: updatedLocations, deleted: [] },
      });
      setModalVisible(false);
      setSelectedSpot({});
      setIsOpened(false);
      // #TODO: Update locations time in the overview screen
    } catch (error) {
      console.error("Error while shifting schedule:", error);
    }
  };

  const toggleUser = (userId: number) => {
    const idStr = String(userId);
    setSelectedUsers((prev) =>
      prev.includes(idStr)
        ? prev.filter((id) => id !== idStr)
        : [...prev, idStr],
    );
  };

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

  function renderTabContent() {
    if (currentTab === "Overview") {
      return (
        <>
          <View style={styles.quickActions}>
            {quickActions.map((quickAction) => (
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
            ))}
          </View>
          <StrataTripOverviewCard
            trip={trip}
            locations={trip?.locations || []}
            onPress={() =>
              router.push({
                pathname: "/trip/[trip_id]",
                params: { trip_id: trip.trip_id, origin: "dashboard" },
              })
            }
          />
          <StrataDocumentsCard
            locations={trip?.locations || []}
            tripStartDate={trip?.start_date}
            classname={{ marginBottom: 40 }}
          />
        </>
      );
    }
    if (currentTab === "Map") {
      return (
        <View style={styles.mapContainer}>
          <Text style={styles.mapsText}>
            View your complete trip itinerary directly on your native maps app.
          </Text>
          <Pressable
            style={styles.mapsButton}
            onPress={() => openMapRoute(trip?.locations || [])}
          >
            <Text style={styles.ctaText}>Open Route in Maps</Text>
          </Pressable>
        </View>
      );
    }
    if (currentTab === "Budget")
      return <BudgetScreen trip={trip} setTrip={setTrip} />;

    return null;
  }

  function renderShiftComponent() {
    if (!trip?.locations || trip.locations.length === 0)
      return <Text>Add locations to your trip!</Text>;
    if (!activeSpotInfo) return <Text>No scheduled locations available.</Text>;

    const { locationsWithDates, active, shiftedDate } = activeSpotInfo;

    return (
      <View style={styles.shiftContainer}>
        <View style={styles.location}>
          <View style={styles.left}>
            <Text style={styles.label}>
              {getDayLabel(active.parsedDate, todayMidnight)}
            </Text>
            {selectedMethod === "Shift All" ? (
              <Text numberOfLines={1} style={styles.text}>
                {active.name}
              </Text>
            ) : (
              <Pressable
                style={styles.select}
                onPress={() => setIsOpened(!isOpened)}
              >
                <Text numberOfLines={1} style={styles.text}>
                  {active.name}
                </Text>
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
              {active.parsedDate.toLocaleTimeString("pt-PT", {
                hour: "2-digit",
                minute: "2-digit",
                timeZone: "UTC",
              })}
            </Text>
            <Text style={styles.labelM}>
              {getTimeUntil(active.scheduled_time)}
            </Text>
          </View>

          {isOpened && (
            <View style={styles.optionsContainer}>
              {locationsWithDates.map((loc: any) => (
                <Pressable
                  key={loc.location_id}
                  style={{ width: "100%", paddingVertical: 4 }}
                  onPress={() => {
                    setSelectedSpot(loc);
                    setIsOpened(false);
                  }}
                >
                  <Text style={styles.options}>{loc.name}</Text>
                </Pressable>
              ))}
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
            <Text numberOfLines={1} style={styles.text}>
              {active.name}
            </Text>
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
          onToggleSchedule={() => true}
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

  function renderModalContent() {
    switch (currentAction) {
      case "Plan B":
        return <Text>Plan b</Text>;
      case "Shift Trip":
        return (
          <>
            {[
              { title: "Shift All", text: "Delay full schedule" },
              {
                title: "Shift From",
                text: "Delay from specific time from the schedule",
              },
            ].map((btn) => (
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
                    selectedMethod === btn.title && { color: Colors.coral900 },
                  ]}
                >
                  {btn.title}
                </Text>
                <Text
                  style={[
                    styles.selectableText,
                    selectedMethod === btn.title && { color: Colors.coral400 },
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
              onPress={handleShiftSubmit}
            />
          </>
        );
      case "Invite":
        return (
          <>
            <StrataSocialList
              users={friends}
              selectedIds={selectedUsers}
              onUserPress={(u) => toggleUser(u.user_id)}
              renderRightIcon={(u, isSelected) =>
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
                await Promise.all(
                  selectedUsers.map((u) =>
                    inviteToTrip(trip.trip_id, Number(u)),
                  ),
                );
                setSelectedUsers([]);
                setModalVisible(false);
              }}
            />
          </>
        );
      case "Export":
        return (
          <StrataButton
            title={trip?.name || "Trip"}
            text="Export full trip!"
            imageSource={require("@/assets/images/pdf.png")}
            onPress={() => {
              try {
                ExportTrip(trip.trip_id);
                setModalVisible(false);
              } catch (error: any) {
                alert(error);
              }
            }}
          />
        );
      default:
        return null;
    }
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

  if (chatVisible) {
    return (
      <>
        <Tabs.Screen options={{ tabBarStyle: { display: "none" } }} />
        <Chat
          setVisible={setChatVisible}
          trip={trip}
          handleMessage={sendMessage}
          messages={chatMessages}
          setMessages={setChatMessages}
          resetMessages={clearMessages}
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
          ...(trip?.members?.length > 1
            ? [
                {
                  icon: <ChatBubbleIcon color={Colors.primaryDark} />,
                  classname: styles.icon,
                  hasNotification: messages.length > 0,
                  onPress: () => setChatVisible(true),
                },
              ]
            : []),
        ]}
      />

      {!trip && !isCreating ? (
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
      )}
    </View>
  );
}
