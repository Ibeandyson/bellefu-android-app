import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Image, Text, ScrollView, Alert} from 'react-native';
import {TextInput} from 'react-native-paper';
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
    const [phoneCode, setPhoneCode] = useState({
        verification_code: ''
    });
    const [seconds, setSeconds] = useState(0);
    const [number, setNumber] = useState('');
    const [showNumber, setShowNumber] = useState(false);
    const [call, setcall] = useState(false);
    const [error, setError] = useState('');
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
        });
    };

    // ======= loading useer profile=====
    let url = 'https://bellefu.com/api/user/profile/details';

    const loadUserProfile = async () => {
        setLoading(true);
        let tokenn = await AsyncStorage.getItem('user');
        await setToken(tokenn);

        Axios.get(url, {
            headers: {
                Authorization: `Bearer ${tokenn}`,
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
                } else if (res.data.user.kyc_verification.status !== 'pending') {
                    setPendingKYC(true);
                }
            })
            .catch(e => {
                setError('Something Went Wrong');
            });
    };

    useEffect(() => {
        loadUserProfile();
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
    const onCodeRequest = async () => {
        let tokenn = await AsyncStorage.getItem('user');
        setRequestLoading(true);
        Axios.get('https://bellefu.com/api/user/verification/request/phone_otp/sms', {
            headers: {
                Authorization: `Bearer ${tokenn}`,
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

    const {verification_code} = phoneCode;
    const onPhoneChange = value => {
        setPhoneCode({
            ...phoneCode,
            verification_code: value
        });
    };

    //======= FUNCTION TO SUBMIT CODE====

    const onSubmitCode = async () => {
        let tokenn = await AsyncStorage.getItem('user');
        setLoading(true);
        console.log('the code', phoneCode);
        Axios.post('https://bellefu.com/api/user/verification/confirm/phone_otp', phoneCode, {
            headers: {
                Authorization: `Bearer ${tokenn}`,
                'Content-Type': 'application/json',
                Accept: 'application/json'
            }
        })
            .then(res => {
                console.log(res);
                setLoading(false);
                setShowNumber(true);
                setHeaderTitle('ID Verification');
                setComponentToShow('id');
                setError('');
                if (res) {
                    Alert.alert('Phone Verification Successful');
                }
            })
            .catch(error => {
                console.log('errdkdk', error);
                setLoading(false);
                setError(error);
                Alert.alert('something went wrong, try again');
            });
    };

    const setOTPrequeastAlertFalse = () => {
        setShowNumber(false);
    };

    // =======FUNCTION TO MAKE A CALL FOR CODE =========
    const onCallRequest = async () => {
        let tokenn = await AsyncStorage.getItem('user');
        setRequestLoading(true);
        Axios.get('https://bellefu.com/api/user/verification/request/phone_otp/call', {
            headers: {
                Authorization: `Bearer ${tokenn}`,
                'Content-Type': 'application/json',
                Accept: 'application/json'
            }
        })
            .then(res => {
                console.log(res);
                setShowNumber(true);
                setRequestLoading(false);
                setShowCodeInput(true);
                setcall(true);
                setSeconds(180);
            })
            .catch(error => {
                console.log('this is error: ', error);
                setRequestLoading(false);
                setError('Something went wrong');
            });
    };

    // ========== FUNCTION TO SUBMIT ID =======
    const onIdSubmit = async () => {
        let tokenn = await AsyncStorage.getItem('user');
        setLoading(true);
        const payload = new FormData();
        imagesUri.forEach((image, index) => {
            payload.append(`id_images[${index}]`, {
                uri: Platform.OS === 'ios' ? `file:///${image.path}` : image.path,
                type: 'image/jpeg',
                name: 'image.jpg'
            });
        });

        Axios({
            method: 'POST',
            url: 'https://bellefu.com/api/user/verification/request/id',
            data: payload,

            headers: {
                Authorization: `Bearer ${tokenn}`,
                'Content-Type': `multipart/form-data; boundary=${payload._boundary}`,
                Accept: 'application/json'
            }
        })
            .then(res => {
                setLoading(false);
                setPendingID(true);
                setError('');
                if (res) {
                    Alert.alert('Successful', `ID Verification have been received but pending`);
                }
            })
            .catch(error => {
                Alert.alert('something went wrong, try again');
                console.log(error.response.data);
                setLoading(false);
                setError(error.response.data.message);
            });
    };

    // ========= FUNCTION TO REQUEST FOR KYC
    const onKycSubmit = async e => {
        let tokenn = await AsyncStorage.getItem('user');
        setLoading(true);
        Axios.get('https://bellefu.com/api/user/verification/request/kyc', {
            headers: {
                Authorization: `Bearer ${tokenn}`,
                'Content-Type': 'application/json',
                Accept: 'application/json'
            }
        })
            .then(res => {
                setLoading(false);
                setHeaderTitle('KYC Verification');
                setComponentToShow('kyc');
                setPendingKYC(true);
                setError('');
                if (res) {
                    Alert.alert('Successful', 'Your KYC request has been received.');
                }
            })
            .catch(error => {
                Alert.alert('something went wrong, try again');
                console.log(error);
                setLoading(false);
                setError(error.response.data.message);
            });
    };

    return (
        <View>
            {loading ? <Preloader /> : null}

            {error.length > 0 ? Alert.alert(`${error}`) : null}

            {showNumber === true ? (
                Alert.alert(
                    'Successfully',
                    `an action have been made to this number: ${number}`,
                    [
                        {
                            text: 'Close',
                            onPress: () => {
                                setOTPrequeastAlertFalse();
                            }
                        }
                    ],
                    {
                        cancelable: true,
                        onDismiss: () => {
                            setOTPrequeastAlertFalse();
                        }
                    }
                )
            ) : null}

            {/* =========OTP START===== */}
            {componentToShow === 'phone' ? (
                <View>
                    {showCodeInput ? (
                        <View>
                            <View style={{padding: 20}}>
                                <TextInput
                                    mode="outlined"
                                    name="code"
                                    label="code"
                                    value={verification_code}
                                    onChangeText={value => onPhoneChange(value)}
                                />
                            </View>

                            <View style={{padding: 20, marginTop: 50}}>
                                <Button onPress={onSubmitCode} mode="contained" style={{backgroundColor: '#ffa500'}}>
                                    <Text style={{color: 'white'}}>Submit Code</Text>
                                </Button>
                            </View>

                            <View style={{marginTop: 50}}>
                                {requestLoading && <ActivityIndicator animating={true} color="rgba(49, 180, 4, 1)" />}
                            </View>

                            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50}}>
                                <Text style={{fontSize: 20, fontWeight: 'bold', justifyContent: 'center'}}>
                                    Take aother request action in
                                </Text>
                                {seconds > 0 ? (
                                    <Text
                                        style={{
                                            fontSize: 20,
                                            justifyContent: 'center',
                                            fontWeight: 'bold',
                                            textAlign: 'center',
                                            width: 35,
                                            height: 35,
                                            borderRadius: 2,
                                            color: 'black'
                                        }}>
                                        {seconds}
                                    </Text>
                                ) : null}
                            </View>
                            {seconds === 0 ? (
                                <View>
                                    {call === true ? (
                                        <View style={{padding: 20, marginTop: 50}}>
                                            <Button
                                                onPress={onCallRequest}
                                                mode="contained"
                                                style={{backgroundColor: '#ffa500'}}>
                                                <Text style={{color: 'white'}}>Call Again</Text>
                                            </Button>
                                        </View>
                                    ) : (
                                        <View style={{padding: 20, marginTop: 50}}>
                                            <Button
                                                onPress={onCodeRequest}
                                                mode="contained"
                                                style={{backgroundColor: '#ffa500'}}>
                                                <Text style={{color: 'white'}}>Resend Code</Text>
                                            </Button>
                                        </View>
                                    )}
                                </View>
                            ) : null}
                        </View>
                    ) : null}

                    {!showCodeInput && (
                        <View>
                            {!requestLoading && (
                                <View>
                                    <View style={{padding: 20, marginTop: 50}}>
                                        <Button
                                            onPress={onCodeRequest}
                                            mode="contained"
                                            style={{backgroundColor: '#ffa500'}}>
                                            <Text style={{color: 'white'}}>Request Code SMS</Text>
                                        </Button>
                                    </View>
                                </View>
                            )}

                            <View style={{justifyContent: 'center', alignItems: 'center'}}>
                                <Text style={{fontWeight: 'bold', fontSize: 20}}>OR</Text>
                            </View>
                            {/* maKE CALL FOR CODE */}
                            {!requestLoading && (
                                <View>
                                    <View style={{padding: 20, marginTop: 1}}>
                                        <Button
                                            onPress={onCallRequest}
                                            mode="contained"
                                            style={{backgroundColor: '#ffa500'}}>
                                            <Text style={{color: 'white'}}>Request CALL CODE</Text>
                                        </Button>
                                    </View>
                                </View>
                            )}

                            <View style={{marginTop: 50}}>
                                {requestLoading && <ActivityIndicator animating={true} color="rgba(49, 180, 4, 1)" />}
                            </View>
                        </View>
                    )}
                </View>
            ) : null}
            {/* =========OTP END===== */}

            {/* =========ID START===== */}
            {componentToShow === 'id' ? (
                <View>
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
                                <Image
                                    source={{uri: images.path}}
                                    style={{width: 100, height: 100, marginHorizontal: 5}}
                                />
                            ))}
                        </View>
                    </ScrollView>
                    <View style={{padding: 20, marginTop: 50}}>
                        <Text style={{marginBottom: 10}}>*Upload ID images</Text>
                        <Button onPress={pickImage} mode="contained" style={{backgroundColor: '#ffa500'}}>
                            <AntDesign name="cloudupload" size={23} color="white" />
                            <Text style={{color: 'white'}}>UPLOAD ID</Text>
                        </Button>
                    </View>

                    <View style={{padding: 20, marginTop: 50}}>
                        <Button onPress={onIdSubmit} mode="contained" style={{backgroundColor: '#ffa500'}}>
                            <Text style={{color: 'white'}}>SUBMIT</Text>
                        </Button>
                    </View>
                </View>
            ) : null}
            {/* =========ID END===== */}
            {pendingID === true ? (
                <View style={{flex: 1, justifyContent: 'center', marginTop: 100, padding: 10}}>
                    <Text style={{fontWeight: 'bold', fontSize: 20}}>
                        Your ID verification is pending. If accepted, the last step is KYC request.
                    </Text>
                </View>
            ) : null}

            {/* =========KYC START===== */}
            {componentToShow === 'kyc' ? (
                <View>
                    <View>
                        <View style={{padding: 20, marginTop: 10}}>
                            <Text style={{marginBottom: 10}}>*Click the button below to request for KYC</Text>
                            <Button onPress={onKycSubmit} mode="contained" style={{backgroundColor: '#ffa500'}}>
                                <Octicons name="git-pull-request" size={23} color="white" />
                                <Text style={{color: 'white'}}>REQUEST</Text>
                            </Button>
                        </View>
                    </View>

                    {pendingKYC === true ? (
                        <View style={{flex: 1, justifyContent: 'center', marginTop: 100, padding: 10}}>
                            <Text style={{fontWeight: 'bold', fontSize: 20}}>YOU ARE FULLY VERIFIED</Text>
                        </View>
                    ) : (
                        <View style={{flex: 1, justifyContent: 'center', marginTop: 100, padding: 10}}>
                            <Text style={{fontWeight: 'bold', fontSize: 20}}>
                                Your KYC verification is pending. If accepted, you are fully verified.
                            </Text>
                        </View>
                    )}
                </View>
            ) : null}

            {/* =========KYC END===== */}
        </View>
    );
}

const styles = StyleSheet.create({});
