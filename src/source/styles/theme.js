import { StyleSheet, Dimensions, Platform } from 'react-native';
import { moderateScale as normalize } from 'react-native-size-matters';

const color = {
    fb_btn_bg: "#3b5998",
    active_tb_color: "#276ccd",
    deactive_tb_color: "#8c99aa",
    menu_color: "#636363",
    line_color: "#dadada",
    white: '#ffffff',
    text_color: '#1A76D2',
    text_color1: '#888888',
    text_color2: '#6D6B6B',
    bg_color: '#F4F8FC',
    google_btn_bg: '#ec3c34',
    status_color: '#ee6c7c',
    status_color1: '#50e3c2',
    btn_color: '#04c0f1',
    disalbe_card: '#252222',
    title_bar: '#262fa5',
    statusBar_morning_color: '#2528a2',
    statusBar_lunch_color: '#f25f23',
    statusBar_evening_color: '#4131aa',
}

const fontSize = {
    small: normalize(12),
    regular: normalize(15),
    large: normalize(17),
}

const padding = 10  ;
const navbarHeight = (Platform.OS === 'ios') ? 74 : 54;
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.white,
        alignItems: 'center'
    },
    input_view: {
        flexDirection: 'row', 
        alignItems: 'center',
        backgroundColor: color.grey,
        borderRadius: 22
    },
    text_input: {
        flex: 1, 
        height: 40, 
        marginLeft: 20
    },
    view_size: {
        height: 45,
        width: windowWidth - 50
    },
    label: {
        color: color.top_up, 
        fontSize: 12, 
        marginTop: 3
    },
    btn_label: {
        fontSize: fontSize.large, 
        color: 'white',
        textAlign: 'center'
    },
    line: {
        height: 0.5, 
        width: windowWidth - 40, 
        backgroundColor: color.grey, 
        marginTop: 15,
        marginLeft: 20
    },
    white_small_font: {
        color: color.white, 
        fontSize: fontSize.small
    }
});

export {
    styles,
    color,
    fontSize,
    padding,
    navbarHeight,
    windowWidth,
    windowHeight
}
