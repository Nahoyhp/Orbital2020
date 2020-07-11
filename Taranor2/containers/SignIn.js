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
    TouchableOpacity
} from 'react-native';
import auth from '@react-native-firebase/auth'
import * as Animatable from 'react-native-animatable';
import Feather from 'react-native-vector-icons/Feather';
import Fontisto from 'react-native-vector-icons/Fontisto';

export default class Login extends Component {

  constructor() {
      super();
      this.state = { 
        email: '', 
        password: '',
        isLoading: false,
        secureText: true,
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

    toggleSecureText = () => {
      this.setState({secureText : !this.state.secureText})
    }

  render() {
  if(this.state.isLoading){
      return(
        <View style={styles.preloader}>
          <ActivityIndicator size={Platform.OS === 'ios'? 'large' : 50} color="white"/>
        </View>
      )
    }    

  return (
    <View style = {styles.container}>
        <View style = {styles.top} >
            <Text style = {styles.header}> TARANOR </Text>
        </View>
        <Animatable.View
        animation = "bounceInUp"
        duration = {1500}
        style = {styles.bottom}>
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
                    onSubmitEditing = {() => this.secondTextInput.focus()}
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
                    secureTextEntry={this.state.secureText}
                    ref = {(input) => {this.secondTextInput = input}}
                    onSubmitEditing = {() => this.userLogin()}
                />
                <TouchableOpacity onPress={this.toggleSecureText}>
                    {this.state.secureText ? 
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
            <View style = {styles.buttons}>
                <Button
                    color="#45B39D"
                    title="Sign in"
                    onPress={() => this.userLogin()}
                />

                <Button
                    color="#45B39D"
                    title="Testing ground"
                    onPress={() => this.props.navigation.navigate('Content')}
                />

                <Text
                    style={styles.loginText}
                    onPress={() => this.props.navigation.navigate('SignUp')}>
                    Don't have account? Click here to signup!
                </Text>
            </View>


        </Animatable.View>
    </View>
    )

  }
}

const styles = StyleSheet.create({
    container: {
      flex : 1,
      backgroundColor: '#45B39D',
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
        flex: 2,
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
    }
})