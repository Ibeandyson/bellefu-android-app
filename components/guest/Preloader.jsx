import React , {useState} from 'react'
import { View ,Image} from 'react-native';
import { Modal, Portal} from 'react-native-paper';


export default function Preloader() {
    const [visible] = React.useState(true);
    // const showModal = () => setVisible(true);
    // const hideModal = () => setVisible(false);
    return (
        <View>
             <Portal>
                <Modal visible={visible}   style={{flex: 1, justifyContent: 'center', alignItem: 'center'}}>
                     <View style={{flex: 1, justifyContent: "center" , alignContent: "center"}}>
                     <Image style={{height: 100, width: 100,alignSelf: "center",}} source={require('../../images/spinner.gif')} />
                         </View>  
                </Modal>
            </Portal>
        </View>
    )
}
