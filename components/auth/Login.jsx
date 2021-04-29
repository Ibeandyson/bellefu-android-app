import React, {useEffect} from 'react';
import NavigationBar from 'react-native-navbar-color';
import {View, Text, TouchableOpacity, TextInput, Platform, StyleSheet, StatusBar, Alert} from 'react-native';
import * as Animatable from 'react-native-animatable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import {useDispatch} from 'react-redux';
import {useTheme} from 'react-native-paper';
import Axios from 'axios';
import Preloader from '../guest/Preloader';
import {LOAD_USER_COUNTRY, USER_SIGNIN_SUCCESS} from '../../redux/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = ({navigation}) => {
    const dispatch = useDispatch();
    const [data, setData] = React.useState({
        identifier: '',
        password: '',
        check_textInputChange: false,
        secureTextEntry: true,
        isValidUser: true,
        isValidPassword: true
    });
    const [loadingg, setLoading] = React.useState(false);

    const {colors} = useTheme();

    const textInputChange = val => {
        setData({
            ...data,
            identifier: val,
            check_textInputChange: false,
            isValidUser: false
        });
    };

    const handlePasswordChange = val => {
        setData({
            ...data,
            password: val,
            isValidPassword: false
        });
    };

    const updateSecureTextEntry = () => {
        setData({
            ...data,
            secureTextEntry: !data.secureTextEntry
        });
    };

    const handleValidUser = val => {
        if (val.trim().length >= 4) {
            setData({
                ...data,
                isValidUser: true
            });
        } else {
            setData({
                ...data,
                isValidUser: false
            });
        }
    };

    const loginHandle = async (identifier, password) => {
        if (data.identifier.length == 0 || data.password.length == 0) {
            Alert.alert('Wrong Input!', 'Username or password field cannot be empty.', [{text: 'Okay'}]);
            return;
        } else {
            setLoading(true);
            try {
                let res = await Axios.post('https://bellefu.com/api/auth/login/challenge/default', {
                    identifier,
                    password
                });
                await setLoading(false);
                await dispatch({type: USER_SIGNIN_SUCCESS, payload: res.data.user});
                await dispatch({type: LOAD_USER_COUNTRY, country: res.data.location_info});
                await AsyncStorage.setItem('countrySlug', res.data.location_info.country_slug);
                await AsyncStorage.setItem('countryIso', res.data.location_info.country_iso2);
                await AsyncStorage.setItem('countryName', res.data.location_info.country_name);
                await AsyncStorage.setItem('user', res.data.token);
                Alert.alert(
                    'login successful',
                    `what would you like to do? ${res.data.user.profile.first_name}`,
                    [
                        {text: 'Browse Products', onPress: () => navigation.replace('Home')},
                        {text: 'Go to Dashboard', onPress: () => navigation.replace('Account')}
                    ],
                    {cancelable: false}
                );
            } catch (e) {
                setLoading(false);
                let message = Object.values(e.response.data.errors)[0][0];
                Alert.alert('error', message, [{text: 'Okay'}]);
            }
        }
    };

    useEffect(() => {
        if (Platform.OS === 'ios') {
            NavigationBar.setColor('#ffffff');
        }
    }, []);

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#76BA1A" barStyle="light-content" />
            {loadingg && (
                <View style={{height: '' + 150 + '%'}}>
                    <Preloader />
                </View>
            )}
            <View style={styles.header}>
                <Text style={styles.text_header}>Welcome!</Text>
            </View>
            <Animatable.View
                animation="fadeInUpBig"
                style={[
                    styles.footer,
                    {
                        backgroundColor: colors.background
                    }
                ]}>
                <Text
                    style={[
                        styles.text_footer,
                        {
                            color: colors.text
                        }
                    ]}>
                    Email
                </Text>
                <View style={styles.action}>
                    <FontAwesome name="user-o" color={colors.text} size={20} />
                    <TextInput
                        keyboardType="email-address"
                        placeholder="Email"
                        placeholderTextColor="#666666"
                        style={[
                            styles.textInput,
                            {
                                color: colors.text
                            }
                        ]}
                        autoCapitalize="none"
                        onChangeText={val => textInputChange(val)}
                        onEndEditing={e => handleValidUser(e.nativeEvent.text)}
                    />
                    {data.check_textInputChange ? (
                        <Animatable.View animation="bounceIn">
                            <Feather name="check-circle" color="green" size={20} />
                        </Animatable.View>
                    ) : null}
                </View>

                <Text
                    style={[
                        styles.text_footer,
                        {
                            color: colors.text,
                            marginTop: 35
                        }
                    ]}>
                    Password
                </Text>
                <View style={styles.action}>
                    <Feather name="lock" color={colors.text} size={20} />
                    <TextInput
                        placeholder="Password"
                        placeholderTextColor="#666666"
                        secureTextEntry={data.secureTextEntry ? true : false}
                        style={[
                            styles.textInput,
                            {
                                color: colors.text
                            }
                        ]}
                        autoCapitalize="none"
                        onChangeText={val => handlePasswordChange(val)}
                    />
                    <TouchableOpacity onPress={updateSecureTextEntry}>
                        {data.secureTextEntry ? (
                            <Feather name="eye-off" color="grey" size={20} />
                        ) : (
                            <Feather name="eye" color="grey" size={20} />
                        )}
                    </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={() => navigation.navigate('Forgotpassword')}>
                    <Text style={{color: '#009387', marginTop: 15}}>Forgot password?</Text>
                </TouchableOpacity>
                <View style={styles.button}>
                    <TouchableOpacity
                        style={[
                            styles.signIn,
                            {
                                borderColor: '#76BA1A',
                                borderWidth: 1,
                                marginTop: 15
                            }
                        ]}
                        onPress={() => loginHandle(data.identifier, data.password)}>
                        <View colors={['#08d4c4', '#01ab9d']} style={styles.signIn}>
                            <Text
                                style={[
                                    styles.textSign,
                                    {
                                        color: '#76BA1A'
                                    }
                                ]}>
                                Sign In
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <View style={{marginTop: 15, marginBottom: 10, alignSelf: 'center'}}>
                        <Text style={{fontWeight: 'bold'}}>OR</Text>
                    </View>

                    <TouchableOpacity
                        onPress={() => navigation.navigate('Signup')}
                        style={[
                            styles.signIn,
                            {
                                borderColor: '#FFA500',
                                borderWidth: 1,
                                marginTop: 15
                            }
                        ]}>
                        <Text
                            style={[
                                styles.textSign,
                                {
                                    color: '#FFA500'
                                }
                            ]}>
                            Sign Up
                        </Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                    <View style={{marginTop: 20}}>
                        <Text style={{color: '#009387', fontSize: 15}}>Skip</Text>
                    </View>
                </TouchableOpacity>
            </Animatable.View>
        </View>
    );
};

export default Login;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#76BA1A'
    },
    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 50
    },
    footer: {
        flex: 3,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30
    },
    text_header: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 30
    },
    text_footer: {
        color: '#05375a',
        fontSize: 18
    },
    action: {
        flexDirection: 'row',
        marginTop: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5
    },
    actionError: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#FF0000',
        paddingBottom: 5
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a'
    },
    errorMsg: {
        color: '#FF0000',
        fontSize: 14
    },
    button: {
        alignItems: 'center',
        marginTop: 10
    },
    signIn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold'
    }
});
