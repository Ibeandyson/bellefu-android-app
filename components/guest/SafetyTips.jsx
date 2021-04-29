import React from 'react';
import {WebView} from 'react-native-webview';

export default function SafetyTips(props) {
    return <WebView source={{uri: `https://bellefu.com/safety_tips`}} />;
}
