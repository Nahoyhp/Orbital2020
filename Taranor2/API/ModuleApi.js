import { React, Component } from "react";
import firestore from '@react-native-firebase/firestore'


class moduleAPI extends Component {
    constructor() {
        super()
        this.state = {
            moduleList: []
        }
    }

    getModuleList = async (updateFunction) => {
        if (this.state.moduleList.length == 0) {
            await firestore().collection("modules").get().then(
                collectionSnap => {
                    collectionSnap.docs.forEach(
                    mod => {
                        console.log(mod.data()['code'])
                        this.state.moduleList.push(mod.data())
                    }
                )
                console.log()
                updateFunction(this.state.moduleList)
                }
            )

        } else {
            console.log("Returned cached value")
        }
        return this.state.moduleList
    }
}

const moduleApi = new moduleAPI()

export default moduleApi