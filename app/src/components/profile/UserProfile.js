import React from "react";
import { View, Text, StyleSheet, Image, ActivityIndicator } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import EditProfilePictureModal from "../modal/EditProfilePictureModal";
import { AuthContext } from "../../contexts/AuthContext";
import * as firebase from "firebase";
import uploadImage from "../../utils/uploadImage";
import dao from "../../firebase/dao";

export default function UserProfile({ navigation }) {
  const { user, refreshUser } = React.useContext(AuthContext);

  const [modalVisible, setModalVisible] = React.useState(false);
  const [isLoading, setLoading] = React.useState(false);

  const db = firebase.firestore();
  const auth = firebase.auth();

  const { uid } = user ? user : "";

  const displayName = React.useMemo(() => {
    return user ? user.displayName : "";
  }, [user]);

  const photoURL = React.useMemo(() => {
    return user ? user.photoURL : "";
  }, [user]);

  async function updatePicture(result) {
    setLoading(true);

    try {
      const url = await uploadImage({
        result,
        id: uid,
        path: "users",
      });

      const userRef = db.collection("users").doc(uid);

      await dao.update(userRef, {
        photoURL: url,
      });

      await auth.currentUser
        .updateProfile({
          photoURL: url,
        })
        .catch((err) => console.log("ERROR ON UPDATE PROFILE", err));

      refreshUser();
    } catch (err) {
      console.log("ERROR ON UPDATING PROFILE PICTURE", err);
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
            <TouchableOpacity style={{ borderRadius: 100 }}>
              {isLoading ? (
                <ActivityIndicator />
              ) : photoURL ? (
                <Image
                  resizeMode={"contain"}
                  style={{ width: 150, height: 150 }}
                  source={{ uri: photoURL }}
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

        <View>
          <Text style={styles.userName}>{displayName}</Text>
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

  userName: {
    fontWeight: "bold",
    textTransform: "uppercase",
    marginTop: 10,
    fontSize: 20,
  },
});
