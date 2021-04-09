import React, {useState, useEffect} from 'react';
import {WebView} from 'react-native-webview';

export default function Messenger(props) {
  
    return <WebView source={{uri: "https://bellefu.com/messenger"}} />;
}
