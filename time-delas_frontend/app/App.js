import React from "react";
import Routes from "./src/routes";
import { StatusBar, Text, YellowBox } from "react-native";
import { AuthProvider } from "./src/contexts/AuthContext";
import { SearchProvider } from "./src/contexts/SearchContext";
import { useFonts } from "@use-expo/font";

export default function App() {
  let [isLoaded] = useFonts({
    "Lato Black": require("./assets/fonts/Lato-Black.ttf"),
    "Lato Regular": require("./assets/fonts/Lato-Regular.ttf"),
  });

  // Ignore log notification by message:
  YellowBox.ignoreWarnings([""]);

  return !isLoaded ? (
    <Text>Loading ... </Text>
  ) : (
    <AuthProvider>
      <SearchProvider>
        <StatusBar barStyle="light-content" backgroundColor="#5a2a95" />
        <Routes />
      </SearchProvider>
    </AuthProvider>
  );
}
