import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ImageBackground, Image, Platform, FlatList, Modal, AsyncStorage, StatusBar, NativeModules, BackHandler} from 'react-native';

import { color, windowWidth, windowHeight } from "./styles/theme"

import { NavigationEvents } from 'react-navigation';
import Loading from 'react-native-whc-loading'

var amount = 0
var item = null
var useFuturePayments = false
var useExistingBalance = false


export default class SelectPayment extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            card: [],
            selectedIndex: -1,
            modalVisible: false,
            currentBalance: 0,
            language: '',
            voucherType: "",
            barcode: "",
            barcode_link: "",
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
        // this.props.navigation.navigate('PaymentAmount1')
        return true;
    }

    setErrorVisible = (visible) => {
        this.setState({ errorVisible: visible });
    }

    errorDidClose = () => {
        this.setState({ errorVisible: false });
    };

    actionOptionSelect = (index) => {
        this.setState({
            selectedIndex: index
        })
    }

    actionMain = () => {
        this.setState({ modalVisible: false });

        this.props.navigation.navigate('Main', {selectedTab: 4})
    }

    addPayment = () => {
        this.props.navigation.navigate('AddCard', {amount: amount, item: item, useFuturePayments: useFuturePayments, useExistingBalance: useExistingBalance})
    }

    setModalVisible = (visible) => {
        this.setState({ modalVisible: visible });
    }

    // modalDidClose = () => {
    //     this.setState({ modalVisible: false });
    // };

    actionBack = () => {
        this.props.navigation.navigate('PaymentAmount1')
    }

    async getSpecifyAmount(amount) {

        this.setState({
            selectedIndex: -1
        })

        console.log("amount", amount);

        this.refs.loading.show();

        var token = await AsyncStorage.getItem("token")
        console.log("token", token);
        token = 4
        console.log("token", token);
        
        await fetch("http://shobbing.herokuapp.com/v2/api/customer/payment/specifyAmount", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'token': token
            },
            body: JSON.stringify({
                amount: amount
            })
            }).then((response) => response.json())
            .then((responseJson) => {
                
                this.refs.loading.close();

                if (responseJson.result.creditCards.length === 0) {
                    this.addPayment()
                } else {
                    this.setState({
                        card: responseJson.result.creditCards
                    })
                }                
            })
            .catch((error) => {
                console.error(error);
                
                this.refs.loading.close();
        });
    }

    async payAtRegister(amount, useFuturePayments, useExistingBalance, supplierId) {
        
        this.refs.loading.show();

        var token = await AsyncStorage.getItem("token")
        console.log("token", token);
        token = 4
        console.log("token", token);

        const {card, selectedIndex} = this.state

        console.log("card: ", card);
        console.log("selectedIndex: ", selectedIndex);

        var creditCard4Digits = card[selectedIndex].cardNumber

        console.log("amount: ", amount);
        console.log("creditCard4Digits: ", creditCard4Digits);
        console.log("useFuturePayments: ", useFuturePayments);
        console.log("useExistingBalance: ", useExistingBalance);
        console.log("supplierId: ", supplierId);
        
        await fetch("http://shobbing.herokuapp.com/v2/api/customer/payment/payAtRegister", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'token': token
            },
            body: JSON.stringify({
                amount: amount,
                supplierId: supplierId,
                useExistingBalance: useExistingBalance,
                useFuturePayments: useFuturePayments,
                creditCard4Digits: creditCard4Digits
            })
            }).then((response) => response.json())
            .then((responseJson) => {
                
                this.refs.loading.close();

                if (responseJson.status == "OK") {

                    console.log("Vouchers: ", responseJson.result.vouchers);

                    this.setState({
                        modalVisible: true,
                        voucherType: responseJson.result.vouchers[0].voucherType,
                        barcode: responseJson.result.vouchers[0].barcode,
                        barcode_link: responseJson.result.vouchers[0].url
                    })
                } else {
                    this.setState({
                        errorVisible: true
                    })
                }
                
            })
            .catch((error) => {
                console.error(error);
                
                this.refs.loading.close();
        });
    }

    renderItem(item, index) {
        
        let label_color = (this.state.selectedIndex === index) ? {color: color.btn_color} : {color: color.disalbe_card}
        let card_icon = (this.state.selectedIndex === index) ? require("../resource/blue_visa.png") : require("../resource/black_visa.png")
        let selected_icon = (this.state.selectedIndex === index) ? require("../resource/blue_chack.png") : require("../resource/unselect.png")
        let border = (this.state.selectedIndex === index) ? {borderColor: color.btn_color} : {borderColor: color.line_color}

        return (
            (this.state.language == "iw_IL" && Platform.OS == 'android') ?
            <TouchableOpacity onPress={() => this.actionOptionSelect(index)} >
                <View style={[styles.card_view, {marginTop: 10}, border]}>
                    <Image source={ selected_icon } style={{width: 21, height: 21, marginLeft: 18}}/>

                    <View style={{flex: 1, height: 65, marginLeft: 15, justifyContent: 'center'}}>
                        <Text style={[{fontSize: 19, textAlign: 'left'}, label_color]}>{item.cardType}</Text>

                        <View style={{flexDirection: 'row', alignSelf: 'flex-start', justifyContent: 'center', alignItems: 'center'}}>
                            <Image source={ card_icon } style={{width: 17, height: 11}}/> 
                            <Text style={[{fontSize: 16, marginLeft: 11}, label_color]}>{item.cardNumber}</Text>
                            <Text style={[styles.card_number, {marginTop: 5}, label_color]}>****</Text>
                            <Text style={[styles.card_number, {marginTop: 5}, label_color]}>****</Text>
                            <Text style={[styles.card_number, {marginTop: 5}, label_color]}>****</Text>
                        </View>
                    </View>

                    <Image source={ require("../resource/trash.png") } style={{width: 11, height: 15, marginRight: 20}}/>
                    <Image source={ require("../resource/edit.png") } style={{width: 17, height: 17, marginRight: 15}}/>
                </View>
            </TouchableOpacity> :
            <TouchableOpacity onPress={() => this.actionOptionSelect(index)} >
                <View style={[styles.card_view, {marginTop: 10}, border]}>
                    <Image source={ require("../resource/edit.png") } style={{width: 17, height: 17, marginLeft: 15}}/>
                    <Image source={ require("../resource/trash.png") } style={{width: 11, height: 15, marginLeft: 20}}/>

                    <View style={{flex: 1, height: 65, marginRight: 15, justifyContent: 'center'}}>
                        <Text style={[{fontSize: 19, textAlign: 'right'}, label_color]}>{item.cardType}</Text>

                        <View style={{flexDirection: 'row', alignSelf: 'flex-end', justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={[styles.card_number, {marginTop: 5}, label_color]}>****</Text>
                            <Text style={[styles.card_number, {marginTop: 5}, label_color]}>****</Text>
                            <Text style={[styles.card_number, {marginTop: 5}, label_color]}>****</Text>
                            <Text style={[{fontSize: 16, marginRight: 11}, label_color]}>{item.cardNumber}</Text>
                            <Image source={ card_icon } style={{width: 17, height: 11}}/> 

                        </View>
                    </View>

                    <Image source={ selected_icon } style={{width: 21, height: 21, marginRight: 18}}/>
                </View>
            </TouchableOpacity>
        );
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

                <NavigationEvents
                     onWillFocus={payload => console.warn('will focus',payload)}
                     onDidFocus={payload => this.getSpecifyAmount(amount)}
                     onWillBlur={payload => console.warn('will blur',payload)}
                     onDidBlur={payload => console.warn('did blur',payload)} />
                
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

                <Text style={{fontSize: 20, textAlign: 'center', color: '#6c6b6b', marginTop: 25}}>סכום לחיוב</Text>

                {(this.state.language == "iw_IL" && Platform.OS == 'android') ?
                    <View style={{flexDirection: 'row', width: 212, height: 50, borderColor: color.line_color, borderWidth: 1.0, alignSelf: 'center', marginTop: 15, alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={[{fontSize: 35, color: color.text_color1}]}>{amount}</Text>
                        <Text style={[styles.label, (Platform.OS == 'ios') ? {marginTop: 12} : {marginTop: 8}]}>₪</Text>
                    </View> :
                    <View style={{flexDirection: 'row', width: 212, height: 50, borderColor: color.line_color, borderWidth: 1.0, alignSelf: 'center', marginTop: 15, alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={[styles.label, (Platform.OS == 'ios') ? {marginTop: 12} : {marginTop: 8}]}>₪</Text>
                        <Text style={[{fontSize: 35, color: color.text_color1}]}>{amount}</Text>
                    </View> }
                
                {(this.state.language == "iw_IL" && Platform.OS == 'android') ?
                    <View style={{flexDirection: 'row', width: windowWidth - 30, height: 30, alignSelf: 'center', alignItems: 'center', marginTop: 25}}>
                        <Text style={[{flex: 1, fontSize: 24, textAlign: 'left'}]}>בחר אמצעי תשלום</Text>

                        <TouchableOpacity onPress={() => this.addPayment()} >
                            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                                <Image source={ require("../resource/add.png") } style={{width: 28, height: 28}}/>
                                <Text style={[{fontSize: 14, color: color.btn_color, marginLeft: 7.5}]}>הוסף כרטיס</Text>
                            </View>
                        </TouchableOpacity>
                    </View> :
                    <View style={{flexDirection: 'row', width: windowWidth - 30, height: 30, alignSelf: 'center', alignItems: 'center', marginTop: 25}}>
                        <TouchableOpacity onPress={() => this.addPayment()} >
                            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                                <Image source={ require("../resource/add.png") } style={{width: 28, height: 28}}/>
                                <Text style={[{fontSize: 14, color: color.btn_color, marginLeft: 7.5}]}>הוסף כרטיס</Text>
                            </View>
                        </TouchableOpacity>

                        <Text style={[{flex: 1, fontSize: 24, textAlign: 'right'}]}>בחר אמצעי תשלום</Text>
                    </View> }

                <View style={{flex: 1, marginTop: 15}}>
                    <FlatList
                        data={this.state.card}
                        keyExtractor={(item, index) => item.index}
                        extraData={this.state}
                        renderItem={({item, index}) => 
                            this.renderItem(item, index)
                        }
                    />
                </View>
                
                {(this.state.selectedIndex !== -1) ?
                    <TouchableOpacity onPress={() => this.payAtRegister(amount, useFuturePayments, useExistingBalance, item.id)} style={[{width: windowWidth - 60, height: 50, borderRadius: 7, alignItems: 'center', alignSelf: 'center', justifyContent: 'center', backgroundColor: color.white, borderColor: color.btn_color, borderWidth: 1}, (Platform.OS == 'ios') ? {marginTop: 30} : {marginTop: 20}]}>
                        <Text style={{color: 'black', opacity: 67, textAlign: 'center', fontSize: 24}}>בצע תשלום</Text>
                    </TouchableOpacity> : null }
                
                <TouchableOpacity onPress={() => this.actionMain()} >
                    <Text style={[{fontSize: 20, textDecorationLine: 'underline', textDecorationColor: '#58656d88', color: '#58656d88', textAlign: 'center', marginTop: 17, marginBottom: 25}]}>בטל תהליך תשלום</Text>
                </TouchableOpacity>

                <Modal animationType='fade' transparent={true} visible={this.state.modalVisible} onRequestClose={() => this.setModalVisible(false)} >
                    <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
                        {/* <TouchableOpacity onPress={() => this.modalDidClose()} > */}
                            <View style={[{ width: windowWidth - 40, height: windowHeight - 70, alignSelf: 'center', alignItems: 'center', backgroundColor: color.white, borderWidth: 3, borderColor: color.btn_color, borderRadius: 17}, (Platform.OS == 'ios') ? {marginTop: 35} : {marginTop: 25}]}>
                                <View style={[{borderColor: color.line_color, borderWidth: .5, justifyContent: 'center', marginTop: 35}, (Platform.OS == 'ios') ? {width: 130, height: 130} : {width: 100, height: 100}]}>
                                    <Image source={ { uri: item.images.thumbUrl} } style={[{width: 84, height: 38, alignSelf: 'center'}]}/>
                                </View>

                                <Text style={{fontSize: 31, textAlign: 'center', color: '#6c6b6b', marginTop: 15}}>{item.name}</Text>
                                <Text style={{fontSize: 15, textAlign: 'center', color: '#6c6b6b'}}>{item.street} {item.houseNumber} {item.city}</Text>

                                <View style={[{width: 120, height: 1, backgroundColor: color.line_color, alignSelf: 'center', marginTop: 18}]} />

                                <Text style={{fontSize: 25, textAlign: 'center', color: '#6c6b6b', marginTop: 17}}>הצג הברקוד לתשלום</Text>

                                <Image source={{ uri: this.state.barcode_link }} style={[{width: 130, height: 130, alignSelf: 'center', marginTop: 15}]}/>
                                <Text style={{fontSize: 13, textAlign: 'center', color: '#6c6b6b', marginTop: 4}}>{this.state.barcode}</Text>

                                <Text style={{fontSize: 14, textAlign: 'center', color: '#6c6b6b', marginTop: 25}}>{(this.state.voucherType === "Rami Levi") ? "התשלום באמצעות רמי לוי התו המלא" : ""}</Text>

                                <TouchableOpacity onPress={() => this.actionMain()}>
                                    <View style={{width: 230, height: 50, backgroundColor: color.btn_color, borderRadius: 10, alignSelf: 'center', marginTop: 10, justifyContent: 'center'}}>
                                        <Text style={{fontSize: 20, color: color.white, textAlign: 'center'}}>סיימתי, תודה</Text>
                                    </View>
                                </TouchableOpacity>

                                {(this.state.language == "iw_IL" && Platform.OS == 'android') ?
                                    <Image source={ require("../resource/big_blue.png") } style={[{width: 50, height: 50, position: 'absolute', top: -25, left: 18}]}/> :
                                    <Image source={ require("../resource/big_blue.png") } style={[{width: 50, height: 50, position: 'absolute', top: -25, right: 18}]}/> }
                            </View>                    
                        {/* </TouchableOpacity> */}
                    </View>                    
                </Modal>

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
    label: {
        fontSize: 18, 
        color: color.text_color1
    },
    subview: {
        width: (windowWidth - 60) / 2 - 6, 
        borderColor: color.btn_color, 
        borderWidth: 1, 
        borderRadius: 3, 
        alignItems: 'center', 
        justifyContent: 'center'
    },
    line: {
        width: 133, 
        height: .5, 
        backgroundColor: color.line_color
    },
    card_view: {
        flexDirection: 'row', 
        width: windowWidth - 30, 
        height: 65, 
        backgroundColor: color.white, 
        borderRadius: 3, 
        borderWidth: 1, 
        borderColor: color.line_color, 
        alignSelf: 'center', 
        alignItems: 'center'
    },
    card_number: {
        fontSize: 16, 
        marginRight: 11
    }
});