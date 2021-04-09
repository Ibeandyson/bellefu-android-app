import React from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import {Card} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function BottomNav(props) {
    return (
        <View>
            <Card
                style={{
                    position: 'absolute',
                    flex: 0.1,
                    left: 0,
                    right: 0,
                    bottom: -10,
                    backgroundColor: "#76ba1b",
                    height: props.home ? 123 : 66,
                    borderRadius: 0
                }}>
                  <View style={{flexDirection: "row", justifyContent: "space-around", alignItems: 'center'}}> 
                  <TouchableOpacity onPress={() =>  props.navigation.navigate('Home')}>
                    <View>
                        <MaterialCommunityIcons name="home" size={27} style={{textAlign: 'center', alignSelf: 'center'}} color="white" />
                        {/* <Text style={{color: "white" , fontSize: 10}}>Home</Text> */}
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() =>  props.navigation.navigate('Favourite')}>
                  <View>
                  <MaterialCommunityIcons style={{textAlign: 'center'}} name="heart" size={27} color="white" />
                  {/* <Text style={{color: "white" , fontSize: 10}}>Favourite</Text> */}
                  </View>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() =>  props.navigation.navigate('Post')}>
                  <View style={{marginHorizontal: 10 }}>
                  <Image style={{height: 60, width: 60, marginTop: -10}} source={require('../../images/postad.png')} />
                  </View>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() =>  props.navigation.navigate('Messenger')}>
                  <View>
                  <MaterialCommunityIcons style={{textAlign: 'center'}} name="message" size={27} color="white" />
                  {/* <Text style={{color: "white" , fontSize: 10}}>Message</Text> */}
                  </View>
                  </TouchableOpacity>
                  
                  <TouchableOpacity onPress={() =>  props.navigation.navigate('Account')}>
                  <View>
                  <MaterialCommunityIcons style={{textAlign: 'center'}} name="account-circle" size={27} color="white" />
                  {/* <Text style={{color: "white" , fontSize: 10}}>Account</Text> */}
                  </View>
                  </TouchableOpacity>
                                    
                  </View>
                  
               
            </Card>
        </View>
    );
}
