import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import EditProfilePicture from "../modal/EditProfilePicture";
import { AuthContext } from "../../contexts/AuthContext";
import getImagePath from "../../utils/getImagePath";

export default function UserProfileThumbnail({ navigation, image }) {
  return (
    <>
      <View>
        <View style={styles.pictureWrapper}>
          <TouchableOpacity style={{ borderRadius: 100 }}>
            {image ? (
              <Image
                resizeMode={"stretch"}
                style={{ width: 150, height: 150 }}
                source={{ uri: image }}
              />
            ) : (
              <FontAwesome name="user" color="#fff" size={60} />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  pictureWrapper: {
    borderRadius: 100,
    backgroundColor: "#5a2a95",
    width: 150,
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
  },

  editWrapper: {
    borderRadius: 100,
    backgroundColor: "#fff",
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",

    position: "absolute",
    bottom: 0,
    right: 0,
    zIndex: 99999,
  },

  edit: {},
});
