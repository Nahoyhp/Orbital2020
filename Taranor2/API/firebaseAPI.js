import { React, Component } from "react";
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import { Alert } from "react-native";
import * as Dashboard from "../containers/DashBoard";
import { genTimeBlock } from 'react-native-timetable';


const modules = firestore().collection('modules')

class firebaseAPI extends Component {
    constructor() {
        super()
        this.state = {
            moduleNameList : [],
            moduleList: [],
            selfDetail: {},
            events: [],
            managingPicker: []
        }
    }

    async getModuleList(){
        if (this.state.moduleNameList.length == 0) {
            console.log("Get Module List")
            await modules.doc("AllModules").get()
            .then(docSnapShot => {
                docSnapShot.data()['allModules'].forEach(mod => {
                    this.state.moduleNameList.push(mod)
                })
            })
            .catch(err => console.log(err))
        }
        return this.state.moduleNameList
    }

    async getStudentInfo() {
        await firestore().collection('users').doc(auth().currentUser.uid)
        .get()
        .then( docSnapShot => {
            Object.keys(docSnapShot.data()).forEach(key => {
                this.state.selfDetail[new String(key)] = docSnapShot.data()[new String(key)]
            })
        }).then(() => this.state.selfDetail.managing.forEach(code => this.insertManagingPicker(code)))
    }

    insertManagingPicker = (input) => {
       this.state.managingPicker.push({label: input,value: input})
    }

    async subscribeNewModule(newModule){
        var temp = []
        await modules.doc(newModule)
        .collection('Events')
        .get()
        .then(collectionSnapShot => {
            temp = collectionSnapShot.docs.map(x => Object(x.data()))
            .map(input => this.formatEvent(input))
        })
        this.setState({events: [...this.state.events, ...temp]})
        return temp
    }

    async addNewModule(input) {
        this.setState({moduleNameList: [...this.state.moduleNameList, input.name]})
    }

    formatEvent(input) {
        console.log(JSON.stringify(input))
        input.startDate = input.startDate.toDate()
        input.startTime = input.startTime.toDate()
        input.endDate = input.endDate.toDate()
        input.endTime = input.endTime.toDate()
        return input
    }

    async getEvents() {
        if (Object.keys(this.state.selfDetail).length == 0) {
            await this.getStudentInfo()
        }
        var temp = []
        var eventArr = []
        moduleInvolved = new Object(this.state.selfDetail.moduleInvolved)
        for (var i = 0; i < moduleInvolved.length; i++){
                await modules.doc(moduleInvolved[i])
                .collection('Events')
                .get()
                .then(collectionSnapShot => {
                    eventArr = collectionSnapShot.docs
                    .map(x => Object(x.data()))
                    .map(mod => this.formatEvent(mod))
                    temp = [...temp, ...eventArr]
                }).catch(err => {
                    console.log("Firebase API")
                    console.log(err)})
        }
        this.setState({events: temp})
        return temp
    }

    async getDetail() { 
        await this.getEvents()
        return this.state.events
    }

    async createModule(input) {
        if (this.state.moduleNameList.includes(input.code)){
            Alert.alert("Error", "Another Module with same code exists",
            [{text: 'Change Module Code', onPress: () => null}],
            {cancelable: false})
            return
        } else {
            const newModuleNames = [...this.state.moduleNameList, input.code]
            this.state.moduleNameList.push(input.code)
            modules.doc('AllModules').update({'allModules' : newModuleNames})
    
            modules.doc(input.code).set({
                code: input.code,
                name: input.name,
                description: input.description,
                createdBy: auth().currentUser.displayName,
                createdByID: auth().currentUser.uid,
                timeCreated: firestore.FieldValue.serverTimestamp(),
            }).catch(err => {
                console.log("Error at Firebase CreateModule")
                console.log(err)
            })
            input.reset()

            this.state.selfDetail.managing.push(input.code)
            this.insertManagingPicker(input.code)

            firestore().collection('users').doc(auth().currentUser.uid).update({managing: [...this.state.selfDetail.managing, input.code]})
        }
    }

    async getModuleSubscribed() {
        if(Object.keys(this.state.selfDetail).length == 0) {
            await this.getStudentInfo()
        }
        return this.state.selfDetail.moduleInvolved
    }

    async unsubscribeRecord(input) {
        await firestore().collection('users').doc(auth().currentUser.uid).update({moduleInvolved : input.moduleSubscribed })
        this.setState({events: input.eventList, moduleList: input.moduleSubscribed})
    }

    async deleteEvent(input) {
        var moduleName = input.eventDeleted.module
        var eventName = input.eventDeleted.title
    
        modules.doc(moduleName).collection('Events').doc(eventName).delete()
    
        this.setState({events : input.newEventList})
    }
    
    async createEvent(inputData) {
        var eventData = inputData.state
        if (!this.state.moduleNameList.includes(eventData.module)) {
            Alert.alert("Error", "Module does not exist")
            return false
        }
   
        await modules.doc(eventData.module).get()
        .then(async function(docSnapShot) {
            if (auth().currentUser.uid == docSnapShot.data().createdByID) {
                await firestore().collection('modules').doc(eventData.module)
                .collection('Events').doc(eventData.eventTitle)
                .set(eventData)
                .then(() => {
                    if (this.state.selfDetail.moduleInvolved.includes(eventData.code)){
                        Dashboard.addToEventList(eventData)
                    }
                    inputData.successMessage()
                })
                return true
            } else {
                Alert.alert("Error", "You are not authorised to create Event in this module")
                return false
            }
        }).then(() => {
        })
        .catch(err => console.log(err))
    }

    async updateInfo(inputData) {
        this.setState({events: inputData.newEventList})
        let modifiedEvent = inputData.modifiedEvent
        modules.doc(modifiedEvent.module).collection('Events').doc(modifiedEvent.eventTitle).update({
            startTime: modifiedEvent.startTime,
            endTime: modifiedEvent.endTime,
            location: modifiedEvent.location,
            extra_description: modifiedEvent.extra_description,
            startDate: modifiedEvent.startDate, 
            endDate: modifiedEvent.endDate,
        }).catch(err => console.log(err))
    }
}

const database = new firebaseAPI()

export default database