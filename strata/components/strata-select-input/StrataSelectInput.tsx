import { View, Text, Pressable, ViewStyle, StyleProp } from "react-native";
import { Image } from "expo-image";
import { useState } from "react";
import { styles } from "./styles";
import { Colors } from "@/constants/global-styles";
import { StrataInput } from "@/components";
import { destinationInputProperties } from "@/utils/input-properties";
import { searchLocation } from "@/utils/countriesApiService";
import { GlobeIcon, XCircleIcon } from "../icons";

type StrataSelectInputProps = {
  classname?: StyleProp<ViewStyle>;
  destinations: string[];
  setDestinations: (destinations: string[]) => void;
};

export function StrataSelectInput({
  destinations,
  setDestinations,
  classname,
}: StrataSelectInputProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);

  const handleSearch = (text: string) => {
    setQuery(text);
    const results = searchLocation(text);
    setSuggestions(results);
  };

  const addDestination = (item: any) => {
    if (!destinations.includes(item.name)) {
      setDestinations([...destinations, item.name]);
    }

    setQuery("");
    setSuggestions([]);
  };

  const removeDestination = (name: string) => {
    setDestinations(destinations.filter((d) => d !== name));
  };

  return (
    <View style={[styles.container, classname]}>
      <StrataInput
        properties={{
          ...destinationInputProperties,
          value: query,
          onChangeText: handleSearch,
        }}
      />

      {query.trim().length > 0 && (
        <View style={styles.suggestionsContainer}>
          {suggestions.map((item, index) => (
            <Pressable
              key={index}
              style={styles.suggestionItem}
              onPress={() => addDestination(item)}
            >
              <Image
                source={item.flag}
                style={styles.flag}
                contentFit="cover"
              />

              <Text style={styles.suggestionText}>{item.name}</Text>
            </Pressable>
          ))}

          <Pressable
            style={styles.suggestionItem}
            onPress={() =>
              addDestination({
                name: query,
              })
            }
          >
            <GlobeIcon classname={styles.icon} color={Colors.grey600} />

            <Text style={styles.suggestionText}>Add &quot;{query}&quot;</Text>
          </Pressable>
        </View>
      )}

      {destinations.length > 0 && (
        <View style={styles.badgeWrapper}>
          {destinations.map((name, index) => (
            <View key={index} style={styles.badge}>
              <Text style={styles.badgeText}>{name}</Text>
              <Pressable onPress={() => removeDestination(name)}>
                <XCircleIcon
                  classname={styles.badgeIcon}
                  color={Colors.coral900}
                />
              </Pressable>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
