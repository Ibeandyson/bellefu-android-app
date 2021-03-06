import React, {useState, useEffect} from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import {Button, TextInput, RadioButton} from "react-native-paper";
import AntDesign from "react-native-vector-icons/AntDesign";
import ImagePicker from "react-native-image-crop-picker";
import Preloader from "../guest/Preloader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import {Picker} from "@react-native-community/picker";

export default function PostAd(props) {
  const [checked, setChecked] = React.useState("");
  const [imagesUri, setImagesUri] = useState([]);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSucess] = useState([]);
  const [stateData, setStateData] = useState([]);
  const [lgaData, setLgaData] = useState([]);
  const [profile, setProfile] = useState({});

  const [productDetail, setProductDetail] = useState({});
  const [productData, setProductData] = useState({
    title: "",
    price: "",
    phone: "",
    admin1_code: "",
    admin2_code: "",
    category: "",
    subcategory: "",
    plan: checked,
    description: "",
    tags: "",
  });

  const {
    subcategory,
    category,
    admin1_code,
    title,
    admin2_code,
    price,
    description,
    tags,
    address,
  } = productData;

  const onChangeTitle = value => {
    setProductData({
      ...productData,
      title: value,
    });
  };
  const onChangePrice = value => {
    setProductData({
      ...productData,
      price: value,
    });
  };
  // const onChangePhone = value => {
  //     setProductData({
  //         ...productData,
  //         phone: value
  //     });
  // };

  const onChangeState = value => {
    setProductData({
      ...productData,
      admin1_code: value,
    });
  };
  const onChangeLga = value => {
    setProductData({
      ...productData,
      admin2_code: value,
    });
  };
  const onChangeCategory = value => {
    setProductData({
      ...productData,
      category: value,
    });
  };
  const onChangeSubCategory = value => {
    setProductData({
      ...productData,
      subcategory: value,
    });
  };
  const onChangePlan = value => {
    setProductData({
      ...productData,
      plan: value,
    });
  };
  const onChangeTag = value => {
    setProductData({
      ...productData,
      tags: value,
    });
  };
  const onChangeAddress = value => {
    setProductData({
      ...productData,
      address: value,
    });
  };
  const onChangeDescription = value => {
    setProductData({
      ...productData,
      description: value,
    });
  };

  //image picker
  const pickImage = () => {
    ImagePicker.openPicker({
      mediaType: "photo",
      multiple: true,
    }).then(images => {
      setImagesUri(images);
      setImageData(images);
    });
  };

  // ==============CATEGORY LIST STATE =========

  const [categoryData, setCategoryData] = useState([]);
  const loadCategory = () => {
    axios
      .get("https://bellefu.com/api/category/list", {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
      .then(res => {
        setCategoryData(res.data.categories);
      })
      .catch(error => {});
  };

  // ==============SUBCATEGORY LIST STATE =========

  const [subcategoryData, setSubCategoryData] = useState([]);
  useEffect(
    () => {
      const loadSubCategory = async () => {
        await axios
          .get(
            `https://bellefu.com/api/subcategory/listfor/${productData.category}`,
            {
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
            }
          )
          .then(res => {
            setSubCategoryData(res.data.subcategories);
          })
          .catch(error => {});
      };
      loadSubCategory();
    },
    [productData, setSubCategoryData]
  );

  //========= call user profile api to get country_code to fatch state data==========
  let url = "https://bellefu.com/api/user/profile/details";
  const loadProfile = async () => {
    let tokenn = await AsyncStorage.getItem("user");
    await setToken(tokenn);
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${tokenn}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
      .then(res => {
        setProfile(res.data.user);
        setLoading(false);
        let stateUrl = `https://bellefu.com/api/${res.data.user
          .country_code}/state/list`;

        axios.get(stateUrl).then(res => {
          setStateData(res.data.states);
        });
      })
      .catch(e => {});
  };

  //========call lga api ==============
  let lgaUrl = `https://bellefu.com/api/${profile.country_code}/${productData.admin1_code}/lga/list`;

  useEffect(
    () => {
      async function loadLga() {
        await axios.get(lgaUrl).then(res => {
          setLgaData(res.data.lgas);
        });
      }
      loadLga();
    },
    [productData, setLgaData]
  );

  useEffect(
    () => {
      loadProfile();
    },
    [stateData.length]
  );

  const onSubmitHandle = () => {
    setLoading(true);
    const payload = new FormData();
    payload.append("title", productData.title);
    payload.append("price", productData.price);
    // payload.append('phone', productData.phone);
    payload.append("address", productData.address);
    payload.append("category", productData.category);
    payload.append("subcategory", productData.subcategory);
    payload.append("address", productData.address);
    payload.append("plan", checked);
    payload.append("description", productData.description);
    payload.append("admin1_code", productData.admin1_code);
    payload.append("admin2_code", productData.admin2_code);
    imagesUri.forEach((image, index) => {
      payload.append(`product_images[${index}]`, {
        uri: Platform.OS === "ios" ? `file:///${image.path}` : image.path,
        type: "image/jpeg",
        name: "image.jpg",
      });
    });
    axios
      .post("https://bellefu.com/api/user/product/save", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
        },
      })
      .then(res => {
        setProductDetail(res.data.product_details);
        setSucess(res.data);
        Alert.alert(res.data.message);
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
        console.log("post ad", error.response.data.errors);
        if (error.response.data.errors.verification) {
          Alert.alert(`${error.response.data.errors.verification}`);
        } else if (error.response.data.errors.avatar) {
          Alert.alert(`${error.response.data.errors.avatar}`);
        } else {
          Alert.alert(
            "Something went wrong",
            "All fields are required. Kindly check for any empty field and complete it. You must upload the product image"
          );
        }
      });
  };

  console.log(success);
  useEffect(() => {
    async function getToken() {
      let tokenn = await AsyncStorage.getItem("user");
      await setToken(tokenn);
    }
    getToken();
  }, []);
  useEffect(
    () => {
      loadCategory();
      if (success && success.is_upgradable === true) {
        props.navigation.navigate("Payment", {productDetail});
      }
    },
    [success, productDetail]
  );

  return (
    <View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {loading ? (
          <Preloader />
        ) : (
          <View style={styles.container}>
            <TouchableOpacity
              style={{
                borderWidth: 1,
                borderColor: "gray",
                borderRadius: 4,
                height: 60,
                opacity: 4,
                marginBottom: 30,
              }}>
              <Picker
                selectedValue={category}
                borderStyle="solid"
                onValueChange={value => onChangeCategory(value)}>
                <Picker.Item label=">>>Select Category<<<" />
                {categoryData.map(data => (
                  <Picker.Item
                    key={data.slug}
                    label={data.name}
                    value={data.slug}
                  />
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
              }}>
              <Picker
                selectedValue={subcategory}
                onValueChange={value => onChangeSubCategory(value)}>
                <Picker.Item label=">>>Select Subcategory<<<" />
                {subcategoryData.map(data => (
                  <Picker.Item
                    key={data.slug}
                    label={data.name}
                    value={data.slug}
                  />
                ))}
              </Picker>
            </TouchableOpacity>
            <TextInput
              style={{marginBottom: 30}}
              mode="outlined"
              label="Title"
              value={title}
              onChangeText={value => onChangeTitle(value)}
            />
            <TextInput
              style={styles.input}
              mode="outlined"
              label="Location"
              value={address}
              onChangeText={value => onChangeAddress(value)}
            />
            <View style={{marginBottom: 30, marginTop: 30}}>
              <Text>State</Text>
              <TouchableOpacity
                style={{
                  borderWidth: 1,
                  borderColor: "gray",
                  borderRadius: 4,
                  height: 60,
                  opacity: 4,
                }}>
                <Picker
                  selectedValue={admin1_code}
                  borderStyle="solid"
                  onValueChange={value => onChangeState(value)}>
                  <Picker.Item label=">>>select state<<<" />
                  {stateData.map(data => (
                    <Picker.Item
                      key={data.code}
                      label={data.name}
                      value={data.code}
                    />
                  ))}
                </Picker>
              </TouchableOpacity>
            </View>

            <View style={{marginBottom: 5}}>
              <Text>City</Text>
              <TouchableOpacity
                style={{
                  borderWidth: 1,
                  borderColor: "gray",
                  borderRadius: 4,
                  height: 60,
                  opacity: 4,
                }}>
                <Picker
                  selectedValue={admin2_code}
                  borderStyle="solid"
                  onValueChange={value => onChangeLga(value)}>
                  <Picker.Item label=">>>select city<<<" />
                  {lgaData.map(data => (
                    <Picker.Item
                      key={data.code}
                      label={data.name}
                      value={data.code}
                    />
                  ))}
                </Picker>
              </TouchableOpacity>
            </View>

            {/* <TextInput
                            style={styles.input}
                            mode="outlined"
                            label="Phone Number"
                            value={phone}
                            onChangeText={value => onChangePhone(value)}
                        /> */}
            <TextInput
              style={styles.input}
              mode="outlined"
              label="Price"
              value={price}
              onChangeText={value => onChangePrice(value)}
            />
            <TextInput
              style={styles.input}
              mode="outlined"
              label="tag"
              value={tags}
              onChangeText={value => onChangeTag(value)}
            />
            <TextInput
              style={styles.input}
              multiline={true}
              numberOfLines={5}
              mode="outlined"
              label="Description"
              value={description}
              onChangeText={value => onChangeDescription(value)}
            />
            <ScrollView horizontal={true}>
              <View
                style={{
                  justifyContent: "center",
                  flexDirection: "row",
                  marginTop: 10,
                  alignSelf: "center",
                  widht: 20,
                }}>
                {imagesUri.map(images => (
                  <Image
                    source={{uri: images.path}}
                    style={{width: 100, height: 100, marginHorizontal: 5}}
                  />
                ))}
              </View>
            </ScrollView>

            <View style={{padding: 20, marginTop: 20}}>
              <Text style={{marginBottom: 10}}>*Upload the product images</Text>
              <Button
                onPress={pickImage}
                mode="contained"
                style={{backgroundColor: "#ffa500"}}>
                <AntDesign name="cloudupload" size={23} color="white" />
                <Text style={{color: "white"}}>upload image</Text>
              </Button>
            </View>

            <View style={{flexDirection: "row", padding: 10}}>
              <RadioButton
                value="free"
                status={checked === "free" ? "checked" : "unchecked"}
                onPress={() => setChecked("free")}
                color="#76ba1b"
                onChangeText={value => onChangePlan(value)}
              />
              <Text style={{marginTop: 10}}>Free</Text>
            </View>
            <View style={{flexDirection: "row", padding: 10}}>
              <RadioButton
                value="urgent"
                status={checked === "urgent" ? "checked" : "unchecked"}
                onPress={() => setChecked("urgent")}
                color="#76ba1b"
                onChangeText={value => onChangePlan(value)}
              />
              <Text style={{marginTop: 10}}>Urgent</Text>
            </View>
            <View style={{flexDirection: "row", padding: 10}}>
              <RadioButton
                value="featured"
                status={checked === "featured" ? "checked" : "unchecked"}
                onPress={() => setChecked("featured")}
                color="#76ba1b"
                onChangeText={value => onChangePlan(value)}
              />
              <Text style={{marginTop: 10}}>Featured</Text>
            </View>
            <View style={{flexDirection: "row", padding: 10}}>
              <RadioButton
                value="highlighted"
                status={checked === "highlighted" ? "checked" : "unchecked"}
                onPress={() => setChecked("highlighted")}
                color="#76ba1b"
                onChangeText={value => onChangePlan(value)}
              />
              <Text style={{marginTop: 10}}>Highlighted</Text>
            </View>
            <Button
              style={styles.btn}
              mode="contained"
              onPress={onSubmitHandle}
              icon={{source: "filter-plus-outline", color: "#ffa500"}}>
              <Text style={{color: "white"}}> Post</Text>
            </Button>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    padding: 10,
    marginBottom: 200,
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
