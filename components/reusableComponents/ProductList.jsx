import React from 'react';
import {View, Text, StyleSheet, Image, ImageBackground, TouchableOpacity} from 'react-native';
import {Card, Paragraph, Button, Portal, Modal} from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Fontisto from 'react-native-vector-icons/Fontisto';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Icon from 'react-native-vector-icons/AntDesign';
import NumberFormat from 'react-number-format';
import {Linking} from 'react-native';
import ContactModal from '../reusableComponents/ContactModal';
import Fav from './Fav';

const ProductList = React.memo(props => {
    //FOR CONTACT MODAL
    const [visible, setVisible] = React.useState(false);
    const [convert, setConvert] = React.useState(false);
    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);

    const shareToWhatsAppWithContact = (text, phoneNumber) => {
        Linking.openURL(`whatsapp://send?text=${text}&phone=${phoneNumber}`);
    };

    const openPhone = number => {
        Linking.openURL(`tel:${number}`);
    };

    const chatAuth = () => {
        if (props.token === undefined || props.token === null) {
            props.navigation.navigate('Login');
        } else {
            props.navigation.navigate('Chat', {title: props.item.title, username: props.item.user.username});
        }
    };

    return (
        <View>
            {/* CARD FOR PRODUCT LISTING START HERE */}
            <Card style={{marginBottom: 5, borderRadius: 0, marginHorizontal: 8}}>
                <View style={styles.img}>
                    <TouchableOpacity
                        onPress={() => props.navigation.navigate('Detail', {item: props.item, token: props.token})}>
                        <ImageBackground
                            resizeMode="cover"
                            style={{height: 110, width: 150, minHeight: 100}}
                            source={{
                                uri: `https://bellefu.com/images/products/${props.item.slug}/${props.item.images[0]}`
                            }}>
                                <View>
                            <View
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 5,
                                    right: 0,
                                    bottom: 0,
                                    justifyContent: 'flex-start',
                                    alignItems: 'flex-start'
                                }}>
                                {props.item.plan === 'urgent' ? (
                                    <Text
                                        style={{
                                            color: '#ffffff',
                                            backgroundColor: 'red',
                                            padding: 5,
                                            borderRadius: 10,
                                            fontSize: 11,
                                            fontWeight: 'bold'
                                        }}>
                                        {props.item.plan}
                                    </Text>
                                ) : null}
                                {props.item.plan === 'highlighted' ? (
                                    <Text
                                        style={{
                                            color: '#ffffff',
                                            backgroundColor: '#76ba1b',
                                            padding: 5,
                                            borderRadius: 10,
                                            fontSize: 11,
                                            fontWeight: 'bold'
                                        }}>
                                        {props.item.plan}
                                    </Text>
                                ) : null}
                                {props.item.plan === 'featured' ? (
                                    <Text
                                        style={{
                                            color: '#ffffff',
                                            backgroundColor: '#ffa500',
                                            padding: 5,
                                            fontSize: 11,
                                            borderRadius: 10,
                                            fontWeight: 'bold'
                                        }}>
                                        {props.item.plan}
                                    </Text>
                                ) : null}

                                
                            </View>
                            <View
                                style={{
                                    position: 'absolute',
                                    top: 60,
                                    left: 5,
                                    right: 0,
                                    bottom: 0,
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    {props.item.inStock === false ? (
                                    <Text
                                        style={{
                                            color: '#ffffff',
                                            backgroundColor: '#000000',
                                            padding: 5,
                                            fontSize: 11,
                                            fontWeight: 'bold'
                                        }}>
                                        OUT OF STOCK
                                    </Text>
                                ) : null}
                                </View>
                            </View>
                        </ImageBackground>
                    </TouchableOpacity>
                    <View style={styles.writUp}>
                        <Paragraph style={styles.title} ellipsizeMode="tail" numberOfLines={2}>
                            {props.item.title}
                        </Paragraph>
                        <View
                            style={{
                                flexDirection: 'row',
                                marginTop: 4,
                                alignItems: 'center'
                            }}>
                            <View style={{marginLeft: 20, marginRight: 10}}>
                                <SimpleLineIcons name="location-pin" size={12} color="#666968" />
                            </View>
                            <Paragraph style={{fontSize: 10.5, maxWidth: 160}}>
                                <Text style={{color: '#666968'}} ellipsizeMode="tail" numberOfLines={1}>
                                    {props.item.admin1 && props.item.admin1.substring(0, 20)}...
                                </Text>
                            </Paragraph>
                        </View>
                        <View style={[styles.icons, {alignItems: 'center', marginTop: 7}]}>
                            <Paragraph style={styles.price}>
                                {!convert ? (
                                    <NumberFormat
                                        value={props.item.price}
                                        displayType={'text'}
                                        thousandSeparator={true}
                                        prefix={props.item.currency_symbol.toString()}
                                        renderText={formattedValue => (
                                            <Text style={{color: '#76ba1b', fontWeight: '900'}}>{formattedValue}</Text>
                                        )} // <--- Don't forget this!
                                    />
                                ) : (
                                    <NumberFormat
                                        value={props.item.alt_price_info.alt_price}
                                        displayType={'text'}
                                        thousandSeparator={true}
                                        prefix={props.item.alt_price_info.alt_symbol.toString()}
                                        renderText={formattedValue => (
                                            <Text style={{color: '#76ba1b', fontWeight: '900'}}>{formattedValue}</Text>
                                        )} // <--- Don't forget this!
                                    />
                                )}
                            </Paragraph>
                            {props.item.alt_price_info && (
                                <TouchableOpacity onPress={() => setConvert(!convert)}>
                                    <View style={{marginLeft: 10}}>
                                        <AntDesign name="swap" size={30} color="#ffa500" />
                                    </View>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </View>
                <View style={styles.contact}>
                    <View style={{paddingLeft: 10}}>
                        <Button
                            onPress={() => chatAuth()}
                            mode="outlined"
                            style={{width: 140, borderColor: '#76ba1b', borderWidth: 1.5}}>
                            <Fontisto name="hipchat" size={13} color="#76BA1A" />
                            <Text style={{color: '#76BA1A', fontSize: 12, paddingLeft: 60}}>Chat</Text>
                        </Button>
                    </View>
                    <View style={{paddingLeft: 10}}>
                        <Button
                            mode="outlined"
                            style={{width: 140, borderColor: '#ffa500', borderWidth: 1.5}}
                            onPress={showModal}>
                            <Fontisto name="phone" size={13} color="#ffa500" />
                            <Text style={{color: '#ffa500', fontSize: 12}}>contact</Text>
                        </Button>
                    </View>
                    <View style={{marginLeft: 10, alignSelf: 'center'}}>
                        <Fav {...props} />
                    </View>
                </View>
            </Card>
            {/* MODAL TO SHOW CONACT DETAILS */}
            <ContactModal
                visible={visible}
                hideModal={hideModal}
                phone={props.item.phone}
                shareToWhatsAppWithContact={shareToWhatsAppWithContact}
                openPhone={openPhone}
            />
        </View>
    );
});
export default ProductList;

const styles = StyleSheet.create({
    my_card: {
        marginTop: 29
    },
    img: {
        flexDirection: 'row',
        padding: 10
    },
    title: {
        fontSize: 12,
        paddingLeft: 20,
        fontWeight: '600',
        marginTop: -10,
        width: 150
    },
    price: {
        fontSize: 16,
        paddingLeft: 15
    },
    icons: {
        flexDirection: 'row',
        marginTop: -8
    },
    like: {
        paddingLeft: 100,
        paddingTop: 5,
        color: '#ffa500'
    },
    contact: {
        paddingBottom: 10,
        flexDirection: 'row',
        marginTop: 5
    },
    writUp: {
        flexDirection: 'column',
        paddingVertical: 10
    }
});
