import { Pressable, ScrollView, View, Text } from "react-native";
import { Image } from "expo-image";
import { Colors } from "@/constants/global-styles";
import { EmptyState } from "@/app/pages/empty-state";
import { StrataHeader, StrataButton, StrataInput } from "@/components";
import { BellIcon, SliderHorizontalIcon } from "@/components/icons";
import { styles } from "@/styles/discover/styles";
import { StrataTab } from "@/components/strata-tab/StrataTab";
import { router, Tabs, useFocusEffect } from "expo-router";
import { useCallback, useState, useMemo } from "react";
import { getPublicTrips, getSocialTrips } from "@/utils/StrataApiService";
import { TripCard } from "@/components/strata-trip-card/StrataTripCard";
import { searchInputProperties } from "@/utils/input-properties";
import { user } from "@/utils/userService";
import { Notifications } from "@/components/features/notifications/Notifications";
import { screenOptions } from "../_layout";

const tabs = ["Explore", "Following"];

export default function Discover() {
  const [currentTab, setCurrentTab] = useState("Explore");
  const [publicTrips, setPublicTrips] = useState<any[]>([]);
  const [socialTrips, setSocialTrips] = useState<any[]>([]);
  const [search, setSearch] = useState<string>("");
  const [notificationVisible, setNotificationVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchDiscoverTrips = async () => {
        try {
          const [publicData, socialData] = await Promise.all([
            getPublicTrips(),
            getSocialTrips(),
          ]);

          if (isActive) {
            setPublicTrips(publicData || []);
            setSocialTrips(socialData || []);
          }
        } catch (error) {
          console.error("Error loading trips:", error);
        }
      };

      fetchDiscoverTrips();

      return () => {
        isActive = false;
        setPublicTrips([]);
        setSocialTrips([]);
        setCurrentTab("Explore");
        setSearch("");
      };
    }, []),
  );

  const displayTrips = useMemo(() => {
    const activeTrips = currentTab === "Explore" ? publicTrips : socialTrips;

    if (!search.trim()) return activeTrips;

    const searchTerm = search.toLowerCase();

    return activeTrips.filter((trip: any) => {
      const matchName = trip.name?.toLowerCase().includes(searchTerm);
      const matchDestinations = trip.destinations?.some(
        (dest: any) =>
          typeof dest === "string" && dest.toLowerCase().includes(searchTerm),
      );

      return matchName || matchDestinations;
    });
  }, [currentTab, publicTrips, socialTrips, search]);

  const emptyConfig =
    currentTab === "Explore"
      ? {
          title: "No trips shared yet.",
          subtitle:
            "Start planning your next adventure and be the first to inspire the community.",
          btnTitle: "Create Trip",
          btnText: "Plan your dream trip!",
          onPress: () => router.push("/(tabs)/my-trips"),
        }
      : {
          title: "No friends' trips yet.",
          subtitle: "Follow your friends to see their shared adventures here.",
          btnTitle: "Find Friends",
          btnText: "Connect with others!",
          onPress: () => router.push("/(tabs)/profile"),
        };

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

  return (
    <View style={styles.page}>
      <Tabs.Screen options={{ tabBarStyle: screenOptions.tabBarStyle }} />

      <StrataHeader
        classname={[styles.header]}
        icons={[
          {
            icon: <BellIcon color={Colors.primaryDark} />,
            classname: styles.icon,
            hasNotification:
              user.pending_friends.length > 0 || user.pending_trips.length > 0,
            onPress: () => setNotificationVisible(true),
          },
        ]}
      />

      <StrataTab
        tabs={tabs}
        activeTab={currentTab}
        onTabPress={(tabTitle) => {
          setCurrentTab(tabTitle);
          setSearch("");
        }}
      />

      {displayTrips.length > 0 ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.scrollPage}
          contentContainerStyle={[
            styles.scrollView,
            { justifyContent: "flex-start", paddingTop: 40, gap: 40 },
          ]}
        >
          <View style={styles.filters}>
            <StrataInput
              classname={{ container: styles.container }}
              properties={{
                ...searchInputProperties,
                value: search,
                onChangeText: setSearch,
              }}
            />

            <Pressable onPress={() => {}}>
              <SliderHorizontalIcon
                color={Colors.secondaryDark}
                classname={styles.icon}
              />
            </Pressable>
          </View>

          {displayTrips.map((trip: any, index: number) => {
            const isLast = index === displayTrips.length - 1;

            return (
              <View
                key={trip.trip_id}
                style={[styles.cardContainer, isLast && { marginBottom: 40 }]}
              >
                <View style={{ width: "100%", justifyContent: "flex-start" }}>
                  <Pressable style={[styles.creator]} onPress={() => {}}>
                    <Image
                      source={
                        trip.creator?.photo?.includes("/assets/")
                          ? require("@/assets/images/default-avatar.png")
                          : { uri: trip.creator?.photo }
                      }
                      style={styles.avatar}
                      contentFit="cover"
                    />
                    <Text style={[styles.name]}>{trip.creator?.username}</Text>
                  </Pressable>
                </View>

                <TripCard
                  trip={trip}
                  isPublic={true}
                  onPress={() => {
                    router.push({
                      pathname: "/trip/[trip_id]",
                      params: {
                        trip_id: trip.trip_id,
                        origin: "discover",
                        creator: trip.creator?.photo,
                      },
                    });
                  }}
                />
              </View>
            );
          })}
        </ScrollView>
      ) : (
        <EmptyState
          title={emptyConfig.title}
          subtitle={emptyConfig.subtitle}
          buttons={[
            <StrataButton
              key="empty-action"
              title={emptyConfig.btnTitle}
              text={emptyConfig.btnText}
              imageSource={require("@/assets/images/plane-taking-off.png")}
              onPress={emptyConfig.onPress}
            />,
          ]}
        />
      )}
    </View>
  );
}
