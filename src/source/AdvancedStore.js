import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ImageBackground, Image, Platform, FlatList, ScrollView, TextInput, AsyncStorage, StatusBar, PermissionsAndroid, NativeModules, BackHandler, Modal} from 'react-native';

import { color, windowWidth } from "./styles/theme"

import { NavigationEvents } from 'react-navigation';
import Loading from 'react-native-whc-loading'

var temp = 0

export default class AdvancedStore extends Component {

    constructor(props) {
        super(props);

        this.state = {
            stores: null,
            temp: null,
            categories: null,
            isPopular: 1,
            selectedIndex: -1,
            isSelected: false,
            selectedRow: -1,
            currentBalance: "",
            myLatitude: 0.0,
            myLongitude: 0.0,
            language: '',
            categoryId: '',
            sortByPopularity: true,
            isArrSelected: [],
        }

        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }

    watchID: ?number = null

    async componentDidMount() {

        if (NativeModules.I18nManager && Platform.OS == 'android') {
            const {localeIdentifier} = NativeModules.I18nManager;
            
            this.setState({language: localeIdentifier})
            console.log(localeIdentifier);
        }

        var currentBalance = await AsyncStorage.getItem("currentBalance")
        console.log("currentBalance", currentBalance);
        this.setState({
            currentBalance: currentBalance
        })

        if (Platform.OS === "android") {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        'title': 'Myhabit App',
                        'message': 'Allow ‘Myhabit” to access your location while you are using the app?'
                    }
                )
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    this.getGPSlocation()
                } else {
                    console.log("location permission denied")
                    // alert("Location permission denied");
                }
            } catch (err) {
                alert(JSON.stringify(err))
            }
        } else {
            this.getGPSlocation()
        }

        if (Platform.OS === "android") {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                    {
                        'title': 'Myhabit App',
                        'message': 'Allow ‘Myhabit” to access microphone while you are using the app?'
                    }
                )
                if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                    console.log("Record audio permission denied")
                }
            } catch (err) {
                alert(JSON.stringify(err))
            }
        }
    }

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    
    handleBackButtonClick() {
        // this.props.navigation.navigate('Main', {selectedTab: 4})
        return true;
    }

    getGPSlocation() {

        this.watchID = navigator.geolocation.getCurrentPosition((position) => {
            var lat = parseFloat(position.coords.latitude)
            var long = parseFloat(position.coords.longitude)
          
            var initialRegion = {
                latitude: lat,
                longitude: long,
                latitudeDelta: 0.00922*1.5,
                longitudeDelta: 0.00421*1.5
            }
            this.setState({myLatitude: lat, myLongitude: long})
           
        }, 
        (error) => alert(JSON.stringify(error)),
        { enableHighAccuracy: false, timeout: 20000, maximumAge: 10000})

    }

    reset() {
        this.setState({
            isPopular: 1,
            selectedIndex: -1,
            isSelected: false,
            selectedRow: -1,
            currentBalance: "",
            myLatitude: 0.0,
            myLongitude: 0.0,
            categoryId: '',
            sortByPopularity: true
        })
    }

    async getAdvancedStore(reload) {

        this.refs.loading.show();

        StatusBar.setBarStyle( 'light-content',true)
        StatusBar.setBackgroundColor(color.statusBar_morning_color)

        var token = await AsyncStorage.getItem("token")
        // var token = 'e7593b96913b6a5dffb7d652941308885e04e27d'
        console.log("token", token);
        
        let category = (this.state.categoryId != '') ? "&categoryId=" + this.state.categoryId : ""
        let popular = (this.state.sortByPopularity) ? "&sortByPopularity=ture" : "&sortByPopularity=false"
        let location = (this.state.sortByPopularity) ? "lat=31.8962372&lon=34.8094697" : "lat=" + this.state.myLatitude + "&lon=" + this.state.myLongitude

        let api_link = "http://shobbing.herokuapp.com/v2/api/customer/stores?" + location + category + popular
        console.log("http://shobbing.herokuapp.com/v2/api/customer/stores?" + location + category + popular)

        await fetch(api_link, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'token': token
            },
            }).then((response) => response.json())
            .then((responseJson) => {
                
                console.warn("stores", responseJson.result.stores);
                console.warn("categories", responseJson.result.categories);
                
                this.refs.loading.close();

                if (!reload) {
                    let arrSelected = this.state.isArrSelected;
                    console.warn("****", arrSelected);
    
                    for (let index = 0; index < responseJson.result.categories.length; index++) {
                        arrSelected.push(false)
                    }
    
                    console.warn("isArrSelected", arrSelected);    

                    this.setState({
                        isArrSelected: arrSelected
                    })
                }               

                this.setState({
                    stores: responseJson.result.stores,
                    temp: responseJson.result.stores,
                    categories: responseJson.result.categories,
                })
                
            })
            .catch((error) => {
                console.error(error);
                
                this.refs.loading.close();
        });
    }

    actionSwitch = (index) => {

        this.setState({
            isPopular: index
        })

        if (index == 1) {
            this.setState({
                sortByPopularity: true
            })            
        } else {
            this.setState({
                sortByPopularity: false
            })            
        }

        this.getAdvancedStore(true)
    }

    actionCategorySelect = (categoryId, index, isSelected) => {

        const arr = this.state.isArrSelected

        if (isSelected) {

            arr[index] = false

            this.setState({
                categoryId: "",
                selectedIndex: index,
                isArrSelected: arr
            })    
        } else {

            if (temp !== index) arr[temp] = false
            arr[index] = true

            this.setState({
                categoryId: categoryId,
                selectedIndex: index,
                isArrSelected: arr
            })

            temp = index
        }

        this.getAdvancedStore(true)    
    }

    actionSelectRow = (index) => {
        this.setState({
            selectedRow: index
        })
    }

    actionPayment = (item) => {
        this.props.navigation.navigate('PaymentAmount', {item: item})
    }

    actionBack = () => {
        var date, hour;
        
        date = new Date();
        hour = date.getHours(); 

        this.props.navigation.navigate('Main', {selectedTab: 4, hour: hour})
    }

    onSort(e) {

        let fullList = this.state.temp;
    
        if (!e || e === '') {
            this.setState({
                stores: fullList
            })
        } else {
            this.searchAutoComplete(e)
        }
    }

    async searchAutoComplete(search_text) {

        var token = await AsyncStorage.getItem("token")
        console.log("token", token);
        
        let name = "&name=" + search_text
        let location = (this.state.sortByPopularity) ? "lat=31.8962372&lon=34.8094697" : "lat=" + this.state.myLatitude + "&lon=" + this.state.myLongitude

        let api_link = "http://shobbing.herokuapp.com/v2/api/customer/stores/autocomplete?" + location + name
        console.log("http://shobbing.herokuapp.com/v2/api/customer/stores/autocomplete?" + location + name)

        await fetch(api_link, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'token': token
            },
            }).then((response) => response.json())
            .then((responseJson) => {
                
                console.warn("stores", responseJson.result);
                
                this.setState({
                    stores: responseJson.result
                })
                
            })
            .catch((error) => {
                console.error(error);
        });
    }

    renderItem(item, index) {

        return (
            <TouchableOpacity onPress={() => this.actionCategorySelect(item.id, index, this.state.isArrSelected[index])} style={[{marginLeft: 10, borderRadius: 5, alignItems: 'center', justifyContent: 'center', borderWidth: 0.3, borderColor: '#88888888'}, (this.state.selectedIndex === index && this.state.isArrSelected[index]) ? {backgroundColor: color.btn_color} : {backgroundColor: color.white}]} >
                <Text style={[{paddingLeft: 10, paddingRight: 10, textAlign: 'center'}, (this.state.selectedIndex === index && this.state.isArrSelected[index]) ? {color: color.white} : {color: color.text_color2}]}>{item.name}</Text>
            </TouchableOpacity>
        );
    }

    renderListItem(item, index) {

        return (
            (this.state.language == "iw_IL" && Platform.OS == 'android') ?
                <TouchableOpacity onPress={() => this.actionSelectRow(index)} >
                    <View style={[{flexDirection: 'row', width: windowWidth - 20, height: 75, backgroundColor: color.white, marginLeft: 10, borderRadius: 7, alignItems: 'center', borderWidth: 1, marginBottom: 10}, (this.state.selectedRow == index) ? {borderColor: color.btn_color} : {borderColor: color.line_color}]}>
                        
                        <View style={{width: 50, height: 50, borderColor: color.line_color, borderWidth: .5, justifyContent: 'center', marginLeft: 15}}>
                            <Image source={{ uri: item.images.thumbUrl}} style={[{width: 30, height: 24, alignSelf: 'center'}]}/>
                        </View>                    
                        
                        <View style={{flex: 1, height: 65, justifyContent: 'center', marginLeft: 10}}>
                            <Text style={{fontSize: 17, textAlign: 'left'}}>{item.name}</Text>
                            <Text style={{fontSize: 12, opacity: .7, textAlign: 'left', marginTop: 3}}>{item.street} {item.houseNumber} {item.city}</Text>
                        </View>
                        
                        <TouchableOpacity onPress={() => this.actionPayment(item)} >
                            <View style={{width: 90, height: 25, borderRadius: 2, borderColor: color.btn_color, borderWidth: 1, marginRight: 22, justifyContent: 'center'}}>
                                <Text style={[{fontSize: 15, color: color.btn_color, textAlign: 'center'}, (Platform.OS == 'ios') ? {marginTop: 5} : null]}>לתשלום</Text>
                            </View>
                        </TouchableOpacity>                        
                    </View>
                </TouchableOpacity> :
                <TouchableOpacity onPress={() => this.actionSelectRow(index)} >
                    <View style={[{flexDirection: 'row', width: windowWidth - 20, height: 75, backgroundColor: color.white, marginLeft: 10, borderRadius: 7, alignItems: 'center', borderWidth: 1, marginBottom: 10}, (this.state.selectedRow == index) ? {borderColor: color.btn_color} : {borderColor: color.line_color}]}>
                        
                        <TouchableOpacity onPress={() => this.actionPayment(item)} >
                            <View style={{width: 90, height: 25, borderRadius: 2, borderColor: color.btn_color, borderWidth: 1, marginLeft: 22, justifyContent: 'center'}}>
                                <Text style={[{fontSize: 15, color: color.btn_color, textAlign: 'center'}, (Platform.OS == 'ios') ? {marginTop: 5} : null]}>לתשלום</Text>
                            </View>
                        </TouchableOpacity>
                        
                        <View style={{flex: 1, height: 65, justifyContent: 'center', marginRight: 10}}>
                            <Text style={{fontSize: 17, textAlign: 'right'}}>{item.name}</Text>
                            <Text style={{fontSize: 12, opacity: .7, textAlign: 'right', marginTop: 3}}>{item.street} {item.houseNumber} {item.city}</Text>
                        </View>
                        
                        <View style={{width: 50, height: 50, borderColor: color.line_color, borderWidth: .5, justifyContent: 'center', marginRight: 15}}>
                            <Image source={{ uri: item.images.thumbUrl}} style={[{width: 30, height: 24, alignSelf: 'center'}]}/>
                        </View>                    
                    </View>
                </TouchableOpacity>
        );
    }

    render() {

        let listPages = null
        if (this.state.categories) {
            listPages = this.state.categories.map((item, index) => {
                return this.renderItem(item, index);
            });    
        }

        console.warn("updateArrSelected", this.state.isArrSelected);

        return (
            <View style={styles.container}>
                <NavigationEvents
                     onWillFocus={payload => this.reset()}
                     onDidFocus={payload => this.getAdvancedStore(false)}
                     onWillBlur={payload => console.warn('will blur',payload)}
                     onDidBlur={payload => console.warn('did blur',payload)} />
                
                <ImageBackground source={require('../resource/blue_bg.png')} style={[{width: windowWidth, height: 135}]}>

                    {(this.state.language == "iw_IL" && Platform.OS == 'android') ?
                        <View style={{flexDirection: 'row', marginTop: 38, alignSelf: 'center'}}>
                            <Image source={ require("../resource/white_store.png") } style={{width: 24, height: 21, marginRight: 15}}/>
                            <Text style={{color: 'white', textAlign: 'center', fontSize: 20}}>קניות בחנות</Text>
                        </View> :
                        <View style={{flexDirection: 'row', marginTop: 38, alignSelf: 'center'}}>
                            <Text style={{color: 'white', textAlign: 'center', fontSize: 20}}>קניות בחנות</Text>
                            <Image source={ require("../resource/white_store.png") } style={{width: 24, height: 21, marginLeft: 15}}/>
                        </View> }
                    
                    <View style={[{width: 175, height: 1.5, backgroundColor: color.line_color, alignSelf: 'center', marginTop: 15}]} />

                    {(this.state.language == "iw_IL" && Platform.OS == 'android') ?
                        <View style={{flexDirection: 'row', marginTop: 10, alignItems: 'center', justifyContent: 'center'}}>
                            <Text style={{color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 24}}>יתרתך </Text>                           
                            <Text style={{color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 24}}> {this.state.currentBalance}</Text>   
                            <Text style={{color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 16}}>₪</Text>     
                        </View> :
                        <View style={{flexDirection: 'row', marginTop: 10, alignItems: 'center', justifyContent: 'center'}}>
                            <Text style={{color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 16}}>₪</Text>     
                            <Text style={{color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 24}}> {this.state.currentBalance}</Text>   
                            <Text style={{color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 24}}>יתרתך </Text>                           
                        </View> }

                    {(this.state.language == "iw_IL" && Platform.OS == 'android') ?
                        <TouchableOpacity onPress={() => this.actionBack()} style={{position: 'absolute', top: 40, right: 15, width: 70, height: 30, borderRadius: 10, backgroundColor: color.white, justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{textAlign: 'center', fontSize: 18, color: color.active_tb_color}}>חזור</Text>
                        </TouchableOpacity> :
                        <TouchableOpacity onPress={() => this.actionBack()} style={{position: 'absolute', top: 40, left: 15, width: 70, height: 30, borderRadius: 10, backgroundColor: color.white, justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{textAlign: 'center', fontSize: 18, color: color.active_tb_color}}>חזור</Text>
                        </TouchableOpacity> }

                </ImageBackground>

                {(this.state.language == "iw_IL" && Platform.OS == 'android') ?
                    <View style={{flexDirection: 'row', width: windowWidth - 70, height: 45, borderWidth: .5, borderRadius: 7, borderColor: '#886D6B6B', alignSelf: 'center', marginTop: 20, alignItems: 'center', backgroundColor: color.white}}>
                        <TextInput style={{flex: 1, marginLeft: 10, textAlign: 'right', fontSize: 20}}
                            underlineColorAndroid = "transparent"
                            placeholder = "חפש בית  עסק"
                            placeholderTextColor = "#afafaf"
                            autoCapitalize = "none"
                            onChangeText={this.onSort.bind(this)} />
                        <Image source={ require("../resource/voice.png") } style={{width: 27, height: 33, marginRight: 7}}/>                        
                    </View> :
                    <View style={{flexDirection: 'row', width: windowWidth - 70, height: 45, borderWidth: .5, borderRadius: 7, borderColor: '#886D6B6B', alignSelf: 'center', marginTop: 20, alignItems: 'center', backgroundColor: color.white}}>
                        <Image source={ require("../resource/voice.png") } style={{width: 27, height: 33, marginLeft: 7}}/>
                        <TextInput style={{flex: 1, marginRight: 10, textAlign: 'right', fontSize: 20}}
                            underlineColorAndroid = "transparent"
                            placeholder = "חפש בית  עסק"
                            placeholderTextColor = "#afafaf"
                            autoCapitalize = "none"
                            onChangeText={this.onSort.bind(this)} />
                    </View> }

                <ScrollView>
                    {(this.state.language == "iw_IL" && Platform.OS == 'android') ?
                        <View style={{flexDirection: 'row', width: 220, height: 35, backgroundColor: color.white, borderRadius: 17.5, alignSelf: 'center', marginTop: 25}}>
                            <TouchableOpacity onPress={() => this.actionSwitch(0)}>
                                <View style={[{width: 110, height: 35, borderTopLeftRadius: 17.5, borderBottomLeftRadius: 17.5, justifyContent: 'center'}, (this.state.isPopular == 0) ? {backgroundColor: color.btn_color} : {backgroundColor: color.white}]}>
                                    <Text style={[{textAlign: 'center', fontSize: 15}, (this.state.isPopular == 0) ? {color: 'white'} : {color: color.text_color1}]}>קרוב אלי</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => this.actionSwitch(1)}>
                                <View style={[{width: 110, height: 35, borderTopRightRadius: 17.5, borderBottomRightRadius: 17.5, justifyContent: 'center'}, (this.state.isPopular == 1) ? {backgroundColor: color.btn_color} : {backgroundColor: color.white}]}>
                                    <Text style={[{textAlign: 'center', fontSize: 15}, (this.state.isPopular == 1) ? {color: 'white'} : {color: color.text_color1}]}>פופאלרי</Text>
                                </View>
                            </TouchableOpacity>                        
                        </View> :
                        <View style={{flexDirection: 'row', width: 220, height: 35, backgroundColor: color.white, borderRadius: 17.5, alignSelf: 'center', marginTop: 25}}>
                            <TouchableOpacity onPress={() => this.actionSwitch(1)}>
                                <View style={[{width: 110, height: 35, borderTopLeftRadius: 17.5, borderBottomLeftRadius: 17.5, justifyContent: 'center'}, (this.state.isPopular == 1) ? {backgroundColor: color.btn_color} : {backgroundColor: color.white}]}>
                                    <Text style={[{textAlign: 'center', fontSize: 15}, (this.state.isPopular == 1) ? {color: 'white'} : {color: color.text_color1}]}>פופאלרי</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => this.actionSwitch(0)}>
                                <View style={[{width: 110, height: 35, borderTopRightRadius: 17.5, borderBottomRightRadius: 17.5, justifyContent: 'center'}, (this.state.isPopular == 0) ? {backgroundColor: color.btn_color} : {backgroundColor: color.white}]}>
                                    <Text style={[{textAlign: 'center', fontSize: 15}, (this.state.isPopular == 0) ? {color: 'white'} : {color: color.text_color1}]}>קרוב אלי</Text>
                                </View>
                            </TouchableOpacity>
                        </View> }

                    <View style={[{ height: 30, marginTop: 30}]}>
                        <ScrollView
                            horizontal={true}
                            showsHorizontalScrollIndicator={false} >

                            {listPages}

                        </ScrollView>
                    </View>

                    <View style={{flex: 1, marginTop: 20}}>
                        <FlatList
                            data={this.state.stores}
                            keyExtractor={(item, index) => item.index}
                            extraData={this.state}
                            renderItem={({item, index}) => 
                                this.renderListItem(item, index)
                            }
                        />
                    </View>
                </ScrollView>

                <Loading ref="loading"/>
            </View>
        )
    }


}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.bg_color,
    },
});