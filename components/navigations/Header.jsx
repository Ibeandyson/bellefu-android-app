import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Modal, TouchableHighlight, ScrollView, Platform, StatusBar } from "react-native";
import { Appbar, Button } from "react-native-paper";
import Icon from "react-native-vector-icons/AntDesign";
import MiniSearch from 'minisearch'
import Axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SearchBar } from "react-native-elements";


export default function Header(props) {
  const [open, setOpen] = useState(false)
	const [altCountry, setAltCountry] = useState([])
  const [searchedCountry, setSearchedCountry] = useState('')
  const [country, setCountry] = useState("country")
  const [countryIso, setCountryIso] = useState("")
  const [countries, setCountries] = useState([])
  
  const miniSearch = new MiniSearch({
    fields: ['name'],
    storeFields: ['name', 'iso2', 'slug', 'code'],
    searchOptions: {
        boost: { name: 2 },
        fuzzy: 0.2,
        prefix: true
      }
})

miniSearch.addAll(countries)

const onFlagClick = (code, name) => {
  setCountry(name)
  setCountryIso(code)
  setOpen(false)
  Axios.get(`https://bellefu.com/api/location/info/set/country/${code}`)
  .then((data) => {
      props.countryChange(data.data.location_info.country_slug)
      AsyncStorage.setItem('countrySlug', data.data.location_info.country_slug)
      AsyncStorage.setItem('countryIso', data.data.location_info.country_iso2)
      AsyncStorage.setItem('countryName', data.data.location_info.country_name)
  });
}

useEffect(() => {
  if(searchedCountry.length === 0){
      setAltCountry([])
  } else {
      
  let results = miniSearch.search(searchedCountry)
  setAltCountry(results)
      
  }
}, [searchedCountry])

const onChange = (e) => {
  setSearchedCountry(e)
}

const fetchCountries = () => {
  Axios.get('https://bellefu.com/api/country/list')
  .then((data) => {
      setCountries(data.data.countries)
    })
}

const getCountry = async () => {
  let countryName = await AsyncStorage.getItem("countryName")
  let countryIso = await AsyncStorage.getItem("countryIso")
  
  if(countryName !== undefined && countryName !== null){
    await setCountryIso(countryIso)
    await setCountry(countryName)
  } else {
    let res = await Axios.get('https://bellefu.com/api/location/info')
    setCountry(res.data.location_info.country_name)
    setCountryIso(res.data.location_info.country_iso2)
    AsyncStorage.setItem('countrySlug', res.data.location_info.country_slug)
    AsyncStorage.setItem('countryIso', res.data.location_info.country_iso2)
    AsyncStorage.setItem('countryName', res.data.location_info.country_name)
  }
}

useEffect(() => {
getCountry()
fetchCountries()
}, [])
  return (
    <View>
      <Appbar.Header style={styles.bg}>
        <View style={{ marginLeft: 20 }}>
          <Button style={{borderColor: 'white'}} onPress={() => setOpen(true)} color="#ffa500" mode="outlined">
            <Text style={styles.text}>{country}</Text>
          </Button>
        </View>
        <View style={{ flex: 1, marginLeft: 20, flexDirection: "row-reverse" }}>
          {!props.home && (
            <TouchableOpacity
              onPress={() => props.navigation.navigate("Filter", {find: props.find, country: props.country, token: props.token, countryIso:countryIso})}
            >
              <Icon name="filter" size={35} color="white" />
            </TouchableOpacity>
          )}
          <View style={{ marginRight: 20 }}>
            <Button color="#ffa500" mode="outlined" style={styles.btn}>
              <Text style={styles.text}>EN</Text>
            </Button>
          </View>
        </View>
      </Appbar.Header>
      <Modal
        animationType="fade"
        transparent={true}
        visible={open}
        onRequestClose={() => setOpen(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={[styles.modalText]}>Select Country</Text>
            <SearchBar
              inputStyle={{ backgroundColor: "#d4d3cf", fontSize: 15 }}
              inputContainerStyle={{backgroundColor: '#d4d3cf', borderRadius: 50, width: 250, height: 35,}}
              blurOnSubmit={true}
              containerStyle={{backgroundColor: 'transparent', borderTopColor: 'transparent', borderBottomColor: 'transparent'}}
              placeholder="Search Country"
              onClear={() => setSearchedCountry("")}
              onChangeText={onChange}
              value={searchedCountry}
            />
            {altCountry.length > 0 ? (
									<ScrollView style={{flex: 1}}>
										{altCountry.map((data, index) => (
                      <TouchableOpacity onPress={() => onFlagClick(data.iso2, data.name)} key={index} style={{marginTop: 10}}>
                        <Text style={{fontSize: 13.5, textAlign: 'left'}}>
                          {data.name}
                        </Text>
                      </TouchableOpacity>
					 					))}
									</ScrollView>
								) : (
									<ScrollView style={{flex: 1}}>
										{countries && countries.map((data, index) => (
											<TouchableOpacity onPress={() => onFlagClick(data.iso2, data.name)} key={index} style={{marginTop: 10}}>
                      <Text style={{fontSize: 13.5, textAlign: 'left'}}>
                        {data.name}
                      </Text>
                    </TouchableOpacity>
					 					))}
									</ScrollView>
								)
							}
            <TouchableHighlight
              style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
              onPress={() => {
                setOpen(false);
              }}
            >
              <Text style={styles.textStyle}>Close</Text>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: {
    backgroundColor: "#76ba1b",
  },
  btn: {
    backgroundColor: "#ffa500",
  },
  text: {
    fontSize: 10,
    color: "white",
    fontWeight: "700",
  },
  centeredView: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    width: 320,
    height: 500,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "left",
    fontSize: 15,
    fontWeight: "700"
  }
});
