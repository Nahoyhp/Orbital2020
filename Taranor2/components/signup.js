import React, { Component } from 'react';
import { 
    StyleSheet,
    Platform,
    Text,
    View,
    TextInput,
    Button,
    Alert,
    ActivityIndicator,
    TouchableOpacity,
    Dimensions,
    Keyboard,
} from 'react-native';
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import * as Animatable from 'react-native-animatable';
import Feather from 'react-native-vector-icons/Feather';
import Fontisto from 'react-native-vector-icons/Fontisto';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import DropDownPicker from 'react-native-dropdown-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default class Signup extends Component {
  
  constructor() {
    super();
    this.state = { 
      displayName: '',
      email: '', 
      password: '',
      password2: '',
      role: null,
      isLoading: false,
      securetxt1: true,
      securetxt2: true,
    }
  }

  updateInputVal = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  }

  togglesecuretxt1 = () => {
    this.setState({securetxt1 : !this.state.securetxt1})
  }

  togglesecuretxt2 = () => {
    this.setState({securetxt2 : !this.state.securetxt2})
  }


  registerUser = (role) => {
    if (this.state.password != this.state.password2) {
      Alert.alert('Error', '')
    }
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

        firestore().collection('users').doc(res.user.uid)
        .set({
          name: this.state.displayName,
          uid: res.user.uid,
          email: this.state.email,
          password: this.state.password,
          role:this.state.role,
          moduleInvolved: [],
        })
        .catch(err =>console.error(err))

        this.setState({
          isLoading: false,
          displayName: '',
          email: '', 
          password: ''
        })
        this.props.navigation.navigate('Login')
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          Alert.alert('Error', 'That email address is already in use!');
        } else if (error.code === 'auth/invalid-email') {
          Alert.alert('Error', 'That email address is invalid!');
        }
        this.setState({isLoading: false})
      }) 
    }
  }

  render() {
    if(this.state.isLoading){
      return(
        <View style={styles.preloader}>
          <ActivityIndicator size="large" color="white"/>
            <Text style = {{fontSize: 20, color: 'white'}}>Registering ....</Text>
        </View>
      )
    }
    return (
      <KeyboardAwareScrollView
        style = {styles.container}
        getTextInputRefs = {() => {
          return [this.displayName, this.emailInput, this.passwordInput, this.passwordInput2]
        }}
      >
          <Animatable.View 
          animation = "fadeInDownBig"
          style = {styles.top} >
              <Text style = {styles.header}> Sign Up </Text>
          </Animatable.View>
          <Animatable.View
          animation = "fadeInUpBig"
          duration = {1000}
          style = {styles.bottom}>
              <Text style = {styles.text_footer}>Display Name</Text>
              <View style = {styles.action}>
                  <FontAwesome 
                  name="user-o"
                  color={'#05375a'}
                  size={20}
                  />
                  <TextInput
                    style={styles.inputStyle}
                    placeholder="Display Name"
                    value={this.state.displayName}
                    onChangeText={(val) => this.updateInputVal(val, 'displayName')}
                    returnKeyType = "next"
                    ref = {(input) => this.displayName = input}
                    onSubmitEditing = {() => this.emailInput.focus()}
                    blurOnSubmit = {false}
                  />      
              </View>
              <Text style = {styles.text_footer}>Email</Text>
              <View style = {styles.action}>
                  <Fontisto 
                  name="email"
                  color={'#05375a'}
                  size={20}
                  />
                  <TextInput
                      style={styles.inputStyle}
                      placeholder="E-mail"
                      value={this.state.email}
                      onChangeText={(val) => this.updateInputVal(val, 'email')}
                      returnKeyType = "next"
                      ref = {(input) => {this.emailInput = input}}
                      onSubmitEditing = {() => this.passwordInput.focus()}
                      blurOnSubmit = {false}
                  />
              </View>
              <Text style = {styles.text_footer} >Password</Text>
              <View style = {styles.action}>
                  <Feather 
                  name="lock"
                  color={'#05375a'}
                  size={20}
                  />
                  <TextInput
                    style={styles.inputStyle}
                    placeholder="Password"
                    value={this.state.password}
                    onChangeText={(val) => this.updateInputVal(val, 'password')}
                    maxLength={15}
                    secureTextEntry={this.state.securetxt1}
                    ref = {(input) => {this.passwordInput = input}}
                    returnKeyType = "next"
                    onSubmitEditing = {() => this.passwordInput2.focus()}
                    blurOnSubmit = {false}
                  />
                  <TouchableOpacity onPress={this.togglesecuretxt1}>
                      {this.state.securetxt1 ? 
                      <Feather 
                          name="eye-off"
                          color="grey"
                          size={20}
                      />
                      :
                      <Feather 
                          name="eye"
                          color="grey"
                          size={20}
                      />
                      }
                  </TouchableOpacity>   
              </View>
              <Text style = {styles.text_footer}>Re-enter Password</Text>
              <View
              style = {styles.action}>
                  <Feather 
                  name="lock"
                  color={'#05375a'}
                  size={20}
                  />
                  <TextInput
                    style={styles.inputStyle}
                    placeholder="Re-enter Password"
                    value={this.state.password2}
                    onChangeText={(val) => this.setState({password2 : val})}
                    maxLength={15}
                    secureTextEntry={this.state.securetxt2}
                    ref = {(input) => {this.passwordInput2 = input}}
                    blurOnSubmit = {false}
                    onSubmitEditing = {() => Keyboard.dismiss()}
                  />
                  <TouchableOpacity onPress={this.togglesecuretxt2}>
                      {this.state.securetxt2 ? 
                      <Feather 
                          name="eye-off"
                          color="grey"
                          size={20}
                      />
                      :
                      <Feather 
                          name="eye"
                          color="grey"
                          size={20}
                      />
                      }
                  </TouchableOpacity>   
              </View>
              {
                this.state.password == this.state.password2 ?
                <Text></Text> :
                <Text style = {styles.warning}> Password doesn't match </Text>
              }

              <DropDownPicker
                items={[{label:'Student',value:'Student', key: 'Students'},{label:'Teacher',value: 'Teacher', key: 'Teacher'},]}
                defaultValue={this.state.role}
                placeholder = "Select your role"
                ref = {(input) => {this.roleInput = input}}
                style = {{backgroundColor:'#ffffff', elevation: 10}}
                containerStyle = {{height:30,marginBottom:15}}
                dropDownStyle = {{backgroundColor:'#ffffff', elevation: 10}}
                onChangeItem={item => this.setState({
                  role : item.value  
                })}
              />

              <View style = {styles.buttons}>
                  <Button
                      color="#45B39D"
                      title="Sign Up"
                      onPress={this.registerUser}
                  />
              </View>

          </Animatable.View>
      </KeyboardAwareScrollView>
      )
    
    
    
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#45B39D',
    flex: 1,
    paddingTop: 65
  },
  header:{
      fontSize:30,
      fontFamily:'serif',
      color: '#fff'
  },
  top : {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 10
  },
  bottom: {
      flex: 5,
      backgroundColor: '#fff',
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      paddingHorizontal: 20,
      paddingVertical: 30
  },
  text_footer: {
      color: '#05375a',
      fontSize: 18
  },
  action: {
      flexDirection: 'row',
      marginTop: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#f2f2f2',
      marginBottom: 20
  },
  inputStyle : {
      flex: 1,
      marginTop: Platform.OS === 'ios' ? 0 : -12,
      paddingLeft: 10,
      color: '#05375a',
      height: Dimensions.get('window').height / 15,
  },
  loginText: {
      color: '#45B39D',
      marginTop: 25,
      textAlign: 'center'
  },
  buttons: {
      alignContent: 'center',
      marginTop: 30,
  },
  preloader: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      position: 'absolute',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#45B39D'
  },
  warning : {
    color: 'red',
    textAlign: 'center'
  }
})