import AsyncStorage from '@react-native-async-storage/async-storage'
import Axios from 'axios'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Alert, Dimensions, Text, View } from 'react-native'
import { Button, TextInput } from 'react-native-paper'

const ChangePassword = (props) => {
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState({
        current_password: '',
        new_password: '',
        retype_new_password: ''
    })
    const [token, setToken] = useState("")
    const url = `https://bellefu.com/api/user/password/update`;


    const _user_token = async () => {
        let user_token = await AsyncStorage.getItem("user");
        setToken(user_token)
    }

    const handleSubmit = () => {
        if(data.new_password !== data.retype_new_password){
            Alert.alert("error", "Passwords do not match")
        } else if (data.new_password.length < 1 || data.current_password.length < 1){
            Alert.alert("error", "All fields are required")
        }
        
        else {
        setLoading(true)
        Axios.post(url, data, {
            headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
				Accept: 'application/json'
			}
        }).then((e) => {
            setLoading(false)
            Alert.alert("success", "Password updated successfully")
        }).catch((e) => {
            setLoading(false)
            Alert.alert("error", "Current password is incorrect!")
        })
    }
    }

    useEffect(() => {
        _user_token()
    }, [])
    return (
        <View style={{justifyContent: "center", alignItems: "center", width: Dimensions.get('window').width}}>
            <TextInput
                name="current_password" 
                placeholderTextColor="#666666"
                style={{width: 300, marginTop: 15}}
                mode="outlined"
                label="current password *"
                secureTextEntry={true}
                onChangeText={(text) => setData({...data, current_password: text})}
            />
            <TextInput 
                name="new_password" 
                placeholderTextColor="#666666"
                style={{width: 300, marginTop: 15}}
                mode="outlined"
                label="new password *"
                secureTextEntry={true}
                onChangeText={(text) => setData({...data, new_password: text})}
            />
            <TextInput 
                name="retype_new_password" 
                placeholderTextColor="#666666"
                style={{width: 300, marginTop: 15}}
                mode="outlined"
                label="confirm password *"
                secureTextEntry={true}
                onChangeText={(text) => setData({...data, retype_new_password: text})}
            />
            {loading ? (
                <ActivityIndicator style={{marginTop: 20}} color="#76ba1b" animating size="large" />
            ) : (

            <Button onPress={handleSubmit} mode="contained" style={{marginTop: 50, padding: 7}}>
                <Text style={{color: "white"}}>Change Password</Text>
            </Button>
            )}
        </View>
    )
}

export default ChangePassword