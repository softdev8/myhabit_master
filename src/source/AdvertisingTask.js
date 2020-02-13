import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, Platform, ImageBackground, StatusBar, BackHandler} from 'react-native';

import { color, windowWidth } from "./styles/theme"

import { NavigationEvents } from 'react-navigation';

export default class AdvertisingTask extends Component {

    constructor(props) {
        super(props);

        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }

    static navigationOptions = {
        header: null
    }

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

    actionStart = () => {
        this.props.navigation.navigate('Questions')
    }

    actionMain = () => {
        this.props.navigation.navigate('Main', {selectedTab: 4})
    }

    setStatusBar = () => {
        StatusBar.setBarStyle( 'light-content',true)
        StatusBar.setBackgroundColor(color.statusBar_morning_color)
    }

    render() {

        return (
            <View style={styles.container}>
                <NavigationEvents
                     onWillFocus={payload => console.warn('will focus',payload)}
                     onDidFocus={payload => this.setStatusBar()}
                     onWillBlur={payload => console.warn('will blur',payload)}
                     onDidBlur={payload => console.warn('did blur',payload)} />

                <ImageBackground source={require('../resource/bg.png')} style={{flex: 1}}>
                
                    <Image source={ require('../resource/coins.png') } style={[{height: 52, width: 58, alignSelf: 'center'}, (Platform.OS == 'ios') ? {marginTop: 166} : {marginTop: 150}]}/>
                    
                    <Text style={{color: 'white', textAlign: 'center', fontSize: 27.5, marginTop: 15, fontWeight: 'bold'}}>כאן תוכל להרוויח כסף</Text>

                    <Text style={{color: 'white', textAlign: 'center', marginTop: 15}}>
                        <Text style={{fontSize: 17}}>  ₪</Text>
                        <Text style={{fontSize: 27.5, fontWeight: 'bold'}}>50</Text>
                    </Text>

                    <Text style={{color: 'white', textAlign: 'center', fontSize: 18.5, marginTop: 10}}>כל תשובה נכונה תזכה אותך ב 10 ₪</Text>
                    <Text style={{color: 'white', textAlign: 'center', fontSize: 18.5}}>וגם החברים שלך ירווחו</Text>

                    <TouchableOpacity onPress={() => this.actionStart()} style={[{width: windowWidth - 80, height: 50, borderRadius: 7, alignSelf: 'center', justifyContent: 'center', backgroundColor: 'white', marginTop: 80}]}>
                        <Text style={{color: color.btn_color, textAlign: 'center', fontSize: 20}}>יאללה בואו נתחיל</Text>
                    </TouchableOpacity>      

                    <TouchableOpacity onPress={() => this.actionMain()} >
                        <Text style={[{fontSize: 20, textDecorationLine: 'underline', textDecorationColor: '#58656d88', color: color.white, textAlign: 'center', marginTop: 30}]}>הבנתי, אולי פעם אחרת</Text>
                    </TouchableOpacity>              
                
                </ImageBackground>
            </View>
        )
    }


}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    }    
});