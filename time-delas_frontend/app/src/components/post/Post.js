import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
  Button,
  TouchableOpacity,
  Animated,
  Alert,
  Modal,
  FlatList,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import getImagePath from "../../utils/getImagePath";
import EditPostModal from "../modal/EditPostModal";
import PostComment from "./PostComment";
import api from "../../services/api";
import { AuthContext } from "../../contexts/AuthContext";

export default function Post({
  navigation,
  item = null,
  editable = false,
  refresh,
}) {
  const { user } = React.useContext(AuthContext);

  const [post, setPost] = React.useState(item);
  const [commentText, setCommentText] = React.useState("");

  const [isLoading, setLoading] = React.useState(false);
  const [isOptionsOpen, setOptionsOpen] = React.useState(false);
  const [isModalOpen, setModalOpen] = React.useState(false);

  const [isLiked, setLiked] = React.useState(
    post ? post.likes.some((id) => id == user._id) : false
  );

  const animation = React.useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

  const src = React.useMemo(
    () =>
      getImagePath({
        id: post.postedBy._id,
        file: post.postedBy.profilePicture,
        path: "users",
      }),
    [post]
  );

  const fullName = React.useMemo(() => {
    return post.postedBy.fullName;
  }, [post]);

  function toggleOptions() {
    setOptionsOpen(!isOptionsOpen);

    Animated.timing(animation, {
      toValue: isOptionsOpen ? { x: 0, y: 0 } : { x: 200, y: 80 },
      duration: 200,
      useNativeDriver: false,
    }).start();
  }

  async function toggleLike() {
    try {
      if (!isLiked) {
        const resp = await api.post(`/posts/${post._id}/likes`, {
          userId: user._id,
        });

        setLiked(true);
        setPost(resp.data);
      } else {
        const resp = await api.put(`/posts/${post._id}/likes`, {
          userId: user._id,
        });

        setLiked(false);
        setPost(resp.data);
      }
    } catch (err) {
      console.log("ERROR IN LIKE", err);
    }
  }

  async function postComment() {
    setLoading(true);

    try {
      const resp = await api.post(`/posts/${post._id}/comments`, {
        comment: commentText,
        userId: user._id,
      });

      setCommentText("");
      setPost(resp.data);
    } catch (err) {
      console.log("ERROR!", err);
    }

    setLoading(false);
  }

  return (
    <>
      <View style={styles.container} key={post.postedBy._id}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalOpen}
          onRequestClose={() => {
            setModalOpen(false);
          }}
        >
          <View style={styles.modalView}>
            <View
              style={{
                alignItems: "flex-end",
                // backgroundColor: "yellow",
                marginBottom: 20,
              }}
            >
              <TouchableOpacity
                style={{ width: 30, height: 30, justifyContent: "center" }}
                onPress={() => setModalOpen(false)}
              >
                <Text style={{ fontWeight: "bold" }}>X</Text>
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1 }}>
              <FlatList
                data={post ? post.comments : []}
                renderItem={({ item }) => {
                  return <PostComment item={item} />;
                }}
                keyExtractor={(item) => item._id}
              />
            </View>
            <View style={{ flexDirection: "row", marginBottom: 20 }}>
              <View
                style={{
                  flex: 4,
                }}
              >
                <TextInput
                  placeholder="Comente..."
                  keyboardType="default"
                  value={commentText}
                  onChangeText={(text) => setCommentText(text)}
                  style={{
                    borderWidth: 1,
                    borderRadius: 15,
                    marginRight: 25,
                    padding: 5,
                  }}
                />
              </View>
              <View style={{ flex: 1 }}>
                {isLoading ? (
                  <ActivityIndicator />
                ) : (
                  <Button
                    title="Enviar"
                    onPress={() => postComment()}
                    color="#5a2a95"
                  />
                )}
              </View>
            </View>
          </View>
        </Modal>

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

          {editable && (
            <>
              <TouchableOpacity
                onPress={() => toggleOptions()}
                style={styles.options}
              >
                <View>
                  <MaterialIcons name="more-vert" size={20} />
                </View>
              </TouchableOpacity>

              {/*POST OPTIONS MENU */}
              <Animated.View
                style={{
                  // backgroundColor: "red",
                  height: animation.y,
                  width: animation.x,
                  position: "absolute",
                  right: 0,
                  top: 50,
                  zIndex: 999,
                  borderColor: "black",
                  borderWidth: isOptionsOpen ? 1 : 0,
                  backgroundColor: isOptionsOpen ? "white" : "transparent",
                }}
              >
                {isOptionsOpen && (
                  <>
                    <TouchableOpacity
                      style={styles.postOptionsContainer}
                      onPress={() => {
                        setOptionsOpen(false);
                        navigation.navigate("EditPost", {
                          postId: post._id,
                          content: post.content,
                          refresh,
                        });
                      }}
                    >
                      <View style={styles.postOptions}>
                        <MaterialIcons name="edit" style={{ margin: 5 }} />
                        <Text>Editar Publicação</Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.postOptionsContainer}
                      onPress={() => {
                        setOptionsOpen(false);
                        Alert.alert(
                          "Confirmação",
                          "Deseja realmente excluir a publicação?",
                          [
                            {
                              text: "Cancelar",
                              onPress: () => console.log("Cancel Pressed"),
                              style: "cancel",
                            },
                            {
                              text: "OK",
                              onPress: async () => {
                                try {
                                  await api.delete(
                                    `/posts/${post.postedBy._id}`
                                  );

                                  refresh();
                                } catch (err) {
                                  console.log("ERROR ON DELETE!");
                                }
                              },
                            },
                          ]
                          // { cancelable: false }
                        );
                      }}
                    >
                      <View style={styles.postOptions}>
                        <MaterialIcons name="delete" style={{ margin: 5 }} />
                        <Text>Remover Publicação</Text>
                      </View>
                    </TouchableOpacity>
                  </>
                )}
              </Animated.View>
            </>
          )}
        </View>

        <View style={styles.content}>
          <Text>{post.content}</Text>
        </View>

        {/* LIKE & COMMENT COUNTERS */}
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            marginBottom: 15,
            paddingLeft: 15,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <FontAwesome name="thumbs-up" />
            <Text> {post.likes.length}</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginLeft: 15,
            }}
          >
            <FontAwesome name="comment" />

            <Text> {post.comments.length}</Text>
          </View>
        </View>

        {/*POST BUTTONS */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => toggleLike()}>
            <FontAwesome
              name="thumbs-up"
              style={{ marginRight: 10, color: isLiked ? "blue" : "black" }}
            />
            <Text style={{ color: isLiked ? "blue" : "black" }}>Curtir</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              // navigation.navigate("CommentPost", {
              //   postId: post._id,
              //   setPost,
              // });
              setModalOpen(true);
            }}
          >
            <FontAwesome name="comment" style={{ marginRight: 10 }} />
            <Text>Comentar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.lastButton}
            onPress={() => console.log("SHARE!")}
          >
            <FontAwesome name="share" style={{ marginRight: 10 }} />
            <Text>Compartilhar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
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
