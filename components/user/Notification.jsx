import React, {useState, useEffect} from 'react';
import {View, FlatList, ActivityIndicator, Text} from 'react-native';
import NotificationList from './NotificationList';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Preloader from "../guest/Preloader"
import axios from 'axios'

export default function Ntification(props) {
    const [status, setStatus] = useState(false);
    const [nextPageUrl, setNextPageUrl] = useState([]);
    const [notificationData, setNotificatoinData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loading1, setLoading1] = useState(false);
    const [token, setToken] = useState();

    const nextData = () => {
        if (nextPageUrl === null) {
            return;
        } else {
            setLoading1(true);
            Axios.get(nextPageUrl, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                }
            }).then(res => {
                setLoading1(false);
                setNextPageUrl(res.data.notifications.next_page_url);
                setNotificatoinData(notificationData.concat(...res.data.notifications.data));
            });
        }
    };

    let url = 'https://bellefu.com/api/user/notification/list';
    const loadNotification = async () => {
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
                setLoading(false);
                setNotificatoinData(res.data.notifications.data);
                setNextPageUrl(res.data.notifications.next_page_url);
                if (res.data.notifications.data.length < 1) {
                    setStatus(true);
                }
            })
            .catch(error => {
                setLoading(false);
                setNotificatoinData([]);
                setNextPageUrl([]);
            });
    };
    useEffect(() => {
        loadNotification();
    }, []);

    const _renderFooter = () => {
        if (!loading1 && notificationData.length < 1)
            return (
                <View
                    style={{
                        height: 200
                    }}>
                    <Text style={{textAlign: 'center', color: 'gray'}}>No available ad for this country</Text>
                </View>
            );
        if (!loading1)
            return (
                <View
                    style={{
                        height: 200
                    }}
                />
            );

        return (
            <View
                style={{
                    height: 400,
                    justifyContent: 'flex-start',
                    alignItems: 'center'
                }}>
                <ActivityIndicator color="#76BA1A" animating size="large" />
            </View>
        );
    };

    return (
        <View>
            {loading ? (
                <Preloader />
            ) : status  ? (
                <View style={{marginTop: 50, flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 20}}>No Notification</Text>
                </View>
            ) : (
                <FlatList
                    // refreshControl={
                    //     <RefreshControl progressBackgroundColor="#76BA1A" refreshing={refreshing} onRefresh={onRefresh} />
                    // }
                    data={notificationData}
                    onEndReached={nextData}
                    initialNumToRender={15}
                    keyExtractor={item => item.id}
                    onEndReachedThreshold={0.5}
                    renderItem={({item, index}) => (
                        <NotificationList token={token} {...props} item={item} key={item.id} />
                    )}
                    ListFooterComponent={_renderFooter}
                />
            )}
        </View>
    );
}
