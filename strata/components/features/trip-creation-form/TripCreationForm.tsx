import { View, ScrollView } from "react-native";
import { useMemo, useState } from "react";
import { styles } from "./styles";
import { Colors } from "@/constants/global-styles";
import { StrataCTA } from "@/components/strata-cta/StrataCTA";
import { StrataForm } from "@/components/strata-form/StrataForm";
import { StrataInput } from "@/components/strata-input/StrataInput";
import { StrataImagePicker } from "@/components/strata-image-picker/StrataImagePicker";
import { StrataSelectInput } from "@/components/strata-select-input/StrataSelectInput";
import { tripNameInputProperties } from "@/utils/input-properties";
import { StrataRadioButtonGroup } from "@/components/strata-radio-button-group/StrataRadioButtonGroup";
import { ArrowIcon, GlobeIcon, LockIcon, UsersIcon } from "@/components/icons";

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
        return [];

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
