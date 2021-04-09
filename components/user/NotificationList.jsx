import React from 'react'
import {View, Text} from "react-native"
import {Card} from 'react-native-paper'
import Moment from 'react-moment';

export default function NotificationList(props) {
    return (
        <View>
            <Card style={{marginBottom: 20}}>
                <Card.Title titleStyle={{color:props.item.data.color }} title={props.item.data.title}/>
                <Text style={{padding:20, paddingTop: -20, opacity: 0.7}}>{props.item.data.message}</Text>
                <Moment style={{padding:20, paddingTop: -50, opacity: 0.4}}element={Text} format="MMMM Do, YYYY">
              {props.item.created_at}
            </Moment>
            </Card>
        </View>
    )
}
