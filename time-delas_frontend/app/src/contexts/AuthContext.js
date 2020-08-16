import * as React from "react";
import { AsyncStorage } from "react-native";
import api from "../services/api";

const AuthContext = React.createContext();

function AuthProvider(props) {
  const [isSignedIn, setSignedIn] = React.useState(false);
  const [user, setUser] = React.useState(null);
  const [friends, setFriends] = React.useState([]);

  React.useEffect(() => {
    console.log("USER", user);
  }, [user]);

  React.useEffect(() => {
    signIn({ email: "A", password: "A" });
  }, []);

  async function refresh() {
    const resp = await api.get(`users/${user._id}`);
    setUser(resp.data);
  }

  async function signIn({ email, password }) {
    const loginResp = await api.post("signin", { email, password });

    const userResp = await api.get(`users/${loginResp.data.user.id}`);
    const user = userResp.data;

    await AsyncStorage.setItem("Authorization", loginResp.data.jwt.token);
    console.log(loginResp.data.jwt.token);

    setUser(user);
    setSignedIn(true);
  }

  async function signUp({ email, password }) {
    if (email && password) setSignedIn(true);
  }

  async function signOut() {
    setSignedIn(false);
    setUser(null);
  }

  // React.useEffect(() => {
  //   console.log("USER", user);
  // }, [user]);

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

        refresh,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
