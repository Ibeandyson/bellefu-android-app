import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  RefreshControl,
  ScrollView,
  ActivityIndicator,
  Text,
  FlatList
} from "react-native";
import Header from "../navigations/Header";
import Bottom from "../navigations/BottomNav";
import ProductList from "../reusableComponents/ProductList";
import LandingPageContet from "./LandingPageContet"
import Axios from "axios";
import Preloader from "./Preloader";
import AsyncStorage from "@react-native-async-storage/async-storage";
const wait = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};

export default function Landing(props) {
  const [loading, setLoading] = useState(true);
  const [loading1, setLoading1] = useState(true);
  const [productsData, setProductsData] = useState([]);
  const [products, setProducts] = useState([]);
  const [nextPageUrl, setNextPageUrl] = useState("");
  const [token, setToken] = useState("");
  const [country, setCountry] = useState('')





    

  const callApi = async (countryy, token) => {
    Axios.get(
      `https://bellefu.com/api/product/list?country=${country.length > 0 ? country : countryy}`,
      {
        headers: {
          Authorization: token !== undefined && token !== null ? `Bearer ${token}` : "hfh",
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    )
      .then((res) => {
        setLoading(false);
        setLoading1(false)
        setProducts(res.data.products);
        setProductsData(res.data.products.data);
        setNextPageUrl(res.data.products.next_page_url);
      })
      .catch((error) => {
        console.log(error)
      });
  }

  const loadData = async () => {
    setLoading1(true)
    let tokenn = await AsyncStorage.getItem("user");
    await setToken(tokenn);
    let countryy = await AsyncStorage.getItem("countrySlug");
      
    if(countryy !== undefined && countryy !== null) {
        setCountry(countryy)
        await callApi(countryy, tokenn)
      } else {
        let res = await Axios.get('https://bellefu.com/api/location/info')
        AsyncStorage.setItem('countrySlug', res.data.location_info.country_slug).then(() => {
          AsyncStorage.setItem('countryIso', res.data.location_info.country_iso2).then(() => {
            setCountry(res.location_info.country_slug)
            callApi(res.data.location_info.country_slug, tokenn)
          }) 
        })
      }
    }

   

  const nextData = () => {
    if (nextPageUrl === null) {
      return;
    } else {
      setLoading1(true)
      Axios.get(nextPageUrl, {
        headers: {
          Authorization: token !== undefined ? `Bearer ${token}` : "hfh",
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

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    wait(1000).then(() => {
      setRefreshing(false);
      loadData();
    });
  }, []);

  

  useEffect(() => {
    setNextPageUrl(null)
    loadData();
  }, [country]);

  const _renderFooter = () => {
    if (!loading1 && productsData.length < 1) return (
      <View
        style={{
          height: 200,
        }}
      >
        <Text style={{textAlign: "center", color: "gray"}}>No available ad for this country</Text>
      </View>
    )
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
          height: 400,
          justifyContent: 'flex-start',
          alignItems: 'center'
        }}
      >
        <ActivityIndicator color="#76BA1A" animating size="large" />
      </View>
    );
  };

  const countryChange = (country) => {
    setProductsData([])
    setCountry(country)
  }

  return (
    <View>
    <Header countryChange={countryChange} home={true} {...props} />
    {loading && (
        <View style={{height: '' + 100 + '%'}}>
            <Preloader />
        </View>
    )}
        <FlatList
         refreshControl={
          <RefreshControl
            progressBackgroundColor="#76BA1A"
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
            data={productsData}
            onEndReached={nextData}
            initialNumToRender={15}
            keyExtractor={item => item.slug}
            onEndReachedThreshold={0.5}
            ListHeaderComponent={<LandingPageContet token={token} country={country} {...props}/>}
            renderItem={({item, index}) => (
                <ProductList token={token} {...props} item={item} key={item.slug} />
            )}
            ListFooterComponent={_renderFooter}
        />
    <ScrollView>
    </ScrollView>
    <Bottom home={true} {...props} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "whitesmoke",
  },
});




