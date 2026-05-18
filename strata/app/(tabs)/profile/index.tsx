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
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  declineFriendRequest,
  getTripByID,
  getUsersData,
  searchUser,
  sendFriendRequest,
  stopFollowingUser,
} from "@/utils/StrataApiService";
import { TripCard } from "@/components/strata-trip-card/StrataTripCard";
import { router } from "expo-router";
import { StrataSocialUser } from "@/components/strata-social-user/StrataSocialUser";
import { searchInputProperties } from "@/utils/input-properties";
import { StrataModal } from "@/components/strata-modal/StrataModal";

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

  const tabs = ["Stats", "Social", "Shared"];

  const setUserImageSource = (photoUrl: string) => {
    const isOnlineUrl = photoUrl && photoUrl.startsWith("http");

    return isOnlineUrl
      ? { uri: photoUrl }
      : require("@/assets/images/default-avatar.png");
  };

  const getWorldCompletion = async (tripsData: any[]) => {
    try {
      const cachedCountriesData = await AsyncStorage.getItem("countries_data");

      const countries = cachedCountriesData
        ? JSON.parse(cachedCountriesData)
        : [];

      const totalCountries = countries.length > 0 ? countries.length : 195;

      const visitedCountries = new Set();

      tripsData.forEach((trip) => {
        if (trip.destinations && Array.isArray(trip.destinations)) {
          trip.destinations.forEach((dest: any) => {
            const destName =
              typeof dest === "string" ? dest : dest?.destination;

            if (destName) {
              const destLower = destName.toLowerCase();

              const matchedCountry = countries.find(
                (c: any) =>
                  c.country.toLowerCase() === destLower ||
                  (c.cities &&
                    c.cities.some(
                      (city: string) => city.toLowerCase() === destLower,
                    )),
              );

              if (matchedCountry) {
                visitedCountries.add(matchedCountry.iso3);
              }
            }
          });
        }
      });

      const percentage = (visitedCountries.size / totalCountries) * 100;
      return parseFloat(percentage.toFixed(2));
    } catch (error) {
      console.error("Error calculating world completion:", error);
      return 0;
    }
  };

  const getDaysAbroad = () => {
    let totalDays = 0;

    trips.forEach((trip) => {
      if (trip.start_date && trip.end_date) {
        const start = new Date(trip.start_date).getTime();
        const end = new Date(trip.end_date).getTime();

        const diffInDays =
          Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1;

        if (diffInDays > 0) {
          totalDays += diffInDays;
        }
      }
    });

    return totalDays;
  };

  const getTravelBuddies = () => {
    const buddiesMap = new Map();

    trips.forEach((trip) => {
      if (trip.members && Array.isArray(trip.members)) {
        trip.members.forEach((member: any) => {
          const buddy = member.user;

          if (buddy && buddy.username !== user.username) {
            if (buddiesMap.has(buddy.username)) {
              buddiesMap.get(buddy.username).tripsShared += 1;
            } else {
              buddiesMap.set(buddy.username, {
                ...buddy,
                tripsShared: 1,
              });
            }
          }
        });
      }
    });

    return Array.from(buddiesMap.values())
      .sort((a, b) => b.tripsShared - a.tripsShared)
      .slice(0, 4);
  };

  const getSharedTripsData = () => {
    let totalShared: number = 0;
    let totalRating: number = 0.0;
    let sharedTrips: any[] = [];

    trips.forEach((trip) => {
      if (trip.visibility.toLowerCase() !== "private") {
        totalShared += 1;
        sharedTrips.push(trip);

        if (trip.rating) {
          totalRating += trip.rating;
        }
      }
    });

    let averageRating =
      totalShared > 0 ? Math.min(totalRating / totalShared, 5) : 0;

    return { totalShared, averageRating, sharedTrips };
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
      await sendFriendRequest(userToAdd.id);
      user.pending_friends = [...(user.pending_friends || []), userToAdd.id];
    } catch (error) {
      console.error("Error adding friend:", error);
    }
  };

  const handleRemoveFriend = async (userToRemove: any) => {
    try {
      await declineFriendRequest(userToRemove.id);

      user.friends = (user.friends || []).filter(
        (id: number) => id !== userToRemove.id,
      );
      user.friends_profiles = (user.friends_profiles || []).filter(
        ({ user_id }: { user_id: number }) => user_id !== userToRemove.id,
      );
    } catch (error) {
      console.error("Error Removing friend:", error);
    }
  };

  const handleRemoveFollow = async (userToRemove: any) => {
    try {
      await stopFollowingUser(userToRemove.id);

      user.following = (user.following || []).filter(
        (id: number) => id !== userToRemove.id,
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

  const handleAction = (relationship: string, user: any) => {
    switch (relationship) {
      case "friend":
        if (
          user.pending_friends?.includes(user.id) ||
          user.friends?.includes(user.id)
        ) {
          handleRemoveFriend(user);
        } else {
          handleAddFriend(user);
        }
        break;

      default:
        handleRemoveFollow(user);
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
              text: `${getDaysAbroad()}`,
            })}

            <View style={[styles.card, { width: "100%" }]}>
              <Image
                source={require("@/assets/images/friends.png")}
                style={styles.image}
                resizeMode="contain"
              />

              <View style={styles.cardTextContainer}>
                <Text style={styles.title}>Travel Buddies</Text>
                {getTravelBuddies().length === 0 ? (
                  <Text style={styles.text}>You are a solo traveler!</Text>
                ) : (
                  <>
                    <Image
                      source={setUserImageSource(getTravelBuddies()[0].photo)}
                      style={[
                        styles.avatar,
                        { width: 24, height: 24, marginRight: 10 },
                      ]}
                      resizeMode="contain"
                    />

                    <Text style={styles.text}>
                      {getTravelBuddies()[0].username}
                    </Text>
                  </>
                )}
              </View>

              {getTravelBuddies().length === 0 && (
                <View style={styles.cardTextContainer}>
                  {getTravelBuddies().map((buddy: any) => (
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
              text: `${getSharedTripsData().totalShared}`,
            })}

            {statCard({
              image: require("@/assets/images/star.png"),
              title: "Average Rating",
              text: `${getSharedTripsData().averageRating.toFixed(1)} / 5`,
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
                    ) || !user.pending_friends?.includes(searchedUser.id) ? (
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
                    handleAction("friend", searchedUser);
                  }}
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
                      handleAction("friend", friend);
                    }}
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
                      handleAction("follow", follow);
                    }}
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
            {getSharedTripsData().sharedTrips.length === 0 ? (
              <Text style={styles.text}>
                No shared trips yet. Time to share!
              </Text>
            ) : (
              getSharedTripsData().sharedTrips.map(
                (trip: any, index: number) => {
                  const isLast =
                    index === getSharedTripsData().sharedTrips.length - 1;

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

  // #TODO: Go to users profiles
  // #TODO: Add confirmation alert for unfriending and unfollowing

  return (
    <View style={styles.page}>
      <StrataHeader
        classname={[styles.header]}
        icons={[
          {
            icon: <BellIcon color={Colors.primaryDark} />,
            classname: styles.icon,
            onPress: () => {}, // #TODO: add notification functionality
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
