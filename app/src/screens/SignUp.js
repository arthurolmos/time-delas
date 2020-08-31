import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  ProgressViewIOSComponent,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import { AuthContext } from "../contexts/AuthContext";
import { MaterialIcons } from "@expo/vector-icons";
import Toast from "react-native-simple-toast";

export default function SignUp({ navigation }) {
  const { signUp } = React.useContext(AuthContext);

  const [isLoading, setLoading] = React.useState(false);
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  async function handleSignUp() {
    setLoading(true);
    try {
      await signUp({ firstName, lastName, email, password });

      Toast.show("Usuário criado com sucesso!");
    } catch (err) {
      console.log("ERROR ON HANDLE SIGNUP", err);
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
            placeholder="First Name"
            value={firstName}
            onChangeText={(text) => setFirstName(text)}
          />

          <TextInput
            style={styles.input}
            placeholder="Last Name"
            value={lastName}
            onChangeText={(text) => setLastName(text)}
          />

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={(text) => setEmail(text)}
            keyboardType="email-address"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry={true}
            textContentType="password"
          />

          {isLoading ? (
            <ActivityIndicator />
          ) : (
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                Keyboard.dismiss();
                handleSignUp();
              }}
            >
              <Text style={styles.buttonText}>Register</Text>
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
    margin: "auto",
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
