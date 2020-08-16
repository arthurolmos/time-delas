import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import EditProfilePictureModal from "../modal/EditProfilePictureModal";
import { AuthContext } from "../../contexts/AuthContext";
import getImagePath from "../../utils/getImagePath";
import uploadImage from "../../utils/uploadImage";
import api from "../../services/api";

export default function UserProfile({ navigation }) {
  const { user, refresh } = React.useContext(AuthContext);

  const [modalVisible, setModalVisible] = React.useState(false);
  const [image, setImage] = React.useState(null);

  React.useEffect(() => {
    if (user && user.profilePicture !== null) {
      const src = getImagePath({
        id: user._id,
        file: user.profilePicture,
        path: "users",
      });
      console.log("SRC", src);

      setImage(src);
    }
  }, [user]);

  async function updatePicture(image) {
    await api.put(`/users/${user._id}`, { profilePicture: image });

    refresh();
  }

  return (
    <>
      <EditProfilePictureModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        navigation={navigation}
        update={updatePicture}
        uploadData={{
          id: user && user._id,
          path: "users",
        }}
      />

      <View style={{ alignItems: "center", marginBottom: 15 }}>
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

          <View style={styles.editWrapper}>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <FontAwesome
                name="camera"
                color="#5a2a95"
                size={20}
                style={styles.edit}
              />
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
