import React, { Component } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
//import firebase from '../database/config';
import auth from '@react-native-firebase/auth'

export default class Dashboard extends Component {
  constructor() {
    super();
    this.state = { 
      uid: ''
    }
  }

  signOut = () => {
    auth().signOut().then(() => {
      this.props.navigation.navigate('Login')
    })
    .catch(error => this.setState({ errorMessage: error.message }))
  }  

  render() {
    this.state = { 
      displayName: auth().currentUser.displayName,
      uid: auth().currentUser.uid
    }    
    return (
      <View style={styles.container}>
        <Text style = {styles.textStyle}>
          Hello, {this.state.displayName}
        </Text>
        <View style = {{ flexDirection: "row", justifyContent: "space-between"}} >
        <Button
          color="#3740FE"
          title="Logout"
          onPress={() => this.signOut()}
        />
        <Button
          color="#3740FE"
          title = "Add Module"
          onPress = {() => this.props.navigation.navigate('AddModule')}
        />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    display: "flex",
    justifyContent: 'center',
    alignItems: 'center',
    padding: 35,
    backgroundColor: '#fff'
  },
  textStyle: {
    fontSize: 15,
    marginBottom: 20
  }
});