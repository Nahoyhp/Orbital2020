import React, { Component } from 'react';
import { View, TextInput, StyleSheet, Text, Alert, Keyboard, Modal} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import DateTimePicker from '@react-native-community/datetimepicker'
import * as colours from '../colours'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import database from '../API/firebaseAPI';
import { genTimeBlock } from 'react-native-timetable';
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'
import {Picker} from '@react-native-community/picker';
import {Button} from 'react-native-elements'

const dayList = ['SUN','MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', ]

export function update(input){
    this.setState({
        managing: input
    })
}

export default class CreateEvent extends Component{
    constructor() {
        super()
        this.state = {
            managing: [],
            module:'',
            title: '',
            startTime: '',
            endTime: '',
            location: '',
            extra_description: '',
            created: false,
            moduleList: [],

            startDate : new Date(),
            endDate: new Date(),
            dateDisplay: '',
            setDate: false,
            show : false,

            day : '',

            showStart: false,
            showEnd: false,
            display: 'default',
        }

        update = update.bind(this)
    }

    updateModule = (module) => this.setState({module})

    updateTitle = (title) => this.setState({title})

    updateLocation = (location) => this.setState({location})

    updateExtraDescription = (extra_description) => this.setState({extra_description})

    checkInput = () => {
        let valid = this.state.module != ''
        valid = valid && this.state.title.length != 0
        valid = valid && (this.state.startTime != '' && this.state.endTime != '')
        valid = valid && this.state.startDate != ''
        return valid

    }

    reset = () => {
        this.setState({
            module:'',
            title: '',

            startTime: '',
            endTime: '',
            dateDisplay: '',
            day : '',

            location: '',
            extra_description: '',
        
            startDate : new Date(),
            endDate: new Date(),

            setDate: false,
            show : false,
            mode : 'date',
        
            showStart: false,
            showEnd: false,
            display: 'default',
        })
    }

    successMessage = () => {
        this.setState({loading: false})
        Alert.alert(
            "Successful", 
            "You have successfully created " + this.state.module +  " " + this.state.title,
            [
                {text: 'Dashboard', onPress: () => this.props.navigation.jumpTo('Dashboard')},
                {text: 'Stay at Page', onPress: () => this.reset()},
            ],
            {cancelable: false})
    }

    createNewEvent = () => {
        if (!this.checkInput()) {
            Alert.alert("Error", "Please fill in all the necessary detail")
            return
        }

        var start = this.state.startTime.split(':')
        var startMoment = genTimeBlock(this.state.day, start[0], start[1])
        var end = this.state.endTime.split(':')
        var endMoment = genTimeBlock(this.state.day, end[0], end[1])

        const eventDetail = {
            module : this.state.module,
            eventTitle : this.state.title,
            title : this.state.module + " " + this.state.title,

            startTime : startMoment,
            endTime : endMoment,
            day: this.state.day,

            startDate : this.state.startDate,
            endDate : this.state.endDate,

            location : this.state.location,
            extra_description : this.state.extra_description,

            createdAt: firestore.FieldValue.serverTimestamp(),
            createdBy: auth().currentUser.displayName,
        }
        database.createEvent({state: eventDetail, successMessage : input => this.successMessage()})
     }

    
    updateDate = (event, selectedDate) => {
        if (event.type == 'dismissed' || selectedDate == undefined){
            return
        }

        try{
            var date = new String(selectedDate.getDate()) + " - "
            if (selectedDate.getMonth() < 9) { date += '0'}
            date += new String(selectedDate.getMonth() + 1 )
            date += " - " + new String(selectedDate.getFullYear())
            this.setState({
                startDate: selectedDate,
                show: false, 
                dateDisplay: date,
                day: dayList[selectedDate.getDay()],
                setDate: true
            })
        } catch (err) {console.log(err)}
    }

    openDatePicker = () => {
        Keyboard.dismiss()
        this.setState({show: true})
    }

    openTimePickerStart = () => {
        this.setState({showStart: true})
    }

    openTimePickerEnd = () => {
        this.setState({showEnd: true})
    }



    updateStartTime = (event, selectedTime) => {
        if (event.type == 'dismissed' || selectedTime == undefined){
            return
        }
        try {
            this.state.startDate.setHours(selectedTime.getHours())
            this.state.startDate.setMinutes(selectedTime.getMinutes())
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

    updateEndTime = (event, selectedTime) => {
        if (event.type == 'dismissed' || selectedTime == undefined){
            return
        }
        try {
            var current = new Date(this.state.startDate.getTime())
            var hours = new String(selectedTime.getHours())
            var mins = new String(selectedTime.getMinutes())
            current.setHours(hours)
            current.setMinutes(mins)
            if (hours.length == 1) { hours = "0" + hours}
            if (mins.length == 1) {mins = "0" + mins}
            var time = hours + " : " + mins
            this.setState({
                showEnd: false,
                endTime: time,
                endDate : current,
            }) 
        }catch (err) {console.log(err)}
    }

    getCodeItems = () => {
        return this.state.managing.sort().map(code => {
            return (<Picker.Item label = {code} key = {code} value = {code}/>)
        })
    }

    componentDidMount = () => {
        this.setState({
            managing: database.getManaging()
        })
    }


    render(){
        return (
            <KeyboardAwareScrollView
                style = {{flex: 1, paddingBottom: 10, paddingTop: 10,backgroundColor:colours.darkblue}}
            >
                <View style = {styles.top} >
                    <Text style = {styles.header}> Create Event </Text>
                </View>
                
                <View style = {styles.bottom}>    
                    <View style = {dropDownStyle.style}>
                        <MaterialIcon
                            name = "subject"
                            color = {'#05375a'}
                            size = {20}
                        />
                        <Picker
                            style = {{flex: 1}}
                            selectedValue = {this.state.module}
                            onValueChange = {(item) => this.setState({module: item})}
                            placeholder = {{label: "Choose a code "}}
                        >
                            {this.getCodeItems()}
                        </Picker>
                    </View>

                    <View style = {styles.action}>
                        <MaterialIcon
                            name = "title"
                            color = {'#05375a'}
                            size = {20}
                        />
                        <TextInput style = {styles.inputStyle}
                            placeholder = "Event Title" 
                            value = {this.state.title}
                            onChangeText={this.updateTitle}
                            ref = {(input) => {this.secondTextInput = input}}
                        />
                    </View>
                    
                    <View style = {styles.action}>
                        <MaterialIcon
                            name = "date-range"
                            color = {'#05375a'}
                            size = {20}
                        />
                        <TextInput style = {styles.inputStyle}
                            placeholder = "Date of Event" 
                            value = {this.state.dateDisplay}
                            showSoftInputOnFocus = {false}
                            onFocus = {this.openDatePicker}
                        />
                    </View>


                    <View style = {{flex:1, flexDirection:"row", justifyContent: 'space-between',}}>
                        <View style = {styles.action}>
                            <AntDesign
                                name = "clockcircleo"
                                color = {'#05375a'}
                                size = {20}
                            />
                            <TextInput style = {styles.inputStyle}
                                placeholder = "Start Time" 
                                value = {this.state.startTime}
                                showSoftInputOnFocus = {false}
                                onFocus = {this.openTimePickerStart}
                            />
                        </View>
                        <View style = {styles.action}>
                            <AntDesign
                                name = "clockcircle"
                                color = {'#05375a'}
                                size = {20}
                            />
                            <TextInput style = {styles.inputStyle}
                                placeholder = "End Time" 
                                value = {this.state.endTime}
                                showSoftInputOnFocus = {false}
                                onFocus = {this.openTimePickerEnd}
                            />
                        </View>
                    </View>

                    <View style = {styles.action}>
                        <MaterialIcon
                            name = "location-on"
                            color = {'#05375a'}
                            size = {20}
                        />
                        <TextInput style = {styles.inputStyle}
                            placeholder = "Location" 
                            value = {this.state.location}
                            onChangeText={this.updateLocation}
                            returnKeyType = "next"
                            onSubmitEditing = {() => this.extraDescription.focus()}
                            blurOnSubmit = {false}
                        />
                    </View>

                    <View style = {styles.action}>
                        <MaterialIcon
                            name = "description"
                            color = {'#05375a'}
                            size = {20}
                        />    
                        <TextInput style = {styles.inputStyle}
                            placeholder = "Extra Description" 
                            value = {this.state.extra_description}
                            onChangeText={this.updateExtraDescription}
                            ref = {(input) => {this.extraDescription = input}}
                            onSubmitEditing = {this.createNewEvent}
                        />
                    </View>

                    <Button
                        color= {colours.darkblue}
                        title="Create Event"
                        buttonStyle = {{backgroundColor: colours.lightblue, borderTopLeftRadius: 15, borderBottomLeftRadius: 15, borderBottomRightRadius:15,borderTopRightRadius:15}}
                        onPress={this.createNewEvent}
                    />

                </View>
                {this.state.show && <DateTimePicker
                testID = 'datePicker'
                mode = {'date'}
                value = {new Date()}
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
const dropDownStyle = StyleSheet.create({
    style: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        marginBottom: 15,
        padding:5,
        flex: 1,
        zIndex: 10,
    }
})

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: 35,
        backgroundColor: colours.darkblue
    },

    top : {
        flex: 1,
        justifyContent: 'flex-end',
        marginTop:20,
        paddingHorizontal: 15,
        paddingBottom: 15
    },
    
    bottom: {
        flex: 5,
        backgroundColor: '#fff',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        paddingHorizontal: 25,
        paddingVertical: 25,
    },
    
    header:{
        fontSize:30,
        fontFamily:'serif',
        color: "#fff",
        marginTop:5,
        marginBottom:10
    },
    
    inputStyle : {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -15,
        marginBottom: -10,
        paddingLeft: 10,
        color: '#05375a',
    },

    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        marginBottom: 15,
        padding:5,
        flex: 1
    },
    
    inputStyleSide:{
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -15,
        marginBottom: -10,
        paddingLeft: 10,
        color: '#05375a',
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