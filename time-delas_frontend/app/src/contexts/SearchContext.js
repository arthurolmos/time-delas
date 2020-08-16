import * as React from "react";
import { AsyncStorage } from "react-native";
import api from "../services/api";

const SearchContext = React.createContext();

function SearchProvider(props) {
  const [loading, setLoading] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [searchResults, setSearchResults] = React.useState([]);
  const [isSearchOn, setSearchOn] = React.useState(false);

  async function search(term) {
    setLoading(true);

    try {
      const resp = await api.get("/teams");

      const users = await resp.data;

      setSearchResults(users);
      setSearchOn(true);
    } catch (err) {
      console.log("ERROR!", err);
    }

    setLoading(false);
  }

  function clearSearch() {
    setSearchResults([]);
    setSearchOn(false);
  }

  return (
    <SearchContext.Provider
      value={{
        searchResults,
        isSearchOn,
        search,
        clearSearch,

        loading,
        setLoading,

        value,
        setValue,
      }}
    >
      {props.children}
    </SearchContext.Provider>
  );
}

export { SearchContext, SearchProvider };
