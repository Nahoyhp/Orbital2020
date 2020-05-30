import React, { Component } from 'react';
import { View, TextInput, StyleSheet, Button ,Text } from 'react-native';
import BlueButton from './BlueButton';
//import firebaseDb from '../database/config';
import firestore from '@react-native-firebase/firestore'


const ref = firestore().collection('modules');


class addModuleList extends Component{
    state = {
        code:'',
        name:'',
        description:'',
        moduleCreated: false
    };

    handleUpdateName = (name) => this.setState({name});

    handleUpdateCode = (code) => this.setState({code});

    handleDescription = (description) =>this.setState({description});
    
    handleCreateModules = () => 
        ref
        .add({
            code: this.state.code,
            name: this.state.name,
            description: this.state.description
        }).then(() => this.setState({
            code: '',
            name: '',
            description:'',
            moduleCreated: true
        })).catch(err =>console.error(err))
    

    render(){
        const { name, code, description, moduleCreated } = this.state;

        return (
            <View style = {styles.container}>
                <Text style = {styles.Text}>HELLO,plz put in your module details and torture the students :D</Text> 
                <TextInput style = {styles.inputStyle}
                    placeholder = "Code" 
                    value = {code}
                    onChangeText={this.handleUpdateCode} 
                />
                <TextInput style = {styles.inputStyle}
                    placeholder = "Name" 
                    value = {name}
                    onChangeText={this.handleUpdateName} 
                />
                <TextInput style = {styles.inputStyle}
                    placeholder = "Module description" 
                    value = {description}
                    onChangeText={this.handleDescription} 
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

                <Button
                    color="#3740FE"
                    title="Back to dashboard"
                    onPress={() => this.props.navigation.navigate('Dashboard')}
        />
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