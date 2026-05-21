import { Pressable, ScrollView, View, Text } from "react-native";
import { useFocusEffect } from "expo-router";
import {
  useState,
  useCallback,
  SetStateAction,
  Dispatch,
  useRef,
  useEffect,
} from "react";
import { Image } from "expo-image";
import { styles } from "./styles";
import { Colors } from "@/constants/global-styles";
import { ArrowIcon, PaperPlaneIcon } from "@/components/icons";
import { StrataInput } from "@/components/strata-input/StrataInput";
import { searchInputProperties } from "@/utils/input-properties";
import { user } from "@/utils/userService";

type ChatProps = {
  trip: any;
  setVisible: Dispatch<SetStateAction<boolean>>;
  handleMessage: any;
  messages: any[];
  setMessages: Dispatch<SetStateAction<any>>;
  resetMessages: any;
};

export const Chat = (props: ChatProps) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    props.resetMessages();
  }, []);

  useFocusEffect(
    useCallback(() => {
      return async () => {
        setMessage("");
        props.resetMessages();
      };
    }, [props.resetMessages]),
  );

  const renderHeaderUsers = (members: any[]) => {
    if (!members || members.length === 0) return null;

    const visibleMembers = members.slice(0, 3);
    const remainingCount = members.length - 3;

    return (
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {visibleMembers.map((member, index) => {
          const isDefault = member.user.photo.includes("/assets/");
          const photoSource = isDefault
            ? require("@/assets/images/default-avatar.png")
            : { uri: member.user.photo };

          return (
            <Image
              key={member.user_id}
              source={photoSource}
              style={[styles.avatar, index > 0 && { marginLeft: -12 }]}
              contentFit="cover"
            />
          );
        })}

        {remainingCount > 0 && (
          <View
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: "#ddd",
              justifyContent: "center",
              alignItems: "center",
              marginLeft: -12,
              borderWidth: 2,
              borderColor: "white",
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: "bold" }}>
              +{remainingCount}
            </Text>
          </View>
        )}
      </View>
    );
  };

  const handleSendMessage = () => {
    if (message.trim() === "") return;

    props.handleMessage(message);

    setMessage("");

    props.setMessages((prevMessages: any) => [...prevMessages, message]);
  };

  const getMemberWhoSentMessage = (id: number) => {
    if (id === user.user_id) {
      return null;
    }

    const memberData = props.trip.members.find((member: any) => {
      return member.user.user_id === id;
    });

    if (!memberData) {
      return null;
    }

    return { name: memberData.user.name, photo: memberData.user.photo };
  };

  const toDateString = (date: Date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `${day}/${month}/${date.getFullYear()}`;
  };

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const todayStr = toDateString(today);
  const yesterdayStr = toDateString(yesterday);

  const formatDate = (isoString: string) => {
    if (!isoString) return "";

    const messageDateStr = toDateString(new Date(isoString));

    if (messageDateStr === todayStr) return "Today";
    if (messageDateStr === yesterdayStr) return "Yesterday";

    return messageDateStr;
  };

  const formatTime = (isoString: string) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  return (
    <View style={styles.page}>
      <View style={styles.header}>
        <Pressable
          style={styles.iconBg}
          onPress={() => props.setVisible(false)}
        >
          <ArrowIcon classname={styles.icon} color={Colors.primaryDark} />
        </Pressable>

        <View style={styles.headerContent}>
          <Text style={styles.title}>{props.trip.name}</Text>

          {renderHeaderUsers(props.trip.members)}
        </View>
      </View>

      <ScrollView
        ref={scrollViewRef}
        onLayout={() => scrollViewRef.current?.scrollToEnd({ animated: false })}
        onContentSizeChange={() =>
          scrollViewRef.current?.scrollToEnd({ animated: true })
        }
        showsVerticalScrollIndicator={false}
        style={styles.scrollPage}
        contentContainerStyle={[
          styles.scrollView,
          { justifyContent: "flex-end", paddingTop: 0, alignItems: "center" },
        ]}
      >
        <View style={styles.container}>
          {props.messages?.map((msg, index) => {
            const currentDate = formatDate(msg.created_at);
            const previousDate =
              index > 0
                ? formatDate(props.messages[index - 1].created_at)
                : null;
            const showDateHeader = currentDate !== previousDate;

            const isMyMessage = msg.user_id === user.user_id;

            return (
              <View key={index} style={{ width: "100%" }}>
                {showDateHeader && (
                  <Text style={styles.date}>{currentDate}</Text>
                )}

                <View
                  style={[
                    styles.messageContainer,
                    index === props.messages.length - 1 && { marginBottom: 24 },
                  ]}
                >
                  {getMemberWhoSentMessage(msg.user_id)?.name && (
                    <View style={styles.userContainer}>
                      <Image
                        source={
                          getMemberWhoSentMessage(msg.user_id)?.photo.includes(
                            "/assets/",
                          )
                            ? require("@/assets/images/default-avatar.png")
                            : {
                                uri: getMemberWhoSentMessage(msg.user_id)
                                  ?.photo,
                              }
                        }
                        style={[styles.avatar]}
                        contentFit="cover"
                      />

                      <Text style={styles.user}>
                        {getMemberWhoSentMessage(msg.user_id)?.name}
                      </Text>
                    </View>
                  )}

                  <View
                    style={[
                      styles.messageBubble,
                      isMyMessage && {
                        backgroundColor: Colors.coral100,
                        alignSelf: "flex-end",
                      },
                    ]}
                  >
                    <Text style={styles.text}>{msg.message}</Text>

                    <Text
                      style={[
                        styles.time,
                        isMyMessage && {
                          color: Colors.coral400,
                        },
                      ]}
                    >
                      {formatTime(msg.created_at)}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <StrataInput
          properties={{
            ...searchInputProperties,
            placeholder: "Message",
            value: message,
            onChangeText: setMessage,
          }}
          icon={{
            icon: (
              <PaperPlaneIcon
                color={Colors.coral500}
                classname={styles.chatIcon}
              />
            ),
            onPress: () => handleSendMessage(),
          }}
          classname={{
            input: {
              overflow: "hidden",
              paddingRight: 60,
              paddingVertical: 14,
            },
          }}
        />
      </View>
    </View>
  );
};
