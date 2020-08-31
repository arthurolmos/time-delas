import React from "react";
import { View, Text, StyleSheet, Image, ActivityIndicator } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import EditProfilePictureModal from "../modal/EditProfilePictureModal";
import * as firebase from "firebase";
import uploadImage from "../../utils/uploadImage";
import dao from "../../firebase/dao";

export default function TeamProfile({ navigation, team, setTeam, admin }) {
  const { id } = team ? team : "";

  const photoURL = React.useMemo(() => {
    return team.photoURL;
  }, [team]);

  const [loading, setLoading] = React.useState(false);
  const [modalVisible, setModalVisible] = React.useState(false);

  async function updatePicture(result) {
    setLoading(true);

    try {
      const db = firebase.firestore();

      const url = await uploadImage({
        result,
        id: id,
        path: "teams",
      });

      const teamRef = db.collection("teams").doc(id);

      await dao.updateDocument(teamRef, {
        photoURL: url,
      });

      const upd = team;
      upd.photoURL = url;
      setTeam({ ...upd });
    } catch (err) {
      console.log("ERROR ON UPDATE TEAM PICTURE", err);
    }

    setLoading(false);
  }

  return (
    <>
      <EditProfilePictureModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        navigation={navigation}
        action={updatePicture}
      />

      <View style={{ alignItems: "center", marginBottom: 15 }}>
        <View>
          <View style={styles.pictureWrapper}>
            {loading ? (
              <ActivityIndicator />
            ) : (
              <TouchableOpacity style={{ borderRadius: 100 }}>
                {photoURL ? (
                  <Image
                    resizeMode={"contain"}
                    style={{ width: 150, height: 150 }}
                    source={{ uri: photoURL }}
                  />
                ) : (
                  <FontAwesome name="user" color="#fff" size={60} />
                )}
              </TouchableOpacity>
            )}
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
