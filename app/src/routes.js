import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { AuthContext } from "./contexts/AuthContext";

import DefaultHeader from "./components/header/DefaultHeader";
import SearchHeader from "./components/header/SearchHeader";

import Welcome from "./screens/Welcome";
import SignIn from "./screens/SignIn";
import SignUp from "./screens/SignUp";
import Main from "./screens/Main";
import CreateTeam from "./screens/CreateTeam";
import Search from "./screens/Search";
import Settings from "./screens/Settings";
import Picture from "./screens/Picture";
import Team from "./screens/Team";
import EditPost from "./screens/EditPost";
import CommentPost from "./screens/CommentPost";

const Stack = createStackNavigator();

export default function Routes() {
  const { isSignedIn } = useContext(AuthContext);

  return (
    <NavigationContainer>
      <Stack.Navigator headerMode="screen">
        {!isSignedIn ? (
          <>
            <Stack.Screen
              name="Welcome"
              component={Welcome}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="SignIn"
              component={SignIn}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="SignUp"
              component={SignUp}
              options={{
                headerShown: false,
              }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Main"
              component={Main}
              options={({ navigation, route }) => ({
                header: ({ scene, previous, navigation }) => (
                  <DefaultHeader navigation={navigation} />
                ),
              })}
            />

            <Stack.Screen
              name="CreateTeam"
              component={CreateTeam}
              options={({ navigation, route }) => ({
                header: () => <DefaultHeader navigation={navigation} />,
              })}
            />

            <Stack.Screen
              name="Search"
              component={Search}
              options={({ navigation, route }) => ({
                header: ({ scene, previous, navigation }) => (
                  <SearchHeader navigation={navigation} />
                ),
              })}
            />

            <Stack.Screen
              name="Picture"
              component={Picture}
              options={({ navigation, route }) => ({
                header: ({ scene, previous, navigation }) => (
                  <SearchHeader navigation={navigation} />
                ),
              })}
            />

            <Stack.Screen
              name="Team"
              component={Team}
              options={({ navigation, route }) => ({
                header: ({ scene, previous, navigation }) => (
                  <SearchHeader navigation={navigation} />
                ),
              })}
            />

            <Stack.Screen
              name="EditPost"
              component={EditPost}
              options={({ navigation, route }) => ({
                header: ({ scene, previous, navigation }) => (
                  <SearchHeader navigation={navigation} />
                ),
              })}
            />

            <Stack.Screen
              name="CommentPost"
              component={CommentPost}
              options={({ navigation, route }) => ({
                header: ({ scene, previous, navigation }) => (
                  <SearchHeader navigation={navigation} />
                ),
              })}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
