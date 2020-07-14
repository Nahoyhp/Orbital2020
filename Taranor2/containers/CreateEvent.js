import React, { Component } from 'react';
import { View, TextInput, StyleSheet, Text, Alert, Keyboard, Picker, Label, CheckBox} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { Button, Input } from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker'
import { TouchableOpacity } from 'react-native-gesture-handler';
import database from '../API/firebaseAPI';

const dayList = ['SUN','MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', ]

export default class CreateEvent extends Component{
    constructor() {
        super()
        this.state = {
            module:'',
            title: '',
            startTime: '',
            endTime: '',
            location: '',
            extra_description: '',
            date: '',
            created: false,
            moduleList: [],

            date : new Date(),
            dateDisplay: '',
            setDate: false,
            show : false,

            day : '',

            showStart: false,
            showEnd: false,
            display: 'default',
        }
    }

    updateModule = (module) => this.setState({module})

    updateTitle = (title) => this.setState({title})

    updateLocation = (location) => this.setState({location})

    updateExtraDescription = (extra_description) => this.setState({extra_description})

    checkInput = () => {
        let valid = this.state.module != ''
        valid = valid && this.state.title.length != 0
        valid = valid && (this.state.startTime != '' && this.state.endTime != '')
        valid = valid && this.state.date != ''
        return valid

    }

    reset = () => {
        this.setState({
            module:'',
            title: '',
            startTime: '',
            endTime: '',
            location: '',
            extra_description: '',
            date: '',
            created: false,
            moduleList: [],
        
            date : new Date(),
            dateDisplay: '',
            setDate: false,
            show : false,
        
            day : '',
            mode : 'date',
        
        
            showStart: false,
            showEnd: false,
            display: 'default',
        })
    }

    createNewEvent = () => {
       if (!this.checkInput()) {
           Alert.alert("Error", "Please fill in all the necessary detail")
           return
       }

       database.createEvent({state: this.state, function: () => this.reset()})
    }

    updateDate = (event, selectedDate) => {
        if (event.type == 'dismissed'){
            return
        }
        try{
            var date = new String(selectedDate.getDate()) + " - "
            if (selectedDate.getMonth() < 9) { date += '0'}
            date += new String(selectedDate.getMonth() + 1 )
            date += " - " + new String(selectedDate.getFullYear())
            this.setState({
                date: selectedDate,
                show: false, 
                dateDisplay: date,
                day: dayList[selectedDate.getDay()],
                setDate: true
            })
        } catch (err) {console.log(err)}
    }

    openDatePicker = () => {
        this.setState({show: true})
    }

    openTimePickerStart = () => {
        this.setState({showStart: true})
    }

    openTimePickerEnd = () => {
        this.setState({showEnd: true})
    }

    updateStartTime = (event, selectedTime) => {
        try {
            this.state.date.setHours(selectedTime.getHours())
            this.state.date.setMinutes(selectedTime.getMinutes())
            var hours = new String(selectedTime.getHours())
            var mins = new String(selectedTime.getMinutes())
            if (hours.length == 1) { hours = "0" + hours}
            if (mins.length == 1) {mins = "0" + mins}
            var time = hours + " : " + mins
            this.setState({
                showStart: false,
                startTime: time,
            })
        } catch (err) {console.log(err)}
    }

    updateEndTime = (event, endTime) => {
        if (event.type == 'dismissed'){
            return
        }
        try {
            var hours = new String(endTime.getHours())
            var mins = new String(endTime.getMinutes())
            if (hours.length == 1) { hours = "0" + hours}
            if (mins.length == 1) {mins = "0" + mins}
            var time = hours + " : " + mins
            this.setState({
                showEnd: false,
                endTime: time,
            }) 

        }catch (err) {console.log("Error at updateEndTime {CreateEvent} ")}
    }


    render(){
        return (
            <KeyboardAwareScrollView
                style = {{flex: 1, paddingBottom: 10, paddingTop: 10}}
            >
                <TextInput style = {styles.inputStyle}
                placeholder = "Module Name"
                value = {this.state.module}
                onChangeText = {this.updateModule}
                returnKeyType = "next"
                onSubmitEditing = {() => this.secondTextInput.focus()}
                blurOnSubmit = {false}
                />
                
                <TextInput style = {styles.inputStyle}
                placeholder = "Event Title" 
                value = {this.state.title}
                onChangeText={this.updateTitle}
                ref = {(input) => {this.secondTextInput = input}}

                />
                <TouchableOpacity
                    style = {styles.inputStyle}
                    onPress = {this.openDatePicker}>
                    { this.state.setDate ? <Text> {this.state.dateDisplay} </Text> :
                        <Text style = {styles.fakeInputStyle}>Date of Event </Text>
                    }
                </TouchableOpacity>

                <TouchableOpacity 
                    style = {styles.inputStyle}
                    onPress = {this.openTimePickerStart}>
                    { this.state.startTime != '' ? <Text> {this.state.startTime} </Text> :
                        <Text style = {styles.fakeInputStyle}>Start Time </Text>
                    }
                </TouchableOpacity>

                <TouchableOpacity 
                    style = {styles.inputStyle}
                    onPress = {this.openTimePickerEnd}>
                    { this.state.endTime != '' ? <Text> {this.state.endTime} </Text> :
                        <Text style = {styles.fakeInputStyle}>End Time </Text>
                    }
                </TouchableOpacity>

                <TextInput style = {styles.inputStyle}
                placeholder = "Location" 
                value = {this.state.location}
                onChangeText={this.updateLocation}
                returnKeyType = "next"
                onSubmitEditing = {() => this.extraDescription.focus()}
                blurOnSubmit = {false}
                />


                <TextInput style = {styles.inputStyle}
                placeholder = "Extra Description" 
                value = {this.state.extra_description}
                onChangeText={this.updateExtraDescription}
                ref = {(input) => {this.extraDescription = input}}
                onSubmitEditing = {this.createNewEvent}
                scrollEnabled = {true}
                multiline= {true}
                />

                <Button
                color="#3740FE"
                title="Create"
                onPress={this.createNewEvent}
                />

                {this.state.show && <DateTimePicker
                testID = 'datePicker'
                mode = {'date'}
                value = {this.state.date}
                onChange = {this.updateDate}
                is24Hour
                />}

                {this.state.showStart && <DateTimePicker
                testID = 'startTimePicker'
                mode = {'time'}
                value = {new Date()}
                onChange = {this.updateStartTime}
                is24Hour
                />}

                {this.state.showEnd && <DateTimePicker
                testID = 'dateTimePicker'
                mode = {'time'}
                value = {new Date()}
                onChange = {this.updateEndTime}
                is24Hour
                />}

            </KeyboardAwareScrollView>
            
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: 35,
        backgroundColor: '#fff'
    },

    fakeInputStyle: {
        color: '#c2c5cc'
    },

    inputStyle: {
        justifyContent: 'center',
        backgroundColor: 'white',
        width: '100%',
        marginBottom: 15,
        height: 50, 
        alignSelf: "center",
        borderColor: "#ccc",
        borderBottomWidth: 1,
        borderTopWidth: 1
    },
    Text: {
        fontSize: 15,
        color: '#3740FE',
        marginTop: 25,
        textAlign: 'center'
    },
    preloader: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff'
    }
  })
  