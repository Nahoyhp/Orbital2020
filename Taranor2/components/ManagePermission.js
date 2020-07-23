import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Alert,
} from 'react-native';
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import * as colours from '../colours'
import database from '../API/firebaseAPI'
import {Picker} from '@react-native-community/picker';
import Clipboard from "@react-native-community/clipboard";
import {Button} from 'react-native-elements'

import Fontisto from 'react-native-vector-icons/Fontisto';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';


export default class manageModule extends Component {
    constructor(){
        super()
        this.state = {
            userID : auth().currentUser.uid,
            showUserID: true,
            newUser: '',
            module: '',
            showCheck: false,
            confirmInput: '',
            selected: false,
        }
    }

    getCodeItems = () => {
        return [...database.state.selfDetail.managing].sort().map(code => {
            return (<Picker.Item label = {code} key = {code} value = {code}/>)
        })
    }

    tryDelete = () => {
        if (!this.state.selected) {
            Alert.alert("Error", "Please choose a module")
            return
        }
        this.setState({showCheck : true})
    }

    confirmDelete = async () => {
        if (this.state.confirmInput != "Delete_"+ this.state.module) {
            Alert.alert("Error", "Input does not match")
            return
        }
        //Why Can't call database.function here
        Alert.alert("Successful", "You have deleted " + this.state.module)
        this.setState({
            newUser: '',
            module: '',
            confirmInput: '',
            selected: false,
        })
    }

    addUserToManaging = async () => {
        if (this.state.module == "") {
            Alert.alert("Error", "Please select a module")
            return
        }
        if (this.state.newUser == auth().currentUser.uid) {
            Alert.alert("Error", "You can't add yourself to management of the module")
            return
        }
        await firestore().collection('users').doc(this.state.newUser).get().then(docSnapShot => {
            return docSnapShot.data().managing
        }).then(input => {
            if (input.includes(this.state.module)){
                Alert.alert("Unsuccessful", "User is already subscribed to " + this.state.module)
                return
            }
            firestore().collection('users').doc(this.state.newUser).update({
                managing: [...input, this.state.module].sort()
            })
        })
    }

    deleteModule = async () => {
        console.log("at UMFU function")
        //delete module Name if on array of users
        const userRefs = firestore().collection('users').where("moduleInvolved","array-contains",this.state.module)
        //firestore().collection('users').where("email","==","jj1@gmail.com")
        //delete all events
        firestore().collection('modules').doc(this.state.module).collection('Events')
        .get()
        .then(res => {
            res.forEach(element => {
                element.ref.delete();
            })
        })
        //remove module from users subscribed to it
        userRefs
        .get()
        .then(snapshots => {
            snapshots.forEach( doc => {
                doc.ref.update({"moduleInvolved": firestore.FieldValue.arrayRemove(this.state.module)})
                doc.ref.update({"managing": firestore.FieldValue.arrayRemove(this.state.module)})
                console.log(doc.id, "=>", doc.data());
                console.log("users removed deleted")
            });
        }).catch(function(error) {
            console.log("Error getting documents: ", error);
        });
        //delete module
        firestore().collection('modules').doc(this.state.module).delete()
    }

    render(){
        return (
            <KeyboardAwareScrollView style = {styles.container}>
                {!this.state.showCheck && <View style = {styles.topContainer}>
                    <View style = {{flexDirection: 'row', alignItems: 'center', marginBottom: 5}}>
                        <Text style = {styles.text}>Show Your UserID</Text>
                        <TouchableOpacity style = {{paddingLeft: 10}}  onPress= {() => this.setState({showUserID: !this.state.showUserID})} >
                            {this.state.showUserID ? 
                            <Feather 
                                name="eye-off"
                                color="grey"
                                size={30}
                            />
                            :
                            <Feather 
                                name="eye"
                                color="grey"
                                size={30}
                            />
                            }
                        </TouchableOpacity>
                    </View>
                    <View style = {styles.bar}>
                        <TextInput
                            value = {this.state.userID}
                            editable = {false}
                            secureTextEntry = {this.state.showUserID}
                            style = {styles.textInput}
                        />
                        <TouchableOpacity style = {styles.copyPaste} onPress = {() => Clipboard.setString(this.state.userID)}>
                            <Feather 
                                name="clipboard"
                                color="grey"
                                size={30}
                            />
                        </TouchableOpacity>
                  </View> 
                </View>}
                
                <View style = {styles.secondContainer}>
                    <View style = {{flexDirection: 'row', alignItems: 'center', marginBottom: 5, borderColor: colours.darkblue}}>
                        <Text style  = {styles.text}> Manage Module</Text>
                        <View style = {{borderWidth: 1, flex: 1, marginLeft: 10, marginVertical: 10, borderRadius: 20, paddingLeft: 10}}>
                            <Picker
                                style = {{flex: 1}}
                                selectedValue = {this.state.module}
                                onValueChange = {(item) => this.setState({module: item, selected: true})}
                            >
                                {this.getCodeItems()}
                            </Picker>
                    </View>
                    </View>
                    <Text style  = {styles.text}> Enter the new User ID </Text>
                    <View style = {styles.bar}>
                        <TextInput
                            value = {this.state.newUser}
                            style = {styles.textInput}
                            onChangeText = {input => this.setState({newUser: input, selected: true})}
                        />
                        <TouchableOpacity style = {styles.copyPaste} onPress = {async () => this.setState({newUser : await Clipboard.getString()}) }>
                            <Fontisto
                                name = 'paste'
                                color = 'grey'
                                size = {30}
                            />
                        </TouchableOpacity>
                    </View>

                    <View style = {styles.buttons}>
                        <View style = {{flex: 1}}>
                            <Button
                                title="Add User"
                                onPress={this.addUserToManaging}
                                buttonStyle = {{backgroundColor: colours.lightblue, borderTopLeftRadius: 15, borderBottomLeftRadius: 15, marginRight: 3}}
                            />
                        </View>
                        <View style = {{flex: 1}}>
                            {this.state.showCheck ? 
                            <Button
                            title="Back"
                            onPress={() => this.setState({showCheck: false})}
                            buttonStyle = {{backgroundColor: colours.lightblue, borderTopRightRadius: 15, borderBottomRightRadius: 15}}
                            />
                            :
                            <Button
                                title="Delete Module"
                                onPress={this.tryDelete}
                                buttonStyle = {{backgroundColor: colours.lightblue, borderTopRightRadius: 15, borderBottomRightRadius: 15}}
                            />
                            }
                        </View>
                    </View>
                </View>
                
                {this.state.showCheck && 
                (<View>
                    <View style = {{flexDirection: 'row', backgroundColor: '#FF0000', paddingHorizontal: 10, paddingTop: 10}}>
                        <MaterialIcons
                        name = "warning"
                        size = {20}
                        color = 'white'
                        />
                        <Text style = {{color: 'white', fontWeight: 'bold', fontSize: 20}}> Delete this module ?</Text>
                    </View>
                    <Text style = {{backgroundColor: '#FF0000', color: 'white', paddingHorizontal: 10, paddingVertical: 5, textAlign: 'justify', fontWeight: 'bold'}}>
                        Doing so will permanently delete all the data under this modules, including all events created under this module name.
                    </Text>
                    <View style = {{paddingHorizontal: 10, paddingTop: 5}}>
                        <Text style = {{textAlign: 'justify'}}>Module: <Text style = {{fontWeight: 'bold'}}>{this.state.module}</Text> </Text>
                        <Text>
                            Confirm your action by typing: 
                            <Text style = {{fontWeight: 'bold'}}> Delete_{this.state.module} </Text> 
                        </Text>
                    </View>
                    <View style = {styles.bar2}>
                        <TextInput
                            value = {this.state.confirmInput}
                            placeholder = {"Delete_" + this.state.module}
                            onChangeText = {(input) => this.setState({confirmInput: input})}
                            style = {styles.textInput}
                        />
                        <Button
                        title = "Confirm"
                        onPress = {this.deleteModule}
                        type = 'solid'
                        buttonStyle = {{backgroundColor: colours.lightblue, paddingHorizontal: 15, paddingVertical: 10}}
                        containerStyle = {{marginHorizontal: 10}}
                        />
                    </View>

                </View>)
                }
            
            </KeyboardAwareScrollView>           
        )
    }
}


const styles = StyleSheet.create({
    text: {
        color: colours.darkblue,
        fontWeight: 'bold'
    },
    container: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
    },
    topContainer: {
        borderBottomWidth: 1,
        padding: 10,
        paddingBottom: 40,
    },
    secondContainer: {
        borderBottomWidth: 1,
        padding: 10,
        paddingBottom: 20,
    },
    buttons: {
        alignContent: 'center',
        marginTop: 30,
        flex: 1,
        flexDirection: 'row',
    },
    bar : {
        flexDirection: 'row',
        alignItems: 'center'
    },
    bar2: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 5,
        paddingLeft: 10,
    },
    textInput : {
        borderWidth: 1,
        borderRadius: 20,
        flex: 1,
        borderColor: colours.darkblue
    },
    copyPaste: {
        marginLeft: 10,
    },
})