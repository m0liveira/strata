import React from "react";
import {
  View,
  Text,
  Pressable,
  StyleProp,
  ViewStyle,
  Platform,
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import { styles } from "./styles";
import { ArrowIcon, PdfIcon, PlaneIcon } from "@/components/icons"; // Ajusta para os teus ícones
import { Colors } from "@/constants/global-styles";

type DocumentsCardProps = {
  classname?: StyleProp<ViewStyle>;
  locations: any[];
  tripStartDate: string;
  onPressAll?: () => void;
};

const getLocationDate = (loc: any, tripStartDate: string) => {
  if (loc.scheduled_time && loc.scheduled_time.includes("T")) {
    return new Date(loc.scheduled_time);
  }
  const baseDate = new Date(tripStartDate);
  baseDate.setDate(baseDate.getDate() + ((loc.day || 1) - 1));
  return baseDate;
};

const getFileName = (url: string | null) => {
  if (!url) return "Document";

  const fullName = url.split("/").pop()?.split("?")[0] || "Document";

  if (fullName.includes("-")) {
    return fullName.substring(fullName.indexOf("-") + 1);
  }

  return fullName;
};

export function StrataDocumentsCard(props: DocumentsCardProps) {
  const now = Date.now();

  const handleOpenTicket = async (url: string) => {
    if (!url) return;

    let finalUrl = url;

    if (Platform.OS === "android" && url.toLowerCase().endsWith(".pdf")) {
      finalUrl = `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(url)}`;
    }

    try {
      await WebBrowser.openBrowserAsync(finalUrl);
    } catch (error) {
      console.error("Error opening browser:", error);
    }
  };

  const documentsToRender = (props.locations || [])
    .filter((loc) => loc.ticket_url)
    .map((loc) => ({
      ...loc,
      parsedDate: getLocationDate(loc, props.tripStartDate),
    }))
    .filter((loc) => {
      if (loc.scheduled_time) {
        return loc.parsedDate.getTime() >= now;
      }
      const endOfDay = new Date(loc.parsedDate);
      endOfDay.setHours(23, 59, 59, 999);
      return endOfDay.getTime() >= now;
    })
    .sort((a, b) => {
      if (a.day !== b.day) return (a.day || 1) - (b.day || 1);
      if (!a.scheduled_time && !b.scheduled_time) return 0;
      if (!a.scheduled_time) return 1;
      if (!b.scheduled_time) return -1;
      return a.parsedDate.getTime() - b.parsedDate.getTime();
    })
    .slice(0, 3);

  // #TODO: Add view ticket functionality
  // #TODO: Add Route to trip/documents page

  return (
    <View style={[styles.card, props.classname]}>
      <Pressable
        android_ripple={{ color: "hsla(14, 91%, 100%, 0.3)", foreground: true }}
        style={({ pressed }) => [
          styles.header,
          Platform.OS === "ios" && pressed && { opacity: 0.3 },
        ]}
        onPress={props.onPressAll}
      >
        <Text style={styles.title}>Documents</Text>

        <View style={styles.headerButton}>
          <ArrowIcon color={Colors.primaryDark} classname={styles.iconSmall} />
        </View>
      </Pressable>

      <View style={styles.list}>
        {documentsToRender.length === 0 ? (
          <Text style={styles.emptyText}>Add a trip reservation.</Text>
        ) : (
          documentsToRender.map((doc, index) => {
            const isLast = index === documentsToRender.length - 1;

            return (
              <Pressable
                key={doc.location_id}
                style={[styles.item, isLast && styles.itemLast]}
                android_ripple={{ color: "rgba(0,0,0,0.05)" }}
                onPress={() => handleOpenTicket(doc.ticket_url)}
              >
                <PlaneIcon color={Colors.grey600} classname={styles.icon} />

                <Text style={styles.itemText} numberOfLines={1}>
                  {getFileName(doc.ticket_url)}
                </Text>

                <PdfIcon color={Colors.grey600} classname={styles.icon} />
              </Pressable>
            );
          })
        )}
      </View>
    </View>
  );
}
