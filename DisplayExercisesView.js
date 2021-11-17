import * as React from 'react';
import { useState } from 'react';
import { View, Text, ScrollView, TextInput, Button, StyleSheet } from 'react-native';
import ExerciseView from './ExerciseView';
import Icon from 'react-native-vector-icons/Ionicons';

function DisplayExerciseView({ route, navigation }) {
    const [exerciseName, setExerciseName] = React.useState("");
    const [duration, setDuration] = React.useState(0);
    const [caloriesBurned, setCaloriesBurned] = React.useState(0);
    const [activities, setActivities] = React.useState([]);
    const [updater, setUpdater] = React.useState(0);

    const forceUpdate = React.useCallback(() => updateState({}), []);

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
        });

        return unsubscribe;
    }, [navigation]);

    // Exercises have to be displayed here. 
    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.main}>
            <View style={styles.button}>
                <Text style={{ fontSize: 27, marginBottom: 10, marginRight: 10, fontWeight: "bold" }}>Exercises</Text>
                <Icon name="fitness" size={30} color="#000" />
                </View>
            {activities.map(activity => <ExerciseView activity={activity} exerciseDisplay={true} token={route.params.token} updateActivities={updateActivities}/>)}
                <View style={styles.button}>
                    <View style={styles.button1}>
                        <Button onPress={() => navigation.navigate('ProfileScreen', {
                            profile: route.params.profile,
                            username: route.params.username,
                            token: route.params.token
                        })}
                            title="Profile" />
                    </View>
                    <View style={styles.button1}>
                        <Button onPress={() => navigation.navigate('AddExerciseView', {
                            profile: route.params.profile,
                            username: route.params.username,
                            token: route.params.token
                        })}
                            title="Add Exercise" />
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