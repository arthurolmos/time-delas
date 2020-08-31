import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  RefreshControl,
  ActivityIndicator,
  Button,
  TextInput,
} from "react-native";
import { AuthContext } from "../contexts/AuthContext";
import TeamProfile from "../components/profile/TeamProfile";
import TeamMember from "../components/team/TeamMember";
import Post from "../components/post/Post";
import api from "../services/api";
import LoadingScreen from "../components/loading/LoadingScreen";
import * as firebase from "firebase";
import dao from "../firebase/dao";
import { OptimizedFlatList } from "react-native-optimized-flatlist";

export default function Team({ route, navigation }) {
  const { teamId } = route.params;

  const { user, refreshTeams } = React.useContext(AuthContext);

  const db = firebase.firestore();
  const userId = user.uid;

  const [isTeamLoading, setTeamLoading] = React.useState(false);
  const [isMembersLoading, setMembersLoading] = React.useState(false);
  const [isLoadingPosts, setLoadingPosts] = React.useState(false);
  const [isPosting, setPosting] = React.useState(false);

  const [team, setTeam] = React.useState({});
  const [isOwner, setOwner] = React.useState(false);
  const [isAdmin, setAdmin] = React.useState(false);
  const [isMember, setMember] = React.useState(false);
  const [members, setMembers] = React.useState([]);

  const [posts, setPosts] = React.useState([]);
  const [postText, setPostText] = React.useState("");

  React.useEffect(() => {
    let isSubscribed = true;

    load(isSubscribed);

    return () => (isSubscribed = false);
  }, []);

  async function load(isSubscribed = true) {
    getTeam(isSubscribed);
    getTeamMembers(isSubscribed);
    getPosts(isSubscribed);
  }

  async function getTeam(isSubscribed) {
    setTeamLoading(true);

    try {
      const teamRef = db.collection("teams").doc(teamId);

      const team = await dao.getDocument(teamRef);
      const { owner } = team;

      const isMemberRef = db
        .collection("teams")
        .doc(teamId)
        .collection("members")
        .doc(userId);

      const isMember = await dao.getDocument(isMemberRef);

      if (isSubscribed) {
        if (owner == userId) {
          setOwner(true);
        }

        if (isMember) {
          if (isMember.isAdmin) setAdmin(true);
          setMember(true);

          setAdmin(true); //TODO: remover depois...
        } else {
          setMember(false);
        }

        setTeam(team);
      }
    } catch (err) {
      console.log("ERROR GETTING THE TEAM!", err);
    }

    setTeamLoading(false);
  }

  async function getTeamMembers(isSubscribed) {
    setMembersLoading(true);

    try {
      const teamMembersRef = db
        .collection("teams")
        .doc(teamId)
        .collection("members");

      const teamMembers = await dao.getCollection(teamMembersRef);
      const membersId = teamMembers.map((member) => {
        return member.id;
      });

      if (membersId.length > 0) {
        const membersRef = db
          .collection("users")
          .where(firebase.firestore.FieldPath.documentId(), "in", membersId);
        const members = await dao.getCollection(membersRef);

        if (isSubscribed) setMembers(members);
      } else {
        if (isSubscribed) setMembers([]);
      }
    } catch (err) {
      console.log("ERROR ON GETTING TEAM MEMBERS", err);
    }

    setMembersLoading(false);
  }

  async function handleAddOrLeaveTeam() {
    setTeamLoading(true);

    if (isMember) {
      //Leaves team
      const teamMemberRef = db
        .collection("teams")
        .doc(teamId)
        .collection("members")
        .doc(userId);

      return db
        .runTransaction((transaction) => {
          return transaction.get(teamMemberRef).then((doc) => {
            transaction.delete(teamMemberRef);

            const userTeamRef = db
              .collection("users")
              .doc(userId)
              .collection("teams")
              .doc(teamId);
            transaction.delete(userTeamRef);
          });
        })
        .then(function () {
          console.log("Transaction successfully committed!");
          setTeamLoading(false);
          load();
          refreshTeams();
        })
        .catch((err) => {
          console.log("Transaction failed: ", err);
          setTeamLoading(false);
        });
    } else {
      //Enters team
      const teamMembersRef = db
        .collection("teams")
        .doc(teamId)
        .collection("members")
        .doc(userId);

      return db
        .runTransaction((transaction) => {
          return transaction.get(teamMembersRef).then((doc) => {
            transaction.set(teamMembersRef, {
              [userId]: true,
              joinedIn: firebase.firestore.FieldValue.serverTimestamp(),
            });

            const userTeamRef = db
              .collection("users")
              .doc(userId)
              .collection("teams")
              .doc(teamId);
            transaction.set(userTeamRef, { [teamId]: true });
          });
        })
        .then(function () {
          console.log("Transaction successfully committed!");
          setTeamLoading(false);
          load();
          refreshTeams();
        })
        .catch((err) => {
          console.log("Transaction failed: ", err);
          setTeamLoading(false);
        });
    }
  }

  async function handleAddPost() {
    setPosting(true);

    try {
      const post = {
        postedBy: userId,
        postedOn: teamId,
        content: postText,
      };

      const postRef = db.collection("teams").doc(teamId).collection("posts");
      const postId = await dao.addDocument(postRef, post);

      setPostText("");

      await getPosts();
    } catch (err) {
      console.log("ERROR ON POSTING!", err);
    }

    setPosting(false);
  }

  async function getPosts(isSubscribed = true) {
    setLoadingPosts(true);

    try {
      const postsRef = db
        .collection("teams")
        .doc(teamId)
        .collection("posts")
        .orderBy("_updatedAt", "desc");
      let posts = await dao.getCollection(postsRef);

      for (let i = 0; i < posts.length; i++) {
        const userId = posts[i].postedBy;
        const userRef = db.collection("users").doc(userId);

        const user = await dao.getDocument(userRef);
        if (user) {
          posts[i].src = user.photoURL;
          posts[i].fullName = user.firstName + " " + user.lastName;
        }
      }

      if (isSubscribed) setPosts([...posts]);
    } catch (err) {
      console.log("ERROR ON LOADING POSTS", err);
    }

    setLoadingPosts(false);
  }

  return (
    <SafeAreaView style={{ flex: 1, flexGrow: 1 }}>
      {isTeamLoading ? (
        <LoadingScreen />
      ) : (
        <ScrollView
          style={styles.container}
          refreshControl={
            <RefreshControl
              onRefresh={() => {
                load();
              }}
              refreshing={isTeamLoading}
            />
          }
        >
          <View style={styles.profileHeader}>
            <TeamProfile
              navigation={navigation}
              team={team}
              setTeam={setTeam}
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
          {isMembersLoading ? (
            <ActivityIndicator />
          ) : (
            isMember && (
              <>
                <View style={styles.wrapper}>
                  <View style={styles.wrapperInternal}>
                    <View style={styles.titleContainer}>
                      <Text style={styles.title}>Membros</Text>
                    </View>

                    <View style={styles.list}>
                      <OptimizedFlatList
                        data={members}
                        renderItem={({ item }) => {
                          const { firstName, lastName, id, photoURL } = item;
                          const fullName = firstName + " " + lastName;

                          return (
                            <TeamMember
                              navigation={navigation}
                              id={id}
                              fullName={fullName}
                              profilePicture={photoURL}
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
            )
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
                  <OptimizedFlatList
                    data={posts ? posts : []}
                    renderItem={({ item }) => {
                      return (
                        <Post
                          navigation={navigation}
                          item={item}
                          // editable={isAdmin || item.postedBy._id == user._id}
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
