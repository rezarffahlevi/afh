import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Clipboard } from 'react-native';
import { Header } from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
import { CONSTANT } from '../../helpers';
import Icon from 'react-native-vector-icons/Feather';
import messaging, { AuthorizationStatus } from '@react-native-firebase/messaging';

const Headers = ({ setIsLogin }) => {
    return (
        <Header
            containerStyle={styles.headerContainer}
            leftComponent={
                <TouchableOpacity onPress={async () => {
                    const token = await messaging().getToken();
                    Clipboard.setString(token);
                }}>
                    <Image source={require('../../assets/icons/bar.png')} />
                </TouchableOpacity>}
            centerComponent={{ text: 'AFH', style: { ...styles.headerTitle } }}
            rightComponent={
                <TouchableOpacity onPress={async () => {
                    await AsyncStorage.multiRemove([CONSTANT.IS_LOGIN, CONSTANT.CURRENT_USER]);
                    setIsLogin(false);
                }}>
                    <Icon name="log-out" size={22} style={styles.headerRight} />
                </TouchableOpacity>}
        />
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        backgroundColor: '#FFF',
        // borderBottomRightRadius: 100,
        height: '10%',
    },
    headerTitle: {
        fontFamily: 'HelveticaNeue',
        color: '#000',
        fontSize: 20,
    },
    headerRight: {
        width: 24,
        height: 24,
        marginHorizontal: 10
    }
});

export default Headers;