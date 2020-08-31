import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { OptimizedFlatList } from "react-native-optimized-flatlist";
import { AuthContext } from "../contexts/AuthContext";
import UserProfile from "../components/profile/UserProfile";
import TeamListItem from "../components/listItem/TeamListItem";
import { useNavigation } from "@react-navigation/native";

const Item = ({ title }) => {
  return (
    <View style={styles.item}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

export default function Home() {
  const navigation = useNavigation();

  const { teams, refreshUser, refreshTeams } = React.useContext(AuthContext);

  const [isLoading, setLoading] = React.useState(false);

  async function handleRefreshProfile() {
    setLoading(true);

    await refreshUser();
    await refreshTeams();

    setLoading(false);
  }

  return (
    <SafeAreaView style={{ flex: 1, flexGrow: 1 }}>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => handleRefreshProfile()}
          />
        }
      >
        <View style={styles.profileHeader}>
          <UserProfile navigation={navigation} />
        </View>

        <View style={styles.wrapper}>
          <View style={styles.wrapperInternal}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Novidades</Text>
            </View>
            <View>
              <Text>Blablabla...</Text>
            </View>
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
                  return <TeamListItem navigation={navigation} item={item} />;
                }}
                keyExtractor={(item) => item.id}
                // horizontal={true}
                scrollEnabled={false}
              />
            </View>

            <View style={styles.footer}>
              <TouchableOpacity>
                <Text>Ver mais</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.wrapper}>
          <View style={styles.wrapperInternal}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Meus esportes</Text>
            </View>

            <View style={styles.list}>
              <OptimizedFlatList
                data={teams}
                renderItem={({ item }) => <Item title={item.name} />}
                keyExtractor={(item) => item.id}
                horizontal={true}
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
    //   backgroundColor: 'green',
    // height: 100,
  },

  profileHeader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
  },

  gridContent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    // backgroundColor: "yellow",
    flexWrap: "wrap",
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
    borderBottomWidth: 1,
    borderBottomColor: "#474747",
    borderStyle: "solid",

    // backgroundColor: "red",
  },

  list: {
    flex: 4,
    justifyContent: "center",
    // backgroundColor: "yellow",
  },

  friendsWrapper: {
    flex: 3,
    padding: 15,
    justifyContent: "flex-start",
  },

  content: {
    flex: 3,
    padding: 15,
    justifyContent: "flex-start",
  },

  title: {
    textTransform: "uppercase",
    fontFamily: "Lato Regular",
    marginBottom: 10,
  },

  titleContainer: {
    flex: 1,
    justifyContent: "flex-start",
  },

  item: {
    backgroundColor: "#f9c2ff",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },

  footer: {
    padding: 10,
    flex: 1,
    justifyContent: "center",
    // backgroundColor: "red",
    alignItems: "flex-end",
  },
});
