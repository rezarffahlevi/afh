import React, { Component } from 'react';
import {
    Text,
    View,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import Base64 from 'base-64';
import {CONSTANT} from '../helpers/';
import AsyncStorage from '@react-native-community/async-storage';

export default class Login extends Component {
    constructor() {
        super();
        this.state = {
            email: '',
            password: '',
            isLoading:false
        }
    }

    handleLogin = async () => {
        const {email, password} = this.state;
        if(email == '' || password == ''){
            Alert.alert("Warning", "Input email and password!")
            return {};
        }
        this.setState({isLoading:true})
        var asliToken = "130609dankogai0BhN%671298423"
        var token = Base64.encode(asliToken);
        
        let payload = {
            email,
            password,
            token,
            fcmtoken: ""
        }

        try {
            let res = await axios.post('https://portalmobile.dexagroup.com/api/login/v1.1.5/loginBitrix', payload);
            console.log('res', res)
            let { data } = res;
            // console.log("ooo",data);
            if ('data' in data) {
                let dataLogin = {
                    bitrix: data.data, it138: '', token: data.token, audienceid: '',
                    userLogin: { username: payload.email, password: payload.password }
                }
                // console.log(`response login ${email} :`, dataLogin);
                console.log(`login ${email} success..`);
                this.setState({isLoading:false})
                const { bitrix, userLogin } = dataLogin;
                let attendData = {
                    emailPrivate: bitrix.result.data.PRIVATE_EMAIL,
                    email: userLogin.username,
                    fullname: bitrix.result.data.NAME,
                    detailempno: bitrix.result.data.CEMP_NO,
                    detailpersonid: bitrix.result.data.CPERSON_ID,
                    detailemail: userLogin.username,
                    detailToken: data.token,
                    // longitude: params.longitude,
                    // latitude: params.latitude,
                    // telegram: params.telegram,
                    // discord: params.discord
                }
                dataLogin.attendData = attendData;
                // await AsyncStorage.setItem(CONSTANT.IS_LOGIN, 'true');
                // await AsyncStorage.setItem(CONSTANT.CURRENT_USER, JSON.stringify(dataLogin));

                await AsyncStorage.multiSet([
                    [CONSTANT.IS_LOGIN, 'true'],
                    [CONSTANT.CURRENT_USER, JSON.stringify(dataLogin)]
                ]);
                
                this.props.route.params.setIsLogin(true);
                return attendData;
            } else {
                console.log(`authentication ${email} failed`, data);
                this.setState({isLoading:false})
                Alert.alert("Warning", "Incorrect email or password!")
                return {};
            }

        } catch (err) {

            return {};
        };
    }
    render() {
        const {isLoading } = this.state;
        return (
            <View style={styles.cantainer}>
                <Text style={styles.headerTxt}>WELCOME</Text>
                <View style={styles.subView}>
                    {isLoading ? <ActivityIndicator size="large" color="#F5AD47" style={{marginVertical:25}}/> : 
                    <Text style={styles.subTxt}>Login</Text>}
                    <TextInput style={styles.nameInput} placeholder="Email" onChangeText={(email => { this.setState({ email }) })} />
                    <TextInput style={styles.nameInput} secureTextEntry={true} placeholder="Password" onChangeText={(password => { this.setState({ password }) })} />
                    <TouchableOpacity style={styles.btn} onPress={this.handleLogin} disabled={isLoading}>
                        <Text style={styles.btnTxt}>Login</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    cantainer: {
        backgroundColor: '#F5AD47',
        flex: 1,
    },
    subView: {
        backgroundColor: 'white',
        flex: 1,
        marginTop: 240,
        borderTopRightRadius: 40,
        borderTopLeftRadius: 40,
        alignItems: 'center'
    },
    headerTxt: {
        fontSize: 40,
        marginLeft: 40,
        fontWeight: 'bold',
        color: 'white',
        position: 'absolute',
        marginTop: 140,
    },
    subTxt: {
        color: 'black',
        marginTop: 20,
        fontSize: 30,
        fontWeight: 'bold',
        // marginLeft: 40,
    },
    nameInput: {
        height: 40,
        width: 270,
        // marginLeft: 40,
        borderBottomWidth: 1,
        marginTop: 30,
    },
    btn: {
        height: 50,
        width: 200,
        backgroundColor: '#F5AD47',
        borderRadius: 80,
        // borderWidth: 2,
        // marginLeft: 50,
        marginTop: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnTxt: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 20,
    },
    endView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    endTxt: {
        fontSize: 15,
        marginTop: 30,
        marginLeft: 60,
        fontWeight: 'bold',
    },
    endBtn: {
        marginRight: 80,
    },
    loginTxt: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 24,
    },
});