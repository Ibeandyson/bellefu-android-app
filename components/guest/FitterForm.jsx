import AsyncStorage from "@react-native-async-storage/async-storage";
import Axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Picker,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Appbar, Button, TextInput } from "react-native-paper";

export default function FillterForm(props) {
  const [categoryData, setCategoryData] = useState([])
  const [subcategoryData, setSubcategoryData] = useState([])
  const [states, setStates] = useState([])
  
  const [data, setData] = useState({
    search: props.route.params.find,
    category: '',
    subcategory: '',
    state: '',
    min_price: '',
    max_price: ''
  })

  const loadStates = async() => {
		Axios.get(`https://bellefu.com/api/${props.route.params.countryIso}/state/list`)
		.then((res) => {
      setStates(res.data.states)
		}).catch((e) => {
		})
  }
  
  const loadCategory = () => {
	
    Axios.get("https://bellefu.com/api/category/list", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    })
    .then((res) => {
      setCategoryData(res.data.categories)
    })
    .catch((error) => {
    });
   }

   const loadSubCategory = () => {
    Axios.get(`https://bellefu.com/api/subcategory/listfor/${data.category}`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    })
    .then((res) => {
      setSubcategoryData(res.data.subcategories)
    })
    .catch((error) => {
    });
 }
 
 const handleSubmit = () => {
  props.navigation.navigate('Search', {find: data.search, country: props.route.params.countryIso, token: props.token, subcategory: data.subcategory, category: data.category, state: data.state, min_price: data.min_price, max_price: data.max_price})
 
}

 useEffect(() => {
   loadSubCategory()
 }, [data.category])

 useEffect(() => {
   loadStates()
   loadCategory()
 }, [])

  return (
    <View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <TextInput
              style={styles.input}
              mode="outlined"
              label="Search"
              value={data.search}
              clear
              onChangeText={(val) => setData({...data, search: val})}
            />
          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderColor: "gray",
              borderRadius: 4,
              height: 60,
              opacity: 4,
              marginVertical: 30,
            }}
          >
            <Picker
              selectedValue={data.category}
              borderStyle="solid"
              onValueChange={(itemValue, itemIndex) =>
                setData({...data, category: itemValue})
              }
            >
              <Picker.Item color="gray" label="select category" />
              {categoryData && categoryData.map((data) => (
                <Picker.Item key={data.slug} label={data.name} value={data.slug} />
              ))}
            </Picker>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderColor: "gray",
              borderRadius: 4,
              height: 60,
              opacity: 4,
              marginBottom: 30,
            }}
          >
            <Picker
              selectedValue={data.subcategory}
              onValueChange={(itemValue, itemIndex) =>
                setData({...data, subcategory: itemValue})
              }
            >
              <Picker.Item color="gray" label="select subcategory" />
              {subcategoryData.map((data) => (
                <Picker.Item key={data.slug} label={data.name} value={data.slug} />
              ))}
            </Picker>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderColor: "gray",
              borderRadius: 4,
              height: 60,
              opacity: 4,
              marginBottom: 30,
            }}
          >
            <Picker
              selectedValue={data.state}
              onValueChange={(itemValue, itemIndex) =>
                setData({...data, state: itemValue})
              }
            >
              <Picker.Item color="gray" label="select state" />
              {states.map((data) => (
                <Picker.Item key={data.slug} label={data.name} value={data.slug} />
              ))}
            </Picker>
          </TouchableOpacity>

          <TextInput keyboardType="number-pad" mode="outlined" label="min price" onChangeText={(val) => setData({...data, min_price: Number(val)})} />
          <TextInput
            keyboardType="number-pad"
            style={styles.input}
            mode="outlined"
            label="max price"
            clear
            onChangeText={(val) => setData({...data, max_price: Number(val)})}
          />
          {!props.home && (
            <Button
              onPress={() => handleSubmit()}
              style={styles.btn}
              mode="contained"
            >
              <Text style={{ color: "white", alignSelf: "center" }}>
                {" "}
                Appy Filter
              </Text>
            </Button>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    padding: 10,
  },
  input: {
    marginTop: 20,
  },
  inputselect: {
    marginTop: 20,
  },
  btn: {
    marginTop: 40,
    color: "white",
    backgroundColor: "#ffa500",
  },
});
