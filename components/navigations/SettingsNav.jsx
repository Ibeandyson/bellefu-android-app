import React from 'react'
import {View, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {List, Divider, Card, Appbar} from 'react-native-paper';
import BottomNav from './BottomNav';


export default function SettingsNav(props) {
    return (
        <View>
        <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{marginBottom: 200}}>
                {/* USER */}
                <TouchableOpacity onPress={() => props.navigation.navigate('Update')}>
                    <Card style={{borderRadius: 0}}>
                        <List.Item
                            title="Update Profile"
                            left={props => <List.Icon {...props} icon="account-box-multiple" color="#ffa500" />}
                        />
                    </Card>
                </TouchableOpacity>

                <Divider />
                {/* ADS */}
                <TouchableOpacity onPress={() => props.navigation.navigate('Password')}>
                    <Card style={{borderRadius: 0, marginTop: 20}}>
                        <List.Item
                            title="Reset Password"
                            left={props => <List.Icon {...props} icon="pencil-lock-outline" color="#ffa500" />}
                        />
                    </Card>
                </TouchableOpacity>

               
                
            </View>
        </ScrollView>
    </View>
    )
}
