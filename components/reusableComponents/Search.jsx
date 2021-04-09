import React, { useState } from "react";
import { View } from "react-native";
import { SearchBar } from "react-native-elements";

export default function Search(props) {
  const [searchQuery, setSearchQuery] = useState("");



  const onChangeSearch = (query) => {
    setSearchQuery(query);
  };

  const submit = () => {
    setSearchQuery('')
    props.navigation.navigate('Search', {find: searchQuery, country: props.country, token: props.token})
  }
  return (
    <View>
      <SearchBar
        inputStyle={{ backgroundColor: "white" }}
        inputContainerStyle={{backgroundColor: 'white', borderRadius: 50}}
        blurOnSubmit={true}
        containerStyle={{backgroundColor: 'transparent', borderTopColor: 'transparent', borderBottomColor: 'transparent'}}
        placeholder="Search"
        onClear={() => setSearchQuery("")}
        onChangeText={onChangeSearch}
        value={searchQuery}
        onSubmitEditing={submit}
      />
    </View>
  );
}
