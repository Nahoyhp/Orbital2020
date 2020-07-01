import React, { Component, useState} from 'react';
import { Dimensions, StyleSheet, View, SafeAreaView, TextInput, Text, FlatList, Alert, ActivityIndicator} from 'react-native';
import BlueButton from "../components/BlueButton";
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'
import TimeTableView, { genTimeBlock } from 'react-native-timetable';
import database from '../API/firebaseAPI'
import { ScreenStackHeaderBackButtonImage } from 'react-native-screens';

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

const modulesCollection = firestore().collection('modules');

const dayArr = ['MON', 'TUE','WED', 'THU','FRI', 'SAT','SUN']

const colorArr = ["#AC96B6",'#048A81',"#54C6EB","#6FA8D6","#8A89C0","#8A89C0"]

function compare(a,b){
  var aIndex = dayArr.indexOf(a["day"])
  var bIndex = dayArr.indexOf(b['day'])
  var result = aIndex - bIndex
  //console.log(a['day'],b['day'] )
  //console.log(aIndex, bIndex)

  if (result != 0) {return result}
  else { Date(a['date']).getHours() - Date(b['date']).getHours() }
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
    }
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
    //console.log(temp)
    this.setState({moduleSubscribed : temp})
  }


  async componentDidMount() {
    if (this.state.moduleNameList.length == 0) {
      await database.getDetail()
      this.getModuleNameList()
      this.getStudentInfo()
      var temp = await database.getEvents()
      temp.sort(compare)
      await this.setState({eventList : temp})
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
      console.log("Subscribe")
      temp = [...this.state.moduleSubscribed, this.state.moduleToSubscribe]
      newEvent = await database.subscribeNewModule(this.state.moduleToSubscribe)
      studentFirebase.update({moduleInvolved: temp})
      this.setState({
        modueToSubscribe: '',
        moduleSubscribed: temp,
        eventList: [...this.state.eventList, ...newEvent].sort(compare)
      })
      console.log("Done")
      Alert.alert("Successful", "You are now subscribed to " + this.state.moduleToSubscribe)
      console.log(this.state.eventList)
    }
  }

  scrollViewRef = (ref) => {
    this.timetableRef = ref;
  };

  testing() {
    return (<View><Text>Hello World</Text></View>)
  }

  customStyle(moduleName) {
    var color = colorArr[this.state.moduleSubscribed.indexOf(moduleName)]
    console.log(color)
    return {
      backgroundColor: color,
      margin: 1,
      padding: 5,
      borderRadius: 5,
    }
  }


  render() {
    if (this.state.moduleNameList.length == 0 || this.state.eventList.length == 0){
      return (
        <View style = {{flex: 1, justifyContent: 'center'}}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )
    } else {
      return (
        <SafeAreaView style={{flex: 1}}>
          <SafeAreaView style = {{flexDirection: "row"}}>
            <TextInput 
              style = {myStyle.input}
              placeholder = "Key in Modules to Search"
              value = {this.state.moduleToSubscribe}
              onChangeText = {this.handleUserInput}
              />
            <View style = {myStyle.buttons}>
              <BlueButton
              style = {myStyle.AddMoudle}
              title = "1"
              onPress = {this.subscribeNewModule}
              />
              <BlueButton
              style = {myStyle.SearchButton}
              title = "2"
              onPress = {() => this.toggleView()}
              />
              <BlueButton
              style = {myStyle.AddMoudle}
              title = "3"
              onPress = {() => this.props.navigation.navigate('AddModules')}
              />

              <BlueButton
              style = {myStyle.AddMoudle}
              title = "4"
              onPress = {() => this.props.navigation.navigate('CreateEvent')}
              />

            </View>
          </SafeAreaView>
          {!this.state.listView ? (
            <View style={styles.container}>
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
            </View>) : <View style={styles.container}>
            <FlatList
            data = {this.state.eventList}
            keyExtractor = {({item}) => {
              detail = new Object(item)
              return String(detail.module) + String(detail.title)
            }}
            renderItem = {({item}) => {
              data = new Object(item)
              return (
              <View style = {this.customStyle(data.module)}>
                <View style = {{flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between'}}>
                  <Text style = {{fontSize: 20}}> {String(data.module) +" " +  String(data.title)}</Text>
                  <Text style = {{fontSize: 15}}>{"Due on: " + String(data.day) + " " + String(data.startTime)}</Text>
                </View>
                {item.extra_description.length != 0 && <Text style = {{fontSize: 15}}>{"Description: " + String(item.extra_description)}</Text>}
              </View>
              )
            }}
            />
           
            </View>
          }
        </SafeAreaView>
      );
    }
  }
}

const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: '#CD6155',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
});

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
        padding: 4,
        flex: 2,
        flexDirection: "row",
        alignItems: "center",
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

    input: {
        flex: 3,
        borderWidth: 1,
        borderColor: '#777',
        padding: 4,
        margin: 10,
        height: 40,
    },

    textStyle: {
        fontSize: 15,
        marginBottom: 20
    }
});