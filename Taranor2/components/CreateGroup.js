import React, { Component } from 'react';
import { 
    StyleSheet,
    Platform,
    Text,
    View,
    TextInput,
    Alert,
} from 'react-native';
import BlueButton from './BlueButton';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import * as colours from '../colours'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import * as Animatable from 'react-native-animatable';
import database from '../API/firebaseAPI';
import {Picker} from '@react-native-community/picker';
import {Button} from 'react-native-elements'

export default class createGroup extends Component{
    constructor(){
        super()
        this.state = {
            code:'',
            name:'',
            description:'',
            moduleCreated: false
        }
    }

    handleUpdateName = (name) => this.setState({name});

    handleUpdateCode = (code) => this.setState({code});

    handleDescription = (description) =>this.setState({description});

    reset = () => {
        Alert.alert("Successful", "You have created " + this.state.code +  ' ' + this.state.name)
        this.setState({
            code: '',
            name: '',
            description:'',
        })
    }

    isModuleCode = (input) => {
        var length = input.length
        console.log(input)
        var cutoff = 2
        console.log(input.slice(0,3))
        if (length < 6 || length > 8) {
            return false
        } else if (length == 7) {
            // if an alphabet exists in third place
           if(/^[a-zA-Z]+$/.test(input.charAt(2))){
               cutoff = 3
           } else {
                return false
           }
        }
        return /^[a-zA-Z]+$/.test(input.slice(0,cutoff)) && /^[0-9]+$/.test(input.slice(cutoff))
    }



    handleCreateGroup = async () => {
        if (this.state.code == '' || this.state.name == '') {
            Alert.alert("Error!", "Group ID and Name is mandatory")
            return
        }

        if (!this.isModuleCode(this.state.code)) {
            await database.createGroup({
                code: this.state.code,
                name: this.state.name,
                description: this.state.description,
                reset: this.reset
            })
        } else {
            Alert.alert("Error", "GroupID must not start with 2 or 3 letters follows by 4 digits")
        }
    }

    render(){
        const { name, code, description, moduleCreated } = this.state;

        return (
            <KeyboardAwareScrollView 
                style = {styles.container}
                resetScrollToCoords={{ x: 0, y: 0 }}   
            > 
                    
                    <View
                        animation = "fadeInRight"
                        duration = {1000}
                        style = {styles.top} >
                        <Text style = {styles.header}> Create Group </Text>
                    </View>

                    <View 
                        animation = "fadeInUp"
                        duration = {1000}
                        style = {styles.bottom}>
                        <Text style = {styles.subheader}>Please key in the details</Text> 
                        
                        <View style = {styles.picker}>
                            <MaterialIcon
                                name = "code"
                                color = {'#05375a'}
                                size = {20}
                            />
                            <TextInput style = {styles.inputStyle}
                                placeholder = "Group ID" 
                                value = {code}
                                onChangeText={this.handleUpdateCode} 
                            />
                        </View>

                        <View style = {styles.action}>
                            <MaterialIcon
                                name = "subject"
                                color = {'#05375a'}
                                size = {20}
                            />
                            <TextInput style = {styles.inputStyle}
                                placeholder = "Group Name" 
                                value = {name}
                                onChangeText={this.handleUpdateName} 
                            />
                        </View>

                        <View style = {styles.action}>
                            <MaterialIcon
                                name = "description"
                                color = {'#05375a'}
                                size = {20}
                            />
                            <TextInput style = {styles.inputStyle}
                                placeholder = "Group Description" 
                                value = {description}
                                onChangeText={this.handleDescription} 
                            />
                        </View>

                        <View style = {{marginTop: 10, marginBottom: 10, flexDirection: 'row'}}>
                            <View style = {{flex: 1}}>
                                <Button
                                    color= {colours.darkblue}
                                    title="Create"
                                    buttonStyle = {{backgroundColor: colours.lightblue, borderTopLeftRadius: 15, borderBottomLeftRadius: 15, marginRight: 3}}
                                    onPress ={this.handleCreateGroup}
                                />
                            </View>
                            <View style = {{flex: 1}}>
                                <Button
                                    color={colours.darkblue}
                                    title="To Dashboard"
                                    buttonStyle = {{backgroundColor: colours.lightblue, borderTopRightRadius: 15, borderBottomRightRadius: 15}}
                                    onPress = {() => this.props.navigation.jumpTo("Dashboard")}
                                />
                            </View>
                        </View>
                    </View>

                    { moduleCreated ? (
                        Alert.alert("", "Module Created")
                    ): null }
                
            </KeyboardAwareScrollView>           
        )
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    padding: 15,
    backgroundColor: colours.darkblue,
  },
  picker : {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    marginBottom: 15,
    padding:5,
    flex: 1,
    zIndex: 10,
  },
  o_container: {
    backgroundColor: '#45B39D',
    flex: 1,
    justifyContent: "center",
    paddingTop: 65
  },

  top : {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 15,
    marginTop:20,
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
      paddingVertical: 46.5
  },

  header:{
    fontSize:30,
    fontFamily:'serif',
    color: "#fff",
    
    marginBottom:10
  },

  action: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    marginBottom: 15,
    padding:5
  },
  subheader:{
    fontSize:18,
    fontFamily:'serif',
    color: colours.darkblue,
    padding: 10,
    marginBottom:10
  },
  inputStyle : {
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
  },
  button: {
    color: 'blue'
  }
})
