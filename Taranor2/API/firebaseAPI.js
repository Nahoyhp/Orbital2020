import { React, Component } from "react";
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import { Alert } from "react-native";
import * as Dashboard from "../containers/DashBoard";
import { genTimeBlock } from 'react-native-timetable';
import * as CreateEvent from "../containers/CreateEvent";


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
        .catch(err => console.log("Error @ getStudentInfo"))
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

    getManaging() {
        return this.state.selfDetail.managing
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

    async createGroup(input) {
        modules.doc(input.code).get().then(docSnapShot => {
            if (docSnapShot.exists) {
                Alert.alert("Error", "Group with same group ID exists")
            } else {
                const newManaging = [...this.state.selfDetail.managing, input.code].sort()

                //Update User information
                firestore().collection('users').doc(auth().currentUser.uid).update({
                    "moduleInvolved": [...this.state.selfDetail.moduleInvolved,input.code],
                    "managing" : newManaging
                })
                
                //Create New Module
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

                //Update local data
                this.state.selfDetail.managing.push(input.code)
                this.state.selfDetail.moduleInvolved.push(input.code)
                this.setState({
                    moduleNameList: newModuleNames,
                    selfDetail : this.state.selfDetail
                })

                //Update the dropdown on CreateEvent
                CreateEvent.update(newManaging)
            }       
        }).catch(err => {
            console.log("Error @ Firebase createGroup")
            console.log(err)
        })
    }

    async createModule(input) {
        if (this.state.moduleNameList.includes(input.code)){
            Alert.alert("Error", "Another Module with same code exists",
            [{text: 'Change Module Code', onPress: () => null}],
            {cancelable: false})
            return
        } else {
            const newModuleNames = [...this.state.moduleNameList, input.code]
            const newManaging = [...this.state.selfDetail.managing, input.code].sort()

            //Update user information
            firestore().collection('users').doc(auth().currentUser.uid).update({
                "moduleInvolved": [...this.state.selfDetail.moduleInvolved,input.code],
                "managing" : newManaging
            })

            //Update list of AllModules
            modules.doc('AllModules').update({'allModules' : newModuleNames})
    
            //Create New Module
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

            //Reset the CreateGroup Page
            input.reset()

            //Update local data
            this.state.selfDetail.managing.push(input.code)
            this.state.selfDetail.moduleInvolved.push(input.code)
            this.setState({
                moduleNameList: newModuleNames,
                selfDetail : this.state.selfDetail
            })

            //Update the dropdown on CreateEvent
            CreateEvent.update(newManaging)

        }
    }

    async deleteModule(inputData){
        //console.log("at UMFU function")
        var input = inputData.moduleCode
        var newState = this.state.selfDetail.managing.filter(x => {return x != input})
        this.setState({
            moduleList: this.state.modueList
        })
        //console.log("Done")
        //delete module Name if on array of users
        const userRefs = firestore().collection('users').where("moduleInvolved","array-contains",input)
        const userRefs2 = firestore().collection('users').where("managing","array-contains",input)
        //firestore().collection('users').where("email","==","jj1@gmail.com")
        //delete all events
        firestore().collection('modules').doc(input).collection('Events')
        .get()
        .then(res => {
            res.forEach(element => {
                element.ref.delete();
            })
        }).catch(err => {
            console.log("Error: " ,err);
        })
        //remove module from users subscribed to it
        userRefs
        .get()
        .then(snapshots => {
            snapshots.forEach( doc => {
                doc.ref.update({"moduleInvolved": firestore.FieldValue.arrayRemove(input)})
                doc.ref.update({"managing": firestore.FieldValue.arrayRemove(input)})
                //console.log(doc.id, "=>", doc.data());
                //console.log("users removed deleted")
            });
        }).then( () => {
            Alert.alert("Delete Successful", "Module has been deleted",
            [{text: 'Hello World', onPress: () => inputData.function(inputData.newList)},],
            {cancelable: false})

            firestore().collection('modules').doc("AllModules").update({
                "allModules": database.state.moduleNameList.filter(x => {
                    return x != input
                })
            }).then(() => {this.setState({module: '',
            showCheck: false,
            confirmInput: '',
            selected: false,})})

        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        });
        userRefs2
        .get()
        .then(snapshots => {
            snapshots.forEach( doc => {
                doc.ref.update({"managing": firestore.FieldValue.arrayRemove(input)})
                console.log(doc.id, "=>", doc.data());
                console.log("users removed deleted")
            });
        }).catch(function(error) {
            console.log("Error getting documents: ", error);
        });
        //delete module
        firestore().collection('modules').doc(input).delete()
        //remove current user from managing this module
    }
    

    async createEvent(inputData) {
        var eventData = inputData.state

        this.state.selfDetail.managing.push(eventData.module)
   
        if (this.state.selfDetail.managing.includes(eventData.module)) {
            await firestore().collection('modules').doc(eventData.module)
            .collection('Events').doc(eventData.eventTitle)
            .set(eventData)
            .then(() => {
                Dashboard.addToEventList(eventData)
                inputData.successMessage()
            })
            return true
        } else {
            Alert.alert("Error", "You are not authorised to create Event in this module")
            return false
        }

    }

    //update Event Information
    async updateInfo(inputData) {
        this.setState({events: inputData.newEventList})
        let modifiedEvent = inputData.modifiedEvent
        modules.doc(modifiedEvent.module).collection('Events').doc(modifiedEvent.eventTitle).update({
            day: modifiedEvent.day,
            endDate: modifiedEvent.endDate,
            endTime: modifiedEvent.endTime,
            extra_description: modifiedEvent.extra_description,
            location: modifiedEvent.location,
            startDate: modifiedEvent.startDate, 
            startTime: modifiedEvent.startTime,
        }).catch(err => console.log(err))
    }
    
    async addUserToGroup(inputData) {
        var newUser = inputData.user
        var code = inputData.code

        await firestore().collection('users').doc(newUser).get().then(docSnapShot => {
            return docSnapShot.data()
        }).then(inputData => {
            var input = inputData.moduleInvolved
            if (input.includes(code)){
                Alert.alert("Error", "User is already subscribed to " + code)
                return
            }
            firestore().collection('users').doc(newUser).update({
                moduleInvolved: [...input, code].sort()
            })
            Alert.alert("Successful", "You have added " + inputData.name + " (UID: " + newUser + ") to " + code)
        })
        .catch(err => {
            console.log("@Firebase API addUserToGroup")
            console.log(err)
        })
    }

    async deleteEvent(input) {
        var moduleName = input.eventDeleted.module
        var eventName = input.eventDeleted.eventTitle
    
        modules.doc(moduleName).collection('Events').doc(eventName).delete()
    
        this.setState({events : input.newEventList})
    }

}

const database = new firebaseAPI()

export default database