import { styles } from "./styles";
import { Calendar } from "react-native-calendars";
import {
  eachDayOfInterval,
  format,
  isBefore,
  parseISO,
  addDays,
} from "date-fns";
import { BorderRadius, Colors } from "@/constants/global-styles";
import { StyleProp, ViewStyle } from "react-native";

type StrataCalendarProps = {
  classname?: StyleProp<ViewStyle>;
  startDate: string | null;
  endDate: string | null;
  onRangeChange: (range: { start: string | null; end: string | null }) => void;
  fixedRangeLength?: number;
};

export function StrataCalendar(props: StrataCalendarProps) {
  const today = format(new Date(), "yyyy-MM-dd");

  const onDayPress = (day: any) => {
    const dateString = day.dateString;

    if (props.fixedRangeLength && props.fixedRangeLength > 0) {
      const endObj = addDays(parseISO(dateString), props.fixedRangeLength - 1);
      const endString = format(endObj, "yyyy-MM-dd");

      props.onRangeChange({ start: dateString, end: endString });
      return;
    }

    if (!props.startDate) {
      props.onRangeChange({ start: dateString, end: dateString });
      return;
    }

    if (props.startDate && props.endDate && props.startDate !== props.endDate) {
      props.onRangeChange({ start: dateString, end: dateString });
      return;
    }

    if (props.startDate && props.endDate && props.startDate === props.endDate) {
      if (dateString === props.startDate) {
        props.onRangeChange({ start: null, end: null });
        return;
      }

      if (isBefore(parseISO(dateString), parseISO(props.startDate))) {
        props.onRangeChange({ start: dateString, end: dateString });
        return;
      }

      props.onRangeChange({ start: props.startDate, end: dateString });
    }
  };

  const getMarkedDates = () => {
    if (!props.startDate) return {};
    const marked: any = {};

    if (props.startDate && !props.endDate) {
      marked[props.startDate] = {
        startingDay: true,
        endingDay: true,
        color: Colors.coral500,
        textColor: "white",
        customStyles: {
          container: {
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: Colors.coral500,
            borderRadius: BorderRadius.sm,
            height: 36,
            width: 36,
          },
          text: {
            color: "white",
            fontWeight: "bold",
          },
        },
      };
    } else if (props.startDate && props.endDate) {
      const days = eachDayOfInterval({
        start: parseISO(props.startDate),
        end: parseISO(props.endDate),
      });

      days.forEach((day, index) => {
        const dateStr = format(day, "yyyy-MM-dd");
        const isFirst = index === 0;
        const isLast = index === days.length - 1;
        const isEdge = isFirst || isLast;

        marked[dateStr] = {
          startingDay: isFirst,
          endingDay: isLast,
          customStyles: {
            container: {
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: isEdge ? Colors.coral500 : Colors.coral200,
              borderRadius: isEdge ? BorderRadius.sm : BorderRadius.full,
              height: 36,
              width: 36,
            },
            text: {
              color: isEdge ? "white" : Colors.primaryDark,
              fontWeight: isEdge ? "bold" : "normal",
            },
          },
        };
      });
    }
    return marked;
  };

  return (
    <Calendar
      enableSwipeMonths={true}
      allowSelectionOutOfRange={false}
      minDate={today}
      markingType={"custom"}
      markedDates={getMarkedDates()}
      onDayPress={onDayPress}
      style={[styles.calendar, props.classname]}
      theme={{
        calendarBackground: Colors.white,
        textSectionTitleColor: Colors.grey400,
        dayTextColor: Colors.grey600,
        todayTextColor: Colors.coral500,
        monthTextColor: Colors.primaryDark,
        textDisabledColor: Colors.grey400,
        arrowColor: Colors.grey600,
      }}
    />
  );
}
