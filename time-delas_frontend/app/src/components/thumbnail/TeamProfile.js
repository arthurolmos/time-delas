import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import EditProfilePictureModal from "../modal/EditProfilePictureModal";
import { AuthContext } from "../../contexts/AuthContext";
import getImagePath from "../../utils/getImagePath";
import api from "../../services/api";

export default function TeamProfile({ navigation, team, refresh, admin }) {
  const { user } = React.useContext(AuthContext);

  const [modalVisible, setModalVisible] = React.useState(false);
  const [image, setImage] = React.useState(null);

  const src = React.useMemo(() => {
    console.log("CHANGED");

    return getImagePath({
      id: team._id,
      file: team.profilePicture,
      path: "teams",
    });
  }, [team]);

  async function updatePicture(image) {
    await api.put(`/teams/${team._id}`, { profilePicture: image });

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
          id: team && team._id,
          path: "teams",
        }}
      />

      <View style={{ alignItems: "center", marginBottom: 15 }}>
        <View>
          <View style={styles.pictureWrapper}>
            <TouchableOpacity style={{ borderRadius: 100 }}>
              {src ? (
                <Image
                  resizeMode={"stretch"}
                  style={{ width: 150, height: 150 }}
                  source={{ uri: src }}
                />
              ) : (
                <FontAwesome name="user" color="#fff" size={60} />
              )}
            </TouchableOpacity>
          </View>

          {admin && (
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
          )}
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
