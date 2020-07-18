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
import BlueButton from './BlueButton';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import * as colours from '../colours'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import * as Animatable from 'react-native-animatable';
import database from '../API/firebaseAPI';

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
            Alert.alert("Error!", "Course code and name is mandatory")
            return
        }

        //database.addNewModule({name: this.state.code})

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
            <KeyboardAwareScrollView 
                style = {styles.container}
                resetScrollToCoords={{ x: 0, y: 0 }}   
            > 
                    
                    <Animatable.View 
                        animation = "fadeInRight"
                        duration = {1000}
                        style = {styles.top} >
                        <Text style = {styles.header}> Add Modules </Text>
                    </Animatable.View>

                    <Animatable.View 
                        animation = "fadeInUp"
                        duration = {1000}
                        style = {styles.bottom}>
                        <Text style = {styles.subheader}>Please key in the necessary details</Text> 
                        
                        <View style = {styles.action}>
                            <MaterialIcon
                                name = "code"
                                color = {'#05375a'}
                                size = {20}
                            />
                            <TextInput style = {styles.inputStyle}
                                placeholder = "Module Code" 
                                value = {code}
                                onChangeText={this.handleUpdateCode} 
                            />
                        </View>

                        <View style = {styles.action}>
                            <MaterialIcon
                                name = "subject"
                                color = {'#05375a'}
                                size = {20}
                            />
                            <TextInput style = {styles.inputStyle}
                                placeholder = "Module Name" 
                                value = {name}
                                onChangeText={this.handleUpdateName} 
                            />
                        </View>

                        <View style = {styles.action}>
                            <MaterialIcon
                                name = "description"
                                color = {'#05375a'}
                                size = {20}
                            />
                            <TextInput style = {styles.inputStyle}
                                placeholder = "Module description" 
                                value = {description}
                                onChangeText={this.handleDescription} 
                            />
                        </View>

                        <View style = {{marginTop: 10, marginBottom: 10}}>
                            <Button
                                color= {colours.darkblue}
                                title="Submit"
                                style = {{paddingBottom: 10, marginBottom: 10}}
                                onPress ={() => {this.handleCreateModules()} }
                            />
                        </View>
                        <Button
                        color={colours.darkblue}
                        title="Back to dashboard"
                        onPress={() => this.props.navigation.navigate('Dashboard')}
                        />
                    </Animatable.View>

                    { moduleCreated ? (
                        Alert.alert("", "Module Created")
                    ): null }
                
            </KeyboardAwareScrollView>           
        )
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    padding: 15,
    backgroundColor: colours.darkblue,
  },
  o_container: {
    backgroundColor: '#45B39D',
    flex: 1,
    justifyContent: "center",
    paddingTop: 65
  },

  top : {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 15,
    marginTop:20,
    paddingBottom: 15
  },

  bottom: {
      flex: 5,
      backgroundColor: '#fff',
      borderTopLeftRadius: 25,
      borderTopRightRadius: 25,
      borderBottomLeftRadius: 25,
      borderBottomRightRadius: 25,
      paddingHorizontal: 25,
      paddingVertical: 46.5
  },

  header:{
    fontSize:30,
    fontFamily:'serif',
    color: "#fff",
    
    marginBottom:10
  },

  action: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    marginBottom: 15,
    padding:5
  },
  subheader:{
    fontSize:18,
    fontFamily:'serif',
    color: colours.darkblue,
    padding: 10,
    marginBottom:10
  },
  inputStyle : {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -15,
    marginBottom: -10,
    paddingLeft: 10,
    color: '#05375a',
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