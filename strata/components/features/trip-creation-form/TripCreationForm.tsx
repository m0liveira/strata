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
import { ArrowIcon, MinusIcon, PlusIcon } from "@/components/icons";
import { StrataSocialList } from "@/components/strata-social-list/StrataSocialList";
import { user } from "@/utils/userService";
import { PublicUser } from "@/types/models/user-model";
import {
  budgetOptions,
  intensityOptions,
  styleOptions,
  visibilityOptions,
} from "@/utils/radioButton-properties";

type TripCreationFormProps = {
  stage: number;
  handleSubmit: () => void;
};

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
  const [budget, setBudget] = useState<string>("");
  const [intensity, setIntensity] = useState<string>("");
  const [tripStyle, setTripStyle] = useState<string>("adventure");

  useEffect(() => {
    setFriendsProfiles(user.friends_profiles || []);
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
  const isStepThreeValid =
    budget.trim().length > 0 && intensity.trim().length > 0;

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

      case 3:
        return [
          {
            label: "Trip budget",
            element: (
              <StrataRadioButtonGroup
                options={budgetOptions}
                isScrollable={false}
                labelStyle={styles.radioButtonLabel}
                radioButtonStyle={styles.radioButton}
                containerStyle={styles.generalGap}
                selectedValue={budget}
                onValueChange={setBudget}
              />
            ),
          },
          {
            label: "Trip intensity",
            element: (
              <StrataRadioButtonGroup
                options={intensityOptions}
                isScrollable={false}
                labelStyle={styles.radioButtonLabel}
                radioButtonStyle={styles.radioButton}
                containerStyle={styles.generalGap}
                selectedValue={intensity}
                onValueChange={setIntensity}
              />
            ),
          },
          // #TODO: Style carousel group buttons properly 
          {
            label: "Trip style",
            element: (
              <StrataRadioButtonGroup
                options={styleOptions}
                isScrollable={true}
                labelStyle={styles.scrollRadioButtonLabel}
                radioButtonStyle={styles.scrollRadioButton}
                containerStyle={styles.generalGap}
                selectedValue={tripStyle}
                onValueChange={setTripStyle}
              />
            ),
          },
          {
            element: (
              <StrataCTA
                text="Next"
                isDisabled={!isStepThreeValid}
                onPress={props.handleSubmit}
                classname={
                  isStepThreeValid
                    ? styles.enabledButton
                    : styles.disabledButton
                }
                icon={
                  <ArrowIcon
                    color={isStepThreeValid ? Colors.white : Colors.grey400}
                  />
                }
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
    budget,
    intensity,
    tripStyle,
    isStepThreeValid,
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
