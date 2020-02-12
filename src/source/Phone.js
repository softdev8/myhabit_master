import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, Platform, TextInput, AsyncStorage, StatusBar, NativeModules, BackHandler, Modal} from 'react-native';

import { color, windowWidth, windowHeight } from "./styles/theme"
import LinearGradient from 'react-native-linear-gradient';
import { NavigationEvents } from 'react-navigation';

export default class Phone extends Component {

    constructor(props) {
        super(props);

        this.state = {
            prefix_number: "05",
            end_number: "",
            language: "",
            errorVisible: false
        }

        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }

    static navigationOptions = {
        header: null
    }

    componentDidMount() {

        StatusBar.setBarStyle( 'light-content',true)
        StatusBar.setBackgroundColor(color.statusBar_morning_color) 
        
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
        this.props.navigation.navigate('Welcome')
        return true;
    }

    componentWillReceiveProps(props) {
        this.setState({
            prefix_number: "05",
            end_number: ""
        })
    }

    reset() {
        this.setState({
            prefix_number: "05",
            end_number: ""
        })
    }

    setModalVisible = (visible) => {
        this.setState({ errorVisible: visible });
    }

    modalDidClose = () => {
        this.setState({ errorVisible: false });
    };

    onActionStart = () => {

        const {prefix_number, end_number} = this.state

        if (prefix_number.length == 0 || end_number.length == 0) {
            alert("Please enter phone number");
        } else { 

            if (prefix_number.substr(0, 1) != "0") {
                alert("Please enter phone number correctly.");
            } else {
                this.postPhoneVerify("+972" + prefix_number.substr(1, prefix_number.length) + end_number)
            }
        }
    }

    async postPhoneVerify(number) {

        let device_type = Platform.OS

        await fetch("http://shobbing.herokuapp.com/v2/api/customer/signup", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                phone: number,
                deviceType: device_type,
            })
            }).then((response) => response.json())
            .then((responseJson) => {

                if (responseJson.status == "OK") {

                    AsyncStorage.setItem('phone', number);

                    this.props.navigation.navigate("PhoneVerification", {send: true})
                } else {
                    this.setState({
                        errorVisible: true
                    })
                }
            })
            .catch((error) => {
                console.error(error);
        });
    }

    onPinInput = (number, index) => {
        
        const {prefix_number, end_number} = this.state

        var value = -1

        if (index == 3) {
            if (number != 10 && number != 12) {
                value = 0
            } else if (number == 12) {
                // alert(end_number);
                
                if (end_number.length != 0) {
                    this.setState({
                        end_number: (end_number.length == 1) ? "" : end_number.substr(0, end_number.length - 1)
                    })    
                } else {
                    this.setState({
                        prefix_number: (prefix_number.length == 1) ? "" : prefix_number.substr(0, prefix_number.length - 1)
                    })    
                }                
            }
        } else {
            value = number
        }

        if (number != 12 && number != 10) {
            if (prefix_number.length < 3) {

                this.setState({
                    prefix_number: prefix_number.concat("" + value + "")    
                })
            } else {

                this.setState({
                    end_number: end_number.concat("" + value + "")    
                })
            }        
        }
    }

    renderItem(index) {
        
        return (
            (this.state.language == "iw_IL" && Platform.OS == 'android') ?
            <View style={styles.view}>
                <TouchableOpacity onPress={() => this.onPinInput(3 + 3*index, index)}>
                    <View style={{width: 75}}>
                        {(index != 3) ? 
                            <Text style={[styles.button, (Platform.OS == 'ios') ? {paddingTop: 12} : null]}>{(index != 3) ? 3 + 3*index : ""}</Text> :
                            <Image source={ require('../resource/path.png') } style={{height: 29, width: 41, alignSelf: 'center'}}/>
                        }
                    </View> 
                </TouchableOpacity>                
                <TouchableOpacity onPress={() => this.onPinInput(2 + 3*index, index)}>
                    <View style={{width: 75, marginLeft: 15}}>
                        <Text style={[styles.button, (Platform.OS == 'ios') ? {paddingTop: 12} : null]}>{(index != 3) ? 2 + 3*index : "0"}</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.onPinInput(1 + 3*index, index)}>
                    <View style={{width: 75, marginLeft: 15}}>
                        <Text style={[styles.button, (Platform.OS == 'ios') ? {paddingTop: 12} : null]}>{ (index != 3) ? 1 + 3*index : ""}</Text>
                    </View>
                </TouchableOpacity>
            </View> : 
            <View style={styles.view}>
                <TouchableOpacity onPress={() => this.onPinInput(1 + 3*index, index)}>
                    <View style={{width: 75}}>
                        <Text style={[styles.button, (Platform.OS == 'ios') ? {paddingTop: 12} : null]}>{ (index != 3) ? 1 + 3*index : ""}</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.onPinInput(2 + 3*index, index)}>
                    <View style={{width: 75, marginLeft: 15}}>
                        <Text style={[styles.button, (Platform.OS == 'ios') ? {paddingTop: 12} : null]}>{(index != 3) ? 2 + 3*index : "0"}</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.onPinInput(3 + 3*index, index)}>
                    <View style={{width: 75, marginLeft: 15}}>
                        {(index != 3) ? 
                            <Text style={[styles.button, (Platform.OS == 'ios') ? {paddingTop: 12} : null]}>{(index != 3) ? 3 + 3*index : ""}</Text> :
                            <Image source={ require('../resource/path.png') } style={{height: 29, width: 41, alignSelf: 'center'}}/>
                        }
                    </View> 
                </TouchableOpacity>
            </View>
        )
    }

    render() {

        listPages = new Array();
        for (let index = 0; index < 4; index++) {
            listPages.push(this.renderItem(index));
        }

        return (
            <View style={styles.container}>

                <NavigationEvents
                     onWillFocus={payload => console.warn('will focus',payload)}
                     onDidFocus={payload => this.reset()}
                     onWillBlur={payload => console.warn('will blur',payload)}
                     onDidBlur={payload => console.warn('did blur',payload)} />

                <LinearGradient start={{x: 0, y: 0}} end={{x: 0, y: 1}} colors={['#3023AE', '#00DCFF']} style={{flex: 1, alignItems: 'center'}}>
                    
                    <View style={[{width: windowWidth, backgroundColor: color.title_bar}, (Platform.OS == 'ios') ? {height: 64} : {height: 50}]}>
                        <Text style={[{color: 'white', textAlign: 'center', fontSize: 18}, (Platform.OS == 'ios') ? {marginTop: 36} : {marginTop: 15}]}>הרשמה</Text>
                    </View>

                    <Text style={[{color: 'white', textAlign: 'center', fontSize: 25}, (Platform.OS == 'ios') ? {marginTop: 30} : {marginTop: 15}]}>מספר הנייד שלך</Text>

                    {(this.state.language == "iw_IL" && Platform.OS == 'android') ?

                        <View style={{flexDirection: 'row', marginTop: 15}}>

                            <View style={[styles.input_view, {width: 160}, (Platform.OS == 'android') ? {height: 55} : null]}>
                                <TextInput style={[styles.text_input, styles.viewSpace, (Platform.OS == 'android') ? {height: 55} : null]}
                                    underlineColorAndroid = "transparent"
                                    placeholderTextColor = "white"
                                    autoCapitalize = "none"
                                    onChangeText = {(end_number) => this.setState({ end_number: end_number })}
                                    value={this.state.end_number} />
                                <View style={[styles.switch_line, {width: 165}]} />
                            </View>

                            <View style={[styles.input_view, {width: 90, marginLeft: 20}, (Platform.OS == 'android') ? {height: 55} : null]}>
                                <TextInput style={[styles.text_input, styles.viewSpace, (Platform.OS == 'android') ? {height: 55} : null]}
                                    underlineColorAndroid = "transparent"
                                    placeholderTextColor = "white"
                                    autoCapitalize = "none"
                                    onChangeText = {(prefix_number) => this.setState({ prefix_number: prefix_number })}
                                    value={this.state.prefix_number} />
                                <View style={[styles.switch_line, {width: 90}]} />
                            </View>                            
                        </View> :
                        <View style={{flexDirection: 'row', marginTop: 15}}>
                            
                            <View style={[styles.input_view, {width: 90}, (Platform.OS == 'android') ? {height: 55} : null]}>
                                <TextInput style={[styles.text_input, styles.viewSpace, (Platform.OS == 'android') ? {height: 55} : null]}
                                    underlineColorAndroid = "transparent"
                                    placeholderTextColor = "white"
                                    autoCapitalize = "none"
                                    onChangeText = {(prefix_number) => this.setState({ prefix_number: prefix_number })}
                                    value={this.state.prefix_number} />
                                <View style={[styles.switch_line, {width: 90}]} />
                            </View>

                            <View style={[styles.input_view, {width: 160, marginLeft: 20}, (Platform.OS == 'android') ? {height: 55} : null]}>
                                <TextInput style={[styles.text_input, styles.viewSpace, (Platform.OS == 'android') ? {height: 55} : null]}
                                    underlineColorAndroid = "transparent"
                                    placeholderTextColor = "white"
                                    autoCapitalize = "none"
                                    onChangeText = {(end_number) => this.setState({ end_number: end_number })}
                                    value={this.state.end_number} />
                                <View style={[styles.switch_line, {width: 165}]} />
                            </View>
                        </View> }

                    <View style={{flexDirection: 'column', marginTop: 10, alignSelf: 'center'}}>
                        {listPages}
                    </View>

                    <TouchableOpacity onPress={() => this.onActionStart()} style={[{width: windowWidth - 80, height: 50, borderRadius: 7, alignItems: 'center', justifyContent: 'center', backgroundColor: '#3D4FCA'}, (Platform.OS == 'ios') ? {marginTop: 30} : {marginTop: 20}]}>
                        <Text style={{color: 'white', textAlign: 'center', fontSize: 24}}>המשך</Text>
                    </TouchableOpacity>

                </LinearGradient>

                <Modal animationType='fade' transparent={true} modalDidClose={this.modalDidClose} visible={this.state.errorVisible} onRequestClose={() => this.setModalVisible(false)} >
                    <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
                        <TouchableOpacity onPress={() => this.modalDidClose()} >
                            <View style={{ width: 200, height: 200, alignSelf: 'center', alignItems: 'center', justifyContent: 'center', backgroundColor: color.white, borderWidth: 3, borderColor: '#d0021b', borderRadius: 17, marginTop: (windowHeight - 162) / 2}}>
                                <Text style={[styles.label, {textAlign: 'center'}]}>מספר הטלפון אינו תקין</Text>

                                {(this.state.language == "iw_IL" && Platform.OS == 'android') ?
                                    <Image source={ require('../resource/errow.png') } style={{width: 45, height: 45, position: 'absolute', top: -22.5, left: 12}}/> :
                                    <Image source={ require('../resource/errow.png') } style={{width: 45, height: 45, position: 'absolute', top: -22.5, right: 12}}/> }
                            </View>                    
                        </TouchableOpacity>
                    </View>                    
                </Modal>
            </View>
        )
    }


}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    view: {
        flexDirection: 'row', 
        height: 75, 
        justifyContent: 'center', 
        alignItems: 'center',
        marginTop: 5
    },
    button: {
        height: 75, 
        width: 75, 
        textAlign: 'center', 
        textAlignVertical: 'center',
        fontSize: 40,
        color: color.white,
    },
    text_input: {
        flex: 1, 
        height: 40, 
        fontSize: 33,
        textAlign: 'center',
        color: 'white'
    },
    input_view: {
        height: 50, 
        justifyContent: 'center'
    },
    switch_line: {
        height: 2, 
        backgroundColor: color.white, 
        position: 'absolute', 
        bottom: 0, 
    }
    
});