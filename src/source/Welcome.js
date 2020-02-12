import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, Platform, AsyncStorage, StatusBar, BackHandler, Alert} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import { NavigationEvents } from 'react-navigation';

const deviceWidth = Dimensions.get('window').width

import { color, windowWidth } from "./styles/theme"

export default class Welcome extends Component {

    constructor(props) {
        super(props);

        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }

    static navigationOptions = {
        header: null
    }

    async componentDidMount() {

        var token = await AsyncStorage.getItem("token")
        console.log("token", token);
        
        if (token != null && token != "") {
            this.props.navigation.navigate("Main")    
        } 

    }

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    
    handleBackButtonClick() {
        Alert.alert(
            'Exit App',
            'Do you want to exit?',
            [
              {text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
              {text: 'Yes', onPress: () => BackHandler.exitApp()},
            ],
            { cancelable: false });
        return true;
    }

    onActionStart = () => {
        this.props.navigation.navigate("Phone")    
        // this.props.navigation.navigate("Main")    
    }

    welcome() {
        StatusBar.setBarStyle( 'light-content',true)
        StatusBar.setBackgroundColor(color.statusBar_morning_color)        
    }

    render() {

        return (
            <View style={styles.container}>

                <NavigationEvents
                     onWillFocus={payload => console.warn('will focus',payload)}
                     onDidFocus={payload => this.welcome()}
                     onWillBlur={payload => console.warn('will blur',payload)}
                     onDidBlur={payload => console.warn('did blur',payload)} />

                <LinearGradient start={{x: 0, y: 0}} end={{x: 0, y: 1}} colors={['#3023AE', '#00DCFF']} style={{flex: 1, alignItems: 'center'}}>
                    <Image source={ require('../resource/logo.png') } style={{height: 93, width: 148, marginTop: 40}}/>

                    <Image source={ require('../resource/logo1.png') } style={{height: 57, width: 125, marginTop: 30}}/>

                    <Text style={[{color: 'white', textAlign: 'center', fontSize: 34, marginTop: 24}]}>ברוכים הבאים</Text>

                    <Text style={[{color: 'white', textAlign: 'center', fontSize: 20, marginTop: 5}, (Platform.OS == 'ios') ? {width: 165} : {width: 180}]}>לראשונה 
מימון חברתי בארנק דיגיטלי</Text>

                    <View style={[{width: 200, height: 50, borderRadius: 7, borderColor: 'white', borderWidth: 1, alignItems: 'center', justifyContent: 'center'}, (Platform.OS == 'ios') ? {marginTop: 65} : {marginTop: 35}]}>
                        <Text style={{width: 165, color: 'white', textAlign: 'center', fontSize: 20}}>איך זה עובד?</Text>
                    </View>

                    <TouchableOpacity onPress={() => this.onActionStart()} style={[{width: deviceWidth - 80, height: 50, borderRadius: 7, alignItems: 'center', justifyContent: 'center', backgroundColor: '#3D4FCA', position: 'absolute'}, (Platform.OS == 'ios') ? {bottom: 100} : {bottom: 40}]}>
                        <Text style={{color: 'white', textAlign: 'center', fontSize: 24}}>הבא</Text>
                    </TouchableOpacity>

                </LinearGradient>
            </View>
        )
    }


}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});