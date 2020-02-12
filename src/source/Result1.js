import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, StatusBar, Platform, ImageBackground, NativeModules, BackHandler} from 'react-native';

import { color, windowWidth } from "./styles/theme"

export default class Result1 extends Component {

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

                    <Image source={ require('../resource/hart.png') } style={[{height: 83, width: 158, alignSelf: 'center', marginTop: 70}]}/>
                    
                    {(this.state.language == "iw_IL" && Platform.OS == 'android') ?                                            
                        <View style={{alignSelf: 'center', marginTop: 20}}>
                            <Text style={{fontSize: 36, color: color.white, textAlign: 'center'}}>ננסה בפעם הבאה</Text>
                            <Text style={{fontSize: 36, color: color.white, textAlign: 'center'}}>לא נורא</Text>
                        </View> :
                        <View style={{alignSelf: 'center', marginTop: 20}}>
                            <Text style={{fontSize: 36, color: color.white, textAlign: 'center'}}>לא נורא</Text>
                            <Text style={{fontSize: 36, color: color.white, textAlign: 'center'}}>ננסה בפעם הבאה</Text>
                        </View> }    
                    
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