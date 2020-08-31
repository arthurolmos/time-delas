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
  AsyncStorage,
} from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function SearchResult({ id, name }) {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("Team", { teamId: id })}
    >
      <View style={styles.wrapper}>
        <View style={styles.picture}>
          <View style={styles.profile}>
            <FontAwesome name="user-o" color="#000" size={20} />
          </View>
        </View>

        <View style={styles.content} id={id}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.info}>Hello</Text>
          <Text style={styles.info}>Hello</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    height: 100,
    maxHeight: 100,
    minHeight: 100,
    //   backgroundColor: 'blue'
  },

  picture: {
    flex: 1,
    // backgroundColor: 'red',
    alignItems: "center",
    justifyContent: "center",
  },

  content: {
    flex: 2,
    // backgroundColor: 'yellow',
    justifyContent: "center",
    padding: 15,
  },

  profile: {
    borderRadius: 50,
    backgroundColor: "white",
    width: 65,
    height: 65,
    justifyContent: "center",
    alignItems: "center",
  },

  leftHeader: {},

  name: {
    fontWeight: "bold",
    fontSize: 20,
  },

  info: {
    fontSize: 12,
    color: "#474747",
  },
});
