import React, {useState} from 'react';
import {View, Text, Alert} from 'react-native';
import {Button, TextInput} from 'react-native-paper';

const ForgotPassword = () => {
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

    // ==========================ALL EMAIL SUBMITION FUNCTIONS ==============
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
                console.log(res);
                setComponentToShow(true);
            })
            .catch(error => {
                console.log(error);
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
        const payload = new FormData();
        payload.append('code', otpData.code);
        payload.append('email', requestData.email);
        axios
            .post('https://bellefu.com/api/auth/validate_password_reset_code', payload)
            .then(res => {
                console.log(res);
                setComponentToShow_2(true);
            })
            .catch(e => {
                console.log(e);
                setloading(false);
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
        const payload = new FormData();
        payload.append('code', otpData.code);
        payload.append('email', requestData.email);
        payload.append('password', passwordData.password);
        payload.append('c_password', passwordData.c_password);
        axios
            .post('https://bellefu.com/api/auth/password_reset', payload)
            .then(res => {
                console.log(res);
            })
            .catch(e => {
                console.log(e);
                setloading(false);
            });
    };

    return (
        <View>
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
                        <Text style={{color: 'white'}}> Post</Text>
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
                                <Text style={{color: 'white'}}> Post</Text>
                            </Button>
                        </View>
                    ) : (
                        <View>
                           <View style={{marginBottom: 30}}>
                                <Text>Enter New Password</Text>
                                <TextInput
                                    style={{marginBottom: 30}}
                                    value={password}
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
                                onPress={onOtpSubmit}
                                mode="contained"
                                icon={{source: 'filter-plus-outline', color: '#ffa500'}}>
                                <Text style={{color: 'white'}}> Post</Text>
                            </Button>
                           </View>
                    )}
                </View>
            )}
        </View>
    );
};

export default ForgotPassword;
