import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ImageBackground, Image, Platform, ScrollView, AsyncStorage, StatusBar, NativeModules} from 'react-native';

import { color, windowWidth } from "../styles/theme"
import { App } from '../global.js';

import { NavigationEvents } from 'react-navigation';
import Loading from 'react-native-whc-loading'

export default class House extends Component {

    constructor(props) {
        super(props);

        this.state = {
            hour: '',
            result: null,
            navigation: props.navigation,
            language: ''
        };

        if (props.selectedTab == 4) {

            this.getDashboard()
        }
    }

    componentDidMount() {

        if (NativeModules.I18nManager && Platform.OS == 'android') {
            const {localeIdentifier} = NativeModules.I18nManager;
            
            this.setState({language: localeIdentifier})
            console.log(localeIdentifier);
        }

        this.refs.loading.show();    
    }

    async getDashboard() {

        var date, hour;
        
        date = new Date();
        hour = date.getHours(); 
        // console.log("Date", date);
        // console.log("Hour123", hour);

        // var statusBar_color = (hour < 11) ? color.statusBar_morning_color : (hour < 20) ? color.statusBar_lunch_color : color.statusBar_evening_color
        // StatusBar.setBarStyle( 'light-content',true)
        // StatusBar.setBackgroundColor(statusBar_color)
        
        var token = await AsyncStorage.getItem("token")
        // var token = 4
        console.log("token", token);

        await fetch("http://shobbing.herokuapp.com/v2/api/customer/dashboard", {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'token': token
            },
            }).then((response) => response.json())
            .then((responseJson) => {
                
                console.warn("dashboard", responseJson.result);
                
                if (responseJson.status == "OK") {

                    AsyncStorage.setItem('currentBalance', `${responseJson.result.currentBalance}`);
                    AsyncStorage.setItem('first_name', responseJson.result.customer.name.first);
                    AsyncStorage.setItem('last_name', responseJson.result.customer.name.last);
                    AsyncStorage.setItem('imageUrl', responseJson.result.customer.imageUrl);
                    AsyncStorage.setItem('email', responseJson.result.customer.email);
                    AsyncStorage.setItem('futurePayments', JSON.stringify(responseJson.result.futurePayments));
                    
                    this.refs.loading.close();

                    this.setState({
                        result: responseJson.result,
                        hour: hour
                    })                    
                }
            })
            .catch((error) => {
                console.error(error);

                this.refs.loading.close();
        });
    }

    actionDetails = (currentBalance) => {
        this.state.navigation.navigate('Main', {selectedTab: 5, currentBalance: currentBalance})
    }

    renderItem(item, index) {

        var value = Math.floor(item.amount * 100) / 100 ;

        return (
            <View style={[{marginLeft: 20, borderRadius: 10, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', borderWidth: 0.3, borderColor: color.text_color1}, (Platform.OS == 'ios') ? {height: 150, width: 150} : {height: 125, width: 125}]}>
                <Image source={{ uri: item.store.imageUrl }} style={[{resizeMode: 'stretch', width: 75, height: 60}, (Platform.OS == 'android') ? {width: 65, height: 60} : null]}/>

                <View style={[{width: 75, height: 0.5, backgroundColor: color.line_color, alignSelf: 'center'}, (Platform.OS == 'ios') ? {marginTop: 5, marginBottom: 10} : {marginTop: 5, marginBottom: 5}]} />

                <Text style={{color: color.text_color2, textAlign: 'center'}}>
                    <Text style={{fontSize: 18}}>  ₪</Text>
                    <Text style={{fontSize: 22}}>{value}</Text>
                </Text>
            </View>
        );
    }

    render() {

        let listPages = null
        if (this.state.result) {
            listPages = this.state.result.profitByStore.map((item, index) => {
                return this.renderItem(item, index);
            });    
        }        

        console.log("Hour", this.state.hour);
        let bg_img = (this.state.hour < 11) ? require('../../resource/bg_morning.png') : ((this.state.hour < 20) ? require('../../resource/bg_noon.png') : require('../../resource/bg_evening.png'))

        let currentBalance = (this.state.result) ? this.state.result.currentBalance : ""
        let todaysProfit = (this.state.result) ? this.state.result.todaysProfit : ""
        let totalProfit = (this.state.result) ? this.state.result.totalProfit : ""

        let name = (this.state.result) ? this.state.result.customer.name.first + " " + this.state.result.customer.name.last : ""
        let label = (this.state.hour < 11) ? "בוקר טוב" : (this.state.hour < 20) ? "צהריים טובים" : "ערב טוב"
        App.hour = label

        let user_avatar = (this.state.result) ? this.state.result.customer.imageUrl : null

        return (
            <View style={styles.container}>
                
                <NavigationEvents
                     onWillFocus={payload => console.warn('will focus',payload)}
                     onDidFocus={payload => this.getDashboard()}
                     onWillBlur={payload => console.warn('will blur',payload)}
                     onDidBlur={payload => console.warn('did blur',payload)} />

                <ImageBackground source={ bg_img } style={[{width: windowWidth}, (Platform.OS == 'ios') ? {height: 341} : {height: 300}]}>
                    <Image source={ { uri: user_avatar } } style={[{width: 75, height: 75, alignSelf: 'center', borderRadius: 37.5}, (Platform.OS == 'ios' ? {marginTop: 50} : {marginTop: 20})]}/>

                    {(this.state.language == "iw_IL" && Platform.OS == 'android') ?
                        <Text style={{color: 'white', textAlign: 'center', fontSize: 20, marginTop: 10}}>{label}, {name}</Text> :
                        <Text style={{color: 'white', textAlign: 'center', fontSize: 20, marginTop: 10}}>{name}, {label}</Text> }
                    <Text style={{color: 'white', textAlign: 'center', fontSize: 20}}>יתרתך</Text>

                    <Text style={{color: 'white', textAlign: 'center', fontWeight: 'bold'}}>
                        <Text style={{fontSize: 25}}>  ₪</Text>
                        <Text style={{fontSize: 50}}>{currentBalance}</Text>
                    </Text>

                    <TouchableOpacity onPress={() => this.actionDetails(currentBalance)}>
                        <Text style={{color: 'white', textAlign: 'center', fontSize: 20, textDecorationLine: 'underline', textDecorationColor: color.white}}>הצג פירוט</Text>
                    </TouchableOpacity>

                    {(this.state.hour < 11) ?
                    <Image source={ require("../../resource/sun.png") } style={{position: 'absolute', left: -72, top: 110, width: 132, height: 148}}/>
                    : (this.state.hour < 20) ? <Image source={ require("../../resource/sun.png") } style={[{position: 'absolute', width: 132, height: 148, right: -67}, (Platform.OS == 'ios') ? {top: 90} : {top: 70}]}/> :
                    <Image source={ require("../../resource/moon.png") } style={{position: 'absolute', left: -32, top: 110, width: 132, height: 148}}/> }

                </ImageBackground>

                <View style={[{flexDirection: 'row', width: windowWidth - 80, height: 75, backgroundColor: color.white, alignSelf: 'center', borderRadius: 12}, (Platform.OS == 'ios') ? {marginTop: -55} : {marginTop: -40}]}>
                    <View style={[{width: (windowWidth - 80) / 2}, styles.sub_view]}>
                        <Text style={styles.label}>כמה הרווחתי היום</Text>
                        <Text style={styles.label1}>
                            <Text style={{fontSize: 18}}>  ₪</Text>
                            <Text style={{fontSize: 25}}>{todaysProfit}</Text>
                        </Text>
                    </View>

                    <View style={{width: 0.8, height: 50, backgroundColor: color.line_color, alignSelf: 'center'}} />

                    <View style={[{flex: 1}, styles.sub_view]}>
                        <Text style={styles.label}>סך הרווחים שלי</Text>
                        <Text style={styles.label1}>
                            <Text style={{fontSize: 18}}>  ₪</Text>
                            <Text style={{fontSize: 25}}>{totalProfit}</Text>
                        </Text>
                    </View>
                </View>

                <Text style={[{color: color.text_color1, textAlign: 'center', fontSize: 17}, (Platform.OS == 'ios') ? {marginTop: 10} : {marginTop: 10}]}>הרווח שלי מקניות חברתיות</Text>

                <View style={[{ marginTop: 15}, (Platform.OS == 'ios') ? {height: 150} : {height: 125}]}>
                    <ScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={false} >

                        {listPages}

                    </ScrollView>
                </View>
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
    sub_view: {
        borderTopLeftRadius: 12, 
        borderBottomLeftRadius: 12, 
        justifyContent: 'center'
    },
    label: {
        color: color.text_color1, 
        textAlign: 'center', 
        fontSize: 15
    },
    label1: {
        color: color.text_color2, 
        textAlign: 'center', 
        marginTop: 5
    },
});