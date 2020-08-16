import React, { useContext } from "react";
import { Text, StyleSheet, View, Image } from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { AuthContext } from "../../contexts/AuthContext";
import getImagePath from "../../utils/getImagePath";

export default function DefaultHeader({ navigation }) {
  const { signOut, user } = useContext(AuthContext);
  const [image, setImage] = React.useState(null);

  React.useEffect(() => {
    if (user && user.profilePicture !== "") {
      const src = getImagePath({
        id: user._id,
        file: user.profilePicture,
        path: "users",
      });

      setImage(src);
    }
  }, [user]);

  return (
    <View style={styles.headerWrapper}>
      <View style={styles.headerLeft}>
        <TouchableOpacity onPress={() => console.log("PROFILE")}>
          <View style={styles.profile}>
            {image ? (
              <Image
                resizeMode={"stretch"}
                style={{ width: 60, height: 60 }}
                source={{ uri: image }}
              />
            ) : (
              <FontAwesome
                name="user-o"
                onPress={() => alert("This is a button!")}
                color="#000"
                size={20}
              />
            )}
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.headerTitle}>
        <TouchableOpacity onPress={() => console.log("HELLO")}>
          <Text style={styles.title}>Time Delas</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.headerRight}>
        <TouchableOpacity
          style={{ marginRight: 20 }}
          onPress={() => navigation.navigate("Search")}
        >
          <View style={styles.buttonBackground}>
            <FontAwesome name="search" color="#fff" size={20} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => signOut()}>
          <View style={styles.buttonBackground}>
            <FontAwesome name="bell-o" color="#fff" size={20} />
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
    justifyContent: "space-between",
    height: 70,
    maxHeight: 70,
    minHeight: 70,
    backgroundColor: "#5a2a95",
  },

  buttonBackground: {
    // backgroundColor: 'white',
    backgroundColor: "#5a2a95",
    width: 40,
    height: 40,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 0,
  },

  title: {
    textTransform: "uppercase",
    color: "white",
  },

  profile: {
    borderRadius: 100,
    backgroundColor: "white",
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },

  headerLeft: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },

  headerRight: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 20,
  },

  headerTitle: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
  },
});
