import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  Modal,
  TouchableOpacity,
  Alert,
  TextInput,
  Button,
  TouchableHighlight,
  ActivityIndicator,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import api from "../../services/api";
import { environment } from "../../config/env";

export default function EditPostModal({
  setModalVisible,
  modalVisible,
  content,
  postId,
  refresh,
}) {
  const [isLoading, setLoading] = React.useState(false);
  const [text, setText] = React.useState(content);

  React.useEffect(() => {
    console.log("CONTENT", content, "ID", postId);
  }, []);

  async function handleEditPost() {
    setLoading(true);

    try {
      const resp = await api.put(`/posts/${postId}/`, { content: text });

      console.log(resp.data);

      refresh();
    } catch (err) {
      console.log("ERROR", err);
    }

    setLoading(false);
    setModalVisible(false);
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      // onRequestClose={() => {
      //   Alert.alert("Modal has been closed.");
      // }}
      // presentationStyle="overFullScreen "
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TouchableOpacity
            style={styles.close}
            onPress={() => {
              setModalVisible(false);
            }}
          >
            <FontAwesome name="close" size={20} />
          </TouchableOpacity>

          <Text style={styles.modalText}>Editar Post</Text>

          <View>
            <TextInput
              style={styles.postInput}
              placeholder="Editar post..."
              value={text}
              onChangeText={(text) => setText(text)}
              multiline={true}
              blurOnSubmit={true}
            />
          </View>

          {isLoading ? (
            <ActivityIndicator />
          ) : (
            <TouchableHighlight
              style={styles.button}
              onPress={() => text !== "" && handleEditPost()}
            >
              <Text style={{ color: "white", textTransform: "uppercase" }}>
                Editar
              </Text>
            </TouchableHighlight>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    // marginTop: 22,
    position: "relative",
  },

  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  button: {
    backgroundColor: "#5a2a95", //"#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginBottom: 15,
    width: 200,
    alignItems: "center",
  },

  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },

  modalText: {
    marginBottom: 15,
    textAlign: "center",
    textTransform: "uppercase",
  },

  close: {
    marginBottom: 15,
    marginTop: 15,
    position: "absolute",
    top: 0,
    right: 20,
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
    width: 250,
  },
});
