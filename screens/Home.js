import React, { useEffect, useState } from 'react';
import {
    View, StyleSheet, Text, TouchableOpacity, RefreshControl, ScrollView, ActivityIndicator, Linking, Modal, Image, Platform,
    PermissionsAndroid, Alert
} from 'react-native';

import Headers from '../components/Home/Headers';
import Button from '../components/Home/Button';
import Icons from '../components/Home/Icons';
import Footer from '../components/Home/Footer';
import AsyncStorage from '@react-native-community/async-storage';
import { CONSTANT } from '../helpers/';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';
import { set } from 'react-native-reanimated';
import { handleClock, checkToday } from '../helpers/Absence';
// import BackgroundTask from 'react-native-background-task';
import messaging, { AuthorizationStatus } from '@react-native-firebase/messaging';

// Initialize the module (needs to be done only once)
Geocoder.init("AIzaSyD-fQ4pEHlSzYmAwLIWM7D5jj7hbg5SKYk");
// Geolocation.setRNConfiguration(config);

// BackgroundTask.define(async () => {
//     // Fetch some data over the network which we want the user to have an up-to-
//     // date copy of, even if they have no network when using the app
//     // const response = await fetch('http://feeds.bbci.co.uk/news/rss.xml')
//     // const text = await response.text()
//     // console.log('FROM TASK HEHEHE')
//     let local = await AsyncStorage.getItem('TEST');
//     let i = 0;
//     if(local)
//     {
//         i = parseInt(local);
//         i++;
//     }
//     // Data persisted to AsyncStorage can later be accessed by the foreground app
//     await AsyncStorage.setItem('TEST', i.toString());

//     // Remember to call finish()
//     BackgroundTask.finish()
// })

const params = {
    pagi: {
        url: 'https://portalmobile.dexagroup.com/api/hrd/mobile/v2/insertHRD',
        type: 'checkin-pagi'
    },
    siang: {
        url: 'https://portalmobile.dexagroup.com/api/hrd/mobile/v1/insertHRDSiang',
        type: 'checkin-siang'
    },
    sore: {
        url: 'https://portalmobile.dexagroup.com/api/hrd/mobile/v1/insertHRDSore',
        type: 'checkin-sore'
    }
}

const Home = ({ navigation, route }) => {
    const { setIsLogin } = route.params;
    const [isLoading, setIsLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [user, setUser] = useState({});
    const [longlat, setLonglat] = useState({});
    const [address, setAddress] = useState("Loading...");
    const [modal, setModal] = useState({});
    const [test, setTest] = useState(0);

    async function requestPermissions() {
        const authStatus = await messaging().requestPermission();
        const enabled =
            //   authStatus === AuthorizationStatus.AUTHORIZED || authStatus === AuthorizationStatus.PROVISIONAL;
            authStatus === 1 || authStatus === 2;

        // if (enabled) {
        console.log('Authorization status:', authStatus);
        // }

        if (Platform.OS === 'ios') {
            Geolocation.requestAuthorization();
            Geolocation.setRNConfiguration({
                skipPermissionRequests: false,
                authorizationLevel: 'whenInUse',
            });
            getLocation();

        }

        if (Platform.OS === 'android') {
            let check = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            );
            // console.log('check', check);
            if (check == 'granted')
                getLocation();
            else
                requestPermissions();
        }
    }


    const watchID = () => Geolocation.watchPosition(position => {
        const lastPosition = JSON.stringify(position);
        console.log('watch', position)
    });

    const getLocation = () => {
        setIsLoading(true);
        Geolocation.getCurrentPosition(
            position => {
                const initialPosition = JSON.stringify(position);
                setLonglat(position.coords);
                setIsLoading(false);
                console.log('ini', position)
            },
            error => {
                setIsLoading(false);
                Alert.alert('Error', JSON.stringify(error))
            },
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
        );
        watchID();
    }

    useEffect(() => {
        const getCurrentUser = async () => {
            let userLocal = JSON.parse(await AsyncStorage.getItem(CONSTANT.CURRENT_USER));
            setUser(userLocal);
            checkToday(userLocal.token);
            console.log('user', userLocal);

            // Register the device with FCM
            await messaging().registerDeviceForRemoteMessages();

            // Get the token
            const token = await messaging().getToken();
            console.log('fcm', token)
            setIsLoading(false);
        }

        setIsLoading(true);
        requestPermissions();
        getCurrentUser();
        // BackgroundTask.schedule({
        //     period: 900, // Aim to run every 30 mins - more conservative on battery
        // })
        // // Optional: Check if the device is blocking background tasks or not
        // checkStatus()

        return () => {
            Geolocation.clearWatch(watchID);
        };
    }, [])

    // const checkStatus = async () => {
    //     const status = await BackgroundTask.statusAsync()

    //     if (status.available) {
    //         // Everything's fine
    //         return
    //     }

    //     const reason = status.unavailableReason
    //     if (reason === BackgroundTask.UNAVAILABLE_DENIED) {
    //         Alert.alert('Denied', 'Please enable background "Background App Refresh" for this app')
    //     } else if (reason === BackgroundTask.UNAVAILABLE_RESTRICTED) {
    //         Alert.alert('Restricted', 'Background tasks are restricted on your device')
    //     }
    // }


    useEffect(() => {
        if ('latitude' in longlat) {
            setIsLoading(true);
            Geocoder.from(longlat.latitude, longlat.longitude)
                .then(json => {
                    var addressComponent = json.results[0].formatted_address;
                    setAddress(addressComponent);
                    setIsLoading(false);
                    console.log('addressComponent', addressComponent, longlat.latitude, longlat.longitude);
                })
                .catch(error => {
                    setIsLoading(false);
                    setAddress('Gagal mendapatkan alamat, tarik untuk merefresh');
                    console.warn(error)
                });
        }
    }, [longlat])

    const handleAbsence = (params) => {
        if (!('latitude' in longlat) || (address === 'Loading...' || address === 'Gagal mendapatkan alamat, tarik untuk merefresh')) {
            Alert.alert('Ulangi', 'Gagal mendapatkan alamat, pastikan GPS aktif dan diizinkan');
            getLocation();
            return {};
        }
        setIsLoading(true);
        handleClock({ ...params, ...longlat, ...{ attendData: user.attendData }, ...{ address } }, () => {
            setIsLoading(false);
            setModal({
                success: true,
                txt: params.type + ' berhasil pada ' + new Date().getHours() + ':' + new Date().getMinutes() + ' dan berlokasi di :\n\n ' + address
            })
            setModalVisible(true);
        }, () => {
            setIsLoading(false);
            setModal({
                success: false,
                txt: params.type + ' gagal : ' + err.toString()
            })
            setModalVisible(true);
        });
    }


    return (
        <View style={{ flex: 1 }}>
            <Headers setIsLogin={setIsLogin} />
            <View style={styles.container}>
                {
                    isLoading ? <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator size="large" color="#F5AD47" />
                    </View>
                        :
                        <ScrollView
                            refreshControl={
                                <RefreshControl refreshing={isLoading} onRefresh={() => {
                                    setIsLoading(true);
                                    // Geolocation.getCurrentPosition(info => setLonglat(info.coords));
                                    getLocation();
                                    setIsLoading(false);
                                }} />
                            }
                        >
                            <View style={styles.card}>
                                <Text style={{ fontSize: 21, paddingTop: 10 }}>Selamat Datang {/*test*/}</Text>
                                <Text style={{ fontSize: 16, paddingVertical: 10 }}>{user?.attendData?.fullname}</Text>
                                <Text style={{ fontSize: 16, paddingVertical: 10 }}>Posisi di : {'\n' + address}</Text>
                            </View>
                            <Text style={styles.txtKategori}>Udah belum?</Text>
                            <View style={{ justifyContent: 'space-around', flexDirection: 'row' }}>
                                <TouchableOpacity style={styles.btn} onPress={async () => {
                                    let url = "https://forms.gle/t6oh8ghGNWfGNW3L8";
                                    const supported = await Linking.canOpenURL(url);

                                    if (supported) {
                                        // Opening the link with some app, if the URL scheme is "http" the web link should be opened
                                        // by some browser in the mobile
                                        await Linking.openURL(url);
                                    } else {
                                        Alert.alert(`Don't know how to open this URL: ${url}`);
                                    }

                                }}>
                                    <Text>Isi Health Check</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.btn} onPress={() => {
                                    handleAbsence(params.pagi)
                                }}>
                                    <Text>Check in Pagi</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ justifyContent: 'space-around', flexDirection: 'row' }}>
                                <TouchableOpacity style={styles.btn} onPress={() => {
                                    handleAbsence(params.siang)
                                }}>
                                    <Text>Check in Siang</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.btn} onPress={() => {
                                    handleAbsence(params.sore)
                                }}>
                                    <Text>Check out Sore</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                }
            </View>
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                }}
            >
                <TouchableOpacity style={styles.centeredView} onPress={() => setModalVisible(!modalVisible)}>
                    <TouchableOpacity activeOpacity={1} style={styles.modalView}>

                        {
                            modal?.success &&
                            <Image
                                style={{ width: 100, height: 100, marginBottom: 20 }}
                                resizeMode={'contain'}
                                source={require('../assets/icons/ic_success.png')} />
                        }
                        <Text style={styles.modalText}>{modal.txt}</Text>

                        {/* <TouchableHighlight
                            style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                            onPress={() => {
                                setModalVisible(!modalVisible);
                            }}
                        >
                            <Text style={styles.textStyle}>Hide Modal</Text>
                        </TouchableHighlight> */}
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        // width: '100%',
        // borderLeftColor: '#FFF',
        // borderLeftWidth: 24,
        // backgroundColor: '#FFF'
        margin: 15,
        flex: 1
    },
    card: {
        backgroundColor: '#F5AD47',
        borderWidth: 2,
        borderColor: '#FFF0D9',
        borderRadius: 15,
        // height: 150,
        padding: 15,
        flex: 1
    },
    btn: {
        backgroundColor: '#F5AD47',
        borderWidth: 2,
        borderColor: '#FFF0D9',
        borderRadius: 15,
        height: 90,
        padding: 15,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    txtKategori: {
        fontSize: 20,
        marginVertical: '8%',
        fontFamily: 'HelveticaNeue'
    },

    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        // marginTop: 22,
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        zIndex: 99999999
    },
    openButton: {
        backgroundColor: "#F194FF",
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    }
});

export default Home;