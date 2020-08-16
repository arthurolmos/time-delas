import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Button,
  TextInput,
} from "react-native";
import { AuthContext } from "../contexts/AuthContext";
import TeamProfile from "../components/thumbnail/TeamProfile";
import TeamMember from "../components/team/TeamMember";
import Post from "../components/post/Post";
import api from "../services/api";
import LoadingScreen from "../components/loading/LoadingScreen";

export default function Team({ route, navigation }) {
  const { teamId } = route.params;

  const { user, refresh } = React.useContext(AuthContext);

  const [isLoading, setLoading] = React.useState(false);
  const [isLoadingPosts, setLoadingPosts] = React.useState(false);
  const [isPosting, setPosting] = React.useState(false);

  const [team, setTeam] = React.useState({});
  const [isOwner, setOwner] = React.useState(false);
  const [isAdmin, setAdmin] = React.useState(false);
  const [isMember, setMember] = React.useState(false);

  const [posts, setPosts] = React.useState([]);
  const [postText, setPostText] = React.useState("");

  React.useEffect(() => {
    let isSubscribed = true;

    async function getTeam() {
      setLoading(true);

      try {
        const resp = await api.get(`/teams/${teamId}`);
        const team = resp.data;

        if (isSubscribed) {
          //Check if user is owner
          if (team.owner == user._id) {
            setOwner(true);
            setAdmin(true);
          }

          //Checks if user is member...
          const index = team.members.findIndex(
            (member) => member.userId._id == user._id
          );
          if (index > -1) {
            setMember(true);

            //Checks if user is admin or owner
            const member = team.members[index];
            if (
              // member.roles.find((role) => role == "owner") ||
              member.roles.find((role) => role == "admin")
            ) {
              setAdmin(true);
            }
          }
        }

        if (isSubscribed) {
          setTeam(team);
          getPosts(isSubscribed);
        }
      } catch (err) {
        console.log("ERROR:", err);
      }
      setLoading(false);
    }

    getTeam(isSubscribed);

    return () => (isSubscribed = false);
  }, []);

  async function handleRefreshTeam(isSubscribed = true) {
    try {
      const resp = await api.get(`/teams/${teamId}`);

      if (isSubscribed) {
        setTeam(resp.data);
        getPosts(isSubscribed);
      }
    } catch (err) {
      console.log("ERROR REFRESHING", err);
    }
  }

  async function handleAddOrLeaveTeam() {
    setLoading(true);

    try {
      if (isMember) {
        //Leaves team
        await api.delete(`/teams/${team._id}/members`, {
          data: {
            userId: user._id,
          },
        });

        setMember(false);
      } else {
        //Enters team
        await api.post(`/teams/${team._id}/members`, {
          userId: user._id,
        });

        setMember(true);
      }

      await refresh();
      await handleRefreshTeam();
    } catch (err) {
      console.log("ERROR", err);
    }

    setLoading(false);
  }

  async function handleAddPost() {
    setPosting(true);

    try {
      await api.post("/posts", {
        postedBy: user._id,
        postedOn: team._id,
        onModel: "Team",
        content: postText,
      });

      await getPosts();

      setPostText("");
    } catch (err) {
      console.log("ERROR ON POSTING!", err);
    }

    setPosting(false);
  }

  async function getPosts(isSubscribed = true) {
    setLoadingPosts(true);

    try {
      const resp = await api.get("/posts", {
        params: { postedOn: teamId, onModel: "Team" },
      });

      if (isSubscribed) setPosts(resp.data);
    } catch (err) {
      console.log("ERROR ON LOADING POSTS", err);
    }

    setLoadingPosts(false);
  }

  return (
    <SafeAreaView style={{ flex: 1, flexGrow: 1 }}>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <ScrollView
          style={styles.container}
          refreshControl={
            <RefreshControl
              onRefresh={() => {
                handleRefreshTeam();
              }}
              refreshing={isLoading}
            />
          }
        >
          <View style={styles.profileHeader}>
            <TeamProfile
              navigation={navigation}
              team={team}
              refresh={handleRefreshTeam}
              admin={isAdmin}
            />

            <Text style={styles.teamName}>{team && team.name} </Text>
          </View>

          <View>
            {/* {isOwner ? (
              <View style={{ flex: 1, padding: 15 }}>
                <Button
                  title="Gerenciar"
                  onPress={() => console.log("I AM THE OWNER")}
                  color="#5a2a95"
                />
              </View>
            ) : ( */}
            <View style={{ flex: 1, padding: 15 }}>
              <Button
                title={isMember ? "Sair" : "Entrar"}
                onPress={() => handleAddOrLeaveTeam()}
                color="#5a2a95"
              />
            </View>
          </View>

          {/*Members and write posts will be shown only for team members */}
          {isMember && (
            <>
              <View style={styles.wrapper}>
                <View style={styles.wrapperInternal}>
                  <View style={styles.titleContainer}>
                    <Text style={styles.title}>Membros</Text>
                  </View>

                  <View style={styles.list}>
                    <FlatList
                      data={team ? team.members : []}
                      renderItem={({ item }) => {
                        return (
                          <TeamMember
                            navigation={navigation}
                            id={item.userId._id}
                            fullName={item.userId.fullName}
                            profilePicture={item.userId.profilePicture}
                          />
                        );
                      }}
                      keyExtractor={(item) => item.id}
                      horizontal={true}
                      scrollEnabled={false}
                    />
                  </View>
                </View>
              </View>

              <View style={styles.wrapper}>
                <View style={styles.wrapperInternal}>
                  <View style={styles.titleContainer}>
                    <Text style={styles.title}>Escrever Post</Text>
                  </View>

                  <View style={styles.list}>
                    <TextInput
                      style={styles.postInput}
                      placeholder="Compartilhe suas idéias!"
                      value={postText}
                      onChangeText={(text) => setPostText(text)}
                      multiline={true}
                      blurOnSubmit={true}
                    />
                    <View
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        alignItems: "flex-end",
                        justifyContent: "flex-end",
                        paddingBottom: 15,
                      }}
                    >
                      {isPosting ? (
                        <ActivityIndicator />
                      ) : (
                        <Button
                          title="Postar"
                          color="#5a2a95"
                          onPress={() => handleAddPost()}
                        />
                      )}
                    </View>
                  </View>
                </View>
              </View>
            </>
          )}

          <View style={styles.wrapper}>
            <View style={styles.wrapperInternal}>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>Posts</Text>
              </View>

              <View style={styles.list}>
                {isLoadingPosts ? (
                  <ActivityIndicator />
                ) : (
                  <FlatList
                    data={posts ? posts : []}
                    renderItem={({ item }) => {
                      return (
                        <Post
                          navigation={navigation}
                          item={item}
                          editable={isAdmin || item.postedBy._id == user._id}
                          refresh={getPosts}
                        />
                      );
                    }}
                    keyExtractor={(item) => item._id}
                    scrollEnabled={false}
                  />
                )}
              </View>
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //   backgroundColor: 'green',
    // height: 100,
  },

  userName: {
    fontWeight: "bold",
    textTransform: "uppercase",
    marginTop: 10,
    fontSize: 20,
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

  postInput: {
    height: 40,
    borderColor: "#5a2a95",
    borderRadius: 5,
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: "white",
    height: 100,
    textAlignVertical: "top",
    paddingTop: 15,
    paddingBottom: 15,
  },
});
