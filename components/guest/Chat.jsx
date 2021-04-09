import React, {useState} from 'react';
import {WebView} from 'react-native-webview';

export default function Chat(props) {
    const [username, setUsername] = useState(props.route.params.username);
    const [title, setTitle] = useState(props.route.params.title);
    let msg = props.route.params.message ? props.route.params.message : `Hello, i saw your post ${title}`;
    let encodedMsg = encodeURI(msg);

    return <WebView source={{uri: `https://bellefu.com/messenger?recipient=${username}&msg=${encodedMsg}`}} />;
}
