import { View, Text } from "react-native";
import { Dispatch, SetStateAction, useState } from "react";
import { styles } from "./styles";
import { Colors } from "@/constants/global-styles";
import {
  ArrowsClockwiseIcon,
  CalendarIcon,
  CheckmarkIcon,
  PaperPlaneIcon,
} from "@/components/icons";
import { StrataInput } from "@/components/strata-input/StrataInput";
import { searchInputProperties } from "@/utils/input-properties";
import { StrataRadioButtonGroup } from "@/components/strata-radio-button-group/StrataRadioButtonGroup";
import { generatePlanB } from "@/utils/aiService";
import { StrataLocationGroup } from "@/components/strata-location-group/StrataLocationGroup";
import { StrataCTA } from "@/components/strata-cta/StrataCTA";
import { deleteImageFromSupabase, pushChanges } from "@/utils/StrataApiService";

type PanBProps = {
  locations: any;
  days: any;
  setTrip: Dispatch<SetStateAction<any>>;
  onClose: Dispatch<SetStateAction<any>>;
};

const getOptions = (num: number) => {
  const result = [];

  for (let i = 1; i <= num; i++) {
    result.push({
      id: i,
      label: `Day ${i}`,
      icon: <CalendarIcon color={Colors.grey400} />,
    });
  }

  return result;
};

export const PlanB = (props: PanBProps) => {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isGenerated, setIsGenerated] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const [day, setDay] = useState<any>(1);
  const [reason, setReason] = useState<string>("");
  const [alternatives, setAlternatives] = useState<any>(null);

  const getDayLocations = () => {
    return props.locations.filter((loc: any) => loc.day === day);
  };

  const updateLocationsList = (
    currentLocations: any[],
    updatedLocations: any[],
  ) => {
    return currentLocations.map((oldLocation) => {
      const newLocation = updatedLocations.find(
        (loc) => loc.location_id === oldLocation.location_id,
      );

      return newLocation ? newLocation : oldLocation;
    });
  };

  const handlePlanB = async () => {
    if (reason.length <= 0) {
      return;
    }

    setIsGenerating(true);

    try {
      setAlternatives(await generatePlanB(getDayLocations(), reason));
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
      setIsGenerated(true);
    }
  };

  const handleUpdating = async () => {
    let wentThrough: boolean = false;
    setIsUpdating(true);

    try {
      await pushChanges({
        locations: {
          created: [],
          updated: alternatives.locations,
          deleted: [],
        },
      });

      wentThrough = true;
    } catch (error) {
      console.error(error);
      wentThrough = false;
    } finally {
      if (wentThrough) {
        try {
          const oldLocations = getDayLocations();

          await Promise.all(
            oldLocations.map(async (loc: any) => {
              if (loc.ticket_url) {
                await deleteImageFromSupabase(loc.ticket_url, "tickets");
              }
            }),
          );
        } catch (error) {
          console.error("Error deleting old tickets:", error);
        }

        props.setTrip((prevTrip: any) => ({
          ...prevTrip,
          locations: updateLocationsList(
            prevTrip.locations,
            alternatives.locations,
          ),
        }));
      }

      setIsUpdating(false);
      props.onClose(false);
    }
  };

  if (isGenerating) {
    return (
      <>
        <Text style={styles.textGenerate}>
          Generating new plan for day {day}...
        </Text>
      </>
    );
  }

  if (isGenerated) {
    return alternatives?.locations?.length > 0 ? (
      <>
        <StrataLocationGroup
          classname={{
            width: "100%",
            paddingHorizontal: 4,
            marginBottom: 0,
          }}
          containerStyle={{
            marginBottom: 10,
          }}
          iconGroupStyle={{
            paddingBottom: 10,
          }}
          locations={alternatives.locations}
        />

        <StrataCTA
          classname={[
            styles.button,
            styles.ctaDisabled,
            { marginTop: 80, marginBottom: 0 },
          ]}
          text="Regenerate"
          textclassname={[styles.ctaText, { color: Colors.primaryDark }]}
          icon={
            <ArrowsClockwiseIcon
              color={Colors.primaryDark}
              classname={styles.smallIcon}
            />
          }
          isDisabled={isUpdating}
          onPress={() => {
            handlePlanB();
          }}
        />

        <StrataCTA
          classname={[
            styles.button,
            isUpdating && styles.ctaDisabled,
            { marginTop: 24, marginBottom: 0 },
          ]}
          text="Confirm Changes"
          textclassname={[
            styles.ctaText,
            isUpdating && { color: Colors.primaryDark },
          ]}
          icon={
            <CheckmarkIcon
              color={isUpdating ? Colors.primaryDark : Colors.white}
              classname={styles.smallIcon}
            />
          }
          isDisabled={isUpdating}
          onPress={() => {
            handleUpdating();
          }}
        />
      </>
    ) : (
      <>
        <Text style={styles.textGenerate}>Something went wrong!</Text>
        <Text style={styles.textGenerate}>Please try again later</Text>
      </>
    );
  }

  return (
    <View style={{ gap: 12 }}>
      <Text style={styles.text}>Select day</Text>

      <StrataRadioButtonGroup
        options={getOptions(props.days)}
        isScrollable={true}
        selectedValue={day}
        onValueChange={setDay}
      />

      <Text style={[styles.text, { marginTop: 36 }]}>Reason for plan B</Text>

      <StrataInput
        icon={{
          icon: (
            <PaperPlaneIcon
              classname={styles.icon}
              color={reason.length > 0 ? Colors.coral500 : Colors.grey400}
            />
          ),
          onPress: handlePlanB,
        }}
        properties={{
          ...searchInputProperties,
          placeholder: "It`s raining",
          value: reason,
          onChangeText: setReason,
        }}
      />
    </View>
  );
};
