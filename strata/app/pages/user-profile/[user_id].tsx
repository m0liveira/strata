/* eslint-disable react-hooks/exhaustive-deps */
import { Text, View, Image, ScrollView } from "react-native";
import { styles } from "@/styles/profile/styles";
import { StrataHeader } from "@/components";
import { BellIcon, ShareIcon } from "@/components/icons";
import { Colors, Typography } from "@/constants/global-styles";
import { useState, useEffect } from "react";
import { StrataTab } from "@/components/strata-tab/StrataTab";
import { getTripByID, getUsersData } from "@/utils/StrataApiService";
import { TripCard } from "@/components/strata-trip-card/StrataTripCard";
import { router, Tabs, useLocalSearchParams } from "expo-router";
import { Notifications } from "@/components/features/notifications/Notifications";
import {
  getDaysAbroad,
  getSharedTripsData,
  getTravelBuddies,
  getWorldCompletion,
} from "@/utils/profileFunctions";
import { screenOptions } from "@/app/(tabs)/_layout";
import { user } from "@/utils/userService";

export default function User() {
  const [currentTab, setCurrentTab] = useState("Stats");
  const [worldCompletion, setWorldCompletion] = useState(0);
  const [trips, setTrips] = useState<any[]>([]);
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [userPage, setUserPage] = useState<any[]>([]);

  const { user_id, origin } = useLocalSearchParams() as {
    user_id: string;
    origin?: string;
  };

  const tabs = ["Stats", "Shared"];

  const setUserImageSource = (photoUrl: string) => {
    const isOnlineUrl = photoUrl && photoUrl.startsWith("http");

    return isOnlineUrl
      ? { uri: photoUrl }
      : require("@/assets/images/default-avatar.png");
  };

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        setUserPage(await getUsersData(Number(user_id)));
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadProfileData();
  }, []);

  const statCard = (props: any) => {
    const source = props.image;

    return (
      <View style={styles.card}>
        <Image source={source} style={styles.image} resizeMode="contain" />

        <View style={styles.cardTextContainer}>
          <Text style={styles.title}>{props.title}</Text>
          <Text style={styles.text}>{props.text}</Text>
        </View>
      </View>
    );
  };

  const renderTabContent = () => {
    switch (currentTab) {
      case "Stats":
        return (
          <View style={styles.content}>
            {statCard({
              image: require("@/assets/images/world.png"),
              title: "World Completion",
              text: `${worldCompletion}%`,
            })}

            {statCard({
              image: require("@/assets/images/calendar.png"),
              title: "Days Abroad",
              text: `${getDaysAbroad(trips)}`,
            })}

            {statCard({
              image: require("@/assets/images/shared.png"),
              title: "Shared Trips",
              text: `${getSharedTripsData(trips).totalShared}`,
            })}

            {statCard({
              image: require("@/assets/images/star.png"),
              title: "Average Rating",
              text: `${getSharedTripsData(trips).averageRating.toFixed(1)} / 5`,
            })}
          </View>
        );
      case "Shared":
        return (
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.scrollPage}
            contentContainerStyle={[
              styles.scrollView,
              { justifyContent: "flex-start", paddingTop: 40, gap: 40 },
            ]}
          >
            {getSharedTripsData(trips).sharedTrips.length === 0 ? (
              <Text style={styles.text}>
                No shared trips yet. Time to share!
              </Text>
            ) : (
              getSharedTripsData(trips).sharedTrips.map(
                (trip: any, index: number) => {
                  const isLast =
                    index === getSharedTripsData(trips).sharedTrips.length - 1;

                  return (
                    <TripCard
                      key={trip.trip_id}
                      trip={trip}
                      isPublic={true}
                      classname={isLast && { marginBottom: 40 }}
                      onPress={() => {
                        router.push({
                          pathname: "/trip/[trip_id]",
                          params: {
                            trip_id: trip.trip_id,
                            origin: "my-trips",
                          },
                        });
                      }}
                    />
                  );
                },
              )
            )}
          </ScrollView>
        );
    }
  };

  return notificationVisible ? (
    <>
      <Tabs.Screen
        options={{
          tabBarStyle: notificationVisible
            ? { display: "none" }
            : screenOptions.tabBarStyle,
        }}
      />

      <Notifications
        pending={{ friends: user.pending_friends, trips: user.pending_trips }}
        setVisible={setNotificationVisible}
      />
    </>
  ) : (
    <View style={styles.page}>
      <Tabs.Screen
        options={{
          tabBarStyle: notificationVisible
            ? { display: "none" }
            : screenOptions.tabBarStyle,
        }}
      />

      <StrataHeader
        classname={[styles.header]}
        icons={[
          {
            icon: <BellIcon color={Colors.primaryDark} />,
            classname: styles.icon,
            hasNotification:
              user.pending_friends.length > 0 || user.pending_trips.length > 0,
            onPress: () => {
              setNotificationVisible(true);
            },
          },
        ]}
      />

      <View style={styles.profileContainer}>
        <View style={styles.container}>
          <Image
            source={setUserImageSource(userPage?.[0]?.photo)}
            style={styles.avatar}
            resizeMode="cover"
          />

          <View style={styles.textContainer}>
            <Text style={styles.name}>{userPage?.[0]?.name}</Text>
            <Text style={styles.handle}>@{userPage?.[0]?.username}</Text>
          </View>
        </View>

        <ShareIcon color={Colors.primaryDark} classname={styles.icon} />
      </View>

      <StrataTab
        tabs={tabs}
        activeTab={currentTab}
        onTabPress={(tabTitle) => setCurrentTab(tabTitle)}
      />

      {renderTabContent()}
    </View>
  );
}
