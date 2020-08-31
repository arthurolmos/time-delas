import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Header,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../contexts/AuthContext";
import TeamListItem from "../components/listItem/TeamListItem";
import { OptimizedFlatList } from "react-native-optimized-flatlist";

export default function Convoke() {
  const navigation = useNavigation();

  const { user, teams, refreshTeams } = React.useContext(AuthContext);

  const [loading, setLoading] = React.useState(false);

  function handleRefreshTeams() {
    setLoading(true);

    refreshTeams();

    setLoading(false);
  }

  return (
    <SafeAreaView style={{ flex: 1, flexGrow: 1 }}>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => handleRefreshTeams()}
          />
        }
      >
        <View>
          <View style={{ padding: 20 }}>
            <TouchableOpacity onPress={() => navigation.navigate("CreateTeam")}>
              <Text>Criar time</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.wrapper}>
          <View style={styles.wrapperInternal}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Meus times</Text>
            </View>

            <View style={styles.list}>
              <OptimizedFlatList
                data={teams}
                renderItem={({ item }) => {
                  return <TeamListItem item={item} navigation={navigation} />;
                }}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: "center",
    // justifyContent: "center",
  },

  list: {
    flex: 4,
    justifyContent: "center",
    // backgroundColor: "yellow",
  },

  wrapper: {
    flex: 2,
    padding: 15,
    justifyContent: "center",
    // backgroundColor: "blue",
  },

  wrapperInternal: {
    flex: 1,
    justifyContent: "center",
    borderStyle: "solid",

    // backgroundColor: "red",
  },

  list: {
    flex: 1,
    justifyContent: "center",
    // backgroundColor: "yellow",
  },

  title: {
    textTransform: "uppercase",
    fontFamily: "Lato Regular",
  },

  titleContainer: {
    flex: 1,
    justifyContent: "flex-start",
    marginBottom: 15,
  },
});
