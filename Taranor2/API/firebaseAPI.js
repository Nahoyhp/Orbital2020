import { React, Component } from "react";
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'


const modules = firestore().collection('modules')
const studentInfo = firestore().collection('users').doc(auth().currentUser.uid)

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
            //console.log("Retrieving Data")
            await modules.doc("AllModules").get()
            .then(docSnapShot => {
                docSnapShot.data()['allModules'].forEach(mod => {
                    this.state.moduleNameList.push(mod)
                })
            }).catch(err => console.log(err))

        } else {
            //console.log("Returning Cached Value")
        }
        return this.state.moduleNameList
    }

    async getStudentInfo() {
        //console.log("Loading info")
        await studentInfo.get().then( docSnapShot => {
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
            //console.log("Done getting Student Info")
        }
        var temp = []
        var eventArr = []
        //console.log("Getting Events")
        moduleInvolved = new Object(this.state.selfDetail.moduleInvolved)
        //console.log(moduleInvolved)
        for (var i = 0; i < moduleInvolved.length; i++){
            await modules.doc(moduleInvolved[i])
            .collection('Events')
            .get()
            .then(collectionSnapShot => {
                eventArr = collectionSnapShot.docs.map(x => Object(x.data()))
                temp = [...temp, ...eventArr]
                //console.log(temp)
            })
        }
        //this.setState({events : [...temp]})
        return temp
    }

    async getDetail() { 
        await this.getEvents()
        //console.log("Finally Done")
        return this.state.events 
    }


    async getModuleSubscribed() {
        if(Object.keys(this.state.selfDetail).length == 0) {
            await this.getStudentInfo()
        }
        return this.state.selfDetail.moduleInvolved
    }

}

const database = new firebaseAPI()

export default database