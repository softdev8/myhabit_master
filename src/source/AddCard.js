import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ImageBackground, Image, AsyncStorage, StatusBar, NativeModules, Platform, BackHandler, Modal, Linking} from 'react-native';

import { color, windowWidth, windowHeight } from "./styles/theme"
import Loading from 'react-native-whc-loading'

var amount = 0
var item = null
var useFuturePayments = false
var useExistingBalance = false

export default class AddCard extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            currentBalance: 0,
            language: '',
            errorVisible: false
        }

        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }

    async componentDidMount() {

        if (NativeModules.I18nManager && Platform.OS == 'android') {
            const {localeIdentifier} = NativeModules.I18nManager;
            
            this.setState({language: localeIdentifier})
            console.log(localeIdentifier);
        }

        var currentBalance = await AsyncStorage.getItem("currentBalance")
        console.log("currentBalance", currentBalance);
        this.setState({
            currentBalance: currentBalance
        })
    }

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    
    handleBackButtonClick() {
        // this.props.navigation.navigate('SelectPayment')
        return true;
    }

    setErrorVisible = (visible) => {
        this.setState({ errorVisible: visible });
    }

    errorDidClose = () => {
        this.setState({ errorVisible: false });
    };

    actionMain = () => {
        this.props.navigation.navigate('Main')
    }

    actionBack = () => {
        this.props.navigation.navigate('SelectPayment')
    }

    async addCard() {
        
        this.refs.loading.show();

        var token = await AsyncStorage.getItem("token")
        // var token = 4
        console.log("token", token);

        console.log("amount: ", amount);
        console.log("useFuturePayments: ", useFuturePayments);
        console.log("useExistingBalance: ", useExistingBalance);
        console.log("supplierId: ", item.id);
        
        await fetch("http://shobbing.herokuapp.com/v2/api/customer/payment/payAtRegister", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'token': token
            },
            body: JSON.stringify({
                amount: amount,
                supplierId: item.id,
                useExistingBalance: useExistingBalance,
                useFuturePayments: useFuturePayments
            })
            }).then((response) => response.json())
            .then((responseJson) => {
                
                this.refs.loading.close();

                if (responseJson.status == "OK") {
                    console.log("results: ", responseJson.result);

                    Linking.canOpenURL(responseJson.result.creditCardPaymentUrl).then(supported => {
                        if (supported) {
                          Linking.openURL(responseJson.result.creditCardPaymentUrl);
                        } else {
                          console.log("Don't know how to open URI: " + responseJson.result.creditCardPaymentUrl);
                        }
                    });
                } else {
                    this.setState({ errorVisible: true });
                }                
            })
            .catch((error) => {
                console.error(error);
                
                this.refs.loading.close();
        });
    }

    render() {

        if (this.props.navigation.state.params) {
            amount = this.props.navigation.state.params.amount
            item = this.props.navigation.state.params.item
            useFuturePayments = this.props.navigation.state.params.useFuturePayments
            useExistingBalance = this.props.navigation.state.params.useExistingBalance
        }

        return (
            <View style={styles.container}>

                <StatusBar
                    backgroundColor={color.statusBar_morning_color}
                    barStyle="light-content"
                />

                <ImageBackground source={require('../resource/blue_bg.png')} style={[{width: windowWidth, height: 135}]}>

                    {(this.state.language == "iw_IL" && Platform.OS == 'android') ?
                        <View style={{flexDirection: 'row', marginTop: 38, alignSelf: 'center'}}>
                            <Image source={ require("../resource/white_store.png") } style={{width: 24, height: 21, marginRight: 15}}/>
                            <Text style={{color: 'white', textAlign: 'center', fontSize: 20}}>קניות בחנות</Text>
                        </View> :
                        <View style={{flexDirection: 'row', marginTop: 38, alignSelf: 'center'}}>
                            <Text style={{color: 'white', textAlign: 'center', fontSize: 20}}>קניות בחנות</Text>
                            <Image source={ require("../resource/white_store.png") } style={{width: 24, height: 21, marginLeft: 15}}/>
                        </View> }
                    
                    <View style={[{width: 175, height: 1.5, backgroundColor: color.line_color, alignSelf: 'center', marginTop: 15}]} />

                    {(this.state.language == "iw_IL" && Platform.OS == 'android') ?
                        <View style={{flexDirection: 'row', marginTop: 10, alignItems: 'center', justifyContent: 'center'}}>
                            <Text style={{color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 24}}>יתרתך </Text>                           
                            <Text style={{color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 24}}> {this.state.currentBalance}</Text>   
                            <Text style={{color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 16}}>₪</Text>     
                        </View> :
                        <View style={{flexDirection: 'row', marginTop: 10, alignItems: 'center', justifyContent: 'center'}}>
                            <Text style={{color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 16}}>₪</Text>     
                            <Text style={{color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 24}}> {this.state.currentBalance}</Text>   
                            <Text style={{color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 24}}>יתרתך </Text>                           
                        </View> }

                    {(this.state.language == "iw_IL" && Platform.OS == 'android') ?
                        <TouchableOpacity onPress={() => this.actionBack()} style={{position: 'absolute', top: 40, right: 15, width: 70, height: 30, borderRadius: 10, backgroundColor: color.white, justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{textAlign: 'center', fontSize: 18, color: color.active_tb_color}}>חזור</Text>
                        </TouchableOpacity> :
                        <TouchableOpacity onPress={() => this.actionBack()} style={{position: 'absolute', top: 40, left: 15, width: 70, height: 30, borderRadius: 10, backgroundColor: color.white, justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{textAlign: 'center', fontSize: 18, color: color.active_tb_color}}>חזור</Text>
                        </TouchableOpacity> }

                </ImageBackground>

                <Text style={{fontSize: 24, textAlign: 'center', marginTop: 30}}>טרם הוספת אמצעי תשלום</Text>

                <Image source={ require("../resource/card.png") } style={{width: 206, height: 206, marginTop: 40, alignSelf: 'center'}}/>
                
                <TouchableOpacity onPress={() => this.addCard()}>
                    <View style={{width: windowWidth - 60, height: 50, backgroundColor: color.btn_color, borderRadius: 10, alignSelf: 'center', marginTop: 50, justifyContent: 'center'}}>
                        <Text style={{fontSize: 25, color: color.white, textAlign: 'center'}}>הוסף כרטיס אשראי</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => this.actionMain()} >
                    <Text style={[{fontSize: 20, textDecorationLine: 'underline', textDecorationColor: '#58656d88', color: '#58656d88', textAlign: 'center', marginTop: 30, marginBottom: 25}]}>בטל תהליך תשלום</Text>
                </TouchableOpacity>

                <Modal animationType='fade' transparent={true} modalDidClose={this.errorDidClose} visible={this.state.errorVisible} onRequestClose={() => this.setErrorVisible(false)} >
                    <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
                        <TouchableOpacity onPress={() => this.errorDidClose()} >
                            <View style={{ width: 200, height: 200, alignSelf: 'center', alignItems: 'center', justifyContent: 'center', backgroundColor: color.white, borderWidth: 3, borderColor: '#d0021b', borderRadius: 17, marginTop: (windowHeight - 162) / 2}}>
                                <Text style={[styles.label, {textAlign: 'center'}]}>ההזמנה כבר שולמה</Text>
                                <Text style={[styles.label, {textAlign: 'center'}]}>הזמנה עם סכום זהה הסתיימה בדקות האחרונות</Text>

                                {(this.state.language == "iw_IL" && Platform.OS == 'android') ?
                                    <Image source={ require('../resource/errow.png') } style={{width: 45, height: 45, position: 'absolute', top: -22.5, left: 12}}/> :
                                    <Image source={ require('../resource/errow.png') } style={{width: 45, height: 45, position: 'absolute', top: -22.5, right: 12}}/> }
                            </View>                    
                        </TouchableOpacity>
                    </View>                    
                </Modal>

                <Loading ref="loading"/>
            </View>
        )
    }

    
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.bg_color,
    },
    
});