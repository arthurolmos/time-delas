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
} from "react-native";
import Toast from "react-native-simple-toast";
import { AuthContext } from "../contexts/AuthContext";
import { MaterialIcons } from "@expo/vector-icons";
import api from "../services/api";

export default function CreateTeam({ navigation }) {
  const { user, refresh } = React.useContext(AuthContext);

  const [loading, setLoading] = React.useState(false);

  const [name, setName] = React.useState("");
  const [about, setAbout] = React.useState("");
  const [owner, setOwner] = React.useState("");
  const [leaders, setLeaders] = React.useState("");
  const [participants, setParticipants] = React.useState("");
  const [profilePicture, setProfilePicture] = React.useState(null);

  const [categories, setCategories] = React.useState([]);
  const [selectedValue, setSelectedValue] = React.useState("");

  React.useEffect(() => {
    let isSubscribed = true;

    async function getCategories() {
      setLoading(true);

      try {
        const resp = await api.get("/categories");

        const categories = resp.data.map((category) => {
          return (
            <Picker.Item
              label={category.title}
              value={category._id}
              key={category._id}
            />
          );
        });

        if (isSubscribed) setCategories(categories);
      } catch (err) {
        console.log("ERROR:", err);
      }
      setLoading(false);
    }

    getCategories();

    return () => (isSubscribed = false);
  }, []);

  async function handleSubmit() {
    setLoading(true);

    try {
      const data = {
        name,
        about,
        categoryId: selectedValue,
        owner: user._id,
      };

      const resp = await api.post("/teams", data);
      const teamId = resp.data;

      // if (profilePicture !== null) {
      //   const localUri = profilePicture.uri;
      //   const filename = localUri.split("/").pop();

      //   const match = /\.(\w+)$/.exec(filename);
      //   const type = match ? `image/${match[1]}` : `image`;

      //   const formData = new FormData();
      //   formData.append("file", {
      //     uri: localUri,
      //     name: filename,
      //     type,
      //   });

      //   const upload = await api.post(`/uploads/${teamId}/teams`, formData, {
      //     headers: {
      //       "content-type": "multipart/form-data",
      //     },
      //   });

      //   console.log("UPLOAD", upload.data);

      //   await api.put(`/teams/${teamId}`, {
      //     profilePicture: upload.data.url,
      //   });
      // }

      await refresh();

      // navigation.navigate("Team", { teamId });
      navigation.goBack();
      Toast.show("Time criado com sucesso!");
    } catch (err) {
      console.log("Error!", err);
      Toast.show("Erro ao criar!");
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

        {/* <View>
          <Text>Imagem do Perfil</Text>
          <TeamProfile
            image={profilePicture.uri}
            setImage={setProfilePicture}
          />
        </View> */}

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
});
