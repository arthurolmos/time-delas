import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import getImagePath from "../../utils/getImagePath";
import { useNavigation } from "@react-navigation/native";

export default function TeamMember({ id, fullName, profilePicture }) {
  const [image, setImage] = React.useState(null);

  React.useEffect(() => {
    console.log(profilePicture, "HAHAHAH");
    if (profilePicture) {
      const src = getImagePath({ id, file: profilePicture, path: "users" });
      setImage(src);
    }
  }, []);

  return (
    <View style={styles.wrapper}>
      <View style={styles.picture}>
        {profilePicture ? (
          <Image
            resizeMode={"stretch"}
            style={{ width: 150, height: 150 }}
            source={{ uri: image }}
          />
        ) : (
          <FontAwesome name="user-o" color="#000" size={20} />
        )}
      </View>

      <View style={styles.content} id={id}>
        <Text style={styles.name}> {fullName} </Text>
        <Text style={styles.info}>*** Posição ***</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    // backgroundColor: "blue",
    marginBottom: 5,
    maxWidth: 100,
    minWidth: 100,
    margin: 5,
  },

  picture: {
    // backgroundColor: 'red',
    alignItems: "center",
    justifyContent: "center",
    minHeight: 80,
    maxHeight: 120,
    overflow: "hidden",
  },

  content: {
    flex: 2,
    // backgroundColor: 'yellow',
    padding: 5,
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
    fontSize: 12,
    // backgroundColor: "green",
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
  },

  info: {
    fontSize: 12,
    color: "#474747",
  },
});
