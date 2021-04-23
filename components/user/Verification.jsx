import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Image, Text, ScrollView, Alert} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import CodeInput from 'react-native-code-input';
import {Button} from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Octicons from 'react-native-vector-icons/Octicons';
import ImagePicker from 'react-native-image-crop-picker';
import Preloader from '../guest/Preloader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Axios from 'axios';

export default function Verification(props) {
    const [imagesUri, setImagesUri] = useState([]);
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(false);
    const [phoneCode, setPhoneCode] = useState([]);
    const [seconds, setSeconds] = useState(0);
    const [number, setNumber] = useState('');
    const [showNumber, setShowNumber] = useState(false);
    const [error, setError] = useState('');
    const [idImage, setIdImage] = useState([]);
    const [headerTitle, setHeaderTitle] = useState('Verify Account');
    const [componentToShow, setComponentToShow] = useState('');
    const [requestLoading, setRequestLoading] = useState(false);
    const [showCodeInput, setShowCodeInput] = useState(false);
    const [pendingID, setPendingID] = useState(false);
    const [pendingKYC, setPendingKYC] = useState(false);

    //image picker
    const pickImage = () => {
        ImagePicker.openPicker({
            mediaType: 'photo',
            multiple: true
        }).then(images => {
            setImagesUri(images);
            setImageData(images);
        });
    };

    // ======= loading useer profile=====
    let url = '/api/user/profile/details';

    useEffect(() => {
        Axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
                Accept: 'application/json'
            }
        })
            .then(res => {
                setLoading(false);
                console.log(res.data.user);
                setNumber(res.data.user.phone);
                if (
                    res.data.user.phone_verification === null ||
                    res.data.user.phone_verification.status === 'pending'
                ) {
                    setHeaderTitle('Phone Verification');
                    setComponentToShow('phone');
                } else if (
                    res.data.user.id_verification === null ||
                    res.data.user.phone_verification.status !== 'completed'
                ) {
                    setHeaderTitle('ID Verification');
                    setComponentToShow('id');
                } else if (res.data.user.phone_verification.status !== 'pending') {
                    setPendingID(true);
                } else if (
                    res.data.user.kyc_verification === null ||
                    res.data.user.kyc_verification.status === 'pending'
                ) {
                    setHeaderTitle('KYC Verification');
                    setComponentToShow('kyc');
                }
            })
            .catch(e => {
                setError('Something Went Wrong');
            });
    }, []);

    // =======setting timer for otp requstion btn
    useEffect(() => {
        let myInterval = setInterval(() => {
            if (seconds > 0) {
                setSeconds(seconds - 1);
            }
            if (seconds === 0) {
                clearInterval(myInterval);
            }
        }, 1000);
        return () => {
            clearInterval(myInterval);
        };
    });

    // =======FUNCTION TO REQUST FOR CODE =========
    const onCodeRequest = a => {
        setRequestLoading(true);
        Axios.get('/api/user/verification/request/phone_otp', {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
                Accept: 'application/json'
            }
        })
            .then(res => {
                console.log(res);
                setShowNumber(true);
                setRequestLoading(false);
                setShowCodeInput(true);
                setSeconds(80);
            })
            .catch(error => {
                console.log('this is error: ', error);
                setRequestLoading(false);
                setError('Something went wrong');
            });
    };

    const onChangHandlerImage = e => {
        setIdImage(e);
    };

    const onPhoneChange = e => {
        console.log(e);
        setPhoneCode(e);
    };

    //======= FUNCTION TO SUBMIT CODE====
    useEffect(
        () => {
            if (phoneCode.length === 6) {
                setLoading(true);
                Axios.post(
                    '/api/user/verification/confirm/phone_otp',
                    {verification_code: Number(phoneCode)},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                            Accept: 'application/json'
                        }
                    }
                )
                    .then(res => {
                        console.log(res);
                        setLoading(false);
                        setShowNumber(false);
                        setHeaderTitle('ID Verification');
                        setComponentToShow('id');
                        setError('');
                    })
                    .catch(error => {
                        console.log(error);
                        setLoading(false);
                        setError(error.response.data.message);
                    });
            }
        },
        [phoneCode.length]
    );

    useEffect(() => {
        async function getToken() {
            let tokenn = await AsyncStorage.getItem('user');
            await setToken(tokenn);
        }
        getToken();
    }, []);
    return (
        <View>
            {loading && (
                <View style={{height: '100vh', width: '100%'}}>
                    <Preloader />
                </View>
            )}

            {error.length > 0 && Alert.alert(`${error}`)}
            {showNumber && Alert.alert(`OTP has been sent to ${number}`)}

            {/* =========OTP START===== */}
            {showCodeInput && (
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
                    onChange={onPhoneChange}
                />
            )}

            {!showCodeInput && (
                <View>
                    {!requestLoading && (
                        <View>
                            <View style={{padding: 20, marginTop: 50}}>
                                <Button onPress={onCodeRequest} mode="contained" style={{backgroundColor: '#ffa500'}}>
                                    <AntDesign name="cloudupload" size={23} color="white" />
                                    <Text style={{color: 'white'}}>Request Code</Text>
                                </Button>
                            </View>
                        </View>
                    )}

                    <View>{requestLoading && <ActivityIndicator animating={true} color="rgba(49, 180, 4, 1)" />}</View>
                </View>
            )}

            {/* =========OTP END===== */}

            {/* =========ID START===== */}
            <ScrollView horizontal={true}>
                <View
                    style={{
                        justifyContent: 'center',
                        flexDirection: 'row',
                        marginTop: 10,
                        alignSelf: 'center',
                        widht: 20
                    }}>
                    {imagesUri.map(images => (
                        <Image source={{uri: images.path}} style={{width: 100, height: 100, marginHorizontal: 5}} />
                    ))}
                </View>
            </ScrollView>
            <View style={{padding: 20, marginTop: 50}}>
                <Text style={{marginBottom: 10}}>*Upload ID images</Text>
                <Button onPress={pickImage} mode="contained" style={{backgroundColor: '#ffa500'}}>
                    <AntDesign name="cloudupload" size={23} color="white" />
                    <Text style={{color: 'white'}}>Submit</Text>
                </Button>
            </View>
            {/* =========ID END===== */}

            {/* =========KYC START===== */}
            <View style={{padding: 20, marginTop: 10}}>
                <Text style={{marginBottom: 10}}>*Click the button below to request for KYC</Text>
                <Button mode="contained" style={{backgroundColor: '#ffa500'}}>
                    <Octicons name="git-pull-request" size={23} color="white" />
                    <Text style={{color: 'white'}}>REQUEST</Text>
                </Button>
            </View>
            {/* =========KYC END===== */}
        </View>
    );
}

const styles = StyleSheet.create({});
