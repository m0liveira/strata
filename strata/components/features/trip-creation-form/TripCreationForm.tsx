import { View, ScrollView } from "react-native";
import { useFocusEffect } from "expo-router";
import { useEffect, useMemo, useState, useCallback } from "react";
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
import { format, parseISO } from "date-fns";
import {
  budgetOptions,
  intensityOptions,
  styleOptions,
  visibilityOptions,
} from "@/utils/radioButton-properties";

type TripCreationFormProps = {
  stage: number;
  tripData?: any;
  hideInvite?: boolean;
  handleSubmit: (data: any) => void;
};

export const TripCreationForm = (props: TripCreationFormProps) => {
  const [banner, setBanner] = useState<string>(
    "/assets/images/default-banner.png",
  );
  const [name, setName] = useState<string>("");
  const [destinations, setDestinations] = useState<string[]>([]);
  const [visibility, setVisibility] = useState<string | number>("private");
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [friendsProfiles, setFriendsProfiles] = useState<PublicUser[]>(
    user.friends_profiles || [],
  );
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [budget, setBudget] = useState<string | number>("");
  const [intensity, setIntensity] = useState<string | number>("");
  const [tripStyle, setTripStyle] = useState<string | number>("adventure");

  const resetForm = () => {
    setBanner("/assets/images/default-banner.png");
    setName("");
    setDestinations([]);
    setVisibility("private");
    setStartDate(null);
    setEndDate(null);
    setSelectedUsers([]);
    setBudget("");
    setIntensity("");
    setTripStyle("adventure");

    if (props.tripData && Object.keys(props.tripData).length !== 0) {
      setBanner(props.tripData.banner);
      setName(props.tripData.name);

      const mappedDestinations = props.tripData.destinations
        ? props.tripData.destinations.map((d: any) => d.destination)
        : [];

      setDestinations(mappedDestinations);
      setVisibility(props.tripData.visibility);

      const startFormatted = props.tripData.start_date
        ? format(parseISO(props.tripData.start_date), "yyyy-MM-dd")
        : null;

      const endFormatted = props.tripData.end_date
        ? format(parseISO(props.tripData.end_date), "yyyy-MM-dd")
        : null;

      setStartDate(startFormatted);
      setEndDate(endFormatted);
      setSelectedUsers([]);
      setBudget(props.tripData.budget_level);
      setIntensity(props.tripData.intensity_level);
      setTripStyle(props.tripData.travel_style);
    }
  };

  useEffect(() => {
    setFriendsProfiles(user.friends_profiles || []);
    resetForm();
  }, []);

  useFocusEffect(
    useCallback(() => {
      return () => {
        resetForm();
      };
    }, []),
  );

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
    budget.toString().trim().length > 0 &&
    intensity.toString().trim().length > 0;

  const formProps = useMemo(() => {
    function handleSubmit() {
      const data = {
        banner,
        name,
        visibility,
        start_date: startDate,
        end_date: endDate,
        budget_level: budget,
        intensity_level: intensity,
        travel_style: tripStyle,
        destinations,
        selectedUsers,
      };

      props.handleSubmit(data);
    }

    switch (props.stage) {
      case 1:
        return [
          {
            label: "Trip banner",
            element: (
              <StrataImagePicker
                classname={{ container: styles.generalGap }}
                image={banner.startsWith("/assets") ? null : banner}
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
                onPress={handleSubmit}
                classname={
                  isStepOneValid ? styles.enabledButton : styles.disabledButton
                }
                textclassname={
                  isStepOneValid ? styles.buttonText : styles.disabledButtonText
                }
                icon={
                  <ArrowIcon
                    color={isStepOneValid ? Colors.white : Colors.grey400}
                    classname={styles.icon}
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
          !props.hideInvite && {
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
                onPress={handleSubmit}
                classname={styles.enabledButton}
                textclassname={styles.buttonText}
                icon={
                  <ArrowIcon color={Colors.white} classname={styles.icon} />
                }
              />
            ),
          },
        ].filter(Boolean) as { label?: string; element: React.ReactNode }[];

      case 3:
        return [
          {
            label: "* Trip budget",
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
            label: "* Trip intensity",
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
            label: "* Trip style",
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
                onPress={handleSubmit}
                classname={
                  isStepThreeValid
                    ? styles.enabledButton
                    : styles.disabledButton
                }
                textclassname={
                  isStepThreeValid
                    ? styles.buttonText
                    : styles.disabledButtonText
                }
                icon={
                  <ArrowIcon
                    color={isStepThreeValid ? Colors.white : Colors.grey400}
                    classname={styles.icon}
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
    props,
    banner,
    name,
    destinations,
    visibility,
    startDate,
    endDate,
    selectedUsers,
    budget,
    intensity,
    tripStyle,
    isStepOneValid,
    friendsProfiles,
    isStepThreeValid,
  ]);

  // #FIXME: Trip creation form scrolls infinitely...

  return (
    <ScrollView
      style={styles.page}
      contentContainerStyle={styles.scrollView}
      showsVerticalScrollIndicator={false}
    >
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
