import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import SmallRoundThumbnail from "../thumbnail/SmallRoundThumbnail";

export default function TeamListItem({ navigation, item }) {
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("Team", { teamId: item._id })}
    >
      <View style={styles.wrapper}>
        <View style={styles.picture}>
          <SmallRoundThumbnail
            navigation={navigation}
            item={item}
            path="teams"
          />
        </View>
        <View style={styles.name}>
          <Text>{item.name}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    flex: 1,
    backgroundColor: "white",
    padding: 5,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.8,
    shadowRadius: 4.65,

    elevation: 2,
  },

  name: {
    alignItems: "flex-start",
    justifyContent: "center",
    flex: 4,
    // backgroundColor: "yellow",
    padding: 5,
  },

  picture: {
    flex: 1,
    // backgroundColor: "red",
    padding: 5,
    alignItems: "center",
    justifyContent: "center",
  },
});
