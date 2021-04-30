import React, {useState} from 'react';
import {View, Text, Image, TouchableOpacity, Alert} from 'react-native';
import {Card, Paragraph, Divider, ActivityIndicator} from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Moment from 'react-moment';
import Axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AdTableItem = props => {
    const [loadingg, setLoadingg] = useState(false);

    //==========SET PROUCT OUT OF STOCK FUNCTION ======

    const onOutOfStock = () => {
        Alert.alert(
            'Set out of stock',
            `Are you sure you want to set this product to be out of stock?`,
            [
                {
                    text: 'Set out stock',
                    onPress: () => {
                        setOutOfStock();
                    }
                },
                {text: 'CANCEL', onPress: () => null}
            ],
            {
                cancelable: true
            }
        );
    };

    const setOutOfStock = async () => {
        let tokenn = await AsyncStorage.getItem('user');
        Axios.get(`https://bellefu.com/api/user/product/set_out_of_stock/${props.item.slug}`, {
            headers: {
                Authorization: `Bearer ${tokenn}`,
                'Content-Type': 'application/json',
                Accept: 'application/json'
            }
        })
            .then(res => {
                console.log('data', res);
                props.loadAd();
            })
            .catch(error => {
                console.log('err', error);
            });
    };

    //==========SET PROUCT IN STOCK FUNCTION ======

    const onInStock = () => {
        Alert.alert(
            'Set in stock',
            `Are you sure you want to set this product to be in stock?`,
            [
                {
                    text: 'Set in stock',
                    onPress: () => {
                        setInStock();
                    }
                },
                {text: 'CANCEL', onPress: () => null}
            ],
            {
                cancelable: true
            }
        );
    };

    const setInStock = async () => {
        let tokenn = await AsyncStorage.getItem('user');
        Axios.get(`https://bellefu.com/api/user/product/set_in_stock/${props.item.slug}`, {
            headers: {
                Authorization: `Bearer ${tokenn}`,
                'Content-Type': 'application/json',
                Accept: 'application/json'
            }
        })
            .then(res => {
                console.log('data', res);
                props.loadAd();
            })
            .catch(error => {
                console.log('err', error);
            });
    };

    //==========FUNCTION TO DELETE PRODUCT ======
    const onDelete = slug => {
        Alert.alert(
            'DELETE!',
            `Are you sure you want to delete this product?`,
            [{text: 'DELETE', onPress: () => deleteItem(slug)}, {text: 'CANCEL', onPress: () => null}],
            {cancelable: true}
        );
    };

    const deleteItem = slug => {
        setLoadingg(true);
        Axios.get(`https://bellefu.com/api/user/product/delete/${slug}`, {
            headers: {
                Authorization: `Bearer ${props.token}`,
                'Content-Type': 'application/json',
                Accept: 'application/json'
            }
        })
            .then(res => {
                setLoadingg(false);
                props.onAdDelete(slug);
            })
            .catch(e => {
                setLoadingg(false);
            });
    };

    return (
        <Card style={{marginVertical: 5, borderRadius: 0, marginHorizontal: 5}}>
            <View style={props.styles.img}>
                <TouchableOpacity
                    onPress={() => props.navigation.navigate('Detail', {item: props.item, token: props.token})}>
                    <Image
                        resizeMode="contain"
                        style={{height: 110, width: 150}}
                        source={{
                            uri: `https://bellefu.com/images/products/${props.item.slug}/${props.item.images[0]}`
                        }}
                    />
                </TouchableOpacity>
                <View style={props.styles.writUp}>
                    <Paragraph style={props.styles.title} ellipsizeMode="tail" numberOfLines={2}>
                        {props.item.title}
                    </Paragraph>
                    <Divider />
                    <Paragraph style={props.styles.price}>
                        <Text style={{color: '#76ba1b', fontWeight: '900'}}>
                            {props.item.currency_symbol}
                            {props.item.price}
                        </Text>
                    </Paragraph>
                    <Divider />
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Paragraph style={{fontWeight: 'bold', marginLeft: 20, fontSize: 10.5, color: 'gray'}}>
                            Posted:
                        </Paragraph>
                        <Moment
                            style={{fontSize: 10.5, paddingLeft: 5, color: 'gray'}}
                            element={Text}
                            format="MMMM Do, YYYY">
                            {props.item.created_at}
                        </Moment>
                    </View>
                    <Divider />
                    <View style={props.styles.icons}>
                        <View style={props.styles.convert}>
                            <TouchableOpacity
                                onPress={() =>
                                    props.navigation.navigate('Edit', {item: props.item, token: props.token})}>
                                <AntDesign name="edit" size={20} color="green" />
                            </TouchableOpacity>
                        </View>
                        <View style={props.styles.like}>
                            {loadingg ? (
                                <ActivityIndicator color="#76BA1A" animating size="small" />
                            ) : (
                                <AntDesign
                                    onPress={() => onDelete(props.item.slug)}
                                    name="delete"
                                    size={17}
                                    color="red"
                                />
                            )}
                        </View>
                        <View style={{paddingTop: 5, paddingLeft: 50}}>
                            {props.item.inStock === true ? (
                                <TouchableOpacity onPress={() => onOutOfStock()}>
                                    <AntDesign name="closecircleo" size={17} color="red" />
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity onPress={() => onInStock()}>
                                    <AntDesign name="checkcircleo" size={17} color="green" />
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </View>
            </View>
        </Card>
    );
};

export default AdTableItem;
