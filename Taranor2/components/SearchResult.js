import React, { Component, useState} from 'react';
import {
    Alert,
    FlatList,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Dimensions
} from 'react-native';
import database from '../API/firebaseAPI';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Octicons from 'react-native-vector-icons/Octicons';
import { Button } from 'react-native-elements';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export default class SearchResult extends Component{
    constructor() {
        super()
        this.state = {
            moduleToSubscribe : '',
        }
    }

    handleUserInput = (moduleToSubscribe) => {
        this.setState({moduleToSubscribe})
    }

    pressFlatListItem = (item) => {
        this.setState({moduleToSubscribe : item})
    }

    matchInput = (item) => {
        return item.includes(this.state.moduleToSubscribe)
    }

    subscribeNewModule = async () => {
        if (this.state.moduleToSubscribe == "") {
          Alert.alert("Error", "Please key in a module")
          return
        }
    
        if (!this.state.moduleNameList.includes(this.state.moduleToSubscribe)) {
          Alert.alert("Error", "Module does not exist")
          return
        }
    
        var uid = auth().currentUser.uid
        var studentFirebase = firestore().collection('users').doc(uid)

    
        if (Dashboard.state.moduleSubscribed.includes(this.state.moduleToSubscribe)){
          var errorMessage = "You have already subscribed to " + this.state.moduleToSubscribe
          this.setState({moduleToSubscribe: ''})
          Alert.alert("Error", errorMessage)
        } else {
          temp = [...this.state.moduleSubscribed, this.state.moduleToSubscribe]
          newEvent = await database.subscribeNewModule(this.state.moduleToSubscribe)
          studentFirebase.update({moduleInvolved: temp})
          this.setState({
            modueToSubscribe: '',
            moduleSubscribed: temp,
            eventList: [...this.state.eventList, ...newEvent].sort(compare)
          })
          Alert.alert("Successful", "You are now subscribed to " + this.state.moduleToSubscribe)
        }
      }
    


    render() {
        return (
        <SafeAreaView style={{flex: 1, backgroundColor: 'grey'}}>
            <SafeAreaView style = {{flexDirection: "row", alignItems: 'center', backgroundColor: 'white'}}>
                    <View style = {{flex: 7}}>
                        <TextInput 
                        style = {functionBar.input}
                        placeholder = "Key in Modules to Search"
                        value = {this.state.moduleToSubscribe}
                        onChangeText = {this.handleUserInput}
                        autoFocus = {true}
                        />
                    </View>
                    <Button
                    type = 'clear'
                    containerStyle = {functionBar.buttonContainer}
                    icon = {
                        <Fontisto
                        name="search"
                        color={'white'}
                        size={20}
                        />
                    }
                    onPress = {() => {
                        console.log('Hello')
                    }}
                    />
                    <Button
                    type = 'clear'
                    containerStyle = {functionBar.buttonContainer}
                    icon = {
                        <Octicons
                        name="sync"
                        color={'white'}
                        size={20}
                        />
                    }
                    onPress = {null}
                    />
            </SafeAreaView>
                <FlatList
                data = {database.state.moduleNameList.filter(item => this.matchInput(item)).slice(0,5)}
                keyExtractor = {(item, index) => {
                    return JSON.stringify(index)
                }}
                renderItem = {({item}) => {
                    return (
                    <View style = {{flex: 1, flexDirection: 'row'}}>
                        <View style = {flatListItemStyle.container}>
                            <TouchableOpacity onPress = {() => {this.pressFlatListItem(item)}}>
                                <Text style>{item}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style = {{flex: 2, marginLeft: 32}}></View>
                    </View>
                    )
                }}
            />
        </SafeAreaView>
        )
    }
}

const flatListItemStyle = StyleSheet.create({
    container: {
        flex: 7,
        borderWidth: 1,
        marginLeft: 5,
        padding: 5,
        backgroundColor: 'white'
    },
})

const functionBar = StyleSheet.create({
    input: {
      borderColor: '#45B39D',
      borderWidth: 2,
      flex: 7,
      height: 40,
      marginLeft: 5,
      padding: 4,  
    },
  
    buttonContainer: {
      alignContent: 'center',
      alignItems: 'center',
      backgroundColor: '#45B39D',
      flex: 1,
      marginLeft: 5,
      padding: 4,
    }
})



