import * as React from 'react';
import { useState } from 'react';
import { View, Text, ScrollView, TextInput, Button, StyleSheet, TouchableOpacity, AccessibilityInfo } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';

function AddExerciseView({ route, navigation }) {

    const [exerciseName, setExerciseName] = React.useState("");
    const [duration, setDuration] = React.useState(0);
    const [caloriesBurned, setCaloriesBurned] = React.useState(0);
    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
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

    const handleNevermind = () => {
        navigation.navigate('DisplayExercisesView',
            {
                profile: route.params.profile,
                username: route.params.username,
                token: route.params.token
            })
    }

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
    };

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    const showDatepicker = () => {
        showMode('date');
    };

    const showTimepicker = () => {
        showMode('time');
    };

    const handleSaveExercise = () => {
        fetch("http://cs571.cs.wisc.edu:5000/activities", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': route.params.token
            },
            body: JSON.stringify({
                'name': exerciseName,
                'duration': duration,
                'date': (date).toISOString(),
                'calories': caloriesBurned
            })
        })
            .then(res => res.json())
            .then(res => {
                if (res) {
                    alert("Exercise added!")
                } else {
                    alert(res)
                }
            })
            .catch(err => {
                alert(err);
            })

        navigation.navigate('DisplayExercisesView', {
            profile: route.params.profile,
            username: route.params.username,
            token: route.params.token
        })
    }

    // Exercises have to be displayed here. 
    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.main}>
                <View style={styles.button}>
                    <Text style={{ fontSize: 27, marginBottom: 10, marginRight: 10, fontWeight: "bold" }}>
                        Exercise Details
                    </Text>
                    <Icon name="add" size={30} color="#000" accessible={true} accessibilityLabel="Plus icon"/>
                </View>
                <Text style={{ fontSize: 15, fontWeight: "bold" }}
                >Exercise Name</Text>
                <TextInput placeholderTextColor={'gray'} placeholder='Ex: Jogging' value={exerciseName} onChangeText={setExerciseName} style={styles.input}
                    accessible={true}
                    accessibilityLabel="Exercise Name Text Input"
                    accessibilityHint="Enter Exercise Name here"
                    placeholder={screenReaderEnabled ? undefined : "Ex: Jogging"}
                />
                <Text style={{ fontSize: 15, fontWeight: "bold" }}
                >Duration (minutes)</Text>
                <TextInput placeholderTextColor={'gray'} onChangeText={setDuration} style={styles.input}
                    accessible={true}
                    accessibilityLabel="Exercise Duration Text Input"
                    accessibilityHint="Enter Exercise Duration here"
                    value={screenReaderEnabled ? undefined : duration.toString()}
                />
                <Text style={{ fontSize: 15, fontWeight: "bold" }}
                >Calories Burnt</Text>
                <TextInput placeholderTextColor={'gray'} onChangeText={setCaloriesBurned} style={styles.input}
                    accessible={true}
                    accessibilityLabel="Calories Burnt Text Input"
                    accessibilityHint="Enter the number of calories burned during the exercise here"
                    value={screenReaderEnabled ? undefined : duration.toString()}
                />
                <Text style={{ fontSize: 15, fontWeight: "bold" }}
                >Exercise Date and Time</Text>
                <Text>{date.toString()}</Text>
                <View style={styles.button}>
                    <View style={styles.button1}>
                        <TouchableOpacity onPress={showDatepicker} title="Set Date"
                            accessible={true}
                            accessibilityLabel="Set Date Button"
                            accessibilityHint="Navigates to the Set Date modal to set the date of the exercise">
                            <View style={{ backgroundColor: "#00C1E8", textAlign: "center", height: 35, width: 75, justifyContent: "center" }}>
                                <Text style={{ color: "white", textAlign: "center", justifyContent: "center" }}>SET DATE</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={showTimepicker} title="Set Time"
                        accessible={true}
                        accessibilityLabel="Set Time Button"
                        accessibilityHint="Navigates to the Set Time modal to set the time of the exercise">
                        <View style={{ backgroundColor: "#00C1E8", textAlign: "center", height: 35, width: 75, justifyContent: "center" }}>
                            <Text style={{ color: "white", textAlign: "center", justifyContent: "center" }}>SET TIME</Text>
                        </View>
                    </TouchableOpacity>
                    {show && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={date}
                            mode={mode}
                            is24Hour={true}
                            display="default"
                            onChange={onChange}
                        />
                    )}
                </View>
                <Text style={{ fontSize: 15, marginTop: 30 }}>Looks good! Ready to save your work?</Text>
                <View style={styles.button}>
                    <View style={styles.button1}>
                        <TouchableOpacity onPress={handleSaveExercise} title="Save Exercise"
                            accessible={true}
                            accessibilityLabel="Save Exercise Button"
                            accessibilityHint="Saves the exercise and navigates to Exercises view">
                            <View style={{ backgroundColor: "#00C1E8", textAlign: "center", height: 35, width: 110, justifyContent: "center" }}>
                                <Text style={{ color: "white", textAlign: "center", justifyContent: "center" }}>SAVE EXERCISE</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={handleNevermind} title="Nevermind"
                        accessible={true}
                        accessibilityLabel="Nevermind Button"
                        accessibilityHint="Ignores current exercise being added and navigates to Exercises view">
                        <View style={{ backgroundColor: "#00C1E8", textAlign: "center", height: 35, width: 110, justifyContent: "center" }}>
                            <Text style={{ color: "white", textAlign: "center", justifyContent: "center" }}>NEVERMIND</Text>
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
        justifyContent: 'center',
        flex: 1
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10
    }
});

export default AddExerciseView;