import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const IconWrapper = props => {
    return (
        <View opacity={props.opacity} style={styles.iconWrapper}>
            <Icon name={props.icon} size={22} />
            <Text style={styles.title}>{props.children}</Text>
        </View>
    )
}

const Footer = () => {
     return (
        <View style={styles.container}>
            <IconWrapper icon="home">Home</IconWrapper>
            <IconWrapper opacity={0.5} icon="bar-chart">Reports</IconWrapper>
            {/* <IconWrapper opacity={0.5} icon="heart">Health</IconWrapper>
            <IconWrapper opacity={0.5} icon="phone-call">Emergency</IconWrapper> */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100%',
        height: 60,
        position: 'absolute',
        bottom: 20,
        left:0,
        right:0,
        borderColor: '#FFF',
        backgroundColor: '#efefef',
        // paddingHorizontal:10,
        borderRadius:30
    },
    iconWrapper: {
        alignItems: 'center',
    },
    title: {
        fontSize: 12,
        fontFamily: 'HelveticaNeue'
    }
});

export default Footer;