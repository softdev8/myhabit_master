import React, {Component} from 'react';
import {
    Dimensions,
    Image
} from 'react-native';
import {createBottomTabNavigator, createDrawerNavigator, createAppContainer} from 'react-navigation'

import { color } from "./src/source/styles/theme"

import SlideMenu from './src/source/Menu'

import Welcome from "./src/source/Welcome";
import Phone from "./src/source/Phone";
import PhoneVerification from "./src/source/PhoneVerification";
import UserProfile from "./src/source/UserProfile";
import UserProfile1 from "./src/source/UserProfile1";
import CatchUp from "./src/source/CatchUp";

import ForgotPassword from "./src/source/ForgotPassword";
import Gift from "./src/source/Gift";

import Main from "./src/source/main/Main";
import Details from "./src/source/Details";

import AdvancedStore from "./src/source/AdvancedStore";
import PaymentAmount from "./src/source/PaymentAmount";
import PaymentAmount1 from "./src/source/PaymentAmount1";
import SelectPayment from "./src/source/SelectPayment";
import AddCard from "./src/source/AddCard";

import AdvertisingTask from "./src/source/AdvertisingTask";
import Questions from "./src/source/Questions";
import Result from "./src/source/Result";
import Result1 from "./src/source/Result1";

import QRcode from "./src/source/QRcode";
import QRcodeResult from "./src/source/QRcodeResult";

const HomeStack = createDrawerNavigator({
    Welcome: { screen: Welcome,
      navigationOptions: ({navigation}) => ({
        gesturesEnabled: false,
        drawerLockMode: 'locked-open'
    }) },
    ForgotPassword: { screen: ForgotPassword,
      navigationOptions: ({navigation}) => ({
        gesturesEnabled: false,
        drawerLockMode: 'locked-open'
    }) },
    Gift: { screen: Gift,
      navigationOptions: ({navigation}) => ({
        gesturesEnabled: false,
        drawerLockMode: 'locked-open'
      })
    },
    Main: { screen: Main,
      navigationOptions: ({navigation}) => ({
        gesturesEnabled: false,
        drawerLockMode: 'locked-open'
      }) },
    Details: { screen: Details,
      navigationOptions: ({navigation}) => ({
        gesturesEnabled: false,
        drawerLockMode: 'locked-open'
      }) },
    AdvancedStore: { screen: AdvancedStore,
      navigationOptions: ({navigation}) => ({
        gesturesEnabled: false,
        drawerLockMode: 'locked-open'
      }) },
    PaymentAmount: { screen: PaymentAmount,
      navigationOptions: ({navigation}) => ({
        gesturesEnabled: false,
        drawerLockMode: 'locked-open'
      }) },  
    PaymentAmount1: { screen: PaymentAmount1,
      navigationOptions: ({navigation}) => ({
        gesturesEnabled: false,
        drawerLockMode: 'locked-open'
      }) },
    SelectPayment: { screen: SelectPayment,
      navigationOptions: ({navigation}) => ({
        gesturesEnabled: false,
        drawerLockMode: 'locked-open'
      }) },
    AddCard: { screen: AddCard,
      navigationOptions: ({navigation}) => ({
        gesturesEnabled: false,
        drawerLockMode: 'locked-open'
      }) },
    Phone: { screen: Phone,
      navigationOptions: ({navigation}) => ({
        gesturesEnabled: false,
        drawerLockMode: 'locked-open'
      }) },
    PhoneVerification: { screen: PhoneVerification,
      navigationOptions: ({navigation}) => ({
        gesturesEnabled: false,
        drawerLockMode: 'locked-open'
      }) },
    UserProfile: { screen: UserProfile,
      navigationOptions: ({navigation}) => ({
        gesturesEnabled: false,
        drawerLockMode: 'locked-open'
      }) },
    UserProfile1: { screen: UserProfile1,
      navigationOptions: ({navigation}) => ({
        gesturesEnabled: false,
        drawerLockMode: 'locked-open'
      }) },
    CatchUp: { screen: CatchUp,
      navigationOptions: ({navigation}) => ({
        gesturesEnabled: false,
        drawerLockMode: 'locked-open'
      }) },
    AdvertisingTask: { screen: AdvertisingTask,
      navigationOptions: ({navigation}) => ({
        gesturesEnabled: false,
        drawerLockMode: 'locked-open'
      }) },
    Questions: { screen: Questions,
      navigationOptions: ({navigation}) => ({
        gesturesEnabled: false,
        drawerLockMode: 'locked-open'
      }) },
    Result: { screen: Result,
      navigationOptions: ({navigation}) => ({
        gesturesEnabled: false,
        drawerLockMode: 'locked-open'
      }) },
    Result1: { screen: Result1,
      navigationOptions: ({navigation}) => ({
        gesturesEnabled: false,
        drawerLockMode: 'locked-open'
      }) },
    QRcode: { screen: QRcode,
      navigationOptions: ({navigation}) => ({
        gesturesEnabled: false,
        drawerLockMode: 'locked-open'
      }) },
    QRcodeResult: { screen: QRcodeResult,
      navigationOptions: ({navigation}) => ({
        gesturesEnabled: false,
        drawerLockMode: 'locked-open'
      }) },
    }, {
      contentComponent: SlideMenu,
      drawerWidth: Dimensions.get('window').width - 90,    
    }
);


const App = createAppContainer(HomeStack);

export default App;
