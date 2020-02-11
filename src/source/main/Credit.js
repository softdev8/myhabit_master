import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

import { color } from "../styles/theme"

export default class Credit extends Component {

    constructor(props) {
        super(props);
    }

    openMenu = () => {
        this.props.navigation.openDrawer(); 
    }

    render() {

        return (
            <View style={styles.container}>
                <TouchableOpacity onPress={() => this.openMenu()} >
                    <Text style={{fontSize: 25}}>Loading Credit</Text>
                </TouchableOpacity>
            </View>
        )
    }


}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.white,
        alignItems: 'center',
        justifyContent: 'center'
    }
});