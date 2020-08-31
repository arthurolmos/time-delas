import React, { useContext } from "react";
import {
  LogoTitle,
  Button,
  Text,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { SearchContext } from "../../contexts/SearchContext";

export default function SearchHeader({ navigation }) {
  const { search, setLoading } = React.useContext(SearchContext);
  const [value, setValue] = React.useState("");

  return (
    <View style={styles.headerWrapper}>
      <View style={styles.headerLeft}>
        <TouchableOpacity onPress={() => navigation.goBack({ key: "any" })}>
          <View style={styles.buttonBackground}>
            <FontAwesome name="arrow-left" color="#fff" size={20} />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.inputWrapper}>
        <TextInput
          placeholder="Search..."
          style={styles.searchInput}
          value={value}
          onChangeText={(text) => setValue(text)}
        />
      </View>

      <View style={styles.headerRight}>
        <TouchableOpacity onPress={() => search()}>
          <View style={styles.buttonBackground}>
            <FontAwesome
              name="search"
              color="#fff"
              size={20}
              // style={{ color: '#5a2a95' }}
            />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerWrapper: {
    flexDirection: "row",
    alignItems: "center",
    height: 70,
    maxHeight: 70,
    minHeight: 70,
    backgroundColor: "#5a2a95",
    position: "relative",
  },

  buttonBackground: {
    // backgroundColor: 'white',
    backgroundColor: "#5a2a95",
    width: 40,
    height: 40,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },

  headerLeft: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
    // backgroundColor: 'red'
  },

  searchInput: {
    backgroundColor: "white",
    padding: 5,
    alignSelf: "stretch",
    borderRadius: 5,
  },

  inputWrapper: {
    flex: 4,
    flexGrow: 4,
    justifyContent: "center",
    padding: 5,
    // backgroundColor: 'blue',
  },

  headerRight: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 20,
    // backgroundColor: 'yellow'
  },
});
