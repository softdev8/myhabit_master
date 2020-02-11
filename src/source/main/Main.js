import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, Platform, NativeModules, BackHandler, Alert, StatusBar} from 'react-native';

import { color, windowWidth } from "../styles/theme"

import House from "./House"
import Barcode from "./Barcode"
import Credit from "./Credit"
import Transfer from "./Transfer"
import Details from '../Details';

import { App } from '../global.js';

export default class Main extends Component {

    constructor(props) {
        super(props);

        this.state = {
            tabIndex: 4,
            language: ''
        };

        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
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

    componentWillReceiveProps(props) {
        this.setState({
            tabIndex: 4
        })
    }

    actionSelectTab = (index) => {

        if (index == 0) {

            App.isOpenMenu = true
            
            this.props.navigation.openDrawer(); 
        } else if (index == 1) {
            this.props.navigation.navigate('QRcode')    
        } else {

            this.setState({
                tabIndex: index
            })
        }
    }

    actionAdvertisingTask = () => {
        this.props.navigation.navigate('AdvertisingTask')
    }

    render() {

        let selectedTab = this.state.tabIndex
        let currentBalance = ""
        
        if (this.props.navigation.state.params && this.state.tabIndex === 4) {
            selectedTab = this.props.navigation.state.params.selectedTab
            currentBalance = this.props.navigation.state.params.currentBalance
        }
        console.log("selectTab", selectedTab);
        
        let view = (selectedTab === 5) ? <Details navigation={this.props.navigation} currentBalance={currentBalance}/> : (selectedTab === 4) ? <House navigation={this.props.navigation} selectedTab={selectedTab} /> : (selectedTab === 3) ? <Transfer navigation={this.props.navigation} /> : (selectedTab === 2) ? <Credit navigation={this.props.navigation} /> : <Barcode navigation={this.props.navigation} />

        var date = new Date();
        var hour = date.getHours(); 
        console.log("Hour123", hour);

        var statusBar_color = (hour < 11) ? color.statusBar_morning_color : (hour < 20) ? color.statusBar_lunch_color : color.statusBar_evening_color

        StatusBar.setBarStyle( 'light-content',true)
        StatusBar.setBackgroundColor((selectedTab == 4) ? statusBar_color : color.statusBar_morning_color)

        return (
            <View style={styles.container}>

                <View style={{flex: 1, marginBottom: 60}}>
                    {view}
                </View>

                {(selectedTab != 5) ?
                    <TouchableOpacity onPress={() => this.actionAdvertisingTask()} style={{width: 120, height: 83, alignSelf: 'center', position: 'absolute', bottom: 15}}>
                        <Image source={require('../../resource/round.png')} style={{width: 120, height: 120}} />
                        <Image source={require('../../resource/advertising.png')} style={{width: 30, height: 25, position: 'absolute', top: 20, alignSelf: 'center'}} />
                    </TouchableOpacity> : null }
                
                {(this.state.language == "iw_IL" && Platform.OS == 'android') ?
                    <View style={{flexDirection: 'row', position: 'absolute', left: 0, bottom: 0, height: 60, backgroundColor: color.white, width: windowWidth}}>
                        <TouchableOpacity onPress={() => this.actionSelectTab(4)} style={styles.tab_view}>
                            <Image source={require('../../resource/house.png')} style={styles.tab_icon} />
                            <Text style={[styles.tab_label, (selectedTab == 4) ? {color: color.active_tb_color} : null]}>בית</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity onPress={() => this.actionSelectTab(3)} style={styles.tab_view}>
                            <Image source={require('../../resource/transfer.png')} style={styles.tab_icon} />
                            <Text style={[styles.tab_label, (selectedTab == 3) ? {color: color.active_tb_color} : null]}>העברת כסף</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => this.actionSelectTab(2)} style={styles.tab_view}>
                            <Image source={require('../../resource/credit.png')} style={styles.tab_icon} />
                            <Text style={[styles.tab_label, (selectedTab == 2) ? {color: color.active_tb_color} : null]}>טעינת אשראי</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => this.actionSelectTab(1)} style={styles.tab_view}>
                            <Image source={require('../../resource/barcode.png')} style={styles.tab_icon} />
                            <Text style={[styles.tab_label, (selectedTab == 1) ? {color: color.active_tb_color} : null]}>סריקת ברקוד</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => this.actionSelectTab(0)} style={styles.tab_view}>
                            <Image source={require('../../resource/more.png')} style={styles.tab_icon} />
                            <Text style={[styles.tab_label, (selectedTab == 0) ? {color: color.active_tb_color} : null]}>עוד</Text>
                        </TouchableOpacity>                
                    </View> : 
                    <View style={{flexDirection: 'row', position: 'absolute', left: 0, bottom: 0, height: 60, backgroundColor: color.white, width: windowWidth}}>
                        <TouchableOpacity onPress={() => this.actionSelectTab(0)} style={styles.tab_view}>
                            <Image source={require('../../resource/more.png')} style={styles.tab_icon} />
                            <Text style={[styles.tab_label, (selectedTab == 0) ? {color: color.active_tb_color} : null]}>עוד</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => this.actionSelectTab(1)} style={styles.tab_view}>
                            <Image source={require('../../resource/barcode.png')} style={styles.tab_icon} />
                            <Text style={[styles.tab_label, (selectedTab == 1) ? {color: color.active_tb_color} : null]}>סריקת ברקוד</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => this.actionSelectTab(2)} style={styles.tab_view}>
                            <Image source={require('../../resource/credit.png')} style={styles.tab_icon} />
                            <Text style={[styles.tab_label, (selectedTab == 2) ? {color: color.active_tb_color} : null]}>טעינת אשראי</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => this.actionSelectTab(3)} style={styles.tab_view}>
                            <Image source={require('../../resource/transfer.png')} style={styles.tab_icon} />
                            <Text style={[styles.tab_label, (selectedTab == 3) ? {color: color.active_tb_color} : null]}>העברת כסף</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => this.actionSelectTab(4)} style={styles.tab_view}>
                            <Image source={require('../../resource/house.png')} style={styles.tab_icon} />
                            <Text style={[styles.tab_label, (selectedTab == 4) ? {color: color.active_tb_color} : null]}>בית</Text>
                        </TouchableOpacity>
                    </View> }                
            </View>
        )
    }


}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.bg_color,
    },
    tab_view: {
        width: windowWidth / 5, 
        alignItems: 'center', 
        justifyContent: 'center',
    },
    tab_icon: {
        width: 30,
        height: 25 
    },
    tab_label: {
        color: color.deactive_tb_color, 
        marginTop: 3, 
        fontSize: 12
    }
});