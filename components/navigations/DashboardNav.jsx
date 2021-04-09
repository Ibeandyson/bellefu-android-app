import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Platform} from 'react-native';
import {List, Divider, Card, Appbar} from 'react-native-paper';
import requestCameraAndAudioPermission from '../permission/permission';
import BottomNav from './BottomNav';

export default function DashboardNav(props) {
    const [token, setToken] = useState(null);

    const getToken = async () => {
        let token = await AsyncStorage.getItem('user');
        setToken(token);
    };

    const logout = () => {
        if (token === null || token === undefined) {
            props.navigation.navigate('Login');
        } else {
            AsyncStorage.removeItem('user').then(r => {
                setToken(undefined);
            });
        }
    };

    useEffect(() => {
        getToken();
    }, []);

    const startVideo = () => {
        if (token === null || token === undefined) {
            props.navigation.navigate('Login');
        } else {
            if (Platform.OS === 'android') {
                requestCameraAndAudioPermission().then(_ => {
                    props.navigation.navigate('Video', {token});
                });
            }
        }
    };

    return (
        <View>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{marginBottom: 150, height: Dimensions.get('window').height}}>
                    {/* USER */}
                    <TouchableOpacity onPress={() => props.navigation.navigate('Dashboard')}>
                        <Card style={{borderRadius: 0}}>
                            <List.Item
                                title="DashBoard"
                                left={props => <List.Icon {...props} icon="view-dashboard-outline" color="#ffa500" />}
                            />
                        </Card>
                    </TouchableOpacity>

                    <Divider />
                    {/* ADS */}
                    <TouchableOpacity onPress={() => props.navigation.navigate('Ads')}>
                        <Card style={{borderRadius: 0, marginTop: 20}}>
                            <List.Item
                                title="Ads"
                                left={props => <List.Icon {...props} icon="gift-outline" color="#ffa500" />}
                            />
                        </Card>
                    </TouchableOpacity>

                    <Divider />
                    <TouchableOpacity onPress={() => props.navigation.navigate('Favourite')}>
                        <Card style={{borderRadius: 0}}>
                            <List.Item
                                title="Favourite Ads"
                                left={props => <List.Icon {...props} icon="heart-outline" color="#ffa500" />}
                            />
                        </Card>
                    </TouchableOpacity>

                    <Divider />
                    <TouchableOpacity onPress={() => props.navigation.navigate('Pending')}>
                        <Card style={{borderRadius: 0}}>
                            <List.Item
                                title="Pending Ads"
                                left={props => <List.Icon {...props} icon="clock-outline" color="#ffa500" />}
                            />
                        </Card>
                    </TouchableOpacity>
                    <Divider />
                    <TouchableOpacity onPress={() => props.navigation.navigate('Expired')}>
                        <Card style={{borderRadius: 0}}>
                            <List.Item
                                title="Expired Ads"
                                left={props => <List.Icon {...props} icon="calendar-remove-outline" color="#ffa500" />}
                            />
                        </Card>
                    </TouchableOpacity>
                    <Divider />
                    {/* ACCOUNT */}

                    <TouchableOpacity onPress={() => props.navigation.navigate('Notification')}>
                        <Card style={{borderRadius: 0, marginTop: 20}}>
                            <List.Item
                                title="Notification"
                                left={props => <List.Icon {...props} icon="bell-outline" color="#ffa500" />}
                            />
                        </Card>
                    </TouchableOpacity>
                    {/* <Divider />
                    <TouchableOpacity onPress={() => props.navigation.navigate('Verification')}>
                        <Card style={{borderRadius: 0}}>
                            <List.Item
                                title="Verification"
                                left={props => <List.Icon {...props} icon="check-circle-outline" color="#ffa500" />}
                            />
                        </Card>
                    </TouchableOpacity> */}
                    <Divider />
                    <TouchableOpacity onPress={startVideo}>
                        <Card style={{borderRadius: 0}}>
                            <List.Item
                                title="Video Call"
                                left={props => <List.Icon {...props} icon="video-outline" color="#ffa500" />}
                            />
                        </Card>
                    </TouchableOpacity>
                    <Divider />
                    <TouchableOpacity onPress={() => props.navigation.navigate('Settings')}>
                        <Card style={{borderRadius: 0}}>
                            <List.Item
                                title="Settings"
                                left={props => <List.Icon {...props} icon="power-settings" color="#ffa500" />}
                            />
                        </Card>
                    </TouchableOpacity>

                    <Divider />
                    <TouchableOpacity onPress={() => props.navigation.navigate('Links')}>
                        <Card style={{borderRadius: 0}}>
                            <List.Item
                                title="About Bellefu"
                                left={props => <List.Icon {...props} icon="alert-circle-outline" color="#ffa500" />}
                            />
                        </Card>
                    </TouchableOpacity>

                    <Divider />
                    <TouchableOpacity onPress={logout}>
                        <Card style={{borderRadius: 0}}>
                            <List.Item
                                title={token === null || token === undefined ? 'Log In' : 'Log Out'}
                                left={props => <List.Icon {...props} icon="logout-variant" color="#ffa500" />}
                            />
                        </Card>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <BottomNav {...props} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'whitesmoke'
    }
});
