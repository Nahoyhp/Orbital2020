import React, { Component } from 'react';
import { View, TextInput, StyleSheet, Text, Alert, Keyboard, Picker, Label,Button} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import * as colours from '../colours'
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePicker from '@react-native-community/datetimepicker'
import { TouchableOpacity } from 'react-native-gesture-handler';
import moment from "moment";
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import * as Dashboard from "../containers/DashBoard";

const dayList = ['SUN','MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', ]



export default class UpdateModule extends Component{
    constructor(props){
        super(props);
        this.state = {
            module: '',
            title: '',
            extra_description:'',
            endDate: '',  
            startTime:'',
            endTime:'',
            location:'',

            startDate : new Date(),
            endDate: new Date(),
            dateDisplay: '',
            setDate: false,
            show : false,
        
            day : '',
            mode : 'date',

            showStart: false,
            showEnd: false,
            display: 'default',
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

            startDate : new Date(),
            endDate: new Date(),
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

    componentDidMount() {
        var modalModule = this.props.route.params
        var startMoment = Object(modalModule.startDate) instanceof Date ? moment(modalModule.startDate) : moment(modalModule.startDate.toDate())
        var endMoment = Object(modalModule.endDate) instanceof Date ? moment(modalModule.endDate) : moment(modalModule.endDate.toDate())
        this.setState({
            module: modalModule.module,
            title: modalModule.title,

            startDate: modalModule.startDate,
            endDate: modalModule.endDate,

            dateDisplay: moment(modalModule.startDate).format('DD-MM-YYYY'),

            startTime: startMoment.format('HH[:]mm'),
            endTime: endMoment.format('HH[:]mm'),

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
        Keyboard.dismiss()
        this.setState({show: true})
    }

    updateStartTime = (event, selectedTime) => {
        if (event.type == 'dismissed' || selectedTime == undefined){
            return
        }

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

    updateEndTime = (event, selectedTime) => {
        if (event.type == 'dismissed' || selectedTime == undefined){
            return
        }
        try {
            var current = new Date(this.state.date.getTime())
            var hours = new String(endTime.getHours())
            var mins = new String(endTime.getMinutes())
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

    
    render(){
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
                        />
                    </View>
                    <View style = {{flexDirection: 'row', flex: 1, marginTop: 10}}>
                        <View style = {{flex : 1, marginRight: 3}}>
                            <Button
                                color={colours.darkblue}
                                title="Update Event"
                                onPress={() => {
                                    Dashboard.updateInfo(this.state)
                                    this.reset()
                                }}
                            />
                        </View>
                        <View  style = {{flex : 1, marginLeft: 3}}>
                            <Button
                                color={colours.darkblue}
                                title="Delete"
                                onPress={() => {
                                    Dashboard.deleteModalModule(this.state)
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