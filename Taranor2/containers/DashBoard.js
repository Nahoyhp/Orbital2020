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
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { Button } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import moment from "moment"
import * as colours from '../colours'

const dayList = ['SUN','MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', ]

const events_data = [
    {
      title: "Math",
      startTime: genTimeBlock("MON", 9),
      endTime: genTimeBlock("MON", 10, 50),
      location: "Classroom 403",
      extra_descriptions: ["Kim Lee"],
    },
  ];

const dayArr = ['MON', 'TUE','WED', 'THU','FRI', 'SAT','SUN']

const colorArr = ["#8A89C0",'#116466', 'D1E8E2',"#EDC7B7",'#D2FDFF', "#BAB2B5","#123C69","#AC96B6","#D9B08C",'#048A81',"#6FA8D6",'#D6CE15',]


function compare(a,b){
  var aDate = moment(a.startDate)
  var bDate = moment(b.startDate)

  if (aDate.isBefore(bDate)){return -1}
  else if (aDate.isSame(bDate)) {return 0}
  else {return 1}
}

export async function addToEventList(input) {
  await this.setState({eventList: [...this.state.eventList, input]})
}  

export async function deleteModalModule() {
  var eventDeleted = this.state.modalModule
  var newEventList = this.state.eventList.filter(item => {
    var token = item.module == eventDeleted.module && item.title == eventDeleted.title
    return !token
  })
  var message = eventDeleted.module + " " + eventDeleted.title + " has been deleted"
  database.deleteEvent({eventDeleted: eventDeleted, newEventList: newEventList})
  await this.setState({eventList: newEventList})
  Alert.alert("Delete Successful", message,
  [{text: 'Move back to Dashboard', onPress: () => this.props.navigation.navigate('Dashboard')},],
  {cancelable: false})
}

export async function updateInfo(input) {
  var newEventList = this.state.eventList.map(mod => {
    if (mod.module == input.module && mod.title == input.title) {
      mod.startDate = input.startDate
      mod.endDate = input.endDate
      mod.startTime = input.startTime
      mod.endTime = input.endTime
      mod.extra_description = input.extra_description
      mod.location = input.location
    }
    return mod
  })
  database.updateInfo({newEventList: newEventList, modifiedEvent : input})
  var message = input.module + " " + input.title + " has been updated"

  Alert.alert("Update Successful", message,
  [{text: 'Move back to Dashboard', onPress: () => this.props.navigation.navigate('Dashboard')},],
  {cancelable: false})

  await this.setState({eventList : newEventList})
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
      modalModule: {},
      currentDate: new moment().startOf('isoWeek').day(0),
      week: new moment().week(),    
    }
    addToEventList = addToEventList.bind(this)
    deleteModalModule = deleteModalModule.bind(this)
    updateInfo = updateInfo.bind(this)
  }

  currentWeekEvents = (item) => {
    var startMoment = moment(item.startDate)
    var currentWeek = startMoment.day() == 0 ? startMoment.week() - 1 : startMoment.week() 
    return currentWeek == this.state.week
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
      await database.getEvents()
      this.getModuleNameList()
      this.getStudentInfo()
      var temp = await database.getEvents()
      this.setState({eventList : temp.sort(compare), loading: false})
    }
  }

  onEventPress = (evt) => {
    this.setState({modalModule : evt, showModal: true})
    this.modalContent(evt);
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
    var startMoment = moment(modalModule.startDate)
    var endMoment = moment(modalModule.endDate)
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
            {this.modalDetail({title: 'Time :', content: modalModule.day + " " + startMoment.format('HH[:]mm') + " - " + endMoment.format('HH[:]mm')}) }
            {this.modalDetail({title: 'CreatedBy :', content: modalModule.createdBy})}
            {modalModule.location != '' && this.modalDetail({title: 'Location:', content: modalModule.location})}
            {modalModule.extra_description != '' && this.modalNotes({title: 'Notes :', content: modalModule.extra_description})}
            <View style = {{flex: 1, justifyContent: 'flex-end', flexDirection: 'row'}}>
              {database.state.selfDetail.managing.includes(modalModule.module) && 
                <Button
                  title ="Modify"
                  type = "solid"
                  containerStyle = {{marginRight: 5, marginTop: 10}}
                  onPress = {() => {
                    this.props.navigation.navigate('UpdateEvent', {
                      module: modalModule.module,
                      title: modalModule.title,
                      eventTitle: modalModule.eventTitle,

                      startDate: modalModule.startDate,
                      endDate: modalModule.endDate,
                      day: modalModule.day,

                      startTime: modalModule.startTime,
                      endTime: modalModule.endTime,

                      location: modalModule.location,
                      extra_description: modalModule.extra_description,
                    })
                    this.setState({showModal: false})
                  }}
                />
              }
              <Button
                title ="Unsubscribe"
                type = "solid"
                containerStyle = {{marginRight: 5, marginTop: 10}}
                onPress = {() => this.unsubscribe()}
              />
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </Modal>
    )
  }

  unsubscribe = () => {
    var moduleUnsubscribed = this.state.modalModule.module
    var newEvents = this.state.eventList.filter(item => {
      return item.module != moduleUnsubscribed
    })
    
    var newSubscribed = this.state.moduleSubscribed.filter(item => {
      return item != moduleUnsubscribed
    })
    database.unsubscribeRecord({eventList: newEvents, moduleSubscribed : newSubscribed})
    this.setState({eventList : newEvents, moduleSubscribed : newSubscribed, showModal: false})
  }

  deleteEvent = () => {
    var eventModule = this.state.modalModule.module
    var eventTitle = this.state.modalModule.title

    var newEvents = this.state.eventList.filter(item => {
      return !(item.module == eventModule && item.title == eventTitle)
    })

    database.deleteEvent({newEventList : newEvents, eventDeleted:this.state.modalModule})

    this.setState({eventList : newEvents, showModal: false})
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
                this.state.listView ?
                <MaterialIcons
                name = 'view-list'
                color = {'white'}
                size = {20}
                />
                : <Octicons
                name = 'calendar'
                color = {'white'}
                size = {20}
                />
              }
              onPress = {this.toggleView}
              />
                <Button
                type = 'clear'
                containerStyle = {functionBar.buttonContainer}
                onPress = {() => {
                  auth().signOut()
                  Alert.alert("Confirmation required", 'Do you really want to logout?',
                  [{text: 'Yes', onPress: () => this.props.navigation.navigate('SignIn')},{text: 'No'}],
                  {cancelable: false})
                }}
                icon = {<Octicons
                name = 'sign-out'
                color = {'white'}
                size = {20}
                />}
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

  nextWeek = () => {
    this.setState({
      currentDate : this.state.currentDate.day(7),
      week: this.state.week + 1,
    })
  }

  prevWeek = () => {
    this.setState({
      currentDate : this.state.currentDate.day(-7),
      week: this.state.week - 1,
    })
  }

  timetableRender = () => {
    return (
      <SafeAreaView style={{flex: 1}}>
        <View style = {timetableStyle.topBar}>
          <TouchableOpacity style = {timetableStyle.arrows} onPress = {this.prevWeek}>
            <SimpleLineIcons
              name = 'arrow-left'
              size = {15}
              color = 'white'
            />
          </TouchableOpacity>
          <View style = {{flex: 5, alignItems: 'center', alignContent: 'center'}}>
            <Text style = {timetableStyle.text}>
              {/*this.state.currentDate.format('DD/MM')*/}
              {"Week " + this.state.week}
              
            </Text>
          </View>
          <TouchableOpacity style = {timetableStyle.arrows} onPress = {this.nextWeek}>
            <SimpleLineIcons
              name = 'arrow-right'
              size = {15}
              color = 'white'
            />
          </TouchableOpacity>
        </View>
        <ScrollView>
          <View style = {styles.container}>
            <TimeTableView
              scrollViewRef={this.scrollViewRef}
              events={this.state.eventList.filter(item => this.currentWeekEvents(item))}
              pivotTime={8}
              pivotEndTime={20}
              pivotDate={this.pivotDate}
              numberOfDays={5}
              onEventPress={this.onEventPress}
              headerStyle={styles.headerStyle}
              formatDateHeader="dddd"
              locale="en"
            />
          </View>
        </ScrollView>
      </SafeAreaView>
      )
  }

  content = () => {
    return (
      <SafeAreaView style={{flex: 1,}}>
        { this.state.showModal && this.modalContent() }
        { this.searchBar()}
        {this.state.listView ? this.timetableRender()
            : <View style={{flex: 1}}>
            {this.state.eventList.length == 0 ? 
            <Text style = {{alignSelf: 'center', color: colours.lightblue }}>No event exists in your calendar</Text> :
            <FlatList
            data = {this.state.eventList.filter(event => {
              return moment(event.startDate).isAfter(new moment())
            })}
            keyExtractor = {(item, index) => {
              return item['module'] + item['title']
            }}
            renderItem = {({item}) => {
              var data = new Object(item)
              var startMoment = Object(data.startDate) instanceof Date ? moment(data.startDate) : moment(data.startDate.toDate())
              return (
              <View style = {this.customStyle(data.module)}>
                <TouchableOpacity onPress = {() => {this.setState({modalModule : data, showModal: true})}}>
                  <View style = {{flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between'}}>
                    <Text style = {{fontSize: 20}}> {String(data.title)}</Text>
                  </View>
                  <Text style = {{fontSize: 15}}>
                    {"Due on: " + startMoment.format('DD[/]MM') + " " + String(data.day) + " " + startMoment.format('HH[:]mm')}
                  </Text>
                  {item.extra_description.length != 0 && <Text style = {{fontSize: 15}}>{"Description: " + String(item.extra_description)}</Text>}
                </TouchableOpacity>
              </View>
              )
            }}
            />
          }
          </View>
          }
      </SafeAreaView>
    )
  }

  render() {
    if (this.state.loading){
      return (
        <View style = {{flex: 1, justifyContent: 'center'}}>
          <ActivityIndicator size="large" color={colours.lightblue} />
        </View>
      )
    } else {
      return this.state.showDropDown ? this.dropDownContent() : this.content()
    }
  }
}

const timetableStyle = StyleSheet.create({
  topBar: {
    backgroundColor: colours.lightblue,
    marginTop: 5,
    flexDirection: 'row',
    alignContent: 'space-between'
  },
  arrows : {
    flex: 1,
    padding: 5,
    alignItems: 'center'
  }, 
  text: {
    fontSize: 15,
    color: 'white',
  },
  headerStyle: {
    backgroundColor: colours.lightblue,
  },
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
})

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
    backgroundColor: colours.lightblue,
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
    borderColor: colours.lightblue,
    borderWidth: 2,
    flex: 7,
    height: 40,
    marginLeft: 5,
    padding: 4,  
  },

  buttonContainer: {
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: colours.lightblue,
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