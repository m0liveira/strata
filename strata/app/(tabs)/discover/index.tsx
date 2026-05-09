import { Pressable, ScrollView, View, Text } from "react-native";
import { Image } from "expo-image";
import { Colors } from "@/constants/global-styles";
import { EmptyState } from "@/app/pages/empty-state";
import { StrataHeader, StrataButton, StrataInput } from "@/components";
import { BellIcon, SliderHorizontalIcon } from "@/components/icons";
import { styles } from "@/styles/discover/styles";
import { StrataTab } from "@/components/strata-tab/StrataTab";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { getPublicTrips, getSocialTrips } from "@/utils/StrataApiService";
import { TripCard } from "@/components/strata-trip-card/StrataTripCard";
import { searchInputProperties } from "@/utils/input-properties";

const tabs = ["Explore", "Following"];

export default function Discover() {
  const [currentTab, setCurrentTab] = useState("Explore");
  const [publicTrips, setPublicTrips] = useState<any>([]);
  const [socialTrips, setSocialTrips] = useState<any>([]);
  const [search, setSearch] = useState<string>("");

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
            setPublicTrips(publicData);
            setSocialTrips(socialData);
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
      };
    }, []),
  );

  const renderTabContent = () => {
    if (currentTab !== "Explore" && currentTab !== "Following") return null;

    const isExplore = currentTab === "Explore";
    const trips = isExplore ? publicTrips : socialTrips;

    const filteredTrips = trips.filter((trip: any) => {
      const searchTerm = search.toLowerCase();

      const matchName = trip.name?.toLowerCase().includes(searchTerm);

      const matchDestinations = trip.destinations?.some(
        (destination: any) =>
          typeof destination === "string" &&
          destination.toLowerCase().includes(searchTerm),
      );

      return matchName || matchDestinations;
    });

    const displayTrips = search.length > 0 ? filteredTrips : trips;

    if (trips?.length > 0) {
      return (
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
                        trip.creator.photo.includes("/assets/")
                          ? require("@/assets/images/default-avatar.png")
                          : { uri: trip.creator.photo }
                      }
                      style={styles.avatar}
                      contentFit="cover"
                    />

                    <Text style={[styles.name]}>{trip.creator.username}</Text>
                  </Pressable>
                </View>

                <TripCard
                  key={trip.trip_id}
                  trip={trip}
                  isPublic={true}
                  onPress={() => {
                    router.push({
                      pathname: "/trip/[trip_id]",
                      params: {
                        trip_id: trip.trip_id,
                        origin: "discover",
                        creator: trip.creator.photo,
                      },
                    });
                  }}
                />
              </View>
            );
          })}
        </ScrollView>
      );
    }

    const emptyConfig = isExplore
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

    return (
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
    );
  };

  return (
    <View style={styles.page}>
      <StrataHeader
        classname={[styles.header]}
        icons={[
          {
            icon: <BellIcon color={Colors.primaryDark} />,
            classname: styles.icon,
            onPress: () => {}, // #TODO: Add notification functionality
          },
        ]}
      />

      <StrataTab
        tabs={tabs}
        activeTab={currentTab}
        onTabPress={(tabTitle) => setCurrentTab(tabTitle)}
      />

      {renderTabContent()}
    </View>
  );
}
