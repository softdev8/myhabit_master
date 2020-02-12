import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, Platform, TextInput, StatusBar, NativeModules, ScrollView, AsyncStorage, BackHandler, Modal} from 'react-native';

import { color, windowWidth, windowHeight } from "./styles/theme"
import LinearGradient from 'react-native-linear-gradient';
import Loading from 'react-native-whc-loading'
import ImagePicker from 'react-native-image-picker'

export default class UserProfile1 extends Component {

    constructor(props) {
        super(props);

        this.state = {
            language: '',
            first_name: "",
            last_name: "",
            email: "",
            phone: "",
            imageUrl: "",
            street: "",
            entrance: "",
            apartment: "",
            building: "",
            token: "",
            filePath: null,
            errorVisible: false,
            errorMessage: "",
            bImage: false             
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

        AsyncStorage.getItem("first_name").then((value) => {
            console.log("first_name", value);
            this.setState({
                first_name: value
            })
        }).done();

        AsyncStorage.getItem("last_name").then((value) => {
            console.log("last_name", value);
            this.setState({
                last_name: value
            })
        }).done();

        AsyncStorage.getItem("imageUrl").then((value) => {
            console.log("imageUrl", value);
            this.setState({
                imageUrl: value
            })
        }).done();    

        AsyncStorage.getItem("email").then((value) => {
            console.log("email", value);
            this.setState({
                email: value
            })
        }).done();  

        AsyncStorage.getItem("token").then((value) => {
            console.log("token", value);
            this.setState({
                token: value
            })
        }).done();    
    }

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    
    handleBackButtonClick() {
        this.props.navigation.navigate('Main')
        return true;
    }

    setErrorVisible = (visible) => {
        this.setState({ errorVisible: visible });
    }

    errorDidClose = () => {
        this.setState({ errorVisible: false });
    };

    onActionUserProfile = () => {

        const {first_name, last_name, email} = this.state

        if (first_name.length == "") {
            alert("Please enter first name");
        } else if (last_name.length == "") {
            alert("Please enter last name");
        } else if (email.length == "") {
            alert("Please enter email");
        } else {
            this.updateDetails()
        }        
    }

    async updateDetails() {

        const {first_name, last_name, email, token, filePath} = this.state

        var phone = await AsyncStorage.getItem("phone")
        console.log("phone", phone);

        console.log("token", token);

        this.refs.loading.show();  
        
        let device_type = Platform.OS

        await fetch("http://shobbing.herokuapp.com/v2/api/customer/details", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                token: token
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

                    if (filePath === null) {
                        this.props.navigation.navigate('Main')                                          
                    } else {
                        this.uploadImage(token)
                    }                    
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
                    this.props.navigation.navigate('Main')                    
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
                                (this.state.imageUrl != "") ?
                                    <Image source={{ uri: this.state.imageUrl }} style={{width: 86, height: 86, marginTop: 30, borderRadius: 43}}/>:
                                    <Image source={ require('../resource/group.png') } style={{width: 88, height: 86, marginTop: 30}}/>
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

                            <Text style={{width: windowWidth - 30, color: 'white', textAlign: 'right', fontSize: 18, marginTop: 20, marginRight: 20}}>פרטים אישים</Text>

                            <View style={[styles.input_view, {width : windowWidth - 30, marginTop: 10}]}>
                                <TextInput style={[styles.text_input, styles.viewSpace]}
                                    underlineColorAndroid = "transparent"
                                    placeholder = "רחוב"
                                    placeholderTextColor = "white"
                                    autoCapitalize = "none"
                                    onChangeText = {(street) => this.setState({ street: street })}
                                    value={this.state.street} />
                            </View>

                            {(this.state.language == "iw_IL" && Platform.OS == 'android') ?

                                <View style={{flexDirection: 'row', width: windowWidth - 30, height: 50, marginTop: 10}}>
                                    
                                    <View style={[styles.input_view, {width: (windowWidth - 54) / 3}]}>
                                        <TextInput style={[styles.text_input, styles.viewSpace]}
                                            underlineColorAndroid = "transparent"
                                            placeholder = "בנין"
                                            placeholderTextColor = "white"
                                            autoCapitalize = "none"
                                            onChangeText = {(building) => this.setState({ building: building })}
                                            value={this.state.building} />
                                    </View>
                                    
                                    <View style={[styles.input_view, {marginLeft: 12, width: (windowWidth - 54) / 3}]}>
                                        <TextInput style={[styles.text_input, styles.viewSpace]}
                                            underlineColorAndroid = "transparent"
                                            placeholder = "דירה"
                                            placeholderTextColor = "white"
                                            autoCapitalize = "none"
                                            onChangeText = {(apartment) => this.setState({ apartment: apartment })}
                                            value={this.state.apartment} />
                                    </View>

                                    <View style={[styles.input_view, {marginLeft: 12, width: (windowWidth - 54) / 3}]}>
                                        <TextInput style={[styles.text_input, styles.viewSpace]}
                                            underlineColorAndroid = "transparent"
                                            placeholder = "כניסה"
                                            placeholderTextColor = "white"
                                            autoCapitalize = "none"
                                            onChangeText = {(entrance) => this.setState({ entrance: entrance })}
                                            value={this.state.entrance} />
                                    </View>

                                </View> :
                                <View style={{flexDirection: 'row', width: windowWidth - 30, height: 50, marginTop: 10}}>
                                
                                    <View style={[styles.input_view, {width: (windowWidth - 54) / 3}]}>
                                        <TextInput style={[styles.text_input, styles.viewSpace]}
                                            underlineColorAndroid = "transparent"
                                            placeholder = "כניסה"
                                            placeholderTextColor = "white"
                                            autoCapitalize = "none"
                                            onChangeText = {(entrance) => this.setState({ entrance: entrance })}
                                            value={this.state.entrance} />
                                    </View>

                                    <View style={[styles.input_view, {marginLeft: 12, width: (windowWidth - 54) / 3}]}>
                                        <TextInput style={[styles.text_input, styles.viewSpace]}
                                            underlineColorAndroid = "transparent"
                                            placeholder = "דירה"
                                            placeholderTextColor = "white"
                                            autoCapitalize = "none"
                                            onChangeText = {(apartment) => this.setState({ apartment: apartment })}
                                            value={this.state.apartment} />
                                    </View>

                                    <View style={[styles.input_view, {marginLeft: 12, width: (windowWidth - 54) / 3}]}>
                                        <TextInput style={[styles.text_input, styles.viewSpace]}
                                            underlineColorAndroid = "transparent"
                                            placeholder = "בנין"
                                            placeholderTextColor = "white"
                                            autoCapitalize = "none"
                                            onChangeText = {(building) => this.setState({ building: building })}
                                            value={this.state.building} />
                                    </View>
                                </View> }

                            <TouchableOpacity onPress={() => this.onActionUserProfile()} style={[{width: windowWidth - 80, height: 50, borderRadius: 7, alignItems: 'center', justifyContent: 'center', backgroundColor: '#3D4FCA', marginTop: 25}]}>
                                <Text style={{color: 'white', textAlign: 'center', fontSize: 24}}>עדכן</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>    
                </LinearGradient>

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
        fontSize: 14,
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