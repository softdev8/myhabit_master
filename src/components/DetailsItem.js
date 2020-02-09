import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    NativeModules,
    Platform
} from "react-native";

import { color, windowWidth } from "../source/styles/theme"

export default class DetailsItem extends Component {

    constructor(props) {
        super(props);

        this.state = {
            language: ''
        }
    }

    componentDidMount() {

        if (NativeModules.I18nManager && Platform.OS == 'android') {
            const {localeIdentifier} = NativeModules.I18nManager;
            
            this.setState({language: localeIdentifier})
            console.log(localeIdentifier);
        }
    }

    render() {

        const { date_time, value, transactionType } = this.props

        var amount = Math.floor(value * 100) / 100 ;

        const words = date_time.split('T');
        const date = words[0].split("-");
        const real_time = date[2] + "." + date[1] + "." + date[0].substring(2, 4)

        let status_color = (amount < 0) ? color.status_color : color.status_color1

        let thumbnails = (transactionType == "distribution") ? require("../resource/profit.png") : (transactionType == "spent in order") ? require("../resource/balance.png") : (transactionType == "charged in future payment") ? require("../resource/future_payment.png") : require("../resource/advertising.png")

        let title = (transactionType == "distribution") ? "הרווח שלי מקניות חברתית" : (transactionType == "spent in order") ? "שימוש ביתרת הביט" : (transactionType == "charged in future payment") ? "קבלת מימון חברתי": "קאשבק מקנייתך בהביט"

        return (
            
            (this.state.language == "iw_IL" && Platform.OS == 'android') ?
                <View style={{flexDirection: 'row', width: windowWidth - 20, height: 75, backgroundColor: color.white, marginLeft: 10, borderRadius: 7, alignItems: 'center', borderWidth: .5, borderColor: color.line_color, marginBottom: 10}}>
                    <View style={{width: 3, height: 75, backgroundColor: status_color, borderTopRightRadius: 7, borderBottomRightRadius: 7}} />
                    <Image source={ thumbnails } style={[{resizeMode: 'stretch', width: 24, height: 26, marginRight: 15, marginLeft: 15}]}/>

                    <View style={{flex: 1, height: 65, justifyContent: 'center'}}>
                        <Text style={{fontSize: 18, textAlign: 'left'}}>{title}</Text>
                        <Text style={{fontSize: 12, opacity: .7, textAlign: 'left', marginTop: 3}}>{real_time}</Text>
                    </View>

                    <Text style={{fontSize: 18, opacity: .7, width: 50, textAlign: 'right'}}>{amount}</Text>
                    <Text style={{fontSize: 12, opacity: .7, marginLeft: 15}}>  ₪</Text>                  
                </View> :
                <View style={{flexDirection: 'row', width: windowWidth - 20, height: 75, backgroundColor: color.white, marginLeft: 10, borderRadius: 7, alignItems: 'center', borderWidth: .5, borderColor: color.line_color, marginBottom: 10}}>
                    <Text style={{fontSize: 12, opacity: .7, marginLeft: 15}}>  ₪</Text>
                    <Text style={{fontSize: 18, opacity: .7, width: 50, textAlign: 'right'}}>{amount}</Text>

                    <View style={{flex: 1, height: 65, justifyContent: 'center'}}>
                        <Text style={{fontSize: 18, textAlign: 'right'}}>{title}</Text>
                        <Text style={{fontSize: 12, opacity: .7, textAlign: 'right', marginTop: 3}}>{real_time}</Text>
                    </View>

                    <Image source={ thumbnails } style={[{resizeMode: 'stretch', width: 24, height: 26, marginRight: 15, marginLeft: 15}]}/>
                    <View style={{width: 3, height: 75, backgroundColor: status_color, borderTopRightRadius: 7, borderBottomRightRadius: 7}} />
                </View> 
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
});
