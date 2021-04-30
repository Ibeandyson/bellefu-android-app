import React, {useState} from 'react';
import {View, Text, Alert} from 'react-native';
import {Button, TextInput, ActivityIndicator} from 'react-native-paper';
import axios from 'axios';

const ForgotPassword = ({navigation}) => {
    const [requestData, setRequestData] = useState({
        email: ''
    });
    const [otpData, setOtpData] = useState({
        code: ''
    });
    const [passwordData, setPasswordData] = useState({
        password: '',
        c_password: ''
    });
    const [componentToShow, setComponentToShow] = useState(false);
    const [componentToShow_2, setComponentToShow_2] = useState(false);
    const [loading, setLoading] = useState(false);

    // ==========================ALL EMAIL SUBMITION FUNCTIONS ==============
    const ResendMail = () => {
        setComponentToShow(false);
    };
    const {email} = requestData;
    const onEmailChange = value => {
        setRequestData({
            ...requestData,
            email: value
        });
    };
    const onEmailSubmit = () => {
        const payload = new FormData();
        payload.append('email', requestData.email);
        setLoading(true);
        axios
            .post('https://bellefu.com/api/auth/password_reset_request/app', payload, {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                }
            })
            .then(res => {
                setComponentToShow(true);
                setLoading(false);
                Alert.alert('Successful', `an email has been sent to the submitted email, check mail to get otp code`);
            })
            .catch(error => {
                console.log(error);
                setLoading(false);
                Alert.alert('Error', `something went wrong`);
            });
    };

    // ==========================ALL OTP CHECK FUNCTIONS ==============
    const {code} = otpData;
    const onCodeChange = value => {
        setOtpData({
            ...otpData,
            code: value
        });
    };
    const onOtpSubmit = () => {
        setLoading(true);
        const payload = new FormData();
        payload.append('code', otpData.code);
        payload.append('email', requestData.email);
        axios
            .post('https://bellefu.com/api/auth/validate_password_reset_code', payload)
            .then(res => {
                setComponentToShow_2(true);
                setLoading(false);
            })
            .catch(e => {
                Alert.alert('Error', `something went wrong`);
                console.log(e);
                setLoading(false);
            });
    };

    // ==========================ALL OTP SUBMIT NEW PASSWORD ==============
    const {password, c_password} = passwordData;
    const onPasswordChange = value => {
        setPasswordData({
            ...passwordData,
            password: value
        });
    };
    const onC_PasswordChange = value => {
        setPasswordData({
            ...passwordData,
            c_password: value
        });
    };
    const onPasswordSubmit = () => {
        setLoading(true);
        const payload = new FormData();
        payload.append('code', otpData.code);
        payload.append('email', requestData.email);
        payload.append('password', passwordData.password);
        payload.append('c_password', passwordData.c_password);
        axios
            .post('https://bellefu.com/api/auth/password_reset', payload)
            .then(res => {
                setLoading(false);
                Alert.alert(
                    'Successful',
                    `Your password have reset completed. You can now login with the new password.`,
                    [
                        {
                            text: 'Login',
                            onPress: () => {
                                navigation.navigate('Login');
                            }
                        }
                    ],
                    {
                        cancelable: true
                    }
                );
                setComponentToShow(false);
                setComponentToShow_2(false);
                setOtpData({
                    code: ''
                });
                setPasswordData({
                    password: '',
                    c_password: ''
                });
                setRequestData({
                    email: ''
                });
            })
            .catch(e => {
                Alert.alert('Error', `something went wrong`);
                console.log(e);
                setLoading(false);
            });
    };

    return (
        <View style={{flex: 1, padding: 20}}>
            {loading && (
                <View>
                    <ActivityIndicator animating={true} color="rgba(49, 180, 4, 1)" />
                </View>
            )}
            {componentToShow === false ? (
                <View>
                    <View style={{marginBottom: 30}}>
                        <Text>Enter Your Email</Text>
                        <TextInput
                            style={{marginBottom: 30}}
                            value={email}
                            mode="outlined"
                            name="email"
                            label="email"
                            onChangeText={value => onEmailChange(value)}
                        />
                    </View>
                    <Button
                        style={{
                            marginTop: 5,
                            color: 'white',
                            backgroundColor: '#ffa500'
                        }}
                        onPress={onEmailSubmit}
                        mode="contained"
                        icon={{source: 'filter-plus-outline', color: '#ffa500'}}>
                        <Text style={{color: 'white'}}>Send</Text>
                    </Button>
                </View>
            ) : (
                <View>
                    {componentToShow_2 === false ? (
                        <View>
                            <View style={{marginBottom: 30}}>
                                <Text>Enter OTP Code</Text>
                                <TextInput
                                    style={{marginBottom: 30}}
                                    value={code}
                                    mode="outlined"
                                    name="otp"
                                    label="OTP code"
                                    onChangeText={value => onCodeChange(value)}
                                />
                            </View>

                            <Button
                                style={{
                                    marginTop: 5,
                                    color: 'white',
                                    backgroundColor: '#ffa500'
                                }}
                                onPress={onOtpSubmit}
                                mode="contained"
                                icon={{source: 'filter-plus-outline', color: '#ffa500'}}>
                                <Text style={{color: 'white'}}>Send</Text>
                            </Button>
                            <Button
                                style={{
                                    marginTop: 50,
                                    color: 'white',
                                    backgroundColor: '#ffa500'
                                }}
                                onPress={() => ResendMail()}
                                mode="contained"
                                icon={{source: 'filter-plus-outline', color: '#ffa500'}}>
                                <Text style={{color: 'white'}}>Resend mail</Text>
                            </Button>
                        </View>
                    ) : (
                        <View>
                            <View style={{marginBottom: 30}}>
                                <Text>Enter New Password</Text>
                                <TextInput
                                    style={{marginBottom: 30}}
                                    value={password}
                                    secureTextEntry={true}
                                    mode="outlined"
                                    name="password"
                                    label="password"
                                    onChangeText={value => onPasswordChange(value)}
                                />
                            </View>

                            <View style={{marginBottom: 30}}>
                                <Text>Re-enter Password</Text>
                                <TextInput
                                    style={{marginBottom: 30}}
                                    value={c_password}
                                    secureTextEntry={true}
                                    mode="outlined"
                                    name="c_password"
                                    label="password"
                                    onChangeText={value => onC_PasswordChange(value)}
                                />
                            </View>

                            <Button
                                style={{
                                    marginTop: 5,
                                    color: 'white',
                                    backgroundColor: '#ffa500'
                                }}
                                onPress={onPasswordSubmit}
                                mode="contained"
                                icon={{source: 'filter-plus-outline', color: '#ffa500'}}>
                                <Text style={{color: 'white'}}> send </Text>
                            </Button>
                        </View>
                    )}
                </View>
            )}
        </View>
    );
};

export default ForgotPassword;
