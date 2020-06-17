import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Feather';

import Tips1 from './screens/Tips1';
import Tips2 from './screens/Tips2';
import Tips3 from './screens/Tips3';
import Login from './screens/Login';
import Home from './screens/Home';
import Settings from './screens/Settings';
import SkipButton from './components/Tips/SkipButton';

import Footer from './components/Home/Footer';
import AsyncStorage from '@react-native-community/async-storage';
import { CONSTANT } from './helpers';
import { View, ActivityIndicator, Alert, Platform } from 'react-native';
import { YellowBox } from 'react-native';
import messaging from '@react-native-firebase/messaging';

YellowBox.ignoreWarnings([
    'Non-serializable values were found in the navigation state',
]);
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();


const init = () => {
    const [isLogin, setIsLogin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [initialScreen, setInitialScreen] = useState("Tips1");

    useEffect(() => {
        async function initScreen() {
            let install = await AsyncStorage.getItem(CONSTANT.IS_INIT_INSTALL);
            let isLoginTemp = await AsyncStorage.getItem(CONSTANT.IS_LOGIN);

            if (install) {
                setInitialScreen("Login");
            }
            else
                await AsyncStorage.setItem(CONSTANT.IS_INIT_INSTALL, 'true');

            if (isLoginTemp)
                setIsLogin(true);

            setTimeout(() => {
                setIsLoading(false);
            }, 500)
        }


        initScreen();

        messaging().onNotificationOpenedApp(remoteMessage => {
            console.log(
                'Notification caused app to open from background state:',
                remoteMessage.notification,
            );
            // navigation.navigate(remoteMessage.data.type);
        });

        // Check whether an initial notification is available
        messaging()
            .getInitialNotification()
            .then(remoteMessage => {
                if (remoteMessage) {
                    console.log(
                        'Notification caused app to open from quit state:',
                        remoteMessage.notification,
                    );
                    // setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
                }
                // setIsLoading(false);
            });

        const unsubscribe = messaging().onMessage(async remoteMessage => {
            // Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
            if(Platform.OS === 'ios')
                Alert.alert(remoteMessage.data.notification.title, remoteMessage.data.notification.body);
            else
                Alert.alert(remoteMessage.notification.title, remoteMessage.notification.body);
        });

        return unsubscribe;
    }, [])


    return isLoading ? <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#F5AD47" />
    </View> : isLogin ? <Main setIsLogin={setIsLogin} /> : <Onboarding setIsLogin={setIsLogin} initialScreen={initialScreen} />;
}

const Main = ({ setIsLogin }) => {
    return (
        <NavigationContainer>
            <Tab.Navigator
                initialRouteName="Home"
                tabBarOptions={{
                    style: {
                        // backgroundColor:'#F5AD47'
                        // borderTopColor:'#F5AD47',
                        // borderTopWidth:2
                        // backgroundColor: '#FCF6EE'
                    },
                    activeTintColor: "#F5AD47"
                }}
            >
                <Tab.Screen name="Home" component={Home}
                    initialParams={{ setIsLogin }}
                    options={{
                        tabBarLabel: 'Home',
                        tabBarIcon: ({ color }) => (
                            <Icon name={'home'} size={20} color={color} />
                        ),
                    }}
                />
                <Tab.Screen name="Settings" component={Settings}
                    initialParams={{ setIsLogin }}
                    options={{
                        tabBarLabel: 'Settings',
                        tabBarIcon: ({ color }) => (
                            <Icon name={'settings'} size={20} color={color} />
                        ),
                    }}
                />
            </Tab.Navigator>
        </NavigationContainer>
    );
};

const Onboarding = ({ setIsLogin, initialScreen }) => {

    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName={initialScreen}
                screenOptions={{
                    ...TransitionPresets.SlideFromRightIOS
                }}
                headerMode="float"
                animation="fade"
            >
                <Stack.Screen
                    name="Tips1"
                    component={Tips1}
                    options={({ navigation }) => ({
                        title: 'Prevention Tips',
                        headerStyle: { backgroundColor: '#FCF6EE', elevation: 0 },
                        headerRight: () => (
                            <SkipButton onClick={() => navigation.navigate('Login')} />
                        )
                    })}
                />
                <Stack.Screen
                    name="Tips2"
                    component={Tips2}
                    options={({ navigation }) => ({
                        title: 'Prevention Tips',
                        headerStyle: { backgroundColor: '#FCF6EE', elevation: 0 },
                        headerRight: () => (
                            <SkipButton onClick={() => navigation.navigate('Login')} />
                        )
                    })}
                />
                <Stack.Screen
                    name="Tips3"
                    component={Tips3}
                    options={({ navigation }) => ({
                        title: 'Prevention Tips',
                        headerStyle: { backgroundColor: '#FCF6EE', elevation: 0 },
                        headerRight: () => (
                            <SkipButton onClick={() => navigation.navigate('Login')} />
                        )
                    })}
                />

                <Stack.Screen
                    name="Login"
                    component={Login}
                    initialParams={{ setIsLogin }}
                    options={({ navigation }) => ({
                        headerShown: false
                        // title: 'Login',
                        // headerStyle: {backgroundColor: '#FCF6EE', elevation: 0},
                        // headerRight: () => (
                        //     <SkipButton onClick={() => navigation.navigate('Home')} />
                        // )
                    })}
                />

            </Stack.Navigator>
        </NavigationContainer>
    );
};


export default init;