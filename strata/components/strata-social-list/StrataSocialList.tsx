import { styles } from "./styles";
import React, { useState } from "react";
import { View, StyleProp, ViewStyle, Text } from "react-native";
import { StrataSocialUser } from "@/components/strata-social-user/StrataSocialUser";
import { PublicUser } from "@/types/models/user-model";
import { StrataInput } from "../strata-input/StrataInput";
import { searchInputProperties } from "@/utils/input-properties";

type SocialListProps = {
  users: PublicUser[];
  selectedIds?: string[];
  onUserPress?: (user: PublicUser) => void;
  renderRightIcon?: (user: PublicUser, isSelected: boolean) => React.ReactNode;
  classname?: StyleProp<ViewStyle>;
};

export function StrataSocialList(props: SocialListProps) {
  const [search, setSearch] = useState<string>("");

  const filteredUsers = props.users.filter((user) => {
    const searchTerm = search.toLowerCase();
    return (
      user.name.toLowerCase().includes(searchTerm) ||
      user.username.toLowerCase().includes(searchTerm)
    );
  });

  const displayedUsers = filteredUsers.slice(0, 4);

  if (!props.users || props.users.length === 0) {
    return <Text>Add friends to invite them!</Text>;
  }

  return (
    <View style={[props.classname]}>
      <StrataInput
        classname={{ container: styles.container }}
        properties={{
          ...searchInputProperties,
          value: search,
          onChangeText: setSearch,
        }}
      />

      <View>
        {displayedUsers.map((user) => {
          const isSelected =
            props.selectedIds?.includes(String(user.user_id)) ?? false;

          return (
            <StrataSocialUser
              key={user.user_id}
              user={user}
              isSelected={isSelected}
              onPress={() => props.onUserPress?.(user)}
              rightIcon={
                props.renderRightIcon
                  ? props.renderRightIcon(user, isSelected)
                  : undefined
              }
            />
          );
        })}

        {displayedUsers.length === 0 && search.length > 0 && (
          <Text style={{ marginTop: 10, textAlign: "center", color: "grey" }}>
            No friends found matching &quot;{search}&quot;
          </Text>
        )}
      </View>
    </View>
  );
}
