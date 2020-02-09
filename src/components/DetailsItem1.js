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

import moment from 'moment-timezone';

export default class DetailsItem1 extends Component {

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

        const { thumbnails, title, date_time, value, value1 } = this.props

        var amount = Math.floor(value * 100) / 100 ;
        var amountAfterReduction = Math.floor(value1 * 100) / 100 ;

        const words = date_time.split('T');
        const date = words[0].split("-");
        const real_time = date[2] + "." + date[1] + "." + date[0].substring(2, 4)

        return (
            (this.state.language == "iw_IL" && Platform.OS == 'android') ?
                <View style={{flexDirection: 'row', width: windowWidth - 20, height: 75, backgroundColor: color.white, marginLeft: 10, borderRadius: 7, alignItems: 'center', borderWidth: .5, borderColor: color.line_color, marginBottom: 10}}>
                    <View style={{width: 50, height: 50, borderColor: color.line_color, borderWidth: .5, justifyContent: 'center', marginRight: 15}}>
                        <Image source={ { uri: thumbnails} } style={[{width: 30, height: 24, alignSelf: 'center'}]}/>
                    </View>                

                    <View style={{flex: 1, height: 65, justifyContent: 'center', marginRight: 10}}>
                        <Text style={{fontSize: 17, textAlign: 'left'}}>{title}</Text>
                        <Text style={{fontSize: 10, opacity: .7, textAlign: 'left', marginTop: 3}}>{real_time}</Text>
                    </View>

                    <View>
                        <Text style={{fontSize: 12, opacity: .7, width: 95, textAlign: 'left', marginLeft: 10}}>שימוש ביתרת הביט</Text>
                        <Text style={{fontSize: 12, opacity: .7, width: 95, textAlign: 'left', marginLeft: 10}}>שימוש ביתרת הביט</Text>
                    </View>

                    <View>
                        <Text style={{fontSize: 12, opacity: .7, marginLeft: 8}}>₪{amount}</Text>
                        <Text style={{fontSize: 12, marginLeft: 8, color: '#215bc6'}}>₪{amountAfterReduction}</Text>
                    </View>
                </View> :
                <View style={{flexDirection: 'row', width: windowWidth - 20, height: 75, backgroundColor: color.white, marginLeft: 10, borderRadius: 7, alignItems: 'center', borderWidth: .5, borderColor: color.line_color, marginBottom: 10}}>
                    <View>
                        <Text style={{fontSize: 12, opacity: .7, marginLeft: 8}}>₪{amount}</Text>
                        <Text style={{fontSize: 12, marginLeft: 8, color: '#215bc6'}}>₪{amountAfterReduction}</Text>
                    </View>

                    <View>
                        <Text style={{fontSize: 12, opacity: .7, width: 95, textAlign: 'right', marginLeft: 10}}>שימוש ביתרת הביט</Text>
                        <Text style={{fontSize: 12, opacity: .7, width: 95, textAlign: 'right', marginLeft: 10}}>שימוש ביתרת הביט</Text>
                    </View>

                    <View style={{flex: 1, height: 65, justifyContent: 'center', marginRight: 10}}>
                        <Text style={{fontSize: 17, textAlign: 'right'}}>{title}</Text>
                        <Text style={{fontSize: 10, opacity: .7, textAlign: 'right', marginTop: 3}}>{real_time}</Text>
                    </View>
                    
                    <View style={{width: 50, height: 50, borderColor: color.line_color, borderWidth: .5, justifyContent: 'center', marginRight: 15}}>
                        <Image source={ { uri: thumbnails} } style={[{width: 30, height: 24, alignSelf: 'center'}]}/>
                    </View>
                    
                </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
});
