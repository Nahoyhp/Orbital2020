import React from 'react'
import { Button , View, Image, TextInput, Text, StyleSheet } from 'react-native'
import BlueButton from '../components/BlueButton';
//import firebaseDb from '../database/config'
import firestore from '@react-native-firebase/firestore'


const ref = firestore().collection('users');

class SignUpContainer extends React.Component {
  state = {
    name: '',
    email: '',
    password: '',
    signUpSuccess: false
  };

  handleUpdateName = (name) => this.setState({name})

  handleUpdateEmail = (email) => this.setState({email})

  handleUpdatePassword = (password) => this.setState({password})

  handleCreateUser = () => 
    ref
      .add({
        name: this.state.name,
        email: this.state.email,
        password: this.state.password
      })
      .then( () => 
        this.setState({
          name: '',
          email: '',
          password: '',
          signUpSuccess: true,
      })
    )
    .catch(err => console.error(err));
  

  render() {
    const { name, email, password, signUpSuccess } = this.state;

    return (
      <View style={styles.container}>    
        <Text> HELLO SIGN UP HERE </Text>
        <TextInput style={styles.textInput} placeholder="Name" onChangeText={this.handleUpdateName} value={name}/>
        <TextInput style={styles.textInput} placeholder="Email" onChangeText={this.handleUpdateEmail} value={email}/>
        <TextInput style={styles.textInput} placeholder="Password" onChangeText={this.handleUpdatePassword} value={password}/>
        <Button 
          title = 'Sign up' 
          style={styles.button} 
          onPress= {() => 
            this.handleCreateUser()
            //name: this.state.name,
            //email:this.state.email,
            //password:this.state.password
          //)
        }/>
        {
          signUpSuccess ? (<Text style={styles.text}> Sign Up Successful! </Text>) : null
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    marginBottom: 40
  },
  textInput: {
    borderWidth: 1,
    borderColor: 'black',
    fontSize: 10,
    marginBottom: 8,
    width: 200,
    height: 30
  },
  button: {
    marginTop: 42,
  },
  text: {
    fontSize: 20,
    color: 'green',
    marginTop: 40
  }
})

export default SignUpContainer
