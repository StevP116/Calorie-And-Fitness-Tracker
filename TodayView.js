import * as React from 'react';
import { View, Text, ScrollView, TextInput, Button, StyleSheet, TouchableOpacity, AccessibilityInfo } from 'react-native';
import { isEqual } from 'lodash';
import { useState, useEffect } from 'react';
import ExerciseView from './ExerciseView';
import Icon from 'react-native-vector-icons/Ionicons';


function TodayView({ route, navigation }) {
    const [activities, setActivities] = useState([]);
    const [goalDailyMins, setGoalDailyMins] = useState(route.params.profile.goalDailyActivity.toString());
    const [screenReaderEnabled, setScreenReaderEnabled] = React.useState(false);

    var activitiesFilter = activities.filter(activity => {
        let currDate = new Date()
        let actDate = new Date(activity.date)
        return currDate.getDay() === actDate.getDay()
    })
    var completedDailyMins = activitiesFilter.reduce((acc, act) => {
        acc = acc + act.duration;
        return acc;
    }, 0);
    const [activityId, setActivityId] = useState(0);
    const [activityName, setActivityName] = useState("");
    const [activityDuration, setActivityDuration] = useState("");
    const [activityDate, setActivityDate] = useState("");
    const [calsBurned, setCalsBurned] = useState(0);

    const handleExerciseView = () => {
        navigation.navigate('DisplayExercisesView',
            {
                profile: route.params.profile,
                username: route.params.username,
                token: route.params.token,
                activities: activities
            })
    }

    const handleProfileView = () => {
        navigation.navigate('ProfileScreen',
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
                        setActivities(res.activities)
                    } else {
                        alert("User activities could not be retrieved.");
                    }
                })
                .catch(err => {
                    alert(err)
                })

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
                        setGoalDailyMins(res.goalDailyActivity)
                    } else {
                        alert(res)
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
            <ScrollView contentContainerStyle={styles.main}>
                <Text style={{ fontSize: 27, fontWeight: "bold", marginBottom: 10 }}>Today</Text>
                <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 15 }}>Goal Status</Text>
                <Text style={{ fontSize: 17, marginBottom: 15 }}>Daily Activity: {completedDailyMins}/{goalDailyMins} minutes</Text>
                <View style={styles.button}>
                    <Text style={{ fontSize: 20, marginBottom: 10, marginRight: 10, fontWeight: "bold" }}>Completed Exercises</Text>
                    <Icon name="bicycle" size={30} color="#000" accessible={true} accessibilityLabel="Man riding a bicycle icon"/>
                </View>
                {activitiesFilter.map(activity => <ExerciseView activity={activity} exerciseDisplay={false} token={route.params.token} updateActivities={updateActivities} />)}
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
                    {/* <Button onPress={() => navigation.navigate('DisplayExercisesView',
                        {
                            profile: route.params.profile,
                            username: route.params.username,
                            token: route.params.token,
                            activities: activities
                        })} title="Exercises" 
                        accessible={true}
                        accessibilityLabel="Exercises button. Navigates you to Exercises view. All of your exercises are visible here"
                        /> */}
                    <TouchableOpacity onPress={handleExerciseView} title="Exercises"
                        accessible={true}
                        accessibilityLabel="Exercises button"
                        accessibilityHint="Navigates you to Exercises view. All of your exercises are visible here">
                        <View style={{ backgroundColor: "#00C1E8", textAlign: "center", height: 35, width: 75, justifyContent: "center" }}>
                            <Text style={{ color: "white", textAlign: "center", justifyContent: "center" }}>EXERCISES</Text>
                        </View>
                    </TouchableOpacity>
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

export default TodayView;