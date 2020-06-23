import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert, ActivityIndicator } from 'react-native';
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import defaultStyle from './defaultText';
import DropDownPicker from 'react-native-dropdown-picker';

export default class Signup extends Component {
  
  constructor() {
    super();
    this.state = { 
      displayName: '',
      email: '', 
      password: '',
      role: null,
      isLoading: false
    }
  }

  updateInputVal = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  }

  registerUser = (role) => {
    if(this.state.email == '' || this.state.password == '' || this.state.displayName == '') {
      Alert.alert('Enter details to signup!')
    } else {
      this.setState({
        isLoading: true,
      })

      auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then( (res) => {
        res.user.updateProfile({
          displayName: this.state.displayName
        })  
        console.log('User registered successfully!')

        this.state.role == 'Teacher' ?
          firestore().collection('teachers')
          .doc(res.user.uid)
          .set({
            name: this.state.displayName,
            uid: res.user.uid,
            email: this.state.email,
            password: this.state.password,
            role:this.state.role,
            moduleInvolved: [],
          })
          .then(
            console.log("Teacher Data succesfully added to Firestore")
          ).catch(err =>console.error(err)) :

          firestore().collection('students')
          .doc(res.user.uid)
          .set({
            name: this.state.displayName,
            uid: res.user.uid,
            email: this.state.email,
            password: this.state.password,
            role:this.state.role,
            moduleInvolved: [],
          })
          .then(
            console.log("Student Data succesfully added to Firestore")
          ).catch(err =>console.error(err))

        this.setState({
          isLoading: false,
          displayName: '',
          email: '', 
          password: ''
        })
        this.props.navigation.navigate('Login')
      })
      .catch(error => this.setState({ errorMessage: error.message }))   
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
        <Text style = {styles.subheader}>
          Sign Up for Taranor!      
        </Text>
        <Text style = {defaultStyle.default}>
        (Enter your Name, Email and Set a Password)        
        </Text>

        <TextInput
          style={styles.inputStyle}
          placeholder="Display Name"
          value={this.state.displayName}
          onChangeText={(val) => this.updateInputVal(val, 'displayName')}
        />      
        <TextInput
          style={styles.inputStyle}
          placeholder="Email"
          value={this.state.email}
          onChangeText={(val) => this.updateInputVal(val, 'email')}
        />
        <TextInput
          style={styles.inputStyle}
          placeholder="Password"
          value={this.state.password}
          onChangeText={(val) => this.updateInputVal(val, 'password')}
          maxLength={15}
          secureTextEntry={true}
        />
        <Text>Role</Text>

        <View>
          <DropDownPicker
            items={[{label:'Student',value:'Student'},{label:'Teacher',value: 'Teacher'},]}
            defaultValue={this.state.role}
            placeholder = "Select your role"
            style = {{backgroundColor:'#ffffff', elevation: 10}}
            containerStyle = {{height:30,marginTop:10,marginBottom:35,}}
            dropDownStyle = {{backgroundColor:'#ffffff', elevation: 10}}
            onChangeItem={item => this.setState({
              role : item.value  
            })}
          />
        </View>
           
        <Button
          color="#3740FE"
          title="Sign Up"
          onPress={() => {this.registerUser(this.state.role)}}
        />

        <Text 
          style={styles.loginText}
          onPress={() => this.props.navigation.navigate('Login')}>
          Already Registered? Click here to login
        </Text>                          
      </View>
    );
  }
}

const styles = StyleSheet.create({
  subheader:{
    marginBottom:25,
    justifyContent: "center",
    textAlign:'center',
    fontWeight:'bold',
    fontSize:32,
    borderColor:'gray',
    borderWidth:2
    
  },
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: 25,
    backgroundColor: '#fff',
    elevation:5
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