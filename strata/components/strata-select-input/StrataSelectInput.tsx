import { View, Text, Pressable } from "react-native";
import { Image } from "expo-image";
import { useState } from "react";
import { styles } from "./styles";
import { Colors } from "@/constants/global-styles";
import { StrataInput } from "@/components";
import { destinationInputProperties } from "@/utils/input-properties";
import { searchLocation } from "@/utils/countriesApiService";
import { GlobeIcon, XCircleIcon } from "../icons";

export function StrataSelectInput() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [selectedDestinations, setSelectedDestinations] = useState<any[]>([]);

  const handleSearch = (text: string) => {
    setQuery(text);
    const results = searchLocation(text);
    setSuggestions(results);
  };

  const addDestination = (item: any) => {
    if (!selectedDestinations.find((d) => d.name === item.name)) {
      setSelectedDestinations([...selectedDestinations, item]);
    }
    setQuery("");
    setSuggestions([]);
  };

  const removeDestination = (name: string) => {
    setSelectedDestinations(
      selectedDestinations.filter((d) => d.name !== name),
    );
  };

  return (
    <View style={styles.container}>
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
                type: "custom",
                flag: null,
              })
            }
          >
            <GlobeIcon classname={styles.icon} color={Colors.grey600} />
            <Text style={styles.suggestionText}>Add &quot;{query}&quot;</Text>
          </Pressable>
        </View>
      )}

      <View style={styles.badgeWrapper}>
        {selectedDestinations.map((item, index) => (
          <View key={index} style={styles.badge}>
            <Text style={styles.badgeText}>{item.name}</Text>
            <Pressable onPress={() => removeDestination(item.name)}>
              <XCircleIcon
                classname={styles.badgeIcon}
                color={Colors.coral900}
              />
            </Pressable>
          </View>
        ))}
      </View>
    </View>
  );
}
