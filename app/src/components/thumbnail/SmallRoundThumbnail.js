import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function SmallRoundThumbnail({ navigation, item, path }) {
  const photoURL = React.useMemo(() => {
    return item.photoURL;
  }, [item]);

  return (
    <>
      <View style={{ alignItems: "center" }}>
        <View>
          <View style={styles.pictureWrapper}>
            <TouchableOpacity style={{ borderRadius: 100 }}>
              {photoURL ? (
                <Image
                  resizeMode={"contain"}
                  style={{ width: 50, height: 50 }}
                  source={{ uri: photoURL }}
                />
              ) : (
                <FontAwesome name="user" color="#fff" size={20} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  pictureWrapper: {
    borderRadius: 100,
    backgroundColor: "#5a2a95",
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
  },

  edit: {},
});
