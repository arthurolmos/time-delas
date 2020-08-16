import React from "react";
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Home from "./Home";
import Convoke from "./Convoke";
import Services from "./Services";
import Settings from "./Settings";

const Tab = createBottomTabNavigator();

export default function Main({ navigation }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home";
          } else if (route.name === "Convoke") {
            iconName = focused ? "group" : "group";
          } else if (route.name === "Services") {
            iconName = focused ? "star" : "star";
          } else if (route.name === "Settings") {
            iconName = focused ? "settings" : "settings";
          }

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: "gold",
        inactiveTintColor: "gray",
      }}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Convoke" component={Convoke} />
      <Tab.Screen name="Services" component={Services} />
      <Tab.Screen name="Settings" component={Settings} />
    </Tab.Navigator>
  );
}
