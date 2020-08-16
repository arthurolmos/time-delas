import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  Modal,
  TouchableHighlight,
  Alert,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import { AuthContext } from "../../contexts/AuthContext";
import api from "../../services/api";
import { environment } from "../../config/env";
import uploadImage from "../../utils/uploadImage";

export default function EditProfilePictureModal({
  setModalVisible,
  modalVisible,
  navigation,
  update,
  uploadData,
}) {
  const { user, setUser } = React.useContext(AuthContext);

  React.useEffect(() => {
    getPermissionAsync();
  }, []);

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }
  };

  pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 4],
        quality: 1,
      });

      if (!result.cancelled) {
        const image = await uploadImage({
          result,
          id: uploadData.id,
          path: uploadData.path,
        });

        update(image);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        Alert.alert("Modal has been closed.");
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.close}>
            <TouchableHighlight
              onPress={() => {
                setModalVisible(!modalVisible);
              }}
            >
              <FontAwesome name="close" size={20} />
            </TouchableHighlight>
          </View>
          <Text style={styles.modalText}>Imagem do perfil</Text>

          {/* <TouchableHighlight
                        style={{ ...styles.button, backgroundColor: '#5a2a95' }}
                        onPress={ () => {
                            setModalVisible(false)
                            console.log('EDIT IMAGE')
                        }}
                    >
                        <Text style={styles.textStyle}>Editar foto</Text>
                    </TouchableHighlight> */}

          <TouchableHighlight
            style={{ ...styles.button, backgroundColor: "#5a2a95" }}
            onPress={() => {
              setModalVisible(false);
              pickImage();
            }}
          >
            <Text style={styles.textStyle}>Enviar nova foto</Text>
          </TouchableHighlight>

          <TouchableHighlight
            style={{ ...styles.button, backgroundColor: "#5a2a95" }}
            onPress={() => {
              setModalVisible(false);
              navigation.navigate("Picture");
            }}
          >
            <Text style={styles.textStyle}>Selecionar do álbum</Text>
          </TouchableHighlight>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
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
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginBottom: 15,
    width: 200,
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
});
