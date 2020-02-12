import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, StatusBar, Platform, ImageBackground, NativeModules, BackHandler} from 'react-native';

import { color, windowWidth, windowHeight } from "./styles/theme"

export default class QRcodeResult extends Component {

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
        this.props.navigation.navigate('QRcode')
        return true;
    }

    actionScan = () => {
        this.props.navigation.navigate('QRcode')
    }

    actionMain = () => {
        this.props.navigation.navigate('Main')
    }

    render() {

        return (
            <View style={styles.container}>
                <StatusBar
                    backgroundColor={color.statusBar_morning_color}
                    barStyle="light-content"
                />

                <ImageBackground source={require('../resource/bg.png')} style={{flex: 1}}>

                    <Text style={{color: 'white', textAlign: 'center', fontSize: 25, marginTop: 30}}>סרוק את המוצר שברשותך</Text>

                    <Image source={ require('../resource/green_v.png') } style={[{height: 114, width: 114, alignSelf: 'center', marginTop: 20}]}/>

                    <Text style={[{width: 200, color: 'white', textAlign: 'center', fontSize: 17, alignSelf: 'center'}, (Platform.OS == 'ios') ? {marginTop: 18} : {marginTop: 10}]}>שם המוצר נסרק בהצלחה
נא סרוק את המוצר הבא</Text>

                    <View style={{width: 120, height: 50, alignSelf: 'center', position: 'absolute', bottom: windowHeight / 2}}>
                        <Image source={require('../resource/round.png')} style={{width: 120, height: 120}} />
                        <Text style={{position: 'absolute', top: 22, alignSelf: 'center', fontSize: 15, color: '#109fe4'}}>0/20</Text>
                    </View>                   

                    <View style={{width: windowWidth, height: windowHeight / 2, position: 'absolute', bottom: 0, backgroundColor: '#000', alignItems: 'center'}}>
                        <Image source={ require('../resource/cross.png') } style={[{height: 16, width: 16, position: 'absolute', top: 15}, (this.state.language == "iw_IL" && Platform.OS == 'android') ? {left: 15} : {right: 15}]}/>
                        
                        <Text style={{width: 300, color: 'white', textAlign: 'center', fontSize: 25, marginTop: 60}}>האם אתה בטוח שברצונך 
לסיים את המשימה</Text>
                        <TouchableOpacity onPress={() => this.actionScan()} >
                            <View style={[styles.button_view, {marginTop: 32}]}>
                                <Text style={styles.label}>בוא נמשיך בכל זאת</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => this.actionMain()} >
                            <View style={[styles.button_view, {marginTop: 15}]}>
                                <Text style={styles.label}>כן, בוא נסיים</Text>
                            </View>
                        </TouchableOpacity>
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
    button_view: {
        width: windowWidth - 80, height: 45, borderColor: color.white, borderWidth: 1, borderRadius: 5
    },
    label: {
        color: 'white', textAlign: 'center', fontSize: 24
    }
    
});