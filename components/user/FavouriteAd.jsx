import React, {useState, useEffect} from 'react';
import {View, Text, Image, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import {Card, Paragraph, Divider} from 'react-native-paper';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {FlatList} from 'react-native-gesture-handler';
import {useSelector} from 'react-redux';
// import Moment from 'react-moment';
import axios from 'axios';
import Preloader from '../guest/Preloader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FavouriteAdItem from './FavouriteAdItem';

export default function FavouriteAd(props) {
    const [ad, setAd] = useState([]);
    const [products, setProducts] = useState([]);
    const [nextPageUrl, setNextPageUrl] = useState('');
    const [status, setStatus] = useState(false);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState('');

    const nextData = () => {
        setLoading(false);
        if (nextPageUrl === null) {
            return;
        } else {
            axios
                .get(nextPageUrl, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                        Accept: 'application/json'
                    }
                })
                .then(res => {
                    setProducts(res.data.favourites);
                    setNextPageUrl(res.data.favourites.next_page_url);
                    setAd(ad.concat(...res.data.favourites.data));
                });
        }
    };

    const onAdDelete = slug => {
        setAd(ads => ads.filter(ad => ad.slug !== slug));
    };

    let url = 'https://bellefu.com/api/user/product/favourite/list';
    const loadAd = async () => {
        let tokenn = await AsyncStorage.getItem('user');
        await setToken(tokenn);
        axios
            .get(`${url}`, {
                headers: {
                    Authorization: `Bearer ${tokenn}`,
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                }
            })
            .then(res => {
                setProducts(res.data.favourites);
                setAd(res.data.favourites.data);
                setLoading(false);
                setNextPageUrl(res.data.favourites.next_page_url);
                if (res.data.favourites.data.length < 1) {
                    setStatus('No Favourite Ad');
                    setStatus(true);
                }
            })
            .catch(error => {
                setStatus('No Favourite Ad');
                setLoading(false);
                setAd([]);
            });
    };
    useEffect(() => {
        loadAd();
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
                            <FavouriteAdItem
                                styles={styles}
                                item={item}
                                onAdDelete={onAdDelete}
                                token={token}
                                key={item.slug}
                                {...props}
                            />
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
    icons: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
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

    like: {
        paddingLeft: 20,
        paddingTop: 7,
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
