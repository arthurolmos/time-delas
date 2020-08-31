import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { AuthContext } from "../contexts/AuthContext";

export default function Welcome({ navigation }) {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/timedelas_newArtboard.jpg")}
        style={styles.image}
      >
        <View style={styles.main}>
          <Text style={styles.title}>Time delas</Text>
        </View>

        <View style={styles.buttons}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("SignUp")}
          >
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: "transparent",
                borderColor: "white",
                borderWidth: 1,
              },
            ]}
            onPress={() => navigation.navigate("SignIn")}
          >
            <Text style={[styles.buttonText, { color: "white" }]}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
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
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
  },

  buttons: {
    flex: 1,
    flexDirection: "row",
    padding: 15,
    alignItems: "center",
    justifyContent: "space-between",
  },

  button: {
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    maxHeight: 40,
    height: 40,
    flex: 1,
    margin: 5,
  },

  buttonText: {
    textTransform: "uppercase",
    color: "#5a2a95",
  },

  title: {
    textTransform: "uppercase",
    color: "white",
  },

  input: {
    height: 40,
    borderColor: "white",
    borderRadius: 5,
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 15,
    color: "white",
  },
});
