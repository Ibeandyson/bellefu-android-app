import React, {useState} from 'react';
import {View, StyleSheet, Image, Text} from 'react-native';
import CodeInput from 'react-native-code-input';
import {Appbar, Button} from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Octicons from 'react-native-vector-icons/Octicons';

export default function Verification(props) {
    // let openImagePickerAsync = async () => {
    //     let permissionResult = await ImagePicker.requestCameraRollPermissionsAsync();

    //     if (permissionResult.granted === false) {
    //         alert('Permission to access camera roll is required!');
    //         return;
    //     }

    //     let pickerResult = await ImagePicker.launchImageLibraryAsync();
    //     console.log(pickerResult);
    // };

    // handleChoosePhoto = () => {
    //     const options = {
    //         noData: true
    //     };
    //     ImagePicker.launchImageLibrary(options, response => {
    //         if (response.uri) {
    //             setPhoto({photo: response});
    //         }
    //     });
    // };

    // const onFinishCheckingCode1 = code => {
    //     console.log('finished: ', code);
    // };
    return (
        <View>
          
            <CodeInput
                useRef="codeInputRef2"
                activeColor="rgba(49, 180, 4, 1)"
                inactiveColor="rgba(49, 180, 4, 1.3)"
                autoFocus={true}
                inputPosition="center"
                size={50}
                keyboardType="numeric"
                codeLength={6}
                onFulfill={code => onFinishCheckingCode1(code)}
                containerStyle={{marginTop: 30}}
                codeInputStyle={{borderWidth: 1.5}}
            />
            <Image source={{uri: 'https://i.imgur.com/TkIrScD.png'}} />

            <View style={{padding: 20, marginTop: 200, }}>
                <Text style={{marginBottom:10}}>*Upload a Valid Government issued ID</Text>
                <Button
                    
                    mode="contained"
                    style={{backgroundColor: '#ffa500'}}>
                   <AntDesign name="cloudupload" size={23} color="white" />
                    <Text style={{color: 'white'}}>upload image</Text>
                </Button>
            </View>

            <View style={{padding: 20, marginTop: 10, }}>
                <Text style={{marginBottom:10}}>*Click the button below to request for KYC</Text>
                <Button
                    mode="contained"
                    style={{backgroundColor: '#ffa500'}}>
                   <Octicons name="git-pull-request" size={23} color="white" />
                    <Text style={{color: 'white'}}>REQUEST</Text>
                </Button>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({});
