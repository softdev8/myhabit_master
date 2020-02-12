import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, StatusBar, ImageBackground, NativeModules, Platform, BackHandler} from 'react-native';

import { color, windowWidth } from "./styles/theme"

export default class Questions extends Component {

    constructor(props) {
        super(props);

        this.state = {
            incorrect: false,
            correct: false,
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
        this.props.navigation.navigate('AdvertisingTask')
        return true;
    }

    actionIncorrect = (incorrect) => {
        this.setState({
            incorrect: !incorrect
        })
    }

    actionCorrect = (correct) => {
        this.setState({
            correct: !correct
        })
    }

    actionNext = () => {
        this.props.navigation.navigate('Result')
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
                    
                    <Text style={{color: 'white', textAlign: 'center', fontSize: 15, marginTop: 12, fontWeight: 'bold'}}>המשימה בחסות סופר פארם</Text>

                    <Text style={{width: 250, color: 'white', textAlign: 'center', fontSize: 25, marginTop: 45, alignSelf: 'center'}}>באיזה מדינה אין 
לסופר פארם סניפים?</Text>
                    
                    {(this.state.language == "iw_IL" && Platform.OS == 'android') ?
                        <View style={{flexDirection: 'row', height: 50, marginTop: 35, alignItems: 'center', justifyContent: 'center'}}>
                            <TouchableOpacity onPress={() => this.actionCorrect(this.state.correct)} >
                                <View style={[styles.input_view, {marginRight: 20}, (this.state.correct) ? {borderColor: '#86d03a', backgroundColor: color.white} : null]}>    
                                    <Text style={[{color: 'white', textAlign: 'center', fontSize: 17.5}, (this.state.correct) ? {color: '#86d03a'} : null]}>ישראל</Text>
                                    {(this.state.correct) ? 
                                    <Image source={ require('../resource/correct.png') } style={[{height: 20, width: 20, position: 'absolute', top: -10, right: 10}]}/> : null }
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => this.actionIncorrect(this.state.incorrect)} >
                                <View style={[styles.input_view, (this.state.incorrect) ? {borderColor: '#d0021b', backgroundColor: color.white} : null]}>
                                    <Text style={[{color: 'white', textAlign: 'center', fontSize: 17.5}, (this.state.incorrect) ? {color: '#d0021b'} : null]}>רומניה</Text>
                                    {(this.state.incorrect) ?
                                    <Image source={ require('../resource/incorrect.png') } style={[{height: 20, width: 20, position: 'absolute', top: -10, right: 10}]}/> : null}
                                </View>
                            </TouchableOpacity>
                        </View> :
                        <View style={{flexDirection: 'row', height: 50, marginTop: 35, alignItems: 'center', justifyContent: 'center'}}>
                            <TouchableOpacity onPress={() => this.actionIncorrect(this.state.incorrect)} >
                                <View style={[styles.input_view, (this.state.incorrect) ? {borderColor: '#d0021b', backgroundColor: color.white} : null]}>
                                    <Text style={[{color: 'white', textAlign: 'center', fontSize: 17.5}, (this.state.incorrect) ? {color: '#d0021b'} : null]}>רומניה</Text>
                                    {(this.state.incorrect) ?
                                    <Image source={ require('../resource/incorrect.png') } style={[{height: 20, width: 20, position: 'absolute', top: -10, right: 10}]}/> : null}
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => this.actionCorrect(this.state.correct)} >
                                <View style={[styles.input_view, {marginLeft: 20}, (this.state.correct) ? {borderColor: '#86d03a', backgroundColor: color.white} : null]}>    
                                    <Text style={[{color: 'white', textAlign: 'center', fontSize: 17.5}, (this.state.correct) ? {color: '#86d03a'} : null]}>ישראל</Text>
                                    {(this.state.correct) ? 
                                    <Image source={ require('../resource/correct.png') } style={[{height: 20, width: 20, position: 'absolute', top: -10, right: 10}]}/> : null }
                                </View>
                            </TouchableOpacity>
                        </View> }

                    {(this.state.language == "iw_IL" && Platform.OS == 'android') ?                                            
                        <View style={{flexDirection: 'row', height: 50, marginTop: 20, alignItems: 'center', justifyContent: 'center'}}>
                            <View style={[styles.input_view, {marginRight: 20}]}>    
                                <Text style={{color: 'white', textAlign: 'center', fontSize: 17.5}}>סין</Text>
                            </View>

                            <View style={[styles.input_view]}>
                                <Text style={{color: 'white', textAlign: 'center', fontSize: 17.5}}>ארה"ב</Text>
                            </View>
                        </View> :
                        <View style={{flexDirection: 'row', height: 50, marginTop: 20, alignItems: 'center', justifyContent: 'center'}}>
                            <View style={[styles.input_view]}>
                                <Text style={{color: 'white', textAlign: 'center', fontSize: 17.5}}>ארה"ב</Text>
                            </View>

                            <View style={[styles.input_view, {marginLeft: 20}]}>    
                                <Text style={{color: 'white', textAlign: 'center', fontSize: 17.5}}>סין</Text>
                            </View>
                        </View> }

                    <Text style={{color: 'white', textAlign: 'center', fontSize: 25, marginTop: 35, fontWeight: 'bold'}}>1/5</Text>

                    <TouchableOpacity onPress={() => this.actionNext()} >                                        
                        <Text style={{color: 'white', textAlign: 'center', fontSize: 25, marginTop: 35, fontWeight: 'bold'}}>Next</Text>
                    </TouchableOpacity>
                </ImageBackground>
            </View>
        )
    }


}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    input_view: {
        width: (windowWidth - 100) / 2, 
        height: 50, 
        borderRadius: 7, 
        borderColor: 'white', 
        borderWidth: 1.5, 
        justifyContent: 'center'
    }
});