import { View, ScrollView } from "react-native";
import { styles } from "./styles";
import { Colors } from "@/constants/global-styles";
import { StrataCTA } from "@/components/strata-cta/StrataCTA";
import { StrataForm } from "@/components/strata-form/StrataForm";
import { StrataInput } from "@/components/strata-input/StrataInput";
import { StrataImagePicker } from "@/components/strata-image-picker/StrataImagePicker";
import { StrataSelectInput } from "@/components/strata-select-input/StrataSelectInput";
import { tripNameInputProperties } from "@/utils/input-properties";

type TripCreationFormProps = {
  stage: number;
};

const formProps = [
  {
    label: "Trip banner",
    element: <StrataImagePicker />,
  },
  {
    label: "* Trip name",
    element: (
      <StrataInput
        properties={{
          ...tripNameInputProperties,
          value: "",
          onChangeText: () => {},
        }}
      />
    ),
  },
  {
    label: "* Trip destinations",
    element: <StrataSelectInput />,
  },
  {
    element: (
      <StrataCTA
        // classname={styles.button}
        text="Next"
        isDisabled={false}
        onPress={() => {}}
      />
    ),
  },
];

export const TripCreationForm = (props: TripCreationFormProps) => {
  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.scrollView}>
      <View style={styles.trackerContainer}>
        <View
          style={[styles.tracker, props.stage === 1 && styles.activeTracker]}
        />
        <View
          style={[styles.tracker, props.stage === 2 && styles.activeTracker]}
        />
        <View
          style={[styles.tracker, props.stage === 3 && styles.activeTracker]}
        />
      </View>

      <StrataForm classname={styles.form} elements={formProps} />
    </ScrollView>
  );
};
