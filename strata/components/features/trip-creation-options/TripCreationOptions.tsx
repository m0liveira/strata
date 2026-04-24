import { View, Image } from "react-native";
import { styles } from "./styles";
import { Colors } from "@/constants/global-styles";
import { GlobeShadowSVG } from "@/components/svgs";
import { StrataButton } from "@/components/strata-button/StrataButton";

type TripCreationOptionsProps = {
  manualOnPress: () => void;
  generateOnPress: () => void ;
};

export const TripCreationOptions = (props: TripCreationOptionsProps) => {
  return (
    <View
      style={[
        styles.container,
        { alignItems: "center", justifyContent: "flex-start" },
      ]}
    >
      <View style={styles.imageContainer}>
        <GlobeShadowSVG />

        <Image
          source={require("@/assets/images/globe.png")}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      <View style={styles.buttonContainer}>
        <StrataButton
          title="Manual Trip"
          text="Plan your dream trip!"
          imageSource={require("@/assets/images/notebook.png")}
          onPress={props.manualOnPress}
        />
        <StrataButton
          title="Generate Trip"
          text="Nothing in mind? we got you."
          imageSource={require("@/assets/images/AI.png")}
          textclassname={{ color: Colors.blue900 }}
          classname={{
            backgroundColor: Colors.blue100,
            borderColor: Colors.blue200,
          }}
          blobclassname={{ backgroundColor: Colors.blue300 }}
          onPress={props.generateOnPress}
        />
      </View>
    </View>
  );
};
