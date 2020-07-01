import React, { Component } from 'react';
import { View, TextInput, StyleSheet, Button ,Text, Alert } from 'react-native';
import BlueButton from './BlueButton';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth'


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

    handleCreateModules = () => {
        if (this.state.code == '' || this.state.name == '') {
            Alert.alert("Error", "Course code and name is mandatory")
            return
        }

        var newModuleList = []
        ref.doc("AllModules").get()
        .then(docSnapShot => {
            newModuleList = docSnapShot.data()['allModules']
            newModuleList.push(this.state.code)
            console.log(newModuleList)
            ref.doc('AllModules').update({'allModules': newModuleList})
        }).catch(err => console.log("Error @ All Modules"))

        ref
        .doc(this.state.code)
        .set({
            code: this.state.code,
            name: this.state.name,
            description: this.state.description,
            createdBy: auth().currentUser.displayName,
            createdByID: auth().currentUser.uid,
            timeCreated: firestore.FieldValue.serverTimestamp(),
        }).then(() => this.setState({
            code: '',
            name: '',
            description:'',
            moduleCreated: true
        })).catch(err =>console.error(err))
    }


    render(){
        const { name, code, description, moduleCreated } = this.state;

        return (
            <View style = {styles.container}>
                <Text style = {styles.Text}>Please key in releveant details</Text> 
                
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
                <View style = {{marginTop: 10, marginBottom: 10}}>
                    <Button
                        color="#3740FE"
                        title="Submit"
                        style = {{paddingBottom: 10, marginBottom: 10}}
                        onPress ={() => {this.handleCreateModules()} }
                    />
                </View>

                <Button
                    color="#3740FE"
                    title="Back to dashboard"
                    onPress={() => this.props.navigation.navigate('Dashboard')}
                />

                { moduleCreated ? (
                    Alert.alert("", "Module Created")
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
  },
  button: {
    color: 'blue'
  }
})

export default addModuleList