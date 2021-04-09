import React from 'react';
import {View, ImageBackground, Text} from 'react-native'

const Splash = (props) => {

    return (
        <View>
            <ImageBackground imageStyle={{
                resizeMode: "cover"
            }} 
            source={require("../../assets/splash.png")}
            style={{
                backgroundColor: '#76ba1b',
                width: '100%',
                height: '100%' 
              }}
          
            >
                
            </ImageBackground>
        </View>
    )
}

export default Splash