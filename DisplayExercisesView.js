import * as React from 'react';
import { useState } from 'react';
import { View, Text, ScrollView, TextInput, Button, StyleSheet, AccessibilityInfo, TouchableOpacity } from 'react-native';
import ExerciseView from './ExerciseView';
import Icon from 'react-native-vector-icons/Ionicons';

function DisplayExerciseView({ route, navigation }) {
    const [exerciseName, setExerciseName] = React.useState("");
    const [duration, setDuration] = React.useState(0);
    const [caloriesBurned, setCaloriesBurned] = React.useState(0);
    const [activities, setActivities] = React.useState([]);
    const [updater, setUpdater] = React.useState(0);
    const [screenReaderEnabled, setScreenReaderEnabled] = React.useState(false);

    const forceUpdate = React.useCallback(() => updateState({}), []);

    const handleProfileView = () => {
        navigation.navigate('ProfileScreen',
            {
                profile: route.params.profile,
                username: route.params.username,
                token: route.params.token
            })
    }

    const handleAddExerciseView = () => {
        navigation.navigate('AddExerciseView',
            {
                profile: route.params.profile,
                username: route.params.username,
                token: route.params.token
            })
    }

    const handleTodayView = () => {
        navigation.navigate('TodayView',
            {
                profile: route.params.profile,
                username: route.params.username,
                token: route.params.token
            })
    }

    const updateActivities = () => {
        fetch("http://cs571.cs.wisc.edu:5000/activities", {
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
                    setActivities(res.activities);
                } else {
                    alert("User activities could not be retrieved.");
                }
            })
            .catch(err => {
                alert(err)
            })
    }

    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            // The screen is focused
            // Call any action
            fetch("http://cs571.cs.wisc.edu:5000/activities", {
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
                        setActivities(res.activities);
                    } else {
                        alert("User activities could not be retrieved.");
                    }
                })
                .catch(err => {
                    alert(err)
                })

            AccessibilityInfo.isScreenReaderEnabled().then(
                screenReaderEnabled => {
                    setScreenReaderEnabled(screenReaderEnabled);
                }
            );
        });

        return unsubscribe;
    }, [navigation]);

    // Exercises have to be displayed here. 
    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.main}
            >
                <View style={styles.button}>
                    <Text style={{ fontSize: 27, marginBottom: 10, marginRight: 10, fontWeight: "bold" }}>Exercises</Text>
                    <Icon name="fitness" size={30} color="#000" />
                </View>
                {activities.map(activity => <ExerciseView activity={activity} exerciseDisplay={true} token={route.params.token} updateActivities={updateActivities} />)}
                <View style={styles.button}>
                    <View style={styles.button1}>
                        <TouchableOpacity onPress={handleProfileView} title="Profile"
                            accessible={true}
                            accessibilityLabel="Profile button"
                            accessibilityHint="Navigates you to Profile view. All of your daily goals are visible here">
                            <View style={{ backgroundColor: "#00C1E8", textAlign: "center", height: 35, width: 75, justifyContent: "center" }}>
                                <Text style={{ color: "white", textAlign: "center", justifyContent: "center" }}>PROFILE</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.button1}>
                        <TouchableOpacity onPress={handleAddExerciseView} title="Add Exercise"
                            accessible={true}
                            accessibilityLabel="Add Exercise button"
                            accessibilityHint="Navigates to Add Exercise view, where you will enter 
                            exercise details to add an exercise to your account">
                            <View style={{ backgroundColor: "#00C1E8", textAlign: "center", height: 35, width: 105, justifyContent: "center" }}>
                                <Text style={{ color: "white", textAlign: "center", justifyContent: "center" }}>ADD EXERCISE</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={handleTodayView} title="Today View"
                        accessible={true}
                        accessibilityLabel="Today View button"
                        accessibilityHint="Navigates to Today View where you can view exercises 
                            completed today, as well as progress made towards your daily exercise goal">
                        <View style={{ backgroundColor: "#00C1E8", textAlign: "center", height: 35, width: 90, justifyContent: "center" }}>
                            <Text style={{ color: "white", textAlign: "center", justifyContent: "center" }}>TODAY VIEW</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    )
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
        marginBottom: 15,
        marginTop: 10
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
        justifyContent: 'center',
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10
    }
});

export default DisplayExerciseView;