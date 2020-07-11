import { React, Component } from "react";
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'


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

}

const database = new firebaseAPI()

export default database