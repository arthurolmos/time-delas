import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import Toast from "react-native-simple-toast";
import { AuthContext } from "../contexts/AuthContext";
import { MaterialIcons } from "@expo/vector-icons";

export default function SignIn({ navigation }) {
  const { signIn } = React.useContext(AuthContext);

  const [loading, setLoading] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  async function handleSignIn() {
    setLoading(true);
    try {
      await signIn({ email, password });
    } catch (err) {
      console.log("ERROR ON HANDLE SIGNIN", err);
    }
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/timedelas_newArtboard.jpg")}
        style={styles.image}
      >
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
            <Text style={styles.title}>Time Delas</Text>
          </View>

          <View style={{ flex: 1 }} />
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={(text) => setEmail(text)}
            keyboardType="email-address"
            textContentType="emailAddress"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry={true}
          />

          {loading ? (
            <ActivityIndicator />
          ) : (
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                handleSignIn();
                Keyboard.dismiss();
              }}
            >
              <Text style={styles.buttonText}>LOGIN</Text>
            </TouchableOpacity>
          )}
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
    borderColor: "white",
    borderRadius: 5,
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 15,
    color: "white",
  },

  button: {
    backgroundColor: "white",
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
    color: "#5a2a95",
  },

  title: {
    textTransform: "uppercase",
    color: "white",
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
    color: "white",
  },
});
