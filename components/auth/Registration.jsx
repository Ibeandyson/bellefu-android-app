import React from 'react';
import { 
    View, 
    Text, 
    Button, 
    TouchableOpacity, 
    Dimensions,
    TextInput,
    Platform,
    StyleSheet,
    ScrollView,
    StatusBar,
    Alert,
} from 'react-native';
import {Picker} from '@react-native-community/picker'
import * as Animatable from 'react-native-animatable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import Axios from 'axios';
import Preloader from '../guest/Preloader';
import { LOAD_USER_COUNTRY, USER_SIGNIN_SUCCESS, USER_SIGNUP_SUCCESS } from '../../redux/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSelector, useDispatch} from 'react-redux';

const Registration = ({navigation}) => {
    const dispatch = useDispatch();
    const [data, setData] = React.useState({
        username: '',
        password: '',
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        gender: '',
        confirm_password: '',
        check_usernameTextInputChange: false,
        check_firstnameTextInputChange: false,
        check_lastnameTextInputChange: false,
        check_emailTextInputChange: false,
        check_phoneTextInputChange: false,
        check_genderTextInputChange: false,
        check_confirmPasswordTextInputChange: false,
        secureTextEntry: true,
        confirm_secureTextEntry: true,
    });
    const [loadingg, setLoading] = React.useState(false)

    const handleUsername = (val) => {
        if( val.length !== 0 ) {
            setData({
                ...data,
                username: val,
                check_usernameTextInputChange: true
            });
        } else {
            setData({
                ...data,
                username: val,
                check_usernameTextInputChange: false
            });
        }
    }
    const handleFirstName = (val) => {
        if( val.length !== 0 ) {
            setData({
                ...data,
                first_name: val,
                check_firstnameTextInputChange: true
            });
        } else {
            setData({
                ...data,
                first_name: val,
                check_firstnameTextInputChange: false
            });
        }
    }
    const handleLastName = (val) => {
        if( val.length !== 0 ) {
            setData({
                ...data,
                last_name: val,
                check_lastnameTextInputChange: true
            });
        } else {
            setData({
                ...data,
                last_name: val,
                check_lastnameTextInputChange: false
            });
        }
    }

    const handlePhone = (val) => {
        if( val.length > 7 ) {
            setData({
                ...data,
                phone: val,
                check_phoneTextInputChange: true
            });
        } else {
            setData({
                ...data,
                phone: val,
                check_phoneTextInputChange: false
            });
        }
    }

    const handleEmail = (val) => {
        if( val.toLowerCase().indexOf('@') > -1 && val.toLowerCase().indexOf('.com') > -1) {
            setData({
                ...data,
                email: val,
                check_emailTextInputChange: true
            });
        } else {
            setData({
                ...data,
                email: val,
                check_emailTextInputChange: false
            });
        }
    }

    const handleGender = (val) => {
        if( val.length !== 0 ) {
            setData({
                ...data,
                gender: val,
                check_genderTextInputChange: true
            });
        } else {
            setData({
                ...data,
                gender: val,
                check_genderTextInputChange: false
            });
        }
    }

    const handlePasswordChange = (val) => {
        setData({
            ...data,
            password: val
        });
    }

    const handleConfirmPasswordChange = (val) => {
        if( val.length === data.password ) {
            setData({
                ...data,
                confirm_password: val,
                check_confirmPasswordTextInputChange: true
            });
        } else {
            setData({
                ...data,
                confirm_password: val,
                check_phoneTextInputChange: false
            });
        }
    }

    const updateSecureTextEntry = () => {
        setData({
            ...data,
            secureTextEntry: !data.secureTextEntry
        });
    }

    const updateConfirmSecureTextEntry = () => {
        setData({
            ...data,
            confirm_secureTextEntry: !data.confirm_secureTextEntry
        });
    }

    const signupHandle = async (first_name,
        password,
        last_name,
        username,
        phone,
        email,
        gender,
        ) => {
        if ( data.password !== data.confirm_password ) {
            Alert.alert('error', 'Passwords do not match', [
                {text: 'Okay'}
            ]);
            return;
        } else if (!data.email.toLowerCase().includes('@', 1) || !data.email.toLowerCase().includes('.com', 2)){
            Alert.alert('error', 'Email appears to be wrong', [
                {text: 'Okay'}
            ]);
        }
        
        else if ( data.gender.length == 0 || data.password.length == 0 || data.confirm_password == 0 || data.first_name == 0 || data.last_name == 0 || data.username == 0 || data.phone == 0 || data.email == 0 ) {
            Alert.alert('error', 'All fields must not be empty', [
                {text: 'Okay'}
            ]);
            return;
        } else {
            setLoading(true)
            try {
                let res = await Axios.post(
                    "https://bellefu.com/api/auth/register",
                    {
                        first_name,
                        password,
                        last_name,
                        username,
                        phone,
                        email,
                        gender
                    }
                    
                )
                console.log(res.data.token)
                await setLoading(false)
                await dispatch({ type: USER_SIGNUP_SUCCESS, payload: data });
                await dispatch({type: LOAD_USER_COUNTRY, country: res.data.location_info})
                await AsyncStorage.setItem('countrySlug', res.data.location_info.country_slug)
                await AsyncStorage.setItem('countryIso', res.data.location_info.country_iso2)
                await AsyncStorage.setItem('user', res.data.token)
                await AsyncStorage.setItem('countryName', res.data.location_info.country_name)
                Alert.alert('Registration successful', `what would you like to do? ${res.data.user.profile.first_name}`, [
                    {text: 'Browse Products', onPress: () => navigation.navigate('Home')},
                    // {text: 'Go to Profile', onPress: () => navigation.navigate('Account')}
                ], { cancelable: false });
            } catch(e) {
                setLoading(false)
                let message = Object.values(e.response.data.errors)[0][0]
                Alert.alert('error', message, [
                            {text: 'Okay'}
                        ]);
            
            }
        } 
    }

    return (
      <View style={styles.container}>
          <StatusBar backgroundColor='#76BA1A' barStyle="light-content"/>
          {loadingg && (
                <View style={{height: '' + 100 + '%'}}>
                    <Preloader />
                </View>
            )}
        <View style={styles.header}>
            <Text style={styles.text_header}>Register Now!</Text>
        </View>
        <Animatable.View 
            animation="fadeInUpBig"
            style={styles.footer}
        >
            <ScrollView>
            <Text style={styles.text_footer}>Username</Text>
            <View style={styles.action}>
                <FontAwesome 
                    name="user-o"
                    color="#05375a"
                    size={20}
                />
                <TextInput 
                    placeholder="Your Username"
                    style={styles.textInput}
                    autoCapitalize="none"
                    onChangeText={(val) => handleUsername(val)}
                />
                {data.check_usernameTextInputChange ? 
                <Animatable.View
                    animation="bounceIn"
                >
                    <Feather 
                        name="check-circle"
                        color="green"
                        size={20}
                    />
                </Animatable.View>
                : null}
            </View>
            <Text style={[styles.text_footer, {
                marginTop: 35
            }]}>First Name</Text>
            <View style={styles.action}>
                <FontAwesome 
                    name="user-o"
                    color="#05375a"
                    size={20}
                />
                <TextInput 
                    placeholder="Your First Name"
                    style={styles.textInput}
                    autoCapitalize="none"
                    onChangeText={(val) => handleFirstName(val)}
                />
                {data.check_firstnameTextInputChange ? 
                <Animatable.View
                    animation="bounceIn"
                >
                    <Feather 
                        name="check-circle"
                        color="green"
                        size={20}
                    />
                </Animatable.View>
                : null}
            </View>
            <Text style={[styles.text_footer, {
                marginTop: 35
            }]}>Last Name</Text>
            <View style={styles.action}>
                <FontAwesome 
                    name="user-o"
                    color="#05375a"
                    size={20}
                />
                <TextInput 
                    placeholder="Your Last Name"
                    style={styles.textInput}
                    autoCapitalize="none"
                    onChangeText={(val) => handleLastName(val)}
                />
                {data.check_lastnameTextInputChange ? 
                <Animatable.View
                    animation="bounceIn"
                >
                    <Feather 
                        name="check-circle"
                        color="green"
                        size={20}
                    />
                </Animatable.View>
                : null}
            </View>
            <Text style={[styles.text_footer, {
                marginTop: 35
            }]}>Phone Number</Text>
            <View style={styles.action}>
                <FontAwesome 
                    name="mobile"
                    color="#05375a"
                    size={24}
                />
                <TextInput 
                    keyboardType="phone-pad"
                    placeholder="Your Phone Number"
                    style={styles.textInput}
                    autoCapitalize="none"
                    onChangeText={(val) => handlePhone(val)}
                />
                {data.check_phoneTextInputChange ? 
                <Animatable.View
                    animation="bounceIn"
                >
                    <Feather 
                        name="check-circle"
                        color="green"
                        size={20}
                    />
                </Animatable.View>
                : null}
            </View>
            <Text style={[styles.text_footer, {
                marginTop: 35
            }]}>Email</Text>
            <View style={styles.action}>
                <FontAwesome 
                    name="envelope-o"
                    color="#05375a"
                    size={20}
                />
                <TextInput 
                     keyboardType="email-address"
                    placeholder="Your Email Address"
                    style={styles.textInput}
                    autoCapitalize="none"
                    onChangeText={(val) => handleEmail(val)}
                />
                {data.check_emailTextInputChange ? 
                <Animatable.View
                    animation="bounceIn"
                >
                    <Feather 
                        name="check-circle"
                        color="green"
                        size={20}
                    />
                </Animatable.View>
                : null}
            </View>
            <Text style={[styles.text_footer, {
                marginTop: 35
            }]}>Gender</Text>
            <View style={styles.action}>
                <FontAwesome 
                    name="question"
                    color="#05375a"
                    size={20}
                />
                <Picker
                    selectedValue={data.gender}
                    style={styles.textInput}
                    onValueChange={(itemValue) => handleGender(itemValue)}
                >
                    <Picker.Item label="" value="" />
                    <Picker.Item label="Male" value="M" />
                    <Picker.Item label="Female" value="F" />
                </Picker>
                {data.check_genderTextInputChange ? 
                <Animatable.View
                    animation="bounceIn"
                >
                    <Feather 
                        name="check-circle"
                        color="green"
                        size={20}
                    />
                </Animatable.View>
                : null}
            </View>
            <Text style={[styles.text_footer, {
                marginTop: 35
            }]}>Password</Text>
            <View style={styles.action}>
                <Feather 
                    name="lock"
                    color="#05375a"
                    size={20}
                />
                <TextInput 
                    placeholder="Your Password"
                    secureTextEntry={data.secureTextEntry ? true : false}
                    style={styles.textInput}
                    autoCapitalize="none"
                    onChangeText={(val) => handlePasswordChange(val)}
                />
                <TouchableOpacity
                    onPress={updateSecureTextEntry}
                >
                    {data.secureTextEntry ? 
                    <Feather 
                        name="eye-off"
                        color="grey"
                        size={20}
                    />
                    :
                    <Feather 
                        name="eye"
                        color="grey"
                        size={20}
                    />
                    }
                </TouchableOpacity>
            </View>

            <Text style={[styles.text_footer, {
                marginTop: 35
            }]}>Confirm Password</Text>
            <View style={styles.action}>
                <Feather 
                    name="lock"
                    color="#05375a"
                    size={20}
                />
                <TextInput 
                    placeholder="Confirm Your Password"
                    secureTextEntry={data.confirm_secureTextEntry ? true : false}
                    style={styles.textInput}
                    autoCapitalize="none"
                    onChangeText={(val) => handleConfirmPasswordChange(val)}
                />
                {data.check_confirmPasswordTextInputChange ? 
                <Animatable.View
                    animation="bounceIn"
                >
                    <Feather 
                        name="check-circle"
                        color="green"
                        size={20}
                    />
                </Animatable.View>
                : null}
                <TouchableOpacity
                    onPress={updateConfirmSecureTextEntry}
                >
                    {data.secureTextEntry ? 
                    <Feather 
                        name="eye-off"
                        color="grey"
                        size={20}
                    />
                    :
                    <Feather 
                        name="eye"
                        color="grey"
                        size={20}
                    />
                    }
                </TouchableOpacity>
            </View>
            <View style={styles.textPrivate}>
                <Text style={styles.color_textPrivate}>
                    By signing up you agree to our
                </Text>
                <Text style={[styles.color_textPrivate, {fontWeight: 'bold'}]}>{""}Terms of service</Text>
                <Text style={styles.color_textPrivate}>{" "}and</Text>
                <Text style={[styles.color_textPrivate, {fontWeight: 'bold'}]}>{" "}Privacy policy</Text>
            </View>
            <View style={styles.button}>
                <TouchableOpacity
                    style={styles.signIn}
                    onPress={() => signupHandle(data.first_name, data.password, data.last_name, data.username, data.phone, data.email, data.gender)}
                >
                <View
                    colors={['#08d4c4', '#01ab9d']}
                    style={[styles.signIn, {
                        borderColor: '#76BA1A',
                        borderWidth: 1,
                        marginTop: 15,
                    }]}
                >
                    <Text style={[styles.textSign, {
                        color:'#76BA1A'
                    }]}>Sign Up</Text>
                </View>
                </TouchableOpacity>
                <View style={{marginTop: 15, marginBottom: 10, alignSelf: 'center'}}>
                <Text style={{fontWeight: "bold"}}>OR</Text>
                </View>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={[styles.signIn, {
                        borderColor: '#FFA500',
                        borderWidth: 1,
                        marginTop: 15
                    }]}
                >
                    <Text style={[styles.textSign, {
                        color: '#FFA500'
                    }]}>Sign In</Text>
                </TouchableOpacity>
            </View>
            </ScrollView>
        </Animatable.View>
      </View>
    );
};

export default Registration;

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
        flex: Platform.OS === 'ios' ? 3 : 4,
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
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a',
    },
    button: {
        alignItems: 'center',
        marginTop: 50
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
    },
    textPrivate: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 20
    },
    color_textPrivate: {
        color: 'grey'
    }
  });
