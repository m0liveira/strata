import { View } from "react-native";
import { useFocusEffect } from "expo-router";
import { useState, useCallback, useMemo, useEffect } from "react";
import { styles } from "./styles";
import { Colors } from "@/constants/global-styles";
import { StrataCTA } from "@/components/strata-cta/StrataCTA";
import { StrataForm } from "@/components/strata-form/StrataForm";
import { StrataInput } from "@/components/strata-input/StrataInput";
import { tripNameInputProperties } from "@/utils/input-properties";
import { StrataRadioButtonGroup } from "@/components/strata-radio-button-group/StrataRadioButtonGroup";
import { ArrowIcon, CalendarIcon } from "@/components/icons";
import { StrataSchedule } from "@/components/strata-schedule/StrataSchedule";
import {
  PreparedFile,
  StrataFileUploader,
} from "@/components/strata-file-uploader/StrataFileUploader";

type SpotCreationFormProps = {
  days: number;
  selectedDay: number;
  spotData?: any;
  handleSubmit: (data: any) => void;
};

export const SpotCreationForm = (props: SpotCreationFormProps) => {
  const [isScheduled, setIsScheduled] = useState(false);
  const [hour, setHour] = useState("09");
  const [minute, setMinute] = useState("00");
  const [fileToUpload, setFileToUpload] = useState<PreparedFile | null>(null);
  const [name, setName] = useState<string>("");
  const [day, setDay] = useState<string | number>(props.selectedDay);

  const resetForm = () => {
    setName("");
    setIsScheduled(false);
    setHour("09");
    setMinute("00");
    setFileToUpload(null);
    setDay(props.selectedDay);

    if (props.spotData && Object.keys(props.spotData).length !== 0) {
      setName(props.spotData.name);
      setIsScheduled(!!props.spotData.scheduled_time);

      if (props.spotData.scheduled_time) {
        const timePart = props.spotData.scheduled_time.split("T")[1];
        const timeArray = timePart.split(":");

        setHour(timeArray[0]);
        setMinute(timeArray[1]);
      } else {
        setHour("09");
        setMinute("00");
      }

      setFileToUpload(props.spotData.ticket_url);

      setDay(props.spotData.day || props.selectedDay);
    }
  };

  useEffect(() => {
    resetForm();
  }, []);

  useFocusEffect(
    useCallback(() => {
      return () => {
        resetForm();
      };
    }, []),
  );

  const options = useMemo(() => {
    const generatedOptions = [];

    for (let i = 0; i < props.days; i++) {
      generatedOptions.push({
        id: i + 1,
        label: `Day ${i + 1}`,
        icon: <CalendarIcon />,
      });
    }

    return generatedOptions;
  }, [props.days]);

  const isStepOneValid =
    name.trim().length > 0 &&
    day !== null &&
    day !== undefined &&
    day !== "" &&
    !isNaN(Number(day));

  function handleSubmit() {
    const data = {
      name,
      scheduled_time: isScheduled ? `${hour}:${minute}` : null,
      day,
      ticket_url: fileToUpload || null,
    };

    props.handleSubmit(data);
  }

  const formProps = [
    {
      label: "* Spot name",
      element: (
        <StrataInput
          classname={{ container: styles.generalGap }}
          properties={{
            ...tripNameInputProperties,
            placeholder: "Disneyland Paris",
            value: name,
            onChangeText: setName,
          }}
        />
      ),
    },
    {
      label: "Schedule time",
      element: (
        <StrataSchedule
          classname={styles.generalGap}
          isScheduled={isScheduled}
          onToggleSchedule={setIsScheduled}
          selectedHour={hour}
          selectedMinute={minute}
          onTimeChange={(h, m) => {
            setHour(h);
            setMinute(m);
          }}
        />
      ),
    },
    {
      label: "* Trip day",
      element: (
        <StrataRadioButtonGroup
          options={options}
          isScrollable={true}
          labelStyle={styles.scrollRadioButtonLabel}
          radioButtonStyle={styles.scrollRadioButton}
          containerStyle={styles.generalGap}
          selectedValue={day}
          onValueChange={setDay}
        />
      ),
    },
    {
      label: "Ticket",
      element: (
        <StrataFileUploader
          onFilePrepared={(file) => setFileToUpload(file)}
          file={
            props.spotData && Object.keys(props.spotData).length !== 0
              ? props.spotData.ticket_url
              : null
          }
        />
      ),
    },
    {
      element: (
        <StrataCTA
          text="Save Spot"
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

  return (
    <View style={styles.page}>
      <StrataForm elements={formProps} />
    </View>
  );
};
