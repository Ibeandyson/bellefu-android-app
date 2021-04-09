import React, {useState, useEffect} from 'react';
import {Text, View, Alert, StyleSheet, ScrollView} from 'react-native';
import {Button, TextInput, RadioButton, Divider} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Preloader from '../guest/Preloader';


export default function PostAdPayment(props) {
    const [checked, setChecked] = React.useState('');
    const [token, setToken] = useState('');
    const [walletData, setWalletData] = useState([]);
    const [laoding , setLoading] = useState(false)
    const [paymentData, setPaymentData] = useState({
        product_slug: `${props.route.params.productDetail.product_slug}`,
        upgrade_plan: `${props.route.params.productDetail.product_plan}`,
        payment_channel: '',
        voucher_code: '',
        gateway_provider: ''
    });

    ////// CALLED API TO GET WALLET BALANCE
    let url = 'https://bellefu.com/api/user/profile/details';

    const loadProfile = async () => {
        let tokenn = await AsyncStorage.getItem('user');
        await setToken(tokenn);
        axios
            .get(url, {
                headers: {
                    Authorization: `Bearer ${tokenn}`,
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                }
            })
            .then(res => {
                setWalletData(res.data.user.profile.wallet_balance);
                setLoading(false);
            })
            .catch(e => {
            });
    };
   
    useEffect(() => {
        loadProfile();
       
    }, );

    const onSubmitHandle =  () => {
        setLoading(true);
        let mainData =  {};
		let walletPayment =  {
			product_slug: paymentData.product_slug,
			upgrade_plan: paymentData.upgrade_plan,
			payment_channel: checked,
		};
		let voucherPayment = {
			product_slug: paymentData.product_slug,
			upgrade_plan: paymentData.upgrade_plan,
			payment_channel:checked,
			voucher_code: paymentData.voucher_code
		};
        if ( checked === "wallet") {
			mainData =  walletPayment;
		} else if ( checked=== "voucher") {
			mainData =  voucherPayment;
		} else if ( checked === "card") {
			mainData =  cardPayment;
		}
        let url = "https://bellefu.com/api/user/product/upgrade";
            axios
                .post(url, mainData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                        Accept: "application/json"
                    }
                })
                .then(response => {
                    Alert.alert(response.data.message);
                    setLoading(false);
                
                })
                .catch((error) => {
                    Alert.alert(error.response.data.message)
                    setLoading(false);
                });
        };
    
        const  onChangeChenel = value => {
            setPaymentData({
                ...paymentData,
                payment_channel: value
            });
        };
        const  onChangeVoucher = value => {
            setPaymentData({
                ...paymentData,
                voucher_code: value
            });
        };
    

    return (
        <View>
            <ScrollView showsVerticalScrollIndicator={false}>
                {laoding? <Preloader/> : 
                <View style={styles.contianer}>
                    <View style={{justifyContent: 'center', alignSelf: 'center'}}>
                        <Text style={{fontWeight: 'bold', fontSize: 20}}>Choose Payment Method</Text>
                    </View>
                    <Text style={{padding: 30, paddingBottom: -25, fontWeight: 'bold'}}>Pay with Wallet</Text>
                    <View style={{flexDirection: 'row', padding: 10}}>
                        <RadioButton
                            value="wallet"
                            status={checked === 'wallet' ? 'checked' : 'unchecked'}
                            onPress={() => setChecked('wallet')}
                            color="#76ba1b"
                            onChangeText={value => onChangeChenel(value)}
                        />
                        <Text style={{marginTop: 10}}>Wallet (balance: $ {walletData})</Text>
                    </View>
                    <Divider />
                    <Text style={{padding: 30, paddingBottom: -25, fontWeight: 'bold'}}>Pay with Voucher</Text>
                    <View style={{padding: 10}}>
                    <View style={{flexDirection: 'row', }}>
                        <RadioButton
                            value="voucher"
                            status={checked === 'voucher' ? 'checked' : 'unchecked'}
                            onPress={() => setChecked('voucher')}
                            color="#76ba1b"
                            onChangeText={value => onChangeChenel(value)}
                        />
                        <Text style={{marginTop: 10}}>Voucher</Text>
                    </View>
                        <TextInput
                            style={styles.input}
                            mode="outlined"
                            label="Input Voucher Code"
                            // value={phone}
                            onChangeText={value => onChangeVoucher(value)}
                        />
                    </View>
                    <Button
                            style={styles.btn}
                            onPress={() => onSubmitHandle(paymentData)}
                            mode="contained"
                            icon={{source: 'filter-plus-outline', color: '#ffa500'}}>
                            <Text style={{color: 'white'}}> Post</Text>
                        </Button>
                </View>
}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    contianer: {
        padding: 20
    }
});
