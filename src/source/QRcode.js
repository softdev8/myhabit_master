import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, BackHandler, Platform, ImageBackground, StatusBar, NativeModules} from 'react-native';

import { color, windowWidth, windowHeight } from "./styles/theme"

import { NavigationEvents } from 'react-navigation';
import QRCodeScanner from 'react-native-qrcode-scanner';

export default class QRcode extends Component {

    constructor(props) {
        super(props);

        this.state = {
            language: ''
        }

        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }

    static navigationOptions = {
        header: null
    }

    // componentDidMount() {

    //     if (NativeModules.I18nManager && Platform.OS == 'android') {
    //         const {localeIdentifier} = NativeModules.I18nManager;
            
    //         this.setState({language: localeIdentifier})
    //         console.log(localeIdentifier);
    //     }
    // }

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    
    handleBackButtonClick() {
        this.props.navigation.navigate('Main', {selectedTab: 4})
        return true;
    }

    getLanguage = () => {
        if (NativeModules.I18nManager && Platform.OS == 'android') {
            const {localeIdentifier} = NativeModules.I18nManager;
            
            this.setState({language: localeIdentifier})
            console.log(localeIdentifier);
        }
    }

    onSuccess(e) {
        this.props.navigation.navigate('QRcodeResult')
    }

    render() {

        return (
            <View style={styles.container}>
                <NavigationEvents
                     onWillFocus={payload => console.warn('will focus',payload)}
                     onDidFocus={payload => this.getLanguage()}
                     onWillBlur={payload => console.warn('will blur',payload)}
                     onDidBlur={payload => console.warn('did blur',payload)} />

                <StatusBar
                    backgroundColor={color.statusBar_morning_color}
                    barStyle="light-content"
                />
                
                <ImageBackground source={require('../resource/bg.png')} style={{flex: 1}}>

                    <Text style={{color: 'white', textAlign: 'center', fontSize: 25, marginTop: 30}}>סרוק את המוצר שברשותך</Text>

                    <Image source={ require('../resource/barcod.png') } style={[{height: 126, width: 151, alignSelf: 'center', marginTop: 25}]}/>

                    <View style={{width: 120, height: 50, alignSelf: 'center', position: 'absolute', bottom: windowHeight / 2}}>
                        <Image source={require('../resource/round.png')} style={{width: 120, height: 120}} />
                        <Text style={{position: 'absolute', top: 22, alignSelf: 'center', fontSize: 15, color: '#109fe4'}}>0/20</Text>
                    </View>                   

                    <View style={{width: windowWidth, height: windowHeight / 2, position: 'absolute', bottom: 0, backgroundColor: '#000'}}>
                        
                        <Image source={ require('../resource/cross.png') } style={[{height: 16, width: 16, position: 'absolute', top: 10}, (this.state.language == "iw_IL" && Platform.OS == 'android') ? {left: 15} : {right: 15}]}/>

                        <QRCodeScanner  
                            cameraStyle={{width: windowWidth - 170, height: windowHeight / 2 - 150, alignSelf: 'center', transform: [{ rotate: '90deg' }]}}
                            onRead={this.onSuccess.bind(this)} />
                        
                        <View style={[styles.size, styles.view, styles.postion]} />
                        <View style={[styles.size, styles.view, styles.postion1]} />
                        <View style={[styles.size, styles.view, styles.postion2]} />
                        <View style={[styles.size, styles.view, styles.postion3]} />

                        <View style={[styles.size1, styles.view, styles.postion]} />
                        <View style={[styles.size1, styles.view, styles.postion1]} />
                        <View style={[styles.size1, styles.view, styles.postion2]} />
                        <View style={[styles.size1, styles.view, styles.postion3]} />
                    </View>

                    
                    
                </ImageBackground>
             </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    view: {
        backgroundColor: color.white, position: 'absolute'
    },
    postion: {
        left: 35, top: 40
    },
    postion1: {
        left: 35, bottom: 40
    },
    postion2: {
        right: 35, top: 40
    },
    postion3: {
        right: 35, bottom: 40
    },
    size: {
        width: 40, height: 4 
    },
    size1: {
        width: 4, height: 40
    }
});