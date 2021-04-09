import React, {useState, useEffect} from 'react';
import {View, ScrollView, Text} from 'react-native';
import {Card, Avatar, List} from 'react-native-paper';
import axios from 'axios';
import Preloader from '../guest/Preloader';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Dashboard(props) {
    const [profile, setProfile] = useState({});
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState('');

    let url = 'https://bellefu.com/api/user/profile/details';

    const loadProfile = async () => {
        let tokenn = await AsyncStorage.getItem('user');
        await setToken(tokenn);

        axios
            .get(url, {
                headers: {
                    Authorization: `Bearer ${tokenn}`,
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                }
            })
            .then(res => {
                setProfile(res.data.user);
                setLoading(false);
            })
            .catch(e => {});
    };


    useEffect(() => {
        loadProfile();
    }, []);

    return (
        <View>
            <ScrollView showsVerticalScrollIndicator={false}>
                {loading ? (
                    <Preloader />
                ) : (
                    <View style={{marginBottom: 50}}>
                        {/* AVATER AND FULL NAME */}
                        <Card style={{marginVertical: 3, marginHorizontal: 10}}>
                            <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 15}}>
                                <Avatar.Image
                                    size={200}
                                    source={
                                        profile.avatar !== null ? (
                                            {uri: `https://bellefu.com/images/users/${profile.avatar}`}
                                        ) : (
                                            require('../../images/avater_placeholder.jpg')
                                        )
                                    }
                                />
                            </View>
                            <View
                                style={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginTop: 15,
                                    marginBottom: 15
                                }}>
                                <Text style={{fontSize: 16, fontWeight: 'bold', opacity: 0.8, paddingHorizontal: 5}}>
                                    {profile.profile &&
                                        profile.profile.first_name + ' ' + profile.profile.last_name}{' '}
                                </Text>
                                <Text
                                    style={{
                                        fontSize: 13,
                                        marginTop: 5,
                                        fontWeight: 'bold',
                                        opacity: 0.6,
                                        paddingHorizontal: 5
                                    }}>
                                    {profile.bio}
                                </Text>
                            </View>
                        </Card>
                        <View
                            style={{
                                flexWrap: 'wrap',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                maxWidth: 500
                            }}>
                            <Card style={{width: 119.5, margin: 3, height: 85}}>
                                <View style={{justifyContent: 'center', alignItems: 'center', height: 85}}>
                                    <Text style={{fontSize: 12}}>Ads</Text>
                                    <Text style={{fontSize: 15, opacity: 0.5}}>{profile.products_count}</Text>
                                </View>
                            </Card>
                            <Card style={{width: 119.5, margin: 3, height: 85}}>
                                <View style={{justifyContent: 'center', alignItems: 'center', height: 85}}>
                                    <Text style={{fontSize: 12}}>Favourite</Text>
                                    <Text style={{fontSize: 15, opacity: 0.5}}>{profile.favourite_products_count}</Text>
                                </View>
                            </Card>
                            <Card style={{width: 119.5, margin: 3, height: 85}}>
                                <View style={{justifyContent: 'center', alignItems: 'center', height: 85}}>
                                    <Text style={{fontSize: 12}}>Pending </Text>
                                    <Text style={{fontSize: 15, opacity: 0.5}}>{profile.pending_products_count}</Text>
                                </View>
                            </Card>
                            <Card style={{width: 119.5, margin: 3, height: 85}}>
                                <View style={{justifyContent: 'center', alignItems: 'center', height: 85}}>
                                    <Text style={{fontSize: 12}}>Expired </Text>
                                    <Text style={{fontSize: 15, opacity: 0.5}}>{profile.expired_products_count}</Text>
                                </View>
                            </Card>
                            <Card style={{width: 119.5, margin: 3, height: 85}}>
                                <View style={{justifyContent: 'center', alignItems: 'center', height: 85}}>
                                    <Text style={{fontSize: 12}}>Hiden</Text>
                                    <Text style={{fontSize: 15, opacity: 0.5}}>{profile.hidden_products_count}</Text>
                                </View>
                            </Card>
                            <Card style={{width: 119.5, margin: 3, height: 85}}>
                                <View style={{justifyContent: 'center', alignItems: 'center', height: 85}}>
                                    <Text style={{fontSize: 12}}>Wallet</Text>
                                    <Text style={{fontSize: 15, opacity: 0.5}}>
                                        {profile.profile && profile.profile.wallet_balance}
                                    </Text>
                                </View>
                            </Card>
                        </View>

                        {/* PROFILE */}
                        <Card style={{marginHorizontal: 10, marginTop: 5}}>
                            <View style={{marginTop: 15}}>
                                <List.Section>
                                    <List.Subheader style={{fontSize: 14, fontWeight: 'bold'}}>UserName</List.Subheader>
                                    <View style={{marginTop: -15}}>
                                        <List.Item titleStyle={{fontSize: 13}} title={profile.username} />
                                    </View>

                                    <List.Subheader style={{fontSize: 14, fontWeight: 'bold', marginTop: -10}}>
                                        Email
                                    </List.Subheader>
                                    <View style={{marginTop: -15}}>
                                        <List.Item titleStyle={{fontSize: 13}} title={profile.email} />
                                    </View>

                                    <List.Subheader style={{fontSize: 14, fontWeight: 'bold', marginTop: -10}}>
                                        Gender
                                    </List.Subheader>
                                    <View style={{marginTop: -15}}>
                                        <List.Item
                                            titleStyle={{fontSize: 13}}
                                            title={
                                                profile.profile && profile.profile.gender === 'M' ? 'Male' : 'Female'
                                            }
                                        />
                                    </View>

                                    <List.Subheader style={{fontSize: 14, fontWeight: 'bold', marginTop: -10}}>
                                        Phone
                                    </List.Subheader>
                                    <View style={{marginTop: -15}}>
                                        <List.Item titleStyle={{fontSize: 13}} title={profile.phone} />
                                    </View>

                                    <List.Subheader style={{fontSize: 14, fontWeight: 'bold', marginTop: -10}}>
                                        Country
                                    </List.Subheader>
                                    <View style={{marginTop: -15}}>
                                        <List.Item
                                            titleStyle={{fontSize: 13}}
                                            title={profile.country && profile.country.name}
                                        />
                                    </View>
                                </List.Section>
                            </View>
                        </Card>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}
