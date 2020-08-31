import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

export default function PostComment({ item, navigation }) {
  const postId = item.id;
  const comment = item.content;
  const userId = item.postedBy;
  const teamId = item.postedOn;
  const editable = item.postedBy === userId;

  const src = React.useMemo(() => item.src);
  const fullName = React.useMemo(() => item.fullName);

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
      <Text>{comment}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
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
});
