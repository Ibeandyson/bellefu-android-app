import Axios from "axios";
import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  Text,
  Dimensions,
  SafeAreaView, 
  ActivityIndicator
} from "react-native";
import Bottom from "../navigations/BottomNav";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import Header from "../navigations/Header";
import ProductList from "../reusableComponents/ProductList";
import Search from "../reusableComponents/Search";
import Preloader from "./Preloader";

const SearchResult = (props) => {
  const [loading, setLoading] = useState(true);
  const [loading1, setLoading1] = useState(true);
  const [productsData, setProductsData] = useState([]);
  const [products, setProducts] = useState([]);
  const [nextPageUrl, setNextPageUrl] = useState("");
  const [token, setToken] = useState("");
  const [country, setCountry] = useState(props.route.params.country ? `country=${props.route.params.country}` : '')

	let lga = props.route.params.lga ? `&lga=${props.route.params.lga}` : '';
	let state = props.route.params.state ? `&state=${props.route.params.state}` : '';
	let subcategory = props.route.params.subcategory ? `&subcategory=${props.route.params.subcategory}` : '';
	let category = props.route.params.category ? `&category=${props.route.params.category}` : '';
	let maxPrice = props.route.params.maxPrice ? `&max_price=${props.route.params.maxPrice}` : '';
  let minPrice = props.route.params.minPrice ? `&min_price=${props.route.params.minPrice}` : '';
  let find = props.route.params.find ? `&find=${props.route.params.find}` : '';


  const load = async () => {
    setLoading(true);
		Axios
			.get(`https://bellefu.com/api/product/list?${country}${lga}${state}${subcategory}${category}${maxPrice}${minPrice}${find}`, {
				headers: {
					Authorization: props.route.params.token !== undefined ? `Bearer ${props.route.params.token}` : 'hfh',
					"Content-Type": "application/json",
					Accept: "application/json"
				}
			})
			.then((res) => {
        setLoading(false);
        setLoading1(false)
				setProducts(res.data.products)
        setProductsData(res.data.products.data);
        setNextPageUrl(res.data.products.next_page_url)
				setError("");
			})
			.catch((error) => {
				setLoading(false);
				
			});
  }

  const nextData = () => {
    if (nextPageUrl === null) {
      return;
    } else {
      setLoading1(true)
      Axios.get(nextPageUrl, {
        headers: {
          Authorization: props.route.params.token !== undefined ? `Bearer ${props.route.params.token}` : 'hfh',
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }).then((res) => {
        setLoading1(false)
        setProducts(res.data.products);
        setNextPageUrl(res.data.products.next_page_url);
        setProductsData(productsData.concat(...res.data.products.data));
       
      });
    }
  };

  const countryChange = (country) => {
    setCountry(`country=${country}`)
  }

  useEffect(() => {
    load()
  }, [props.route.params.find, country, props.route.params.category, props.route.params.subcategory, props.route.params.lga, props.route.params.state, props.route.params.minPrice, props.route.params.maxPrice])

  const _renderFooter = () => {
    if (!loading1) return (
      <View
        style={{
          height: 200,
        }}
      />
    )

    return (
      <View
        style={{
          height: 250,
          justifyContent: 'flex-start',
          alignItems: 'center'
        }}
      >
        <ActivityIndicator color="#76BA1A" animating size="large" />
      </View>
    );
  };
  return (
    <View>
      <Header countryChange={countryChange} token={props.route.params.token} country={props.route.params.country} find={props.route.params.find} {...props} />
      <View>
      {loading && (
        <View style={{ height: Dimensions.get('window').height}}>
          <Preloader />
        </View>
      )}
      </View>
      
      <View>
      {!loading && productsData.length < 1 && (
        <View style={{height: Dimensions.get('window').height, justifyContent: 'center', alignItems: 'center'}}>
          <Text>No Ad</Text>
        </View>
      )}
      
        <View style={{minHeight: Dimensions.get('window').height}}>
          
          <FlatList
              data={productsData}
              onEndReached={nextData}
              keyExtractor={(item) => item.slug}
              onEndReachedThreshold={0.5}
              ListHeaderComponent={<View>
                                    <Text style={{color: 'gray', fontSize: 14, paddingHorizontal: 10, paddingVertical: 10}}>
                                      {props.route.params.find || props.route.params.subcategory}
                                    </Text>
                                  </View>}
              renderItem={({ item, index }) => (
                  <ProductList
                  token={props.route.params.token}
                  item={item}
                  key={item.slug}
                  {...props}
                  />
              )}
              ListFooterComponent={_renderFooter}
            />
        </View>
      </View>
      <ScrollView>
    </ScrollView>
    </View>
  );
};

export default SearchResult;
