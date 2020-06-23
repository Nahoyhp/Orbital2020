import React, { Component, useState} from 'react';
import { StyleSheet, View, SafeAreaView, TextInput, Text, FlatList, ListItem, Dimensions, Alert} from 'react-native';
import BlueButton from "../components/BlueButton";
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'
import TimeTableView, { genTimeBlock } from 'react-native-timetable';

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

export default class Dashboard extends Component {
  constructor() {
    super();
    this.numOfDays = 5 ;
    this.pivotDate = genTimeBlock('mon');
    this.state = {
      listView: false,
      moduleList: [],
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

  componentDidMount() {
    modulesCollection.get().then( snapshot => snapshot.docs.forEach((mod) => {
      this.state.moduleList.push(mod.data())
      })
    ).catch(err => console.log(err))
    console.log(this.state.moduleList)
  }

  onEventPress = (evt) => {
    Alert.alert("onEventPress", JSON.stringify(evt));
  };

  subscribeNewModule = () => {
    if (this.state.moduleToSubscribe == "") {
      Alert.alert("Error", "Please key in a module")
      return
    }

    var uid = auth().currentUser.uid
    var modules = []
    var students = firestore().collection("students").doc(uid)
    
    modulesCollection
    .doc(this.state.moduleToSubscribe)
    .get()
    .then(docSnapShot => {
      if (docSnapShot.exists) {
        const result = Object.values(docSnap.get('moduleInvolved'))
        result.forEach(mod => modules.push(mod))
        modules.push(this.state.moduleToSubscribe)
        console.log(modules)
        students.update({moduleInvolved : modules})
        this.setState({moduleToSubscribe : ""})
      } else {
        Alert.alert("Invalid Module", "Module does not exist")
      }
    })
  }

  scrollViewRef = (ref) => {
    this.timetableRef = ref;
  };

  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <SafeAreaView style = {{flexDirection: "row"}}>
          <TextInput 
            style = {myStyle.input}
            placeholder = "Key in Modules to Search"
            value = {this.state.moduleList}
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
            onPress = {() => this.props.navigation.navigate('AddModule')}
            />
            <BlueButton
            style = {myStyle.AddMoudle}
            title = "3"
            onPress = {() => this.toggleView()}
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
              scrollViewRef={this.scrollViewRef}
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
          </View>) : (
          <View>
          <FlatList style = {myStyle.flatListStyle}
          data={this.state.moduleList}
          keyExtractor = {(item) => item.code}
          renderItem={({item})=>(
          <View style={{justifyContent:'center',marginBottom:10}}>
            <Text style={myStyle.moduleWord}>
              {item.code}
            </Text>
          </View>
          )} />
        </View>)
        }
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: '#81E1B8',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
});

const myStyle = StyleSheet.create({
    flatListStyle: {
      marginTop:40,
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