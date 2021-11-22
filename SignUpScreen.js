import * as React from 'react';
import { View, Text, ScrollView, TextInput, Button, StyleSheet, AccessibilityInfo, TouchableOpacity } from 'react-native';
import { isEqual } from 'lodash';


function SignUpScreen({ route, navigation }) {
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

    const handleSignUp = () => {
        fetch("http://cs571.cs.wisc.edu:5000/users", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'username': username,
                'password': password
            })
        })
            .then(res => res.json())
            .then(res => {
                if (isEqual(res.message, "Username already taken!")) {
                    alert("Username already taken!");
                } else if (isEqual(res.message, "Field password must be 5 characters or longer.")) {
                    alert("Password must be 5 characters or longer.");
                } else if (isEqual(res.message, "Field username must be 5 characters or longer.")) {
                    alert("Username must be 5 characters or longer.");
                } else {
                    alert(res.message);
                    setUsername("");
                    setPassword("");
                    navigation.navigate('LoginScreen');
                }
            })
            .catch(err => {
                alert(err);
            })
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={{ fontSize: 27, fontWeight: "bold" }}>
                Fitness Tracker
            </Text>
            <Text>New Here? Let's get started!</Text>
            <Text style={{ marginBottom: 10 }}>Please create an account below.</Text>
            <TextInput id='textInput1' value={username} onChangeText={setUsername} style={styles.input}
                placeholder={screenReaderEnabled ? undefined : "Username"}
                accessible={true}
                accessibilityLabel="Username Text Input"
                accessibilityHint="Enter Username for your new account here"
            />
            <TextInput value={password} style={styles.input} secureTextEntry={true} onChangeText={setPassword} 
            placeholder={screenReaderEnabled ? undefined : "Password"}
            accessible={true}
            accessibilityLabel="Password Text Input"
            accessibilityHint="Enter Password for your new account here"
            />
            <View style={styles.button}>
                <View style={styles.button1}>
                    <TouchableOpacity onPress={handleSignUp} title="Create Account"
                        accessible={true}
                        accessibilityLabel="Create Account button"
                        accessibilityHint="Creates your account and navigates back to login screen">
                        <View style={{ backgroundColor: "#00C1E8", textAlign: "center", height: 35, width: 100, justifyContent: "center" }}>
                            <Text style={{ color: "white", textAlign: "center", justifyContent: "center" }}>CREATE ACCOUNT</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')} title="Nevermind!"
                        accessible={true}
                        accessibilityLabel="Nevermind button"
                        accessibilityHint="Exits account sign up and navigates back to login screen">
                        <View style={{ backgroundColor: "#00C1E8", textAlign: "center", height: 35, width: 100, justifyContent: "center" }}>
                            <Text style={{ color: "white", textAlign: "center", justifyContent: "center" }}>NEVERMIND!</Text>
                        </View>
                    </TouchableOpacity>
            </View>
        </ScrollView>
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
        marginBottom: 10,

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

export default SignUpScreen;