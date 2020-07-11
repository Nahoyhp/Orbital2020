import React, { Component, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'
import TimeTableView, { genTimeBlock } from 'react-native-timetable';
import database from '../API/firebaseAPI';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Octicons from 'react-native-vector-icons/Octicons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Button } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';

const events_data = [
    {
      title: "Math",
      startTime: genTimeBlock("MON", 9),
      endTime: genTimeBlock("MON", 10, 50),
      location: "Classroom 403",
      extra_descriptions: ["Kim Lee"],
    },
    {
      title: "Math",
      startTime: genTimeBlock("WED", 9),
      endTime: genTimeBlock("WED", 10, 50),
      location: "Classroom 403",
      extra_descriptions: ["Kim", "Lee"],
    },
    {
      title: "Physics",
      startTime: genTimeBlock("MON", 11),
      endTime: genTimeBlock("MON", 11, 50),
      location: "Lab 404",
      extra_descriptions: ["Einstein"],
    },
    {
      title: "Physics",
      startTime: genTimeBlock("WED", 11),
      endTime: genTimeBlock("WED", 11, 50),
      location: "Lab 404",
      extra_descriptions: ["Einstein"],
    },
    {
      title: "Mandarin",
      startTime: genTimeBlock("TUE", 9),
      endTime: genTimeBlock("TUE", 10, 50),
      location: "Language Center",
      extra_descriptions: ["Chen"],
    },
    {
      title: "Japanese",
      startTime: genTimeBlock("FRI", 9),
      endTime: genTimeBlock("FRI", 10, 50),
      location: "Language Center",
      extra_descriptions: ["Nakamura"],
    },
    {
      title: "Club Activity",
      startTime: genTimeBlock("THU", 9),
      endTime: genTimeBlock("THU", 10, 50),
      location: "Activity Center",
    },
    {
      title: "Club Activity",
      startTime: genTimeBlock("FRI", 13, 30),
      endTime: genTimeBlock("FRI", 14, 50),
      location: "Activity Center",
    },
  ];

const dayArr = ['MON', 'TUE','WED', 'THU','FRI', 'SAT','SUN']

const colorArr = ["#AC96B6",'#048A81',"#54C6EB","#6FA8D6","#8A89C0","#8A89C0"]

const dataTitle = ['module', 'title','createdBy', 'date', 'startTime', 'endTime', 'extra_description']

function compare(a,b){
  var aIndex = dayArr.indexOf(a["day"])
  var bIndex = dayArr.indexOf(b['day'])
  var result = aIndex - bIndex

  if (result != 0) {return result}
  else { return Date(a['date']).getHours() - Date(b['date']).getHours() }
}

export default class Dashboard extends Component {
  constructor() {
    super();
    this.numOfDays = 5 ;
    this.pivotDate = genTimeBlock('mon');
    this.state = {
      listView: true,
      moduleNameList: [],
      eventList: [],
      moduleSubscribed : [],
      userRole: '',
      today: new Date(),
      moduleToSubscribe: "",
      loading: true,
      showModal: false,
      showDropDown: false,
      modalModule: {}        
    }
  }

  onModal = ({data}) => {
    this.setState({showModal : true, modalModule: data})
  }

  offModal = () => {
    this.setState({showModal : false})
  }

  handleUserInput = (moduleToSubscribe) => {
    this.setState({moduleToSubscribe})
  }

  toggleView = () => {
    this.setState({listView: !this.state.listView})
  }


  getModuleNameList = async () => {
    var tempList = await database.getModuleList()
    this.setState({moduleNameList: tempList})
  }

  getStudentInfo = async () => {
    var temp = await database.getModuleSubscribed()
    this.setState({moduleSubscribed : temp})
  }


  async componentDidMount() {
    if (this.state.moduleNameList.length == 0) {
      await database.getDetail()
      this.getModuleNameList()
      this.getStudentInfo()
      var temp = await database.getEvents()
      temp.sort(compare)
      this.setState({eventList : temp, loading: false})
    }
  }

  onEventPress = (evt) => {
    Alert.alert("onEventPress", JSON.stringify(evt));
  };

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
    var temp = []
    var newEvent = []

    if (this.state.moduleSubscribed.includes(this.state.moduleToSubscribe)){
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

  scrollViewRef = (ref) => {
    this.timetableRef = ref;
  };

  customStyle(moduleName) {
    var color = colorArr[this.state.moduleSubscribed.indexOf(moduleName)]
    return {
      backgroundColor: color,
      margin: 1,
      padding: 5,
      borderRadius: 5,
    }
  }

  modalDetail = ({title, content}) => {
    return (
      <View style = {{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
        <Text style = {modalStyle.title}> {title} </Text>
        <View style = {modalStyle.dataContainer}>
          <Text>{content}</Text>
        </View>
      </View>
    )
  }

  modalNotes = ({title, content}) => {
    return (
      <View style = {{flexDirection: "column"}}>
        <Text> {title} </Text>
        <View style = {{borderWidth: 1, borderRadius: 5}}>
          <Text style = {{padding: 5, marginBottom: 10}}>{content}</Text>
        </View>
      </View>
    )
  }

  modalContent = () => {
    var modalModule = this.state.modalModule
    return (
    <Modal
    style = {{flex: 1}}
    visible = {this.state.showModal}
    onRequestClose = {this.offModal}
    animationType = 'fade'
    transparent = {true}
    >
      <View style = {{backgroundColor: 'rgba(0,0,0,0.5)'}}>
        <TouchableOpacity onPressOut = {() => this.offModal()}>
          <View style ={modalStyle.modalContainer}>
            <View style = {{alignItems: 'flex-end', paddingLeft: 5}}>
              <Fontisto 
              name = "close-a"
              color = {'tomato'}
              size = {15}
              />
            </View>
            {this.modalDetail({title: 'Module :', content: modalModule.module})}
            {this.modalDetail({title: 'Time :', content: modalModule.day + " " + modalModule.startTime + " - " + modalModule.endTime}) }
            {this.modalDetail({title: 'CreatedBy :', content: modalModule.createdBy})}
            {modalModule.location != '' && this.modalDetail({title: 'Location:', content: modalModule.location})}
            {modalModule.extra_description != '' && this.modalNotes({title: 'Notes :', content: modalModule.extra_description})}
            <View style = {{flex: 1, justifyContent: 'flex-end', flexDirection: 'row'}}>
              <TouchableOpacity onPress = {null}>
                <Button
                  title ="Modify"
                  type = "solid"
                  containerStyle = {{marginRight: 5, marginTop: 10}}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress = {null}>
                <Button
                  title ="Unsubscribe"
                  type = "solid"
                  containerStyle = {{marginRight: 5, marginTop: 10}}
                />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </Modal>
    )
  }

  searchBar = () => {
    return (
      <SafeAreaView style = {{flexDirection: "row", alignItems: 'center'}}>
            <TextInput 
              style = {functionBar.input}
              placeholder = "Key in Modules to Search"
              value = {this.state.moduleToSubscribe}
              onChangeText = {this.handleUserInput}
              onFocus = {() => this.setState({showDropDown: true})}
              //showSoftInputOnFocus = {false}
              />
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
              onPress = {this.subscribeNewModule}
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
              onPress = {this.toggleView}
              />
        </SafeAreaView>
    )
  }

  dropDownContent = () => {
    return (
      <Modal
      style = {{flex: 1}}
      visible = {this.state.showDropDown}
      onRequestClose = {() => this.setState({showDropDown: false})}
      animationType = 'fade'
      transparent = {true}
      >
        {this.searchBar()}
        <TouchableOpacity onPressOut = {() => this.setState({showDropDown: false})}>
          <View style = {{backgroundColor: 'rgba(0,0,0,0.5)', height: Dimensions.get('window').height}}>
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
          </View>
        </TouchableOpacity> 
      </Modal>
    )
  }

  pressFlatListItem = (item) => {
    this.setState({moduleToSubscribe : item})
  }

  matchInput = (item) => {
      return item.includes(this.state.moduleToSubscribe)
  }

  timetableRender = () => {
    return (
    <View style={styles.container}>
      <View>
        <View>
          <Octicons
            name = 'arrow-left'
            color = '#F8F8F8'
            fontSize = {40}
          />
        </View>
        
        <View>
          <Octicons
            name = 'arrow-right'
            color = '#F8F8F8'
            fontSize = {40}
          />
        </View>
      </View>
      <ScrollView>
        <TimeTableView
          scrollViewRef={events_data}
          events={events_data}
          pivotTime={8}
          pivotEndTime={20}
          pivotDate={this.pivotDate}
          numberOfDays={this.numOfDays}
          onEventPress={this.onEventPress}
          headerStyle={styles.headerStyle}
          formatDateHeader="dddd"
          locale="en"
        />
      </ScrollView>
    </View>)
  }

  content = () => {
    return (
      <SafeAreaView style={{flex: 1,}}>
        { this.state.showModal && this.modalContent() }
        { this.searchBar()}
        {!this.state.listView ? this.timetableRender()
            : <View style={styles.container}>
            <FlatList
            data = {this.state.eventList}
            keyExtractor = {(item, index) => {
              return item['module'] + item['title']
            }}
            renderItem = {({item}) => {
              var data = new Object(item)
              return (
              <View style = {this.customStyle(data.module)}>
                <TouchableOpacity onPress = {() => {this.setState({modalModule : data, showModal: true})}}>
                  <View style = {{flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between'}}>
                    <Text style = {{fontSize: 20}}> {String(data.module) +" " +  String(data.title)}</Text>
                  </View>
                  <Text style = {{fontSize: 15}}>{"Due on: " + String(data.day) + " " + String(data.startTime)}</Text>
                  {item.extra_description.length != 0 && <Text style = {{fontSize: 15}}>{"Description: " + String(item.extra_description)}</Text>}
                </TouchableOpacity>
              </View>
              )
            }}
            />
          </View>
            }
      </SafeAreaView>
    )
  }



  render() {
    if (this.state.loading){
      return (
        <View style = {{flex: 1, justifyContent: 'center'}}>
          <ActivityIndicator size="large" color="#45B39D" />
        </View>
      )
    } else {
      return this.state.showDropDown ? this.dropDownContent() : this.content()
    }
  }
}

const flatListItemStyle = StyleSheet.create({
  container: {
      flex: 7,
      borderWidth: 1,
      marginLeft: 5,
      padding: 5,
      backgroundColor: 'white',
  },
})

const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: '#45B39D',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
});

const modalStyle = StyleSheet.create({
  modalContainer : {
    backgroundColor: 'white',
    marginVertical: Dimensions.get('window').height /4,
    height: Dimensions.get('window').height / 2,
    marginHorizontal: Dimensions.get('window').width / 6,
    padding: 10,
    borderRadius: 10,
  },
  innerModal: {
    flex: 1,
    flexDirection: "row",
    borderWidth: 1,
  },
  title: {
    flex: 1,
  },
  dataContainer: {
    borderWidth: 1,
    flex: 2,
    borderColor: '#05375a',
    padding: 5,
  }
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


const myStyle = StyleSheet.create({
    flatListStyle: {
      backgroundColor: 'white',
      margin: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between'
    },

    moduleWord: {
      backgroundColor:'blue',
      color:'white',
      padding:10,
      width:Dimensions.get('window').width
    },

    buttons : {
        padding:4,
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: '#45B39D'
    },

    SearchButton : {
        marginRight: 3,
        flex: 2,
        margin: 1,
    },

    AddModule : {
        flex: 1,
        margin: 1,
    },

    

    textStyle: {
        fontSize: 15,
        marginBottom: 20
    }
});