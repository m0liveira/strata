import { Text, View, Image, ScrollView, Pressable, Alert } from "react-native";
import { styles } from "@/styles/profile/styles";
import { StrataHeader, StrataInput } from "@/components";
import {
  AddUserIcon,
  BellIcon,
  RemoveUserIcon,
  SearchIcon,
  SettingsIcon,
  ShareIcon,
} from "@/components/icons";
import { Colors, Typography } from "@/constants/global-styles";
import { useState, useEffect } from "react";
import { logout, user } from "@/utils/userService";
import { StrataTab } from "@/components/strata-tab/StrataTab";
import {
  declineFriendRequest,
  getTripByID,
  getUsersData,
  searchUser,
  sendFriendRequest,
  stopFollowingUser,
} from "@/utils/StrataApiService";
import { TripCard } from "@/components/strata-trip-card/StrataTripCard";
import { router, Tabs } from "expo-router";
import { StrataSocialUser } from "@/components/strata-social-user/StrataSocialUser";
import { searchInputProperties } from "@/utils/input-properties";
import { StrataModal } from "@/components/strata-modal/StrataModal";
import { Notifications } from "@/components/features/notifications/Notifications";
import { screenOptions } from "../_layout";
import {
  getDaysAbroad,
  getSharedTripsData,
  getTravelBuddies,
  getWorldCompletion,
} from "@/utils/profileFunctions";

export default function Profile() {
  const [currentTab, setCurrentTab] = useState("Stats");
  const [worldCompletion, setWorldCompletion] = useState(0);
  const [trips, setTrips] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [friends, setFriends] = useState<any[]>([]);
  const [following, setFollowing] = useState<any[]>([]);
  const [searchedUser, setSearchedUser] = useState<any>(null);
  const [isSearched, setIsSearched] = useState(false);
  const [modalSettingsVisible, setModalSettingsVisible] = useState(false);
  const [notificationVisible, setNotificationVisible] = useState(false);

  const tabs = ["Stats", "Social", "Shared"];

  const setUserImageSource = (photoUrl: string) => {
    const isOnlineUrl = photoUrl && photoUrl.startsWith("http");

    return isOnlineUrl
      ? { uri: photoUrl }
      : require("@/assets/images/default-avatar.png");
  };

  useEffect(() => {
    const loadProfileData = async () => {
      if (!user || !user.trips) return;

      try {
        const tripsPromises = user.trips.map((trip: any) =>
          getTripByID(trip.trip_id),
        );
        const detailedTrips = await Promise.all(tripsPromises);

        setTrips(detailedTrips);

        const completion = await getWorldCompletion(detailedTrips);
        setWorldCompletion(completion);

        const following = await getUsersData(user.following);

        setFollowing(following);
        setFriends(user.friends_profiles || []);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadProfileData();
  }, []);

  const handleSearchUser = async (username: string) => {
    try {
      setSearchedUser(null);
      setIsSearched(false);

      const searched = await searchUser(username);

      setSearchedUser(searched || null);
      setIsSearched(true);
    } catch (error) {
      setSearchedUser(null);
      setIsSearched(true);
    }
  };

  const handleAddFriend = async (userToAdd: any) => {
    try {
      await sendFriendRequest(userToAdd.user_id);
    } catch (error) {
      console.error("Error adding friend:", error);
    }
  };

  const handleRemoveFriend = async (userToRemove: any) => {
    try {
      await declineFriendRequest(userToRemove.user_id);

      user.friends = (user.friends || []).filter(
        (id: number) => id !== userToRemove.user_id,
      );
      user.friends_profiles = (user.friends_profiles || []).filter(
        ({ user_id }: { user_id: number }) => user_id !== userToRemove.user_id,
      );
    } catch (error) {
      console.error("Error Removing friend:", error);
    }
  };

  const handleRemoveFollow = async (userToRemove: any) => {
    try {
      await stopFollowingUser(userToRemove.user_id);

      user.following = (user.following || []).filter(
        (id: number) => id !== userToRemove.user_id,
      );
    } catch (error) {
      console.error("Error Removing follow:", error);
    }
  };

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

  const handleAction = (relationship: string, targetedUser: any) => {
    switch (relationship) {
      case "friend":
        if (user.friends?.includes(targetedUser.user_id)) {
          handleRemoveFriend(targetedUser);
        } else if (!user.pending_friends?.includes(targetedUser.user_id)) {
          handleAddFriend(targetedUser);

          setSearchedUser(null);
          setSearch("");
          setIsSearched(false);
        }
        break;

      default:
        handleRemoveFollow(targetedUser);
        break;
    }
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

            <View style={[styles.card, { width: "100%", flex: 0 }]}>
              <Image
                source={require("@/assets/images/friends.png")}
                style={styles.image}
                resizeMode="contain"
              />

              <View style={styles.cardTextContainer}>
                <Text style={styles.title}>Travel Buddies</Text>
                {getTravelBuddies(trips).length === 0 ? (
                  <Text style={styles.text}>You are a solo traveler!</Text>
                ) : (
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Image
                      source={setUserImageSource(
                        getTravelBuddies(trips)[0].photo,
                      )}
                      style={[
                        styles.avatar,
                        { width: 20, height: 20, marginRight: 10 },
                      ]}
                      resizeMode="contain"
                    />

                    <Text style={styles.text}>
                      {getTravelBuddies(trips)[0].username}
                    </Text>
                  </View>
                )}
              </View>

              {getTravelBuddies(trips).length === 0 && (
                <View style={styles.cardTextContainer}>
                  {getTravelBuddies(trips).map((buddy: any) => (
                    <>
                      <Image
                        source={setUserImageSource(buddy.photo)}
                        style={[
                          styles.avatar,
                          { width: 24, height: 24, marginRight: 6 },
                        ]}
                        resizeMode="contain"
                      />

                      <Text style={[styles.text, Typography.bodyS]}>
                        {buddy.username}
                      </Text>
                    </>
                  ))}
                </View>
              )}
            </View>

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
      case "Social":
        return (
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.scrollPage}
            contentContainerStyle={[
              styles.scrollView,
              { justifyContent: "flex-start", paddingTop: 40, gap: 40 },
            ]}
          >
            <View style={styles.socialContainer}>
              <StrataInput
                properties={{
                  ...searchInputProperties,
                  placeholder: "Search buddies",
                  value: search,
                  onChangeText: setSearch,
                }}
                icon={{
                  classname: { top: 12, transform: [{ scaleX: -1 }] },
                  icon: (
                    <SearchIcon
                      color={Colors.grey400}
                      classname={styles.actionIcon}
                    />
                  ),
                  onPress: () => {
                    handleSearchUser(search);
                  },
                }}
              />

              {searchedUser && (
                <StrataSocialUser
                  key={searchedUser.user_id}
                  classname={{ paddingHorizontal: 0, paddingVertical: 0 }}
                  user={searchedUser}
                  rightIcon={
                    user.friends_profiles?.some(
                      (p: any) => p.username === searchedUser.username,
                    ) && !user.pending_friends?.includes(searchedUser.id) ? (
                      <RemoveUserIcon
                        color={Colors.secondaryDark}
                        classname={styles.actionIcon}
                      />
                    ) : (
                      <AddUserIcon
                        color={Colors.secondaryDark}
                        classname={styles.actionIcon}
                      />
                    )
                  }
                  onIconPress={() => {
                    confirmAction("friend", searchedUser);
                  }}
                  onPress={() =>
                    router.push({
                      pathname: "/pages/user-profile/[user_id]",
                      params: {
                        user_id: searchedUser.user_id,
                        origin: "profile",
                      },
                    })
                  }
                />
              )}

              {isSearched && !searchedUser && (
                <Text style={[styles.label, { alignSelf: "center" }]}>
                  No user found with that username.
                </Text>
              )}
            </View>

            <View style={styles.socialContainer}>
              <Text style={styles.label}>Friends</Text>

              {friends.length === 0 ? (
                <Text style={styles.text}>No friends yet. Time to Add!</Text>
              ) : (
                friends.map((friend: any) => (
                  <StrataSocialUser
                    key={friend.user_id}
                    classname={{ paddingHorizontal: 0, paddingVertical: 0 }}
                    user={friend}
                    rightIcon={
                      <RemoveUserIcon
                        color={Colors.secondaryDark}
                        classname={styles.actionIcon}
                      />
                    }
                    onIconPress={() => {
                      confirmAction("friend", friend);
                    }}
                    onPress={() =>
                      router.push({
                        pathname: "/pages/user-profile/[user_id]",
                        params: {
                          user_id: friend.user_id,
                          origin: "profile",
                        },
                      })
                    }
                  />
                ))
              )}
            </View>

            <View style={styles.socialContainer}>
              <Text style={styles.label}>Following</Text>

              {following.length === 0 ? (
                <Text style={styles.text}>
                  Not following yet. Time to Follow!
                </Text>
              ) : (
                following.map((follow: any) => (
                  <StrataSocialUser
                    key={follow.user_id}
                    classname={{ paddingHorizontal: 0, paddingVertical: 0 }}
                    user={follow}
                    rightIcon={
                      <RemoveUserIcon
                        color={Colors.secondaryDark}
                        classname={styles.actionIcon}
                      />
                    }
                    onIconPress={() => {
                      confirmAction("follow", follow);
                    }}
                    onPress={() =>
                      router.push({
                        pathname: "/pages/user-profile/[user_id]",
                        params: {
                          user_id: follow.user_id,
                          origin: "profile",
                        },
                      })
                    }
                  />
                ))
              )}
            </View>
          </ScrollView>
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

  const confirmDangerAction = () => {
    Alert.alert(`Logout Confirmation`, `Are you sure you want to logout?`, [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/pages/get-started");
        },
      },
    ]);
  };

  const confirmAction = (relationship: string, user: any) => {
    Alert.alert(
      `${relationship} Confirmation`,
      `Are you sure you want to ${relationship}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Confirm",
          style: "default",
          onPress: async () => {
            handleAction(relationship.toLowerCase(), user);
          },
        },
      ],
    );
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
          {
            icon: <SettingsIcon color={Colors.primaryDark} />,
            classname: styles.icon,
            onPress: () => setModalSettingsVisible(true),
          },
        ]}
      />

      <View style={styles.profileContainer}>
        <View style={styles.container}>
          <Image
            source={setUserImageSource(user.photo)}
            style={styles.avatar}
            resizeMode="cover"
          />

          <View style={styles.textContainer}>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.handle}>@{user.username}</Text>
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

      <StrataModal
        isVisible={modalSettingsVisible}
        onClose={() => {
          setModalSettingsVisible(false);
        }}
      >
        <View style={styles.options}>
          <>
            <Pressable
              style={styles.dangerAction}
              onPress={confirmDangerAction}
            >
              <Text style={styles.dangerText}>Logout</Text>
            </Pressable>
          </>
        </View>
      </StrataModal>
    </View>
  );
}
