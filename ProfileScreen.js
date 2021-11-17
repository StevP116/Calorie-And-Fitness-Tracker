import * as React from 'react';
import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, Button, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

function ProfileScreen({ route, navigation }) {
    const [firstName, setFirstName] = React.useState(route.params.profile.firstName);
    const [lastName, setLastName] = React.useState(route.params.profile.lastName);
    const [calories, setCalories] = React.useState(route.params.profile.goalDailyCalories.toString());
    const [protein, setProtein] = React.useState(route.params.profile.goalDailyProtein.toString());
    const [carbs, setCarbs] = React.useState(route.params.profile.goalDailyCarbohydrates.toString());
    const [fat, setFat] = React.useState(route.params.profile.goalDailyFat.toString());
    const [activity, setActivity] = React.useState(route.params.profile.goalDailyActivity.toString());

    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            fetch("http://cs571.cs.wisc.edu:5000/users/" + route.params.username, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': route.params.token
                }
            })
                .then(res => res.json())
                .then(res => {
                    if (res) {
                        setActivity(res.goalDailyActivity.toString())
                    } else {
                        alert(res)
                    }
                })
                .catch(err => {
                    alert(err)
                })
        });

        return unsubscribe;
    }, [navigation]);

    const handleSave = () => {

        fetch("http://cs571.cs.wisc.edu:5000/users/" + route.params.username, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': route.params.token
            },
            body: JSON.stringify({
                firstName: firstName,
                lastName: lastName,
                goalDailyCalories: calories,
                goalDailyProtein: protein,
                goalDailyCarbohydrates: carbs,
                goalDailyFat: fat,
                goalDailyActivity: activity
            })
        })
            .then(res => res.json())
            .then(res => {
                if (res) {
                    alert(res.message);
                } else {
                    alert(res);
                }
            })
            .catch(err => {
                alert(err)
            })
    }

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.main}>
            <View style={styles.button}>
            <Text style={{ fontSize: 27, marginBottom: 10, marginRight: 10, fontWeight: "bold" }}>
                    About Me
                </Text>
                <Icon name="body" size={30} color="#000" />
                </View>
                <Text>
                    Let's get to know you!
                </Text>
                <Text style={{ marginBottom: 10 }}>
                    Specify your information below.
                </Text>
                <Text style={{ fontSize: 20, marginBottom: 10, fontWeight: "bold" }}>
                    Personal Information
                </Text>
                <Text style={{ fontSize: 15, fontWeight: "bold" }}>First Name</Text>
                <TextInput placeholderTextColor={'gray'} placeholder='Bucky' value={firstName} onChangeText={setFirstName} style={styles.input} />
                <Text style={{ fontSize: 15, fontWeight: "bold" }}>Last Name</Text>
                <TextInput placeholderTextColor={'gray'} placeholder='Badger' value={lastName} onChangeText={setLastName} style={styles.input} />
                <Text style={{ fontSize: 20, marginBottom: 10, fontWeight: "bold" }}>Fitness Goals</Text>
                <Text style={{ fontSize: 15, fontWeight: "bold" }}>Daily Calories (kcal)</Text>
                <TextInput placeholderTextColor={'black'} value={calories} onChangeText={setCalories} style={styles.input} />
                <Text style={{ fontSize: 15, fontWeight: "bold" }}>Daily Protein (grams)</Text>
                <TextInput placeholderTextColor={'black'} value={protein} onChangeText={setProtein} style={styles.input} />
                <Text style={{ fontSize: 15, fontWeight: "bold" }}>Daily Carbs (grams)</Text>
                <TextInput placeholderTextColor={'black'} value={carbs} onChangeText={setCarbs} style={styles.input} />
                <Text style={{ fontSize: 15, fontWeight: "bold" }}>Daily Fat (grams)</Text>
                <TextInput placeholderTextColor={'black'} value={fat} onChangeText={setFat} style={styles.input} />
                <Text style={{ fontSize: 15, fontWeight: "bold" }}>Daily Activity (mins)</Text>
                <TextInput placeholderTextColor={'black'} value={activity} onChangeText={setActivity} style={styles.input} />
                <Text style={{ fontSize: 20, marginBottom: 10, fontWeight: "bold" }}>Looks good! All set?</Text>
                <View style={styles.button}>
                    <View style={styles.button1}>
                        <Button onPress={handleSave} title="Save Profile" />
                    </View>
                    <Button onPress={() => navigation.navigate('TodayView',
                        {
                            profile: route.params.profile,
                            username: route.params.username,
                            token: route.params.token
                        })} title="Today View" />
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        marginHorizontal: 1
    },
    button: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10
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
    main: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10
    }
});

export default ProfileScreen;