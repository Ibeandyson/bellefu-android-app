import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, Linking} from 'react-native';
import CategoryListing from './CategoryListing';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Search from '../reusableComponents/Search';

const LandingPageContet = React.memo(props => {
    return (
        <View style={{marginBottom: 10}}>
            <View style={{backgroundColor: '#76ba1b', height: 250}}>
                <View style={{padding: 10, marginTop: 50}}>
                    <View
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginBottom: 10
                        }}>
                        <Text style={{color: 'white', fontSize: 18, fontWeight: 'bold', textAlign: 'center'}}>
                            Bellefu - digital agro connect...
                        </Text>
                    </View>
                    <Search {...props} country={props.country} token={props.token} />
                    <TouchableOpacity onPress={() => Linking.openURL('https://www.facebook.com/groups/bellefu')}>
                        <View
                            style={{
                                marginTop: 30,
                                justifyContent: 'center',
                                alignItems: 'center',
                                flexDirection: 'row'
                            }}>
                            <FontAwesome name="external-link" color="white" size={20} />
                            <TouchableOpacity
                                style={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    alignContent: 'center',
                                    alignSelf: 'center'
                                }}
                                onPress={() => props.navigation.replace('Links')}>
                                <Text style={{fontSize: 15, color: '#ffffff', fontWeight: 'bold'}}>ABOUT BELLEFU</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{marginTop: 10}}>
                <CategoryListing token={props.token} country={props.country} {...props} />
            </View>
        </View>
    );
});
export default LandingPageContet;
