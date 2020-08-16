import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import EditProfilePictureModal from "../modal/EditProfilePictureModal";
import { AuthContext } from "../../contexts/AuthContext";
import getImagePath from "../../utils/getImagePath";
import api from "../../services/api";

export default function SmallRoundThumbnail({ navigation, item, path }) {
  const image = item
    ? getImagePath({ file: item.profilePicture, path, id: item._id })
    : null;

  return (
    <>
      <View style={{ alignItems: "center" }}>
        <View>
          <View style={styles.pictureWrapper}>
            <TouchableOpacity style={{ borderRadius: 100 }}>
              {image ? (
                <Image
                  resizeMode={"stretch"}
                  style={{ width: 50, height: 50 }}
                  source={{ uri: image }}
                />
              ) : (
                <FontAwesome name="user" color="#fff" size={50} />
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
