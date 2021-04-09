import React, { useEffect, useState } from 'react';
import BottomNav from '../navigations/BottomNav';
import Header from '../navigations/Header';
import Preloader from './Preloader';
import {
    View,
    ScrollView,
    Text,
    Dimensions,
    SafeAreaView 
  } from "react-native";
import Axios from 'axios';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Divider } from 'react-native-paper';


const SubcategoryListing = (props) => {
    const [subcategories, setSubcategories] = useState([])
    const [loading, setLoading] = useState(true)


    const loadSubCategory = () => {
		Axios
			.get(`https://bellefu.com/api/subcategory/listfor/${props.route.params.category_slug}`, {
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json"
				}
			})
			.then((res) => {
                setLoading(false)
				setSubcategories(res.data.subcategories);
			})
			.catch((error) => {
			});
    };


    useEffect(() => {
        loadSubCategory()
    }, [])
    return (
        <View>
            {loading && (
                <View style={{ height: Dimensions.get('window').height}}>
                    <Preloader />
                </View>
            )}
                <ScrollView showsVerticalScrollIndicator={false}>
                    {subcategories.map((data, index) => (
                        <View key={data.slug} style={{borderBottom: '1px solid #bab8b8', paddingHorizontal: 20, paddingTop: 15}}>
                            <TouchableOpacity onPress={() => props.navigation.navigate('Search', {subcategory: data.slug, category: props.route.params.category_slug, country: props.route.params.country, token: props.route.params.token})}>
                                <View style={{justifyContent: 'flex-start'}}>
                                    <Text>{data.name}</Text>
                                    <Text style={{color: 'gray', fontSize: 12, paddingTop: 5}}>{data.products_count}{" "}{data.products_count > 1 ? "ads" : "ad"}</Text>
                                </View>
                                <Divider style={{ backgroundColor: 'gray', marginTop: 10 }} />
                            </TouchableOpacity>
                        </View>
                    ))}
                </ScrollView>
        </View>
    )
}

export default SubcategoryListing