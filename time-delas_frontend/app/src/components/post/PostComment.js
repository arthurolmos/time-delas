import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import getImagePath from "../../utils/getImagePath";
import api from "../../services/api";
import { AuthContext } from "../../contexts/AuthContext";

export default function PostComment({ item, navigation }) {
  const src = React.useMemo(
    () =>
      getImagePath({
        id: item.userId._id,
        file: item.userId.profilePicture,
        path: "users",
      }),
    [item]
  );

  const fullName = React.useMemo(() => {
    return item.userId.fullName;
  }, []);

  return (
    <View
      navigation={navigation}
      item={item}
      // editable={isAdmin || item.postedBy._id == user._id}
      // refresh={getPosts}
    >
      <View>
        <View style={styles.header}>
          <View style={styles.pictureContainer}>
            <View style={styles.pictureMask}>
              <Image
                resizeMode={"stretch"}
                style={{ width: 60, height: 60 }}
                source={{ uri: src }}
              />
            </View>
          </View>

          <View style={styles.nameContainer}>
            <Text style={styles.name}>{fullName}</Text>
          </View>
        </View>
      </View>
      <Text>{item.comment}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor: "red",
    flex: 1,
    backgroundColor: "white",
    marginBottom: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.8,
    shadowRadius: 4.65,

    elevation: 2,
  },

  header: {
    flexDirection: "row",
    marginBottom: 20,
  },

  pictureContainer: {
    // backgroundColor: "blue",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
  },

  pictureMask: {
    borderRadius: 100,
    overflow: "hidden",
  },

  nameContainer: {
    // backgroundColor: "yellow",
    flex: 3,
    justifyContent: "center",
    // alignItems: "center",
    paddingLeft: 10,
  },

  name: {
    fontWeight: "bold",
    fontSize: 16,
  },

  options: {
    // backgroundColor: "red",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },

  content: {
    flex: 2,
    flexGrow: 2,
    marginBottom: 20,
  },

  buttonContainer: {
    // backgroundColor: "green",
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    height: 30,
    justifyContent: "center",
  },

  button: {
    // backgroundColor: "yellow",
    flexDirection: "row",
    flexGrow: 1,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    borderRightWidth: 0.5,
    borderRightColor: "#474747",
  },

  lastButton: {
    flexDirection: "row",
    flexGrow: 1,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },

  postOptionsContainer: {
    // backgroundColor: "yellow",
    flex: 1,
    flexGrow: 1,
    flexShrink: 1,
  },

  postOptions: {
    // backgroundColor: "blue",
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
  },

  modalView: {
    marginTop: 15,
    marginBottom: 0,
    height: "100%",
    backgroundColor: "white",
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
