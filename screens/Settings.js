import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Image, TextInput, TouchableOpacity, Alert, FlatList, Button } from 'react-native';

import NextButton from '../components/Tips/NextButton';
import { DotBold, DotLight } from '../components/Tips/DotSlider';
import Headers from '../components/Home/Headers';
import moment from 'moment';
// import PushNotification from 'react-native-push-notification';
// import NotificationService from '../helpers/NotificationService';
import AsyncStorage from '@react-native-community/async-storage';
import { CONSTANT } from '../helpers';
import DateTimePicker from '@react-native-community/datetimepicker';
import { CheckBox } from 'react-native-elements'
// import notifee, { EventType } from '@notifee/react-native';

// notifee.onForegroundEvent(({ type, detail }) => {
//   if (type === EventType.APP_BLOCKED) {
//     console.log('User toggled app blocked', detail.blocked);
//   }

//   if (type === EventType.CHANNEL_BLOCKED) {
//     console.log('User toggled channel block', detail.channel.id, detail.blocked);
//   }

//   if (type === EventType.CHANNEL_GROUP_BLOCKED) {
//     console.log('User toggled channel group block', detail.channelGroup.id, detail.blocked);
//   }
// });

const Settings = ({ setIsLogin }) => {
    const [token, setToken] = useState('');
    const [data, setData] = useState([]);

    const [date, setDate] = useState(new Date(1598051730000));
    const [mode, setMode] = useState('time');
    const [show, setShow] = useState(false);
    const [checked, setChecked] = useState(false);

    const [fcmRegistered, setFcmRegistered] = useState(false);
    // const notif = new NotificationService(
    //     onRegister,
    //     onNotif,
    // );

    useEffect(() => {
        const getData = async () => {

            let localData = JSON.parse(await AsyncStorage.getItem(CONSTANT.GET_LIST_ALARM));
            if (localData)
                setData(localData);
        }
        getData();
        // createChannel();
        // notifee.displayNotification({
        //     title: 'Foreground Service Notification',
        //     body: 'Press the Quick Action to stop the service',
        //     subtitle: 'Prizes',
        //     android: {
        //       channelId:'alarm',
        //       actions: [
        //         {
        //           title: 'Stop',
        //           pressAction: {
        //             id: 'stop',
        //           },
        //         },
        //       ],
        //       showChronometer: true,
        //       chronometerDirection: 'down',
        //       timestamp: Date.now() + 300000, // 5 minutes
        //     },
        //   });
    }, [])

    const createChannel = async () => {
        // await notifee.createChannel({
        //     id: 'alarm',
        //     name: 'Firing alarms & timers',
        //     lights: false,
        //     vibration: true,
        //     // importance: notifee.Importance.DEFAULT,
        // });
        //   await notifee.createChannelGroup({
        //     id: 'personal',
        //     name: 'Personal',
        //   });
        //   await notifee.deleteChannel('alarm');
        // // Assign the group to the channel
        // await notifee.createChannel({
        //     id: 'comments',
        //     name: 'New Comments',
        //     groupId: 'personal',
        // });
        // await notifee.deleteChannelGroup('personal');
        // notifee.cancelAllNotifications();
    }

    const reset = async () => {
        await AsyncStorage.removeItem(CONSTANT.GET_LIST_ALARM);
        PushNotification.removeAllDeliveredNotifications();
        notif.cancelAll();
        setData([]);
    }

    const onChange = async (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
        if (event.type === 'set') {
            let temp = [];
            temp.push({ time: currentDate });
            await AsyncStorage.setItem(CONSTANT.GET_LIST_ALARM, JSON.stringify([...temp, ...data]));
            setData([...temp, ...data]);
            console.log('event', currentDate);
            await notif.cancelAll();
            temp.forEach(async date => await notif.scheduleNotif({ date: date.time }))

        }
    };

    const showMode = currentMode => {
        setShow(true);
        setMode(currentMode);
    };

    const showDatepicker = () => {
        showMode('date');
    };

    const showTimepicker = () => {
        showMode('time');
    };

    const onRegister = (token) => {
        setToken(token);
        setFcmRegistered(true);
    }

    const onNotif = (notif) => {
        Alert.alert(notif.title, notif.message);
    }

    const handlePerm = (perms) => {
        Alert.alert('Permissions', JSON.stringify(perms));
    }

    const renderItem = ({ item, index }) => {
        let time = new Date(item.time);
        return (
            <View key={index + time.getHours() + time.getMinutes()}>
                <Text>{(time.getHours() < 10 ? '0' + time.getHours() : time.getHours()) + ' : ' + (time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes())}</Text>
            </View>
        )
    }

    return (
        <View style={{ flex: 1 }}>
            <Headers setIsLogin={setIsLogin} />
            <View style={styles.container}>
                <CheckBox
                    title='Auto absen'
                    checked={checked}
                    onPress={() => {
                        if (!checked) {
                            Alert.alert('Perhatian', 'Fitur belum tersedia!');
                            // setChecked(!checked)
                        }
                        else {
                            // BackgroundTimer.stopBackgroundTimer();
                            setChecked(!checked)
                        }
                    }}
                    containerStyle={{ marginTop: 30 }}
                />
                {/* <View style={{ marginVertical: 10 }}>
                    <TouchableOpacity onPress={showTimepicker} style={{ margin: 15, backgroundColor: '#F5AD47', paddingHorizontal: 70, paddingVertical: 15 }}>
                        <Text>Add Notification</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={reset} style={{ marginHorizontal: 15, marginBottom: 15, backgroundColor: '#F5AD47', paddingHorizontal: 15, paddingVertical: 15, alignItems: 'center' }}>
                        <Text>Reset</Text>
                    </TouchableOpacity>
                </View>
                {show && (
                    <DateTimePicker
                        style={{ width: '100%' }}
                        testID="dateTimePicker"
                        value={date}
                        mode={mode}
                        is24Hour={true}
                        display="default"
                        onChange={onChange}
                    />
                )}
                <Text style={styles.txtKategori}>Notification Time:</Text>
                <FlatList
                    data={data}
                    renderItem={item => renderItem(item)}
                    keyExtractor={(item, i) => i.toString()}
                /> */}
            </View>
        </View>
    );

    const example = () => {
        <View style={styles.container}>
            <Text style={styles.title}>
                Example app react-native-push-notification
                </Text>
            <View style={styles.spacer}></View>
            <TextInput
                style={styles.textField}
                value={token}
                placeholder="Register token"
            />
            <View style={styles.spacer}></View>

            <TouchableOpacity
                style={styles.button}
                onPress={() => {
                    notif.localNotif();
                }}>
                <Text>Local Notification (now)</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.button}
                onPress={() => {
                    notif.localNotif('sample.mp3');
                }}>
                <Text>Local Notification with sound (now)</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.button}
                onPress={() => {
                    notif.scheduleNotif();
                }}>
                <Text>Schedule Notification in 30s</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.button}
                onPress={() => {
                    notif.scheduleNotif('sample.mp3');
                }}>
                <Text>Schedule Notification with sound in 30s</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.button}
                onPress={() => {
                    notif.cancelNotif();
                }}>
                <Text>Cancel last notification (if any)</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.button}
                onPress={() => {
                    notif.cancelAll();
                }}>
                <Text>Cancel all notifications</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.button}
                onPress={() => {
                    notif.checkPermission(handlePerm);
                }}>
                <Text>Check Permission</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.button}
                onPress={() => {
                    notif.requestPermissions();
                }}>
                <Text>Request Permissions</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.button}
                onPress={() => {
                    notif.abandonPermissions();
                }}>
                <Text>Abandon Permissions</Text>
            </TouchableOpacity>

            <View style={styles.spacer}></View>

            {fcmRegistered && <Text>FCM Configured !</Text>}

            <View style={styles.spacer}></View>
        </View>
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: '#FCF6EE'
    },
    imageContainer: {
        width: '50%',
        height: '35%',
        marginVertical: '5%',
        alignItems: 'center'
    },
    image: {
        width: '100%',
        height: '100%'
    },
    textTitle: {
        fontSize: 36,
        fontFamily: 'HelveticaNeue-Bold'
    },
    textBody: {
        width: '75%',
        fontSize: 18,
        fontFamily: 'HelveticaNeue',
        marginVertical: '5%',
        textAlign: 'center'
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    button: {
        borderWidth: 1,
        borderColor: '#000000',
        margin: 5,
        padding: 5,
        width: '70%',
        backgroundColor: '#DDDDDD',
        borderRadius: 5,
    },
    textField: {
        borderWidth: 1,
        borderColor: '#AAAAAA',
        margin: 5,
        padding: 5,
        width: '70%',
    },
    spacer: {
        height: 10,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 20,
        textAlign: 'center',
    },
    txtKategori: {
        fontSize: 20,
        marginVertical: '8%',
        fontFamily: 'HelveticaNeue'
    },
});

export default Settings;