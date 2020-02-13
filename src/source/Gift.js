import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, StatusBar, Platform, ImageBackground, BackHandler} from 'react-native';

import { color, windowWidth } from "./styles/theme"

export default class Gift extends Component {

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
        this.props.navigation.navigate('UserProfile')
        return true;
    }

    actionGift = () => {
        this.props.navigation.navigate('CatchUp')
    }

    render() {

        return (
            <View style={styles.container}>
                <StatusBar
                    backgroundColor={color.statusBar_morning_color}
                    barStyle="light-content"
                />
                
                <ImageBackground source={require('../resource/bg.png')} style={{flex: 1}}>
                
                    <Image source={ require('../resource/logo1.png') } style={[{height: 57, width: 125, alignSelf: 'center'}, (Platform.OS == 'ios') ? {marginTop: 50} : {marginTop: 30}]}/>
                    
                    <Text style={{color: 'white', textAlign: 'center', fontSize: 22, marginTop: 25, fontWeight: 'bold'}}>איזה כיף קיבלת מתנה</Text>

                    <Image source={ require('../resource/gift.png') } style={[{height: 88, width: 88, alignSelf: 'center'}, (Platform.OS == 'ios') ? {marginTop: 30} : {marginTop: 20}]}/>

                    <Text style={[{color: 'white', textAlign: 'center', fontSize: 20}, (Platform.OS == 'ios') ? {marginTop: 50} : {marginTop: 35}]}>כדי שתרגיש למה כדי לך</Text>
                    <Text style={{color: 'white', textAlign: 'center', fontSize: 20}}>פינקנו אותך</Text>

                    <Text style={{color: 'white', textAlign: 'center', marginTop: 15}}>
                        <Text style={{fontSize: 22, fontWeight: 'bold'}}> ב</Text>
                        <Text style={{fontSize: 17}}>  ₪</Text>
                        <Text style={{fontSize: 22, fontWeight: 'bold'}}>30</Text>
                    </Text>
                    <Text style={{color: 'white', textAlign: 'center', fontSize: 22, fontWeight: 'bold'}}>מתנת הצטרפות</Text>

                    <Text style={{color: 'white', textAlign: 'center', fontSize: 20, marginTop: 10}}>תוכל להמשיך ולהרוויח כסף</Text>
                    <Text style={{color: 'white', textAlign: 'center', fontSize: 20}}>עם ביצוע עסקאות באפליקציה</Text>


                    <TouchableOpacity onPress={() => this.actionGift()} style={[{width: windowWidth - 80, height: 50, borderRadius: 7, alignSelf: 'center', justifyContent: 'center', backgroundColor: '#3D4FCA'}, (Platform.OS == 'ios') ? {marginTop: 55} : {marginTop: 35}]}>
                        <Text style={{color: 'white', textAlign: 'center', fontSize: 20}}>המשך</Text>
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
        width: windowWidth - 80, 
        height: 50, 
        borderRadius: 7, 
        borderColor: 'white', 
        borderWidth: 1, 
        justifyContent: 'center'
    }
});