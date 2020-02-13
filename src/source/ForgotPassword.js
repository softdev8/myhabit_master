import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, TextInput, StatusBar} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

const deviceWidth = Dimensions.get('window').width
import { color, windowWidth } from "./styles/theme"

export default class ForgotPassword extends Component {

    constructor(props) {
        super(props);
    }

    static navigationOptions = {
        header: null
    }

    actionForgot = () => {
        this.props.navigation.navigate('Login')
    }

    render() {

        return (
            <View style={styles.container}>
                <StatusBar
                    backgroundColor={color.statusBar_morning_color}
                    barStyle="light-content"
                />
                
                <LinearGradient start={{x: 0, y: 0}} end={{x: 0, y: 1}} colors={['#3023AE', '#00DCFF']} style={{flex: 1, alignItems: 'center'}}>
                    <Image source={ require('../resource/logo.png') } style={{height: 93, width: 135, marginTop: 60}}/>

                    <Image source={ require('../resource/logo1.png') } style={{height: 57, width: 125, marginTop: 30}}/>
                    
                    <Text style={{color: 'white', textAlign: 'center', fontSize: 18, marginLeft: 20, marginTop: 25}}>שכחת סיסמא?</Text>
                    <Text style={{color: 'white', textAlign: 'center', fontSize: 18, marginLeft: 20}}>לא נורא, הכנס את כתובת המייל</Text>
                    <Text style={{color: 'white', textAlign: 'center', fontSize: 18, marginLeft: 20}}>ואנחנו נשלח לך קוד לאתחול סיסמתך</Text>
                    
                    <View style={[styles.input_view, {marginTop: 30}]}>
                        <TextInput style={[styles.text_input, styles.viewSpace]}
                                underlineColorAndroid = "transparent"
                                placeholder = "מייל"
                                placeholderTextColor = "white"
                                autoCapitalize = "none" />
                    </View>

                    <TouchableOpacity onPress={() => this.actionForgot()} style={[{width: deviceWidth - 80, height: 50, borderRadius: 7, alignItems: 'center', justifyContent: 'center', backgroundColor: '#3D4FCA', marginTop: 25}]}>
                        <Text style={{color: 'white', textAlign: 'center', fontSize: 20, marginLeft: 20}}>אתחל סיסמא</Text>
                    </TouchableOpacity>

                    <View style={{width: deviceWidth - 80, alignItems: 'flex-end', marginRight: 12}}>
                        <Text style={{color: 'white', textAlign: 'right', fontSize: 18, marginLeft: 20, marginTop: 10}}>או הרשם</Text>
                    </View>
                    
                    

                </LinearGradient>
            </View>
        )
    }


}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    text_input: {
        flex: 1, 
        height: 40, 
        fontSize: 18,
        textAlign: 'right',
        color: 'white'
    },
    viewSpace: {
        marginLeft: 15,
        marginRight: 15
    },
    input_view: {
        width: deviceWidth - 80, 
        height: 50, 
        borderRadius: 7, 
        borderColor: 'white', 
        borderWidth: 1, 
        justifyContent: 'center'
    }
});