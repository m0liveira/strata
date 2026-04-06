import { View, ScrollView } from "react-native";
import { useEffect, useMemo, useState } from "react";
import { styles } from "./styles";
import { Colors } from "@/constants/global-styles";
import { StrataCTA } from "@/components/strata-cta/StrataCTA";
import { StrataForm } from "@/components/strata-form/StrataForm";
import { StrataInput } from "@/components/strata-input/StrataInput";
import { StrataImagePicker } from "@/components/strata-image-picker/StrataImagePicker";
import { StrataSelectInput } from "@/components/strata-select-input/StrataSelectInput";
import { tripNameInputProperties } from "@/utils/input-properties";
import { StrataRadioButtonGroup } from "@/components/strata-radio-button-group/StrataRadioButtonGroup";
import { StrataCalendar } from "@/components/strata-calendar/StrataCalendar";
import {
  ArrowIcon,
  GlobeIcon,
  LockIcon,
  MinusIcon,
  PlusIcon,
  UsersIcon,
} from "@/components/icons";
import { StrataSocialList } from "@/components/strata-social-list/StrataSocialList";
import { user } from "@/utils/userService";
import { PublicUser } from "@/types/models/user-model";

type TripCreationFormProps = {
  stage: number;
  handleSubmit: () => void;
};

const visibilityOptions = [
  {
    id: "private",
    label: "Private",
    icon: <LockIcon />,
  },
  {
    id: "public",
    label: "Public",
    icon: <GlobeIcon />,
  },
  {
    id: "friends",
    label: "Friends only",
    icon: <UsersIcon />,
  },
];

export const TripCreationForm = (props: TripCreationFormProps) => {
  const [banner, setBanner] = useState<string>(
    "/assets/images/default-banner.png",
  );
  const [name, setName] = useState<string>("");
  const [destinations, setDestinations] = useState<string[]>([]);
  const [visibility, setVisibility] = useState<string>("private");
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [friendsProfiles, setFriendsProfiles] = useState<PublicUser[]>(
    user.friends_profiles || [],
  );
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  useEffect(() => {
    setFriendsProfiles(user.friends_profiles || []);

    console.log(friendsProfiles);
  }, []);

  const toggleUser = (userId: number) => {
    const idStr = String(userId);
    setSelectedUsers((prev) =>
      prev.includes(idStr)
        ? prev.filter((id) => id !== idStr)
        : [...prev, idStr],
    );
  };

  const isStepOneValid = name.trim().length > 0 && destinations.length > 0;

  const formProps = useMemo(() => {
    switch (props.stage) {
      case 1:
        return [
          {
            label: "Trip banner",
            element: (
              <StrataImagePicker
                classname={{ container: styles.generalGap }}
                onImagePicked={(uri) =>
                  setBanner(uri || "/assets/images/default-banner.png")
                }
              />
            ),
          },
          {
            label: "* Trip name",
            element: (
              <StrataInput
                classname={{ container: styles.generalGap }}
                properties={{
                  ...tripNameInputProperties,
                  value: name,
                  onChangeText: setName,
                }}
              />
            ),
          },
          {
            label: "* Trip destinations",
            element: (
              <StrataSelectInput
                classname={styles.generalGap}
                destinations={destinations}
                setDestinations={setDestinations}
              />
            ),
          },
          {
            label: "Trip visibility",
            element: (
              <StrataRadioButtonGroup
                options={visibilityOptions}
                selectedValue={visibility}
                onValueChange={setVisibility}
              />
            ),
          },
          {
            element: (
              <StrataCTA
                text="Next"
                isDisabled={!isStepOneValid}
                onPress={props.handleSubmit}
                classname={
                  isStepOneValid ? styles.enabledButton : styles.disabledButton
                }
                icon={
                  <ArrowIcon
                    color={isStepOneValid ? Colors.white : Colors.grey400}
                  />
                }
              />
            ),
          },
        ];

      case 2:
        return [
          {
            label: "Trip date",
            element: (
              <StrataCalendar
                classname={styles.generalGap}
                startDate={startDate}
                endDate={endDate}
                onRangeChange={({ start, end }) => {
                  setStartDate(start);
                  setEndDate(end);
                }}
              />
            ),
          },
          {
            label: "* Trip party",
            element: (
              <StrataSocialList
                users={friendsProfiles}
                selectedIds={selectedUsers}
                onUserPress={(user) => toggleUser(user.user_id)}
                renderRightIcon={(user, isSelected) =>
                  isSelected ? (
                    <MinusIcon
                      classname={styles.icon2}
                      color={Colors.coral500}
                    />
                  ) : (
                    <PlusIcon
                      classname={styles.icon2}
                      color={Colors.primaryDark}
                    />
                  )
                }
              />
            ),
          },
          {
            element: (
              <StrataCTA
                text="Next"
                isDisabled={false}
                onPress={props.handleSubmit}
                classname={styles.enabledButton}
                icon={<ArrowIcon color={Colors.white} />}
              />
            ),
          },
        ];

      default:
        return [];
    }
  }, [
    props.stage,
    props.handleSubmit,
    name,
    destinations,
    visibility,
    isStepOneValid,
    startDate,
    endDate,
    friendsProfiles,
    selectedUsers,
  ]);

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.scrollView}>
      <View style={styles.trackerContainer}>
        {[1, 2, 3].map((s) => (
          <View
            key={s}
            style={[styles.tracker, props.stage === s && styles.activeTracker]}
          />
        ))}
      </View>

      <StrataForm elements={formProps} />
    </ScrollView>
  );
};
