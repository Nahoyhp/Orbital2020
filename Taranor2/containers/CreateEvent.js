import React, { Component } from 'react';
import { View, TextInput, StyleSheet, Button ,Text, Alert, Keyboard, Picker} from 'react-native';
import BlueButton from './BlueButton';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import DropDownPicker from 'react-native-dropdown-picker';


export default class CreateEvent extends Component{
    constructor() {
        super()
        this.state = {
            module: '',
            title: '',
            startTime: '',
            endTime: '',
            location: '',
            extra_description: '',
            date: '',
            created: false,
            moduleList: []
        }
    }

    updateTitle = (title) => this.setState({title})

    updateDate = (date) => this.setState({date})
    
    updateStartTime = (startTime) => this.setState({startTime})

    updateEndTime = (endTime) => this.setState({endTime})

    updateLocation = (location) => this.setState({location})

    updateExtraDescription = (extra_description) => this.setState({extra_description})
   
    createNewEvent = () => {
       firestore().collection('modules').doc('123')
       .collection('Testing').doc('Testing123')
       .set({
           title : this.state.title,
           startTime : this.state.startTime,
           endTime : this.state.endTime,
           location : this.state.location,
           extra_description : this.state.extra_description,
           date : this.state.date,
           createdAt: firestore.FieldValue.serverTimestamp(),
           createdBy: auth().currentUser.displayName
       })
    }

    
    setSelectedValue = (dd1Value) => {
        this.setState({date : dd1Value})
        console.log(this.setState.date)
    }


    render(){
        let dateDropDownData = [
            {label:'Monday',value:'MON'},
            {label:'Tuesday',value: 'TUE'},
            {label:'Wednesday',value: 'WED'},
            {label:'Thursday',value: 'THU'},
            {label:'Friday',value:'FRI'},
            {label:'Saturday',value: 'SAT'},
            {label:'Sunday',value:'SUN'},
        ]

        return (
            <KeyboardAwareScrollView
                style = {{flex: 1, paddingBottom: 10}}
            >
                <TextInput 
                    placeholder = "Module Title"
                    value = {this.state.module}
                    onChange = {this.updateModule}
                />
                <TextInput style = {styles.inputStyle}
                    placeholder = "Event Title" 
                    value = {this.state.title}
                    onChangeText={this.updateTitle} 
                />
                <TextInput style = {styles.inputStyle}
                placeholder = "Start Time" 
                value = {this.state.startTime}
                onChangeText={this.updateStartTime} 
                />

                <TextInput style = {styles.inputStyle}
                placeholder = "End Time" 
                value = {this.state.endTime}
                onChangeText={this.updateEndTime} 
                />

            <DropDownPicker
                items= {dateDropDownData}
                defaultValue={this.state.role}
                placeholder = "Select the date of Event"
                style = {{backgroundColor:'#ffffff', elevation: 5}}
                containerStyle = {{height:50,marginBottom:15}}
                placeholderStyle = {{textAlign: 'left'}}
                dropDownStyle = {{backgroundColor:'#ffffff', elevation: 5}}
                onChangeItem={item => this.setState({ date : item.value})}
            />

            <TextInput style = {styles.inputStyle}
            placeholder = "Location" 
            value = {this.state.location}
            onChangeText={this.updateLocation} 
            />

            <TextInput style = {styles.inputStyle}
            placeholder = "Extra Description" 
            value = {this.state.extra_description}
            onChangeText={this.updateExtraDescription} 
            />
            <Button
            color="#3740FE"
            title="Signup"
            onPress={this.createNewEvent}
            />
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
    inputStyle: {
      backgroundColor: 'white',
      width: '100%',
      marginBottom: 15,
      paddingBottom: 15,
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
  