import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, Platform, TextInput, Modal, AsyncStorage, StatusBar, ScrollView, NativeModules, BackHandler} from 'react-native';

import { color, windowWidth, windowHeight } from "./styles/theme"
import LinearGradient from 'react-native-linear-gradient';
import Loading from 'react-native-whc-loading'
import ImagePicker from 'react-native-image-picker'

export default class UserProfile extends Component {

    constructor(props) {
        super(props);

        this.state = {
            modalVisible: false,
            errorVisible: false,
            errorMessage: "",
            bImage: false,
            first_name: "",
            last_name: "",
            email: "",
            phone: "",
            language: '',
            filePath: null            
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
        this.props.navigation.navigate('PhoneVerification')
        return true;
    }

    setModalVisible = (visible) => {
        this.setState({ modalVisible: visible });
    }

    modalDidClose = () => {
        this.setState({ modalVisible: false });

        this.props.navigation.navigate('Gift')
    };

    setErrorVisible = (visible) => {
        this.setState({ errorVisible: visible });
    }

    errorDidClose = () => {
        this.setState({ errorVisible: false });
    };

    onActionUserProfile = () => {

        const {filePath, first_name, last_name, email} = this.state

        if (filePath === null) {
            alert("Please select avatar");
        } else if (first_name.length == "") {
            alert("Please enter first name");
        } else if (last_name.length == "") {
            alert("Please enter last name");
        } else if (email.length == "") {
            alert("Please enter email");
        } else {
            this.signUpDetails()
        }
    }

    async signUpDetails() {

        const {first_name, last_name, email} = this.state

        var phone = await AsyncStorage.getItem("phone")
        console.log("phone", phone);

        this.refs.loading.show();  

        let device_type = Platform.OS

        await fetch("http://shobbing.herokuapp.com/v2/api/customer/signup/details", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                phone: phone,
                email: email,
                deviceType: device_type,
                name: {
                    first: first_name, 
                    last: last_name
                }
            })
            }).then((response) => response.json())
            .then((responseJson) => {
                
                if (responseJson.status == "OK") {
                    AsyncStorage.setItem('token', responseJson.result.token);

                    this.uploadImage(responseJson.result.token)

                } else {
                    this.refs.loading.close();
                    this.setState({ 
                        errorVisible: true,
                        errorMessage: "מספר הטלפון אינו תקין",
                        bImage: false
                    });
                }
            })
            .catch((error) => {
                console.error(error);

                this.refs.loading.close();
        });
    }

    chooseFile = () => {
        var options = {
          title: 'Select Image',
          storageOptions: {
            skipBackup: true,
            path: 'images',
          },
        };
        ImagePicker.showImagePicker(options, response => {
          console.log('Response = ', response);
          if (response.didCancel) {
            console.log('User cancelled image picker');
            // alert('User cancelled image picker');
          } else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
            alert('ImagePicker Error: ' + response.error);
          } else if (response.customButton) {
            console.log('User tapped custom button: ', response.customButton);
            // alert(response.customButton);
          } else {
            let source = response;
            console.log("filePath: ", response);
            this.setState({
              filePath: source,
            });
          }
        });
    };

    async uploadImage(token) {

        let body = new FormData();
        body.append('image', {uri: this.state.filePath.uri, name: 'photo.png',filename :'imageName.png',type: 'image/png'});
            body.append('Content-Type', 'image/png');

        await fetch("http://shobbing.herokuapp.com/v2/api/customer/image", {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
                'token': token
            },
            body: body
            }).then((response) => response.json())
            .then((responseJson) => {
                
                console.log("response:", responseJson);

                if (responseJson.status == "OK") {
                    this.setState({ modalVisible: true });
                    
                } else {
                    this.setState({ 
                        errorVisible: true,
                        errorMessage: "התמונה אינה תקינה",
                        bImage: true
                    });
                }

                this.refs.loading.close();
                
            })
            .catch((error) => {
                console.error(error);

                this.refs.loading.close();
        });
    }

    render() {

        return (
            <View style={styles.container} >

                <LinearGradient start={{x: 0, y: 0}} end={{x: 0, y: 1}} colors={['#3023AE', '#00DCFF']} style={{flex: 1, alignItems: 'center'}}>
                    <View style={[{width: windowWidth, backgroundColor: color.title_bar}, (Platform.OS == 'ios') ? {height: 64} : {height: 50}]}>
                        <Text style={[{color: 'white', textAlign: 'center', fontSize: 18}, (Platform.OS == 'ios') ? {marginTop: 36} : {marginTop: 15}]}>פרופיל משתמש</Text>
                    </View>

                    <ScrollView>
                        <View style={{flex: 1, alignItems: 'center'}}>
                            <TouchableOpacity onPress={() => this.chooseFile()} >
                                {(this.state.filePath !== null) ?
                                    <Image source={ {uri: this.state.filePath.uri} } style={{width: 86, height: 86, marginTop: 60, borderRadius: 43}}/> :
                                    <Image source={ require('../resource/group.png') } style={{width: 89, height: 86, marginTop: 60}}/> 
                                }
                            </TouchableOpacity>

                            {(this.state.language == "iw_IL" && Platform.OS == 'android') ?
                                <Text style={{width: windowWidth - 30, color: 'white', textAlign: 'left', fontSize: 18, marginTop: 60, marginLeft: 20}}>פרטים אישים</Text> :
                                <Text style={{width: windowWidth - 30, color: 'white', textAlign: 'right', fontSize: 18, marginTop: 60, marginRight: 20}}>פרטים אישים</Text> }

                            {(this.state.language == "iw_IL" && Platform.OS == 'android') ?
                                <View style={{flexDirection: 'row', width: windowWidth - 30, height: 50, marginTop: 10}}>
                                    <View style={[styles.input_view, {marginRight: 12}]}>
                                        <TextInput style={[styles.text_input, styles.viewSpace]}
                                            underlineColorAndroid = "transparent"
                                            placeholder = "שם"
                                            placeholderTextColor = "white"
                                            autoCapitalize = "none"
                                            onChangeText = {(first_name) => this.setState({ first_name: first_name })}
                                            value={this.state.first_name} />
                                    </View>

                                    <View style={[styles.input_view]}>
                                        <TextInput style={[styles.text_input, styles.viewSpace]}
                                            underlineColorAndroid = "transparent"
                                            placeholder = "שם משפחה"
                                            placeholderTextColor = "white"
                                            autoCapitalize = "none"
                                            onChangeText = {(last_name) => this.setState({ last_name: last_name })}
                                            value={this.state.last_name} />
                                    </View>
                                </View> : 
                                <View style={{flexDirection: 'row', width: windowWidth - 30, height: 50, marginTop: 10}}>
                                    
                                    <View style={[styles.input_view]}>
                                        <TextInput style={[styles.text_input, styles.viewSpace]}
                                            underlineColorAndroid = "transparent"
                                            placeholder = "שם משפחה"
                                            placeholderTextColor = "white"
                                            autoCapitalize = "none"
                                            onChangeText = {(last_name) => this.setState({ last_name: last_name })}
                                            value={this.state.last_name} />
                                    </View>

                                    <View style={[styles.input_view, {marginLeft: 12}]}>
                                        <TextInput style={[styles.text_input, styles.viewSpace]}
                                            underlineColorAndroid = "transparent"
                                            placeholder = "שם"
                                            placeholderTextColor = "white"
                                            autoCapitalize = "none"
                                            onChangeText = {(first_name) => this.setState({ first_name: first_name })}
                                            value={this.state.first_name} />
                                    </View>
                                </View> }

                            <View style={[styles.input_view, {width : windowWidth - 30, marginTop: 10}]}>
                                <TextInput style={[styles.text_input, styles.viewSpace]}
                                    underlineColorAndroid = "transparent"
                                    placeholder = "מיייל"
                                    placeholderTextColor = "white"
                                    autoCapitalize = "none"
                                    onChangeText = {(email) => this.setState({ email: email })}
                                    value={this.state.email} />
                            </View>

                            <TouchableOpacity onPress={() => this.onActionUserProfile()} style={[{width: windowWidth - 80, height: 50, borderRadius: 7, alignItems: 'center', justifyContent: 'center', backgroundColor: '#3D4FCA', marginTop: 80}]}>
                                <Text style={{color: 'white', textAlign: 'center', fontSize: 24}}>הבא</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </LinearGradient>

                <Modal animationType='fade' transparent={true} modalDidClose={this.modalDidClose} visible={this.state.modalVisible} onRequestClose={() => this.setModalVisible(false)} >
                    <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
                        <TouchableOpacity onPress={() => this.modalDidClose()} >
                            <View style={{ width: 200, height: 200, alignSelf: 'center', alignItems: 'center', justifyContent: 'center', backgroundColor: color.white, borderWidth: 3, borderColor: color.btn_color, borderRadius: 17, marginTop: (windowHeight - 162) / 2}}>
                                <Text style={[styles.label, {textAlign: 'center'}]}>הרישום בוצע</Text>
                                <Text style={[styles.label, {textAlign: 'center'}]}>בהצלחה!</Text>

                                {(this.state.language == "iw_IL" && Platform.OS == 'android') ?
                                    <Image source={ require('../resource/big_blue.png') } style={{width: 45, height: 45, position: 'absolute', top: -20, left: 12}}/> :
                                    <Image source={ require('../resource/big_blue.png') } style={{width: 45, height: 45, position: 'absolute', top: -20, right: 12}}/> }
                            </View>                    
                        </TouchableOpacity>
                    </View>                    
                </Modal>

                <Modal animationType='fade' transparent={true} modalDidClose={this.errorDidClose} visible={this.state.errorVisible} onRequestClose={() => this.setErrorVisible(false)} >
                    <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
                        <TouchableOpacity onPress={() => this.errorDidClose()} >
                            <View style={{ width: 200, height: 200, alignSelf: 'center', alignItems: 'center', justifyContent: 'center', backgroundColor: color.white, borderWidth: 3, borderColor: '#d0021b', borderRadius: 17, marginTop: (windowHeight - 162) / 2}}>
                                <Text style={[styles.label, {textAlign: 'center'}]}>{this.state.errorMessage}</Text>
                                {(!this.state.bImage) ?
                                    <Text style={[styles.label, {textAlign: 'center'}]}>מספר הטלפון בשימוש עם משתמש אחר</Text> : null }

                                {(this.state.language == "iw_IL" && Platform.OS == 'android') ?
                                    <Image source={ require('../resource/errow.png') } style={{width: 45, height: 45, position: 'absolute', top: -22.5, left: 12}}/> :
                                    <Image source={ require('../resource/errow.png') } style={{width: 45, height: 45, position: 'absolute', top: -22.5, right: 12}}/> }
                            </View>                    
                        </TouchableOpacity>
                    </View>                    
                </Modal>

                <Loading ref="loading"/>
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
        width: (windowWidth - 42) / 2, 
        height: 45, 
        borderRadius: 7, 
        borderColor: 'white', 
        borderWidth: 1, 
        justifyContent: 'center'
    },
    label: {
        fontSize: 24, 
        color: '#3d4fca'
    },
});