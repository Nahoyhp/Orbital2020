import React, { Component } from 'react';
import { View, TextInput, StyleSheet, Text, Alert, Keyboard, Picker, Label,Button} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import * as colours from '../colours'
import DateTimePicker from '@react-native-community/datetimepicker'
import { TouchableOpacity } from 'react-native-gesture-handler';
import moment from "moment";
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import * as Dashboard from "../containers/DashBoard";
import { genTimeBlock } from 'react-native-timetable';

const dayList = ['SUN','MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', ]



export default class UpdateModule extends Component{
    constructor(props){
        super(props);
        this.state = {
            module: '',
            title: '',
            extra_description:'', 
            startTime:'',
            endTime:'',
            location:'',

            startDate : new Date(),
            endDate: new Date(),
            dateDisplay: '',
            setDate: false,
            show : false,
        
            day : '',

            showStart: false,
            showEnd: false,
        };
    }

    reset() {
        this.setState({
            module: '',
            title: '',
            extra_description:'',
            endDate: '',  
            startTime:'',
            endTime:'',
            location:'',
            eventTitle: '',

            startDate : new Date(),
            endDate: new Date(),
            dateDisplay: '',
            setDate: false,
            show : false,
        
            day : '',

            showStart: false,
            showEnd: false,
        })
    }

    updateModule = (module) => this.setState({module})

    updateTitle = (title) => this.setState({title})

    updateLocation = (location) => this.setState({location})

    updateExtraDescription = (extra_description) => this.setState({extra_description})
    
    checkInput = () => {
        let valid = this.state.module != ''
        valid = valid && this.state.title.length != 0
        return valid

    }

    componentDidMount() {
        var modalModule = this.props.route.params
        var startMoment = Object(modalModule.startDate) instanceof Date ? moment(modalModule.startDate) : moment(modalModule.startDate.toDate())
        var endMoment = Object(modalModule.endDate) instanceof Date ? moment(modalModule.endDate) : moment(modalModule.endDate.toDate())
        this.setState({
            module: modalModule.module,
            title: modalModule.title,
            eventTitle: modalModule.eventTitle,

            day: modalModule.day,
            startDate: modalModule.startDate,
            endDate: modalModule.endDate,

            dateDisplay: moment(modalModule.startDate).format('DD-MM-YYYY'),

            displayStart: startMoment.format('HH[:]mm'),
            displayEnd: endMoment.format('HH[:]mm'),

            startTime: modalModule.startTime,
            endTime: modalModule.endTime,

            location: modalModule.location,
            extra_description: modalModule.extra_description,
        });
    }

    openTimePickerStart = () => {
        this.setState({showStart: true})
    }

    openTimePickerEnd = () => {
        this.setState({showEnd: true})
    }

    updateDate = (event, selectedDate) => {
        if (event.type == 'dismissed' || selectedDate == undefined){
            return
        }

        try{
            var year  = selectedDate.getFullYear()
            var month = selectedDate.getMonth()
            var date = selectedDate.getDate()

            var display = ""

            this.state.startDate.setFullYear(year)
            this.state.startDate.setMonth(month)
            this.state.startDate.setDate(date)

            this.state.endDate.setFullYear(year)
            this.state.endDate.setMonth(month)
            this.state.endDate.setDate(date)

            if (date < 10) { display += "0" }
            display += new String(date) + " - "

            if (month < 10) { display += "0" }
            display += new String(month) + " - "
            
            display += new String(year)

            var newDay = dayList[selectedDate.getDay()]

            this.setState({
                show: false, 
                dateDisplay: display,
                day: newDay,
                setDate: true
            })
        } catch (err) {console.log(err)}
    }

    openDatePicker = () => {
        Keyboard.dismiss()
        this.setState({show: true})
    }

    updateStartTime = (event, selectedTime) => {
        if (event.type == 'dismissed' || selectedTime == undefined){
            return
        }

        let hour = selectedTime.getHours()
        let mins = selectedTime.getMinutes()
        
        this.state.startDate.setHours(hour)
        this.state.startDate.setMinutes(mins)
        this.state.startTime.setHours(hour)
        this.state.startTime.setMinutes(mins)

        var strHour = new String(hour)
        var strMin = new String(mins)

        if (strHour.length == 1) {strHour = "0" + strHour}
        if (strMin.length == 1) {strMin = "0" + strMin}
        var time = strHour + " : " + strMin

        if (moment(this.state.startDate).isSameOrAfter(moment(this.state.endDate))) {
            Alert.alert("Error", "End time for event should be after start time")
        }

        this.setState({
            showStart: false,
            displayStart: time,
            displayEnd: "ERROR"
        })
    }

    updateEndTime = (event, selectedTime) => {
        if (event.type == 'dismissed' || selectedTime == undefined){
            return
        } 

        let hour = selectedTime.getHours()
        let mins = selectedTime.getMinutes()
        
        this.state.endDate.setHours(hour)
        this.state.endDate.setMinutes(mins)
        this.state.endTime.setHours(hour)
        this.state.endTime.setMinutes(mins)
        
        if (moment(this.state.startDate).isSameOrAfter(moment(this.state.endDate))) {
            Alert.alert("Error", "End time for event should be after start time")
            this.setState({
                showEnd: false,
                displayEnd: "ERROR"
            })
            return
        } else {
            var strHour = new String(hour)
            var strMin = new String(mins)

            if (strHour.length == 1) {strHour = "0" + strHour}
            if (strMin.length == 1) {strMin = "0" + strMin}
            var time = strHour + " : " + strMin
            this.setState({
                showEnd: false,
                displayEnd: time,
            })
        }
    }

    
    render(){
        console.log(this.state.day)
        return (
            <KeyboardAwareScrollView
                style = {{flex: 1, paddingBottom: 10, paddingTop: 10,backgroundColor:colours.lightblue,padding:15}}
            >
                <View style = {styles.top} >
                    <View style = {{flexDirection: 'row', alignItems: 'center'}}>
                    <TouchableOpacity onPress = {() => this.props.navigation.navigate('Dashboard')}>
                        <MaterialIcon
                        name = 'arrow-back'
                        color = {'white'}
                        size = {30}
                        />
                    </TouchableOpacity>
                        <Text style = {styles.header}> Update Event </Text>
                    </View>
                </View>
                
                
                <View style = {styles.bottom}>    
                    <View style = {styles.action}>
                        <MaterialIcon
                            name = "subject"
                            color = {'#05375a'}
                            size = {20}
                        />
                        <TextInput style = {styles.inputStyle}
                            placeholder = "Module Name"
                            value = {this.state.module}
                            onChangeText = {this.updateModule}
                            returnKeyType = "next"
                            onSubmitEditing = {() => this.secondTextInput.focus()}
                            blurOnSubmit = {false}
                            editable = {false}
                        />  
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
                            editable = {false}
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
                                value = {this.state.displayStart}
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
                                value = {this.state.displayEnd}
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
                        />
                    </View>
                    <View style = {{flexDirection: 'row', flex: 1, marginTop: 10}}>
                        <View style = {{flex : 1, marginRight: 3}}>
                            <Button
                                color={colours.darkblue}
                                title="Update Event"
                                onPress={() => {
                                    if (this.state.displayEnd == "ERROR") {
                                        Alert.alert("Error", "Please fill in a valid End Time")
                                        return
                                    }
                                    var newStartTime = genTimeBlock(this.state.day, this.state.startTime.getHours(), this.state.startTime.getMinutes())
                                    var newEndTime = genTimeBlock(this.state.day, this.state.endTime.getHours(), this.state.endTime.getMinutes())
                                    Dashboard.updateInfo({
                                        module: this.state.module,
                                        title: this.state.title,
                                        eventTitle: this.state.eventTitle,
                                        extra_description: this.state.extra_description,
                                        location: this.state.location,
                                        
                                        startTime: newStartTime,
                                        endTime: newEndTime,

                                        startDate : this.state.startDate,
                                        endDate: this.state.endDate,
                                        day : this.state.day,
                                    })
                                    this.reset()
                                }}
                            />
                        </View>
                        <View  style = {{flex : 1, marginLeft: 3}}>
                            <Button
                                color={colours.darkblue}
                                title="Delete"
                                onPress={() => {
                                    Dashboard.deleteModalModule({
                                        module: this.state.module,
                                        title: this.state.title,
                                    })
                                    this.reset()
                                }}
                            />
                        </View>
                    </View>

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
const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: 35,
        backgroundColor: colours.darkblue
    },

    fakeInputStyle: {
        color: '#c2c5cc',
        marginTop:15,
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },

    top : {
        flex: 1,
        alignItems: 'flex-end',
        marginTop:20,
        paddingHorizontal: 15,
        paddingBottom: 15,
        flexDirection: 'row',
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
        marginBottom:10,
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