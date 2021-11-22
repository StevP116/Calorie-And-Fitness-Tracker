// In App.js in a new project

import * as React from 'react';
import { View, Text, ScrollView, TextInput, Button, StyleSheet, TouchableOpacity, AccessibilityInfo } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignUpScreen from './SignUpScreen';
import ProfileScreen from './ProfileScreen';
import TodayView from './TodayView';
import ExerciseView from './ExerciseView';
import DisplayExercisesView from './DisplayExercisesView'
import AddExerciseView from './AddExerciseView';
import base64 from 'base-64';

function LoginScreen({ route, navigation }) {
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [screenReaderEnabled, setScreenReaderEnabled] = React.useState(false);

    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
        });

        AccessibilityInfo.isScreenReaderEnabled().then(
            screenReaderEnabled => {
                setScreenReaderEnabled(screenReaderEnabled);
            }
        );

        return unsubscribe;
    }, [navigation]);

    const handleLogin = () => {
        fetch("http://cs571.cs.wisc.edu:5000/login", {
            method: 'GET',
            headers: {
                'Authorization': 'Basic ' + base64.encode(username + ":" + password)
            }
        })
            .then(res => res.json())
            .then(res => {
                if (res.token) {
                    //route.params.handleLogin(res.token, username);
                    setUsername("");
                    setPassword("");
                    getProfileInfo(res.token, username);
                } else {
                    alert("Incorrect username or password! Please try again.");
                }
            })
            .catch(err => {
                alert(err)
            })
    }

    const getProfileInfo = (loginToken, loginUsername) => {
        //Do fetch here to get the profile and set profile var GET profile
        fetch("http://cs571.cs.wisc.edu:5000/users/" + loginUsername, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': loginToken
            }
        })
            .then(res => res.json())
            .then(res => {
                if (res) {
                    navigation.navigate('TodayView', {
                        profile: res,
                        username: loginUsername,
                        token: loginToken
                    });
                } else {
                    alert(res)
                }
            })
            .catch(err => {
                alert(err)
            })
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={{ fontSize: 27, fontWeight: "bold" }}
                accessible={true}
                accessibilityLabel="Fitness Tracker">
                Fitness Tracker
            </Text>
            <TextInput value={username} onChangeText={setUsername} placeholder={screenReaderEnabled ? undefined : "Username"} style={styles.input}
                accessible={true}
                accessibilityLabel="Username Text Input"
                accessibilityHint="Enter Username Here"
            />
            <TextInput value={password} secureTextEntry={true} onChangeText={setPassword} placeholder={screenReaderEnabled ? undefined : "Password"} style={styles.input}
                accessible={true}
                accessibilityLabel="Password Text Input"
                accessibilityHint="Enter Password Here"
            />
            <View style={{ margin: 7 }} />
            <View style={styles.button}>
                <View style={styles.button1}>
                    <TouchableOpacity onPress={handleLogin} title="Login"
                        accessible={true}
                        accessibilityLabel="Login button"
                        accessibilityHint="Logs into your account and navigates to Today View">
                        <View style={{ backgroundColor: "#00C1E8", textAlign: "center", height: 35, width: 60, justifyContent: "center" }}>
                            <Text style={{ color: "white", textAlign: "center", justifyContent: "center" }}>LOGIN</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate('SignUpScreen')} title="Sign Up"
                    accessible={true}
                    accessibilityLabel="Sign Up button"
                    accessibilityHint="Navigates to Account Sign Up Screen"
                >
                    <View style={{ backgroundColor: "#00C1E8", textAlign: "center", height: 35, width: 60, justifyContent: "center" }}>
                        <Text style={{ color: "white", textAlign: "center", justifyContent: "center" }}>SIGN UP</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const Stack = createNativeStackNavigator();

function App() {
    const [token, setToken] = React.useState("");
    const [profile, setProfile] = React.useState({});
    const [username, setUsername] = React.useState("");
    // Might use this in the next project.
    // const handleLogin = (loginToken, loginUsername) => {
    //     setToken(loginToken);
    //     setUsername(loginUsername);
    // }

    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name="LoginScreen"
                    component={LoginScreen} />
                <Stack.Screen
                    name="SignUpScreen"
                    component={SignUpScreen}
                />
                <Stack.Screen
                    name="ProfileScreen"
                    component={ProfileScreen}
                    initialParams={{ token, username }}
                    options={({ navigation }) => ({
                        headerStyle: {
                            backgroundColor: '#273469',
                        },
                        headerTintColor: '#EBF2FA',
                        headerLeft: () => (<></>),
                        headerRight: () => (
                            <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')} title="Logout"
                                accessible={true}
                                accessibilityLabel="Logout button"
                                accessibilityHint="Logs you out of your account and navigates to Log in screen">
                                <View style={{ backgroundColor: "#00C1E8", textAlign: "center", height: 35, width: 60, justifyContent: "center" }}>
                                    <Text style={{ color: "white", textAlign: "center", justifyContent: "center" }}>LOGOUT</Text>
                                </View>
                            </TouchableOpacity>
                        ),
                    })}
                />
                <Stack.Screen
                    name="TodayView"
                    component={TodayView}
                    initialParams={{ token, username }}
                    options={({ navigation }) => ({
                        headerStyle: {
                            backgroundColor: '#273469',
                        },
                        headerTintColor: '#EBF2FA',
                        headerLeft: () => (<></>),
                        headerRight: () => (
                            <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')} title="Logout"
                                accessible={true}
                                accessibilityLabel="Logout button"
                                accessibilityHint="Logs you out of your account and navigates to Log in screen">
                                <View style={{ backgroundColor: "#00C1E8", textAlign: "center", height: 35, width: 60, justifyContent: "center" }}>
                                    <Text style={{ color: "white", textAlign: "center", justifyContent: "center" }}>LOGOUT</Text>
                                </View>
                            </TouchableOpacity>
                        ),
                    })}
                />
                <Stack.Screen name="DisplayExercisesView"
                    component={DisplayExercisesView}
                    initialParams={{ token, username }}
                    options={({ navigation }) => ({
                        headerStyle: {
                            backgroundColor: '#273469',
                        },
                        headerTintColor: '#EBF2FA',
                        headerLeft: () => (<></>),
                        headerRight: () => (
                            <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')} title="Logout"
                                accessible={true}
                                accessibilityLabel="Logout button"
                                accessibilityHint="Logs you out of your account and navigates to Log in screen">
                                <View style={{ backgroundColor: "#00C1E8", textAlign: "center", height: 35, width: 60, justifyContent: "center" }}>
                                    <Text style={{ color: "white", textAlign: "center", justifyContent: "center" }}>LOGOUT</Text>
                                </View>
                            </TouchableOpacity>
                        ),
                    })}
                />
                <Stack.Screen name="AddExerciseView"
                    component={AddExerciseView}
                    initialParams={{ token, username }}
                    options={({ navigation }) => ({
                        headerStyle: {
                            backgroundColor: '#273469',
                        },
                        headerTintColor: '#EBF2FA',
                        headerLeft: () => (<></>),
                        headerRight: () => (
                            <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')} title="Logout"
                                accessible={true}
                                accessibilityLabel="Logout button"
                                accessibilityHint="Logs you out of your account and navigates to Log in screen">
                                <View style={{ backgroundColor: "#00C1E8", textAlign: "center", height: 35, width: 60, justifyContent: "center" }}>
                                    <Text style={{ color: "white", textAlign: "center", justifyContent: "center" }}>LOGOUT</Text>
                                </View>
                            </TouchableOpacity>
                        ),
                    })}
                />
                <Stack.Screen name="ExerciseView"
                    component={ExerciseView}
                    initialParams={{ token, username }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    button1: {
        marginRight: 10
    },
    textInput1: {
        marginBottom: 10
    },
    textInput2: {
        marginTop: 10
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    }
});

export default App;