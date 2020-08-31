import * as React from "react";
import Toast from "react-native-simple-toast";
import * as firebase from "firebase";
import dao from "../firebase/dao";

const AuthContext = React.createContext();

function AuthProvider(props) {
  const [isSignedIn, setSignedIn] = React.useState(false);
  const [user, setUser] = React.useState(null);
  const [teams, setTeams] = React.useState([]);
  const [notification, setNotifications] = React.useState([]);

  const [unsubTeams, setUnsubTeams] = React.useState(null);
  const [unsubNotifications, setUnsubNotifications] = React.useState(null);

  const auth = firebase.auth();
  const db = firebase.firestore();

  React.useEffect(() => {
    signOut();
    signIn({ email: "arthur.olmos@gmail.com", password: "123456" });

    //Add Auth & Team RealTimeListener
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        const { uid } = user;
        const userRef = db.collection("users").doc(uid);

        const teams = await dao.getDocument(userRef);

        //Add Teams realtime listener
        userRef.collection("teams").onSnapshot((snapshot) => {
          const teamsID = [];
          snapshot.forEach((doc) => {
            teamsID.push(doc.id);
          });

          //Add listener on each Team
          if (teamsID.length > 0) {
            db.collection("teams")
              .where(firebase.firestore.FieldPath.documentId(), "in", teamsID)
              .onSnapshot((snapshot) => {
                const teams = [];

                snapshot.forEach((doc) => {
                  const team = doc.data();
                  team.id = doc.id;

                  teams.push(team);
                });

                console.log("AUTH TEAMS", teams);

                setTeams([...teams]);
              });
          } else {
            setTeams([]);
          }
          // setUnsubTeams(unsubTeams);

          //Add realtime listener on Notifications
          const unsubNotifications = userRef
            .collection("notifications")
            .onSnapshot((snapshot) => {
              const notifications = [];

              snapshot.forEach((doc) => {
                const notification = doc.data();
                notification.id = notification.id;

                notifications.push(notification);
              });

              setNotifications([...notification]);
            });
          // setUnsubNotifications(unsubNotifications);
        });

        setUser({ ...user });
        setSignedIn(true);
      } else {
        if (unsubTeams) unsubTeams();
        if (unsubNotifications) unsubNotifications();
        setSignedIn(false);
        setUser(null);
        setTeams([]);
      }
    });
  }, []);

  function refreshUser() {
    const user = firebase.auth().currentUser;
    setUser({ ...user });
  }

  function refreshTeams() {
    // const db = firebase.firestore();
    // const userId = user.uid;
    // db.collection("users")
    //   .doc(userId)
    //   .collection("teams")
    //   .get()
    //   .then((snapshot) => {
    //     const teamsID = [];
    //     snapshot.forEach((doc) => {
    //       console.log("DOCS", doc.id);
    //       teamsID.push(doc.id);
    //     });
    //     console.log("TEAMS ID 3", teamsID);
    //     if (teamsID.length > 0) {
    //       db.collection("teams")
    //         .where(firebase.firestore.FieldPath.documentId(), "in", teamsID)
    //         .get()
    //         .then((snapshot) => {
    //           const teams = [];
    //           snapshot.forEach((doc) => {
    //             const team = doc.data();
    //             team.id = doc.id;
    //             teams.push(team);
    //           });
    //           console.log("TEAMS 4", teams);
    //           setTeams([...teams]);
    //         })
    //         .catch((err) => {
    //           console.log("ERROR ON REFRESH", err);
    //         });
    //     } else {
    //       setTeams([]);
    //     }
    //   })
    //   .catch((err) => {
    //     console.log("ERROR ON REFRESH", err);
    //   });
  }

  async function signIn({ email, password }) {
    return firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .catch((err) => {
        console.log("ERROR ON SIGN IN ", err);
        Toast.show(err.message);
      });
  }

  async function signUp({ email, password, firstName, lastName }) {
    // firstName = "Hello";
    // lastName = "World";
    // password = "123456";

    if (
      email !== "" &&
      password !== "" &&
      firstName !== "" &&
      lastName !== ""
    ) {
      return auth
        .createUserWithEmailAndPassword(email, password)
        .then(async (result) => {
          const { user } = result;

          return user
            .updateProfile({
              displayName: firstName + " " + lastName,
            })
            .then(() => {
              refreshUser();

              const userRef = db.collection("users").doc(user.uid);

              return userRef
                .set({
                  email,
                  firstName,
                  lastName,
                  _createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                  _updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                })
                .catch((err) => {
                  console.log("ERROR ON SAVING USER IN DB - SIGNUP", err);
                });
            });
        })
        .catch((err) => {
          console.log("ERROR ON CREATING USER - SIGNUP", err);
          Toast.show(err.message);
        });
    } else {
      Toast.show("Preencha os campos corretamente!");
    }
  }

  async function signOut() {
    return auth.signOut().catch((err) => {
      console.log("ERROR ON SIGNOUT", err);
      Toast.show("Erro ao sair!");
    });
  }

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        signUp,

        isSignedIn,
        setSignedIn,

        user,
        setUser,

        teams,
        setTeams,

        refreshUser,
        refreshTeams,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
