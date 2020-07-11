// components/login.js

import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert, ActivityIndicator } from 'react-native';
//import firebase from '../database/config';
import auth from '@react-native-firebase/auth'

import defaultStyle from './defaultText';

export default class Login extends Component {
  
  constructor() {
    super();
    this.state = { 
      email: '', 
      password: '',
      isLoading: false
    }
  }

  updateInputVal = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  }

  userLogin = async () => {
    if(this.state.email === '' && this.state.password === '') {
      Alert.alert('Enter details to Sign In!')
    } else {
      this.setState({
        isLoading: true,
      })

      try {
        let response = await auth().signInWithEmailAndPassword(this.state.email, this.state.password)
        if (response && response.user) {
          this.setState({isLoading: false})
          this.props.navigation.navigate('Dashboard')
        }
  
      }catch (e) {
        console.log(e)
        this.setState({
          isLoading: false,
          email: '', 
          password: ''
        })
        Alert.alert("Login Failed", "Username or password is wrong. Please Try again")
      }
    }
  }

  render() {
    if(this.state.isLoading){
      return(
        <View style={styles.preloader}>
          <ActivityIndicator size="large" color="#9E9E9E"/>
        </View>
      )
    }    
    return (
      <View style={styles.container}> 

        <Text style = {styles.header}> 
          <Text style = {{fontFamily:'serif'}}> TARANOR </Text>
        </Text>
      
        <Text style= {styles.subheader}> 
          Welcome to Taranor!
        </Text>

        <TextInput
          style={styles.inputStyle}
          placeholder="Email"
          value={this.state.email}
          onChangeText={(val) => this.updateInputVal(val, 'email')}
          returnKeyType = "next"
          onSubmitEditing = {() => this.secondTextInput.focus()}
          blurOnSubmit = {false}
        />

        <TextInput
          style={styles.inputStyle}
          placeholder="Password"
          value={this.state.password}
          onChangeText={(val) => this.updateInputVal(val, 'password')}
          maxLength={15}
          secureTextEntry={true}
          ref = {(input) => {this.secondTextInput = input}}
          onSubmitEditing = {() => this.userLogin()}
        />   

        <Button
          color="#3740FE"
          title="Signin"
          onPress={() => this.userLogin()}
        />
        
        <Button
          title = "Phyo Han Testing Ground"
          onPress = {() => this.props.navigation.navigate('Test')}
        />


        <Text 
          style={styles.loginText}
          onPress={() => this.props.navigation.navigate('SignUp')}>
          Don't have account? Click here to signup!
        </Text>                          
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header:{
    color:'#000000',
    fontSize:60,
    textAlign:'center',
    marginBottom:10,
  } ,

  subheader:{
    marginBottom:25,
    justifyContent: "center",
    textAlign:'center',
    fontWeight:'bold',
    fontSize:25,
  },
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: 25,
    backgroundColor: '#fff'
  },
  inputStyle: {
    width: '100%',
    marginBottom: 15,
    paddingBottom: 15,
    alignSelf: "center",
    borderColor: "#ccc",
    borderBottomWidth: 1
  },
  loginText: {
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
});