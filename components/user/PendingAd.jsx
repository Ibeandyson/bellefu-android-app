import React, {useState, useEffect} from 'react';
import {View, Text, Image, ScrollView, StyleSheet} from 'react-native';
import {Appbar, Card, Paragraph, Divider} from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {FlatList} from 'react-native-gesture-handler';
import {useSelector} from 'react-redux';
// import Moment from 'react-moment';
import axios from 'axios';
import Preloader from '../guest/Preloader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity } from 'react-native';
import AdTableItem from './AdTableItem';

export default function PenddingAd(props) {
    const [ad, setAd] = useState([]);
    const [products, setProducts] = useState([]);
    const [nextPageUrl, setNextPageUrl] = useState('');
    const [status, setStatus] = useState(false);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState('')

    const onAdDelete = (slug) => {
		setAd((ads) =>
      	ads.filter((ad) => ad.slug !== slug)
    );
    }

    const nextData = () => {
        setLoading(false);
        if (nextPageUrl === null) {
            return;
        }else{
        axios
            .get(nextPageUrl, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                }
            })
            .then(res => {
                setProducts(res.data.products);
                setNextPageUrl(res.data.products.next_page_url);
                setAd(ad.concat(...res.data.products.data));
            });
        }
    };

    let url = "https://bellefu.com/api/user/product/pending";
    const loadAd = async () => {
        let tokenn = await AsyncStorage.getItem('user')
        await setToken(tokenn)
        axios
            .get(url, {
                headers: {
                    Authorization: `Bearer ${tokenn}`,
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                }
            })
            .then(res => {
                setProducts(res.data.products);
                setAd(res.data.products.data);
                setLoading(false);
                setNextPageUrl(res.data.products.next_page_url);
                if (res.data.products.data.length < 1) {
                    setStatus(true);
                }
            })
            .catch(error => {
                setLoading(false);
                setAd([]);
            });
    }
    useEffect(() => {
        loadAd()
    }, []);

    return (
        <View>
           
                <View>
                    {loading ? (
                        <Preloader />
                    ) : status ? (
                        <View style={{marginTop: 50, flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{fontSize: 20}}>No Item</Text>
                        </View>
                    ) : (
                        <FlatList
                            data={ad}
                            keyExtractor={item => item.slug}
                            onEndReached={nextData}
                            onEndReachedThreshold={1}
                            renderItem={({item, index}) => (
                                <AdTableItem styles={styles} item={item} onAdDelete={onAdDelete} token={token} key={item.slug}  {...props}/>
                            )}
                        />
                    )}
                </View>
           
        </View>
    );
}

const styles = StyleSheet.create({
    my_card: {
        marginTop: 29
    },
    img: {
        padding: 10,
        flexDirection: 'row'
    },
    title: {
        fontSize: 12,
        paddingLeft: 20,
        fontWeight: '700',
        marginTop: -10,
        width: 170
    },
    price: {
        fontSize: 15,
        paddingLeft: 20
    },
    icons: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    like: {
        paddingLeft: 100,
        paddingTop: 5,
        color: '#ffa500'
    },
    convert: {
        paddingLeft: 15,
        paddingTop: 5
    },
    divider: {
        paddingLeft: 25,
        paddingTop: 15
    },
    writUp: {
        flexDirection: 'column',
        paddingVertical: 10
    }
});
