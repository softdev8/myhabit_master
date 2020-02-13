import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, AsyncStorage, NativeModules, Platform, Alert, Modal} from 'react-native';

import { styles, color, windowWidth, windowHeight } from "./styles/theme"
import { App } from './global.js';

export default class Menu extends Component {

    constructor(props) {
        super(props);

        this.state = {
            first_name: "",
            last_name: "",
            language: '',
            imageUrl: '',
            modalVisible: false
        }
    }

    componentDidMount() {

        if (NativeModules.I18nManager && Platform.OS == 'android') {
            const {localeIdentifier} = NativeModules.I18nManager;
            
            this.setState({language: localeIdentifier})
            console.log(localeIdentifier);
        }
    }

    componentWillUpdate() {

        if (App.isOpenMenu) {
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

            App.isOpenMenu = false
        }        
    }

    setModalVisible = (visible) => {
        this.setState({ modalVisible: visible });
    }

    modalDidClose = () => {
        this.setState({ modalVisible: false });
    };

    closeMenu = () => {
        this.props.navigation.closeDrawer();
    }

    actionSelectItem = (index) => {
        this.props.navigation.closeDrawer();

        if (index == 0) {
            this.props.navigation.navigate('AdvancedStore')
        } else if (index == 2) {
            this.props.navigation.navigate('AdvertisingTask')
        } else if (index == 4) {
            this.props.navigation.navigate('UserProfile1')
        } else if (index == 5) {
            this.setState({ modalVisible: true });
        }
    }

    onActionLogout = () => {
        Alert.alert(
            'Logout',
            'Do you want to logout?',
            [
              {text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
              {text: 'Yes', onPress: () => this.logout()},
            ],
            { cancelable: false });
        return true;
    }

    logout = () => {
        AsyncStorage.setItem('token', "");
        this.setState({ modalVisible: false });

        this.props.navigation.navigate('Welcome')
    }

    render() {

        const {first_name, last_name, imageUrl} = this.state

        return (
            <View style={{flex: 1}}>
                <View style={{flex: 1, width: windowWidth - 90}}>
                    <Image source={{ uri: imageUrl }} style={{width: 75, height: 75, alignSelf: 'center', marginTop: 50, borderRadius: 37.5}}/>

                    {(this.state.language == "iw_IL" && Platform.OS == 'android') ?
                        <TouchableOpacity onPress={() => this.closeMenu()} style={{position: 'absolute', left: 13, top: 14}}>
                            <Image source={ require("../resource/close.png") } style={{width: 25, height: 25}}/>
                        </TouchableOpacity> :
                        <TouchableOpacity onPress={() => this.closeMenu()} style={{position: 'absolute', right: 13, top: 14}}>
                            <Image source={ require("../resource/close.png") } style={{width: 25, height: 25}}/>
                        </TouchableOpacity> }


                    <View style={{width: 80, height: .5, backgroundColor: color.line_color, alignSelf: 'center', marginTop: 20}} />
                    <Text style={{color: color.text_color, fontSize: 18, textAlign: 'center', marginTop: 10}}>{first_name} {last_name}, {App.hour}</Text>                            

                    <View style={[style.line, {marginTop: 25}]} />

                    <TouchableOpacity onPress={() => this.actionSelectItem(0)} >
                        {(this.state.language == "iw_IL" && Platform.OS == 'android') ?
                            <View style={style.menu_item}>
                                <Text style={[style.menu_item_label, {textAlign: 'left'}]}>קניות בחנות</Text>
                                <Image source={ require("../resource/store.png") } style={{width: 42, height: 42}}/>
                            </View> :
                            <View style={style.menu_item}>
                                <Image source={ require("../resource/store.png") } style={{width: 42, height: 42}}/>
                                <Text style={style.menu_item_label}>קניות בחנות</Text>
                            </View> }
                    </TouchableOpacity>
                    <View style={[style.line, {marginTop: 20}]} />

                    <TouchableOpacity onPress={() => this.actionSelectItem(1)} >
                        {(this.state.language == "iw_IL" && Platform.OS == 'android') ?
                            <View style={style.menu_item}>
                                <Text style={[style.menu_item_label, {textAlign: 'left'}]}>קניות און ליין</Text>
                                <Image source={ require("../resource/shopping.png") } style={{width: 42, height: 42}}/>
                            </View> :
                            <View style={style.menu_item}>
                                <Image source={ require("../resource/shopping.png") } style={{width: 42, height: 42}}/>
                                <Text style={style.menu_item_label}>קניות און ליין</Text>
                            </View> }
                    </TouchableOpacity>
                    <View style={[style.line, {marginTop: 20}]} />

                    <TouchableOpacity onPress={() => this.actionSelectItem(2)} >
                        {(this.state.language == "iw_IL" && Platform.OS == 'android') ?
                            <View style={style.menu_item}>
                                <Text style={[style.menu_item_label, {textAlign: 'left'}]}>משימת פרסום</Text>
                                <Image source={ require("../resource/advertising.png") } style={{width: 42, height: 42}}/>
                            </View> :
                            <View style={style.menu_item}>
                                <Image source={ require("../resource/advertising.png") } style={{width: 42, height: 42}}/>
                                <Text style={style.menu_item_label}>משימת פרסום</Text>
                            </View>}
                    </TouchableOpacity>
                    <View style={[style.line, {marginTop: 20}]} />

                    <TouchableOpacity onPress={() => this.actionSelectItem(3)} >
                        {(this.state.language == "iw_IL" && Platform.OS == 'android') ?
                            <View style={style.menu_item}>
                                <Text style={[style.menu_item_label, {textAlign: 'left'}]}>שתף חברים</Text>
                                <Image source={ require("../resource/friends.png") } style={{width: 42, height: 42}}/>
                            </View> :
                            <View style={style.menu_item}>
                                <Image source={ require("../resource/friends.png") } style={{width: 42, height: 42}}/>
                                <Text style={style.menu_item_label}>שתף חברים</Text>
                            </View> }
                    </TouchableOpacity>
                    <View style={[style.line, {marginTop: 20}]} />

                    <TouchableOpacity onPress={() => this.actionSelectItem(4)} >
                        {(this.state.language == "iw_IL" && Platform.OS == 'android') ?
                            <View style={style.menu_item}>
                                <Text style={[style.menu_item_label, {textAlign: 'left'}]}>פרופיל משתמש</Text>
                                <Image source={ require("../resource/avatar.png") } style={{width: 43, height: 42}}/>
                            </View> :
                            <View style={style.menu_item}>
                                <Image source={ require("../resource/avatar.png") } style={{width: 43, height: 42}}/>
                                <Text style={style.menu_item_label}>פרופיל משתמש</Text>
                            </View> }
                    </TouchableOpacity>
                    <View style={[style.line, {marginTop: 20}]} />

                    <TouchableOpacity onPress={() => this.actionSelectItem(5)} >
                        {(this.state.language == "iw_IL" && Platform.OS == 'android') ?
                            <View style={style.menu_item}>
                                <Text style={[style.menu_item_label, {textAlign: 'left'}]}>יציאה</Text>
                                <Image source={ require("../resource/logout.png") } style={{width: 43, height: 42}}/>
                            </View> :
                            <View style={style.menu_item}>
                                <Image source={ require("../resource/logout.png") } style={{width: 43, height: 42}}/>
                                <Text style={style.menu_item_label}>יציאה</Text>
                            </View> }
                    </TouchableOpacity>
                    <View style={[style.line, {marginTop: 20}]} />
                </View>

                <Modal animationType='fade' transparent={true} modalDidClose={this.modalDidClose} visible={this.state.modalVisible} onRequestClose={() => this.setModalVisible(false)} >
                    <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
                        <TouchableOpacity onPress={() => this.modalDidClose()} >
                       
                            <View style={{ width: windowWidth - 50, height: 175, alignSelf: 'center', backgroundColor: color.white, marginTop: (windowHeight - 175) / 2}}>
                                <Text style={{fontSize: 24, fontWeight: 'bold', margin: 15, textAlign: 'left'}}>התנתקות</Text>
                                <Text style={{fontSize: 20, marginLeft: 15, textAlign: 'left'}}>{(this.state.language == "iw_IL" && Platform.OS == 'android') ? "האם ברצונך להתנתק?" : "?האם ברצונך להתנתק"}</Text>

                                {(this.state.language == "iw_IL" && Platform.OS == 'android') ?
                                    <View style={{flexDirection: 'row', width: 75, position: 'absolute', bottom: 25, right: 15}}>
                                        <TouchableOpacity onPress={() => this.setState({modalVisible: false})} >
                                            <Text style={{fontSize: 20, color: color.btn_color}}>לא</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => this.logout()} >
                                            <Text style={{fontSize: 20, color: color.btn_color, marginLeft: 25}}>כן</Text>
                                        </TouchableOpacity>                                        
                                    </View> :
                                    <View style={{flexDirection: 'row', marginLeft: 15, marginTop: 35}}>
                                        <TouchableOpacity onPress={() => this.logout()} >
                                            <Text style={{fontSize: 20, color: color.btn_color}}>כן</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => this.setState({modalVisible: false})} >
                                            <Text style={{fontSize: 20, color: color.btn_color, marginLeft: 25}}>לא</Text>
                                        </TouchableOpacity>
                                    </View>
                                }
                            </View>                    
                        </TouchableOpacity>
                    </View>                    
                </Modal>
            </View>
        )
    }
}

const style = StyleSheet.create({
    menu_item: {
        flexDirection: 'row', 
        ...Platform.select({
            ios: {
                height: 40
            },
            android: {
                height: 30
            }
        }),
        
        alignItems: 'center', 
        marginTop: 15, 
        marginLeft: 20,
        marginRight: 25
    },
    menu_item_label: {
        flex: 1,
        color: color.menu_color, 
        fontSize: 18, 
        textAlign: 'right', 
        marginLeft: 15
    },
    line: {
        width: windowWidth - 90, 
        height: .5, 
        backgroundColor: color.line_color
    }
});