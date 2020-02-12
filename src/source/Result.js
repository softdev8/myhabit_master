import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, StatusBar, Platform, ImageBackground, NativeModules, BackHandler} from 'react-native';

import { color, windowWidth } from "./styles/theme"

export default class Result extends Component {

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

    componentDidMount() {

        if (NativeModules.I18nManager && Platform.OS == 'android') {
            const {localeIdentifier} = NativeModules.I18nManager;
            
            this.setState({language: localeIdentifier})
            console.log(localeIdentifier);
        }
    }

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    
    handleBackButtonClick() {
        this.props.navigation.navigate('Questions')
        return true;
    }

    render() {

        return (
            <View style={styles.container}>
                <StatusBar
                    backgroundColor={color.statusBar_morning_color}
                    barStyle="light-content"
                />
                
                <ImageBackground source={require('../resource/bg.png')} style={{flex: 1}}>
                
                    <Image source={ require('../resource/icon.png') } style={[{height: 112, width: 112, alignSelf: 'center', marginTop: 40}]}/>

                    <Image source={ require('../resource/canon.png') } style={[{height: 90, width: 127, alignSelf: 'center', marginTop: 47}]}/>
                    
                    {(this.state.language == "iw_IL" && Platform.OS == 'android') ?                                            
                        <View style={{flexDirection: 'row', alignSelf: 'center'}}>
                            <Text style={[{fontSize: 50, color: color.white, textAlign: 'center'}, (Platform.OS == 'ios') ? {width: 230} : {width: 240}]}>אתה תותח!הרווחת 50</Text>
                            <Text style={{fontSize: 25, color: color.white, marginTop: 89}}>₪</Text>
                        </View> : 
                        <View style={{flexDirection: 'row', alignSelf: 'center'}}>
                            <Text style={{fontSize: 25, color: color.white, marginTop: 89}}>₪</Text>
                            <Text style={[{fontSize: 50, color: color.white, textAlign: 'center'}, (Platform.OS == 'ios') ? {width: 230} : {width: 240}]}>אתה תותח!הרווחת 50</Text>
                        </View> }
                    
                    <Text style={{color: 'white', textAlign: 'center', fontSize: 20, marginTop: 90}}> ענית נכון על 5/5 שאלות</Text>

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