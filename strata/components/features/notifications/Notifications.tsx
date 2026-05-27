import { Pressable, ScrollView, View, Text, Alert } from "react-native";
import { useFocusEffect } from "expo-router";
import {
  useState,
  useCallback,
  useEffect,
  SetStateAction,
  Dispatch,
} from "react";
import { Image } from "expo-image";
import { styles } from "./styles";
import { Colors } from "@/constants/global-styles";
import { ArrowIcon, CheckmarkIcon, XCircleIcon } from "@/components/icons";
import {
  acceptFriendRequest,
  acceptTripInvite,
  declineFriendRequest,
  getTripByID,
  getUsersData,
  LeaveTrip,
} from "@/utils/StrataApiService";
import { user } from "@/utils/userService";

type NotificationProps = {
  pending: {
    trips: any[];
    friends: any[];
  };
  setVisible: Dispatch<SetStateAction<boolean>>;
};

export const Notifications = (props: NotificationProps) => {
  const [friendRequests, setFriendRequests] = useState<any[]>([]);
  const [tripRequests, setTripRequests] = useState<any[]>([]);

  const loadProfiles = async () => {
    setTripRequests(props.pending.trips);

    if (!props.pending.friends || props.pending.friends.length === 0) {
      return;
    }

    try {
      const friends = props.pending.friends.map((friend: any) => {
        return friend.requester_id;
      });

      const req = await getUsersData(friends);

      setFriendRequests(req);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    loadProfiles();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadProfiles();

      return async () => {
        setTripRequests([]);
        setFriendRequests([]);
      };
    }, []),
  );

  const acceptTripRequest = async (trip_id: string) => {
    try {
      await acceptTripInvite(trip_id);

      user.pending_trips = user.pending_trips.filter((trip) => {
        return trip.trip_id !== trip_id;
      });

      setTripRequests(user.pending_trips);

      const tripToAdd = await getTripByID(trip_id);

      const { locations, destinations, members, chats, expenses, ...trip } =
        tripToAdd;

      user.trips.push(trip);
    } catch (error) {
      console.error(error);
    }
  };

  const refuseTripInvite = async (trip_id: string) => {
    try {
      await LeaveTrip(trip_id);

      user.pending_trips = user.pending_trips.filter((trip) => {
        return trip.trip_id !== trip_id;
      });

      setTripRequests(user.pending_trips);
    } catch (error) {
      console.error(error);
    }
  };

  const acceptFriendInvite = async (user_id: number) => {
    try {
      await acceptFriendRequest(user_id);

      user.pending_friends = user.pending_friends.filter((friend: any) => {
        return Number(friend.requester_id) !== user_id;
      });

      const userToAdd = await getUsersData([user_id]);

      user.friends_profiles?.push(userToAdd[0]);
      user.friends.push(user_id);

      setFriendRequests(
        friendRequests.filter((f) => {
          return f.user_id !== user_id;
        }),
      );
    } catch (error) {
      console.error(error);
    }
  };

  const refuseFriendInvite = async (user_id: number) => {
    try {
      await declineFriendRequest(user_id);

      user.pending_friends = user.pending_friends.filter((friend: any) => {
        return Number(friend.requester_id) !== user_id;
      });

      setFriendRequests(
        friendRequests.filter((f) => {
          return f.user_id !== user_id;
        }),
      );
    } catch (error) {
      console.error(error);
    }
  };

  const confirmAction = (action: string, content: string, id: any) => {
    Alert.alert(
      `${action} Confirmation`,
      `Are you sure you want to ${action}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: action,
          style: "default",
          onPress: async () => {
            switch (content) {
              case "trip":
                if (action === "Accept") {
                  acceptTripRequest(id);
                } else {
                  refuseTripInvite(id);
                }

                break;

              default:
                if (action === "Accept") {
                  acceptFriendInvite(id);
                } else {
                  refuseFriendInvite(id);
                }

                break;
            }
          },
        },
      ],
    );
  };

  return (
    <View style={styles.page}>
      <View style={styles.header}>
        <Pressable
          style={styles.iconBg}
          onPress={() => props.setVisible(false)}
        >
          <ArrowIcon
            classname={styles.icon}
            color={Colors.primaryDark}
          ></ArrowIcon>
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollPage}
        contentContainerStyle={[
          styles.scrollView,
          { justifyContent: "flex-start", paddingTop: 40, gap: 40 },
        ]}
      >
        {friendRequests.length > 0 ? (
          <View style={styles.container}>
            <Text style={styles.title}>Friend requests</Text>

            {friendRequests.map((friend) => {
              return (
                <View key={friend.user_id} style={styles.itemContainer}>
                  <Image
                    source={
                      friend.photo.includes("/assets/")
                        ? require("@/assets/images/default-avatar.png")
                        : { uri: friend.photo }
                    }
                    style={styles.avatar}
                    contentFit="cover"
                  />

                  <View style={styles.textContainer}>
                    <Text style={styles.name}>{friend.name}</Text>
                    <Text style={styles.handle}>@{friend.username}</Text>
                  </View>

                  <View style={{ flexDirection: "row", gap: 12 }}>
                    <Pressable
                      onPress={() =>
                        confirmAction("Accept", "user", friend.user_id)
                      }
                    >
                      <CheckmarkIcon
                        classname={styles.smallIcon}
                        color="green"
                      />
                    </Pressable>

                    <Pressable
                      onPress={() =>
                        confirmAction("Refuse", "user", friend.user_id)
                      }
                    >
                      <XCircleIcon
                        classname={styles.smallIcon}
                        color="#f96666"
                      />
                    </Pressable>
                  </View>
                </View>
              );
            })}
          </View>
        ) : (
          <Text>No friend requests</Text>
        )}

        {tripRequests.length > 0 ? (
          <View style={styles.container}>
            <Text style={styles.title}>Trip requests</Text>

            {tripRequests.map((trip) => {
              return (
                <View key={trip.trip_id} style={styles.itemContainer}>
                  <Image
                    source={
                      trip.trip.banner === null
                        ? require("@/assets/images/default-banner.png")
                        : trip.trip.banner.includes("/assets/")
                          ? require("@/assets/images/default-banner.png")
                          : { uri: trip.trip.banner }
                    }
                    style={styles.avatar}
                    contentFit="cover"
                  />

                  <View style={styles.textContainer}>
                    <Text style={styles.handle}>
                      {trip.trip.start_date !== null
                        ? new Date(trip.trip.start_date).toLocaleDateString(
                            "pt-PT",
                          )
                        : "TBD"}
                    </Text>
                    <Text style={styles.name}>{trip.trip.name}</Text>
                  </View>

                  <View style={{ flexDirection: "row", gap: 12 }}>
                    <Pressable
                      onPress={() =>
                        confirmAction("Accept", "trip", trip.trip_id)
                      }
                    >
                      <CheckmarkIcon
                        classname={styles.smallIcon}
                        color="green"
                      />
                    </Pressable>

                    <Pressable
                      onPress={() =>
                        confirmAction("Refuse", "trip", trip.trip_id)
                      }
                    >
                      <XCircleIcon
                        classname={styles.smallIcon}
                        color="#f96666"
                      />
                    </Pressable>
                  </View>
                </View>
              );
            })}
          </View>
        ) : (
          <Text>No trip invitations</Text>
        )}
      </ScrollView>
    </View>
  );
};
