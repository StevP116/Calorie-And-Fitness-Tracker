import * as React from 'react';
import { useState } from 'react';
import { View, Text, ScrollView, TextInput, Button, StyleSheet, Modal, Pressable } from 'react-native';
import { Card } from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';

function ExerciseView({ route, navigation, activity, exerciseDisplay, token, updateActivities }) {

    const [modalVisible, setModalVisible] = useState(false);
    const [exerciseName, setExerciseName] = React.useState(activity.name);
    const [duration, setDuration] = React.useState(activity.duration);
    const [caloriesBurned, setCaloriesBurned] = React.useState(activity.calories);
    const [date, setDate] = useState(new Date(activity.date));
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);

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

    const handleDelete = (activityId, token) => {
        fetch("http://cs571.cs.wisc.edu:5000/activities/" + activityId, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': token
            }
        })
            .then(res => res.json())
            .then(res => {
                if (res) {
                    alert("User activity deleted.")
                    updateActivities();
                } else {
                    alert("User activities could not be deleted.");
                }
            })
            .catch(err => {
                alert(err)
            })
    }

    const handleEdit = (activityId, token) => {
        fetch("http://cs571.cs.wisc.edu:5000/activities/" + activityId, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': token
            },
            body: JSON.stringify({
                name: exerciseName,
                duration: duration,
                date: (date).toISOString(),
                calories: caloriesBurned
            })
        })
            .then(res => res.json())
            .then(res => {
                if (res) {
                    alert("Activity successfully updated!");
                    updateActivities();
                    setModalVisible(!modalVisible)
                } else {
                    alert(res);
                }
            })
            .catch(err => {
                alert(err)
            })
    }

    // Exercises have to be displayed here. 
    return (
        <View style={styles.container}>
            <Card containerStyle={{ backgroundColor: '#C5C5C5' }}>
                <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 5 }}>{activity.name}</Text>
                <Text style={{ fontSize: 15, marginBottom: 5 }}>Date: {date.toString()}</Text>
                <Text style={{ fontSize: 15, marginBottom: 5 }}>Duration (mins): {activity.duration}</Text>
                <Text style={{ fontSize: 15, marginBottom: 5 }}>Calories Burnt: {activity.calories}</Text>
                {exerciseDisplay ?
                    <View>
                        <Button onPress={() => setModalVisible(!modalVisible)}
                            title="Edit" />
                        <Text></Text>
                        <Button title="Delete" onPress={() => handleDelete(activity.id, token)} />
                    </View> : <Text></Text>}
            </Card>

            {exerciseDisplay ? <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
            >
                <View style={styles.container}>
                    <View style={styles.modalView}>
                        <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 5 }}>Edit Activity</Text>
                        <Text style={{ fontSize: 15, fontWeight: "bold" }}>Exercise Name</Text>
                        <TextInput placeholderTextColor={'gray'} placeholder='Ex: Jogging' value={exerciseName} onChangeText={setExerciseName} style={styles.input} />
                        <Text style={{ fontSize: 15, fontWeight: "bold" }}>Duration (minutes)</Text>
                        <TextInput placeholderTextColor={'gray'} value={duration.toString()} onChangeText={setDuration} style={styles.input} />
                        <Text style={{ fontSize: 15, fontWeight: "bold" }}>Calories Burnt</Text>
                        <TextInput placeholderTextColor={'gray'} value={caloriesBurned.toString()} onChangeText={setCaloriesBurned} style={styles.input} />
                        <Text style={{ fontSize: 15, fontWeight: "bold" }}>Exercise Date and Time</Text>
                        <Text>{date.toString()}</Text>
                        <View style={styles.button}>
                            <View style={styles.button1}>
                                <Button
                                    title="Set Date" onPress={showDatepicker} />
                            </View>
                            <Button title="Set Time" onPress={showTimepicker} />
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
                        <View style={styles.button}>
                            <View style={styles.button1}>
                                <Button
                                    style={[styles.button, styles.buttonClose]}
                                    onPress={() => setModalVisible(!modalVisible)}
                                    title="Nevermind"
                                />
                            </View>
                            <Button title="Save Changes" onPress={() => handleEdit(activity.id, token)} />
                        </View>
                    </View>
                </View>
            </Modal> : <Text></Text>}
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
    },
    card: {
        backgroundColor: '#C5C5C5',
        alignItems: 'center',
        justifyContent: 'center'
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
        shadowRadius: 4,
        elevation: 5
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    }
});

export default ExerciseView;