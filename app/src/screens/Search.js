import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import Toast from "react-native-simple-toast";
import SearchResult from "../components/search/SearchResult";
import { SearchContext } from "../contexts/SearchContext";
import { OptimizedFlatList } from "react-native-optimized-flatlist";

export default function Search({ navigation }) {
  const { loading, searchResults, clearSearch, isSearchOn } = React.useContext(
    SearchContext
  );

  return (
    <SafeAreaView style={{ flex: 1, flexGrow: 1 }}>
      {loading ? (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <ActivityIndicator color="#5a2a95" size="large" />
        </View>
      ) : (
        isSearchOn && (
          <>
            <OptimizedFlatList
              style={styles.searchWrapper}
              data={searchResults}
              renderItem={({ item }) => {
                const { id, name } = item;

                return (
                  <SearchResult
                    id={id}
                    name={name}
                    keyExtractor={(item) => item.id}
                  />
                );
              }}
              ListHeaderComponent={() => (
                <View style={styles.resultHeader}>
                  <View style={{ flexDirection: "row" }}>
                    <View style={{ flex: 2 }}>
                      <Text>
                        Foram encontrados {searchResults.length} resultados!
                      </Text>
                    </View>
                    <View
                      style={{
                        flex: 1,
                        alignItems: "flex-end",
                        // backgroundColor: 'blue'
                      }}
                    >
                      <Text
                        style={{ color: "blue" }}
                        onPress={() => clearSearch()}
                      >
                        Limpar
                      </Text>
                    </View>
                  </View>
                </View>
              )}
            />
          </>
        )
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  searchWrapper: {
    flex: 1,
    flexGrow: 1,
    paddingTop: 15,
    paddingBottom: 15,
  },

  resultHeader: {
    padding: 10,
  },
});
