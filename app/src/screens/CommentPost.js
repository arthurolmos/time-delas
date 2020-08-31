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
import { FlatList } from "react-native-gesture-handler";

export default function CommentPost({ route, navigation }) {
  const [loading, setLoading] = React.useState(false);

  const { setPost, postId, comments } = route.params;

  const [text, setText] = React.useState("");

  async function handleSubmit() {
    setLoading(true);

    try {
      const resp = await api.post(`/posts/${route.params.postId}/comments`, {
        content: text,
      });

      setPost(post);
    } catch (err) {
      Toast.show("Erro ao atualizar!");
    }

    setLoading(false);
  }

  return (
    <FlatList
      data={comments ? comments : []}
      renderItem={({ item }) => {
        return (
          <View>
            <Text>{comment.text}</Text>
          </View>
        );
      }}
      keyExtractor={(item) => item._id}
      scrollEnabled={false}
    />
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
