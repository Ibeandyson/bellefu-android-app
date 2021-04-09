import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {WebView} from 'react-native-webview';
import {Appbar} from 'react-native-paper';
import Feather from 'react-native-vector-icons/Feather';

export default function LinkTree(props) {
    return (
      <View style={styles.container}>
        <Appbar.Header style={styles.AppBarBg}>
                <View style={{flex: 1, marginLeft: 10}}>
                    <TouchableOpacity onPress={() => props.navigation.navigate('Home')}>
                        <Feather name="x" size={30} color="white" />
                    </TouchableOpacity>
                </View>
            </Appbar.Header>
        <WebView source={{uri: `https://linktr.ee/bellefu`}}/>
            
        </View>
    );
}

const styles = StyleSheet.create({
    AppBarBg: {
        backgroundColor: '#76ba1b'
    },
    container: {
      flex: 1,
    },
});
