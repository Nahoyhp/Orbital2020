import React, { Component } from 'react';
import { View, TextInput, StyleSheet, Button } from 'react-native';
import BlueButton from '../components/BlueButton';
import firebaseDb from '../database/config';


class addModuleList extends Component{
    constructor(){
        super();
        this.state = {
            code:'',
            name:'',
            moduleCreated: false
        }
    }

    handleUpdateName = (name) => this.setState({name});

    handleUpdateCode = (code) => this.setState({code});

    updateInputVal = (val, prop) => {
        const state = this.state;
        state[prop] = val;
        this.setState(state);
    }

    handleCreateModules = () => 
        firebaseDb.firestore()
        .collection('modules')
        .add({
            code: this.state.code,
            name: this.state.name,
        }).then(() => this.setState({
            code: '',
            name: '',
            moduleCreated: true
        })).catch(err =>console.error(err))
    

    render(){
        const { name, code, moduleCreated } = this.state;

        return (
            <View style = {styles.container}>
                <TextInput style = {styles.inputStyle}
                    placeholder = "Code" 
                    value = {this.state.code}
                    onChangeText={this.handleUpdateCode} 
                />
                <TextInput style = {styles.inputStyle}
                    placeholder = "Name" 
                    value = {this.state.name}
                    onChangeText={this.handleUpdateName} 
                />
                <BlueButton style = {styles.button} onPress ={() => {
                    this.handleCreateModules()
                  }
                }>
                    Submit
                </BlueButton>

                { moduleCreated ? (
                    <Text style = {styles.text}> Module Created! </Text> 
                ): null }
            </View>           
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
    width: '100%',
    marginBottom: 15,
    paddingBottom: 15,
    alignSelf: "center",
    borderColor: "#ccc",
    borderBottomWidth: 1
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

export default addModuleList