import { React, Component } from "react";
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import { Alert } from "react-native";


const modules = firestore().collection('modules')

class firebaseAPI extends Component {
    constructor() {
        super()
        this.state = {
            moduleNameList : [],
            moduleList: [],
            selfDetail: {},
            events: [],
        }
    }

    async getModuleList(){
        if (this.state.moduleNameList.length == 0) {
            await modules.doc("AllModules").get()
            .then(docSnapShot => {
                docSnapShot.data()['allModules'].forEach(mod => {
                    this.state.moduleNameList.push(mod)
                })
            }).catch(err => console.log(err))

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
        })
    }

    async subscribeNewModule(newModule){
        var temp = []
        await modules.doc(newModule)
        .collection('Events')
        .get()
        .then(collectionSnapShot => {
            temp = collectionSnapShot.docs.map(x => Object(x.data()))
        })
        this.setState({events: [...this.state.events, ...temp]})
        return temp
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
                eventArr = collectionSnapShot.docs.map(x => Object(x.data()))
                temp = [...temp, ...eventArr]
            })
        }
        this.setState({events: temp})
        return temp
    }

    async getDetail() { 
        await this.getEvents()
        return this.state.events 
    }


    async getModuleSubscribed() {
        if(Object.keys(this.state.selfDetail).length == 0) {
            await this.getStudentInfo()
        }
        return this.state.selfDetail.moduleInvolved
    }

    async unsubscribeRecord(input) {
        firestore().collection('users').doc(auth().currentUser.uid).update({moduleInvolved : input.moduleSubscribed })
        this.setState({events: input.eventList, moduleList: input.moduleSubscribed})
    }

    //database.deleteEvent({newEventList : newEvents, eventDeleted:this.state.modalModule})
    async deleteEvent(input) {
        var moduleName = input.eventDeleted.module
        var eventName = input.eventDeleted.title

        console.log(eventName)

        modules.doc(moduleName).collection('Events').doc(eventName).delete().then(() => {
            console.log("Deleted")
        })

        this.setState({events : input.newEventList})
    }

    async createEvent(inputData) {
        var input = inputData.state
        if (!this.state.moduleNameList.includes(input.module)) {
            Alert.alert("Error", "Module does not exist")
            return false
        }

        await modules.doc(input.module).get()
        .then(async function(docSnapShot) {
            if (auth().currentUser.uid == docSnapShot.data().createdByID) {
                await firestore().collection('modules').doc(input.module)
                .collection('Events').doc(input.title)
                .set({
                    title : input.title,
                    startTime : input.startTime,
                    endTime : input.endTime,
                    location : input.location,
                    extra_description : input.extra_description,
                    date : input.date,
                    createdAt: firestore.FieldValue.serverTimestamp(),
                    createdBy: auth().currentUser.displayName,
                    module : input.module,
                    day: input.day
                }).then(() => {
                    Alert.alert("Successful", "You have successfully created " + input.module +  " " + input.title)
                })
                console.log("Done creating")
                inputData.function()
                return true
            } else {
                Alert.alert("Error", "You are not authorised to create Event in this module")
                return false
            }
        }).catch(err => console.log(err))

       return false
    }
}

const database = new firebaseAPI()

export default database