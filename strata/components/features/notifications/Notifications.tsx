import { Pressable, ScrollView, View, Text } from "react-native";
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
import { getUsersData } from "@/utils/StrataApiService";

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

  const resetForm = () => {};

  useEffect(() => {
    const loadProfiles = async () => {
      if (!props.pending.friends || props.pending.friends.length === 0) {
        return;
      }

      try {
        const friends = props.pending.friends.map((friend: any) => {
          return friend.requester_id;
        });

        const req = await getUsersData(friends);

        setFriendRequests(req);
        setTripRequests(props.pending.trips);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    loadProfiles();
  }, []);

  useFocusEffect(
    useCallback(() => {
      return () => {
        resetForm();
      };
    }, []),
  );

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
                    <Pressable>
                      <CheckmarkIcon
                        classname={styles.smallIcon}
                        color="green"
                      />
                    </Pressable>

                    <Pressable>
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
                        ? trip.trip.start_date
                        : "TBD"}
                    </Text>
                    <Text style={styles.name}>{trip.trip.name}</Text>
                  </View>

                  <View style={{ flexDirection: "row", gap: 12 }}>
                    <Pressable>
                      <CheckmarkIcon
                        classname={styles.smallIcon}
                        color="green"
                      />
                    </Pressable>

                    <Pressable>
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
