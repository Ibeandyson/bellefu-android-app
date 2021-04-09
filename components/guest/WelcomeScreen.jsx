import React, {useEffect, useState} from 'react';
import NavigationBar from 'react-native-navbar-color';
import {
    View,
    Platform,
    ImageBackground,
    Text,
    TouchableOpacity,
    PermissionsAndroid,
    BackHandler,
    Alert
} from 'react-native';
import {Button} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Axios from 'axios';

const WelcomeScreen = props => {
    const setCountry = async () => {
        let country = await AsyncStorage.getItem('countrySlug');
        if (country === null || country === undefined) {
            let res = await Axios.get('https://bellefu.com/api/location/info');
            await AsyncStorage.setItem('countrySlug', res.data.location_info.country_slug);
            await AsyncStorage.setItem('countryIso', res.data.location_info.country_iso2);
            await AsyncStorage.setItem('countryName', res.data.location_info.country_name);
        }
    };

    // const ipAccess = () => {
    //     Alert.alert(
    //         'Getting Ip Address',
    //         'This App is accessing your IP Address, to get your current country location.',
    //         [
    //             {
    //                 text: 'Ok'
    //             },
    //             {
    //                 text: 'No',
    //                 onPress: () => BackHandler.exitApp()
    //             }
    //         ],
    //         {cancelable: false}
    //     );
    // };

    useEffect(() => {
        // ipAccess();

        if (Platform.OS === 'ios') {
            NavigationBar.setColor('#76ba1b');
        }
        setCountry();
    }, []);
    return (
        <View>
            <ImageBackground
                imageStyle={{
                    resizeMode: 'cover'
                }}
                source={require('../../assets/Splash_background.png')}
                style={{
                    backgroundColor: '#76ba1b',
                    width: '100%',
                    height: '100%'
                }}>
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        alignContent: 'center',
                        alignSelf: 'center'
                    }}>
                    <Text
                        style={{
                            width: 200,
                            color: 'white',
                            fontSize: 40,
                            fontWeight: 'bold',
                            paddingHorizontal: 3.5,
                            textShadowColor: '#76ba1b',
                            textShadowOffset: {width: -0.5, height: 1.5},
                            textShadowRadius: 0.5
                        }}>
                        Welcome to Bellefu
                    </Text>
                    <Text
                        style={{
                            color: 'white',
                            fontSize: 22,
                            fontWeight: 'bold',
                            paddingHorizontal: 5,
                            textShadowColor: '#76ba1b',
                            textShadowOffset: {width: -0.5, height: 1},
                            textShadowRadius: 0.005
                        }}>
                        digital agro connect
                    </Text>
                    <View style={{marginTop: 30, justifyContent: 'center', alignItems: 'center'}}>
                        <Button
                            mode="contained"
                            color="white"
                            style={{width: 340, height: 40, borderWidth: 1, backgroundColor: '#76ba1b'}}
                            onPress={() => props.navigation.replace('Login')}>
                            <Text style={{color: 'white', fontSize: 16, fontWeight: '800'}}>LOGIN</Text>
                        </Button>
                        <Text style={{marginTop: 20, fontSize: 20, color: '#ffa500', fontWeight: 'bold'}}>OR</Text>
                        <Button
                            mode="contained"
                            color="white"
                            style={{width: 340, height: 40, borderWidth: 1, backgroundColor: '#ffa500', marginTop: 25}}
                            onPress={() => props.navigation.replace('Signup')}>
                            <Text style={{color: 'white', fontSize: 16, fontWeight: '800'}}>SIGN UP</Text>
                        </Button>
                        <Text style={{marginTop: 20, fontSize: 20, color: '#ffa500', fontWeight: 'bold'}}>OR</Text>
                        <Button
                            mode="contained"
                            color="white"
                            style={{width: 340, height: 40, borderWidth: 1, backgroundColor: 'black', marginTop: 25}}
                            onPress={() => props.navigation.replace('Links')}>
                            <Text style={{color: 'white', fontSize: 16, fontWeight: '800'}}>Legal Links</Text>
                        </Button>
                    </View>
                </View>
                <View style={{marginBottom: 50, flexDirection: 'row-reverse', padding: 30}}>
                    <TouchableOpacity onPress={() => props.navigation.replace('Home')}>
                        <Text style={{color: 'white', fontSize: 20, fontWeight: 'bold'}}>skip</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </View>
    );
};
export default WelcomeScreen;
