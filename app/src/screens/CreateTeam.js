import React from "react";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Keyboard,
  Picker,
  AsyncStorage,
  Image,
} from "react-native";
import Toast from "react-native-simple-toast";
import { AuthContext } from "../contexts/AuthContext";
import { MaterialIcons } from "@expo/vector-icons";
import EditProfilePictureModal from "../components/modal/EditProfilePictureModal";
import { FontAwesome } from "@expo/vector-icons";
import uploadImage from "../utils/uploadImage";

import * as firebase from "firebase";

export default function CreateTeam({ navigation }) {
  const { user, refresh } = React.useContext(AuthContext);

  const { uid } = user ? user : "";

  const [loading, setLoading] = React.useState(false);

  const [name, setName] = React.useState("");
  const [about, setAbout] = React.useState("");
  const [owner, setOwner] = React.useState("");
  const [image, setImage] = React.useState(null);
  // const [leaders, setLeaders] = React.useState("");
  // const [participants, setParticipants] = React.useState("");
  // const [profilePicture, setProfilePicture] = React.useState(null);

  const [modalVisible, setModalVisible] = React.useState(false);

  const [categories, setCategories] = React.useState([]);
  const [selectedValue, setSelectedValue] = React.useState("");

  const db = firebase.firestore();

  React.useEffect(() => {
    let isSubscribed = true;

    async function getCategories() {
      setLoading(true);

      try {
        const snapshot = await db.collection("teamCategories").get();

        const categories = [];
        snapshot.forEach((doc) => {
          const category = doc.data();
          category.id = doc.id;

          categories.push(category);
        });

        const items = categories.map((category) => {
          return (
            <Picker.Item
              label={category.name}
              value={category.id}
              key={category.id}
            />
          );
        });

        if (isSubscribed) setCategories(items);
      } catch (err) {
        console.log("ERROR ON GETTING CATEGORIES", err);
      }
      setLoading(false);
    }

    getCategories();

    return () => (isSubscribed = false);
  }, []);

  async function handleSubmit() {
    setLoading(true);

    try {
      const teamRef = db.collection("teams").doc();
      const userRef = db.collection("users").doc(uid);

      const url = await uploadImage({
        path: "teams",
        id: teamRef.id,
        result: image,
      });

      const data = {
        name,
        about,
        categoryId: selectedValue,
        owner: uid,
        photoURL: url,
        _createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        _updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      };

      return db
        .runTransaction((transaction) => {
          return transaction.get(userRef).then((doc) => {
            console.log("TRANSACTION", doc.data());

            transaction.set(teamRef, data);

            const teamMembersRef = teamRef.collection("members").doc(uid);
            transaction.set(teamMembersRef, {
              [uid]: true,
              joinedIn: firebase.firestore.FieldValue.serverTimestamp(),
            });

            const teamId = teamRef.id;
            const userTeamsRef = userRef.collection("teams").doc(teamId);
            transaction.set(userTeamsRef, { [teamId]: true });
          });
        })
        .then(function () {
          console.log("Transaction successfully committed!");
          setName("");
          setAbout("");

          setLoading(false);
          Toast.show("Time criado com sucesso!");
          navigation.goBack();
        })
        .catch((err) => {
          console.log("Transaction failed: ", err);
        });
    } catch (err) {
      console.log("ERROR ON SAVING TEAM", err);
    }
    setLoading(false);
  }

  return (
    <ScrollView style={{ flex: 1, flexGrow: 1 }}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <MaterialIcons
            name="keyboard-backspace"
            size={25}
            style={styles.return}
            onPress={() => navigation.goBack()}
          />
        </View>

        <View
          style={{
            flex: 3,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={styles.title}>criar time</Text>
        </View>

        <View style={{ flex: 1 }} />
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={(text) => setName(text)}
        />
        <TextInput
          style={styles.aboutInput}
          placeholder="About"
          value={about}
          onChangeText={(text) => setAbout(text)}
          secureTextEntry={true}
          multiline={true}
        />
        <View style={{ flex: 1, flexDirection: "row", marginBottom: 15 }}>
          <View
            style={{
              // backgroundColor: "red",
              alignItems: "flex-start",
              justifyContent: "center",
              flex: 1,
            }}
          >
            <Text>Categoria: </Text>
          </View>
          <View>
            <Picker
              selectedValue={selectedValue}
              style={{ height: 50, width: 150 }}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedValue(itemValue)
              }
            >
              {categories}
            </Picker>
          </View>
        </View>

        {/*TODO: melhorae o upload da Imagems*/}
        <View>
          <Text>Imagem do Perfil</Text>
          <>
            <EditProfilePictureModal
              modalVisible={modalVisible}
              setModalVisible={setModalVisible}
              navigation={navigation}
              action={setImage}
            />

            <View style={{ alignItems: "center", marginBottom: 15 }}>
              <View>
                <View style={styles.pictureWrapper}>
                  <TouchableOpacity style={{ borderRadius: 100 }}>
                    {image ? (
                      <Image
                        resizeMode={"stretch"}
                        style={{ width: 150, height: 150 }}
                        source={{ uri: image.uri }}
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
        </View>

        {loading ? (
          <ActivityIndicator />
        ) : (
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              handleSubmit();
              Keyboard.dismiss();
            }}
          >
            <Text style={styles.buttonText}>Create team!</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },

  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },

  main: {
    flex: 1,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
  },

  form: {
    flex: 9,
    padding: 15,
    justifyContent: "center",
  },

  input: {
    height: 40,
    borderColor: "#5a2a95",
    borderRadius: 5,
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: "white",
  },

  aboutInput: {
    height: 40,
    borderColor: "#5a2a95",
    borderRadius: 5,
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: "white",
    height: 200,
    textAlignVertical: "top",
    paddingTop: 15,
    paddingBottom: 15,
  },

  button: {
    backgroundColor: "#5a2a95",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    maxHeight: 40,
    minHeight: 40,
    flex: 1,
    margin: 5,
  },

  buttonText: {
    textTransform: "uppercase",
    color: "white",
  },

  title: {
    textTransform: "uppercase",
    color: "#5a2a95",
  },

  return: {
    flex: 1,
    justifyContent: "flex-start",
    padding: 25,
  },

  scrollView: {
    flex: 1,
    width: 100,
    height: 100,
  },

  header: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 25,
    position: "relative",
  },

  return: {
    color: "#5a2a95",
  },

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
