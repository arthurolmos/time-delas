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

export default function EditPost({ route, navigation }) {
  const [loading, setLoading] = React.useState(false);

  console.log("ROUTE", route.params.content);
  const { refresh, postId, content } = route.params;

  const [text, setText] = React.useState(content);

  async function handleSubmit() {
    setLoading(true);

    try {
      const resp = await api.put(`/posts/${route.params.postId}/`, {
        content: text,
      });
      console.log(resp.data);

      refresh();

      Toast.show("Post atualizado com sucesso!");
      navigation.goBack();
    } catch (err) {
      console.log("Error!", err);
      Toast.show("Erro ao atualizar!");
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
          <Text style={styles.title}>Editar Post</Text>
        </View>

        <View style={{ flex: 1 }} />
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.postInput}
          placeholder="Editar post..."
          value={text}
          onChangeText={(text) => setText(text)}
          multiline={true}
          blurOnSubmit={true}
        />

        {loading ? (
          <ActivityIndicator />
        ) : (
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              Keyboard.dismiss();
              text !== "" && handleSubmit();
            }}
          >
            <Text style={styles.buttonText}>Update!</Text>
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

  postInput: {
    height: 40,
    borderColor: "#5a2a95",
    borderRadius: 5,
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: "white",
    height: 100,
    textAlignVertical: "top",
    paddingTop: 15,
    paddingBottom: 15,
  },
});
