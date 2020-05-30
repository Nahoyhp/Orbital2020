import React from 'react';
import { FlatList, ActivityIndicator, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import firebaseDb from '../database/config'


class UserListContainer extends React.Component {
  state = {
    isLoading: true,
    users: null
  }

  componentDidMount() {
    this.updateUserList()
  }

  updateUserList = () => firebaseDb.firestore().collection('users').get().then(querySnapshot => {
    const results = []
    querySnapshot.docs.map(documentSnapshot => results.push({
      ...documentSnapshot.data(),
      id: documentSnapshot.id}))
    this.setState({isLoading: false, users: results})
  }).catch(err => console.error(err))

  handleUpdateUser = () => firebaseDb.firestore().collection('users')
    .doc(user_id)
    .set({email: new_email, name: new_name, password: new_password})
    .then(() => this.updateUserList())
    .catch(err => console.error(err))

  handleDeleteUser = id => firebaseDb.firestore().collection('users').doc(id).delete()
    .then(() => this.updateUserList()).catch(err => console.error(err))

  confirmDelete = (id) => {
    Alert.alert('Delete User',
      'Delete this user?',
      [
        {text: "Yes", onPress: () => this.handleDeleteUser(id)},
        {text: "Cancel"}
      ],
      {
        cancellable: true
      })
  }

  render() {
    const { isLoading, users } = this.state

    if (isLoading)
      return <ActivityIndicator />

    return(
      <FlatList
        data={users}
        renderItem={({item}) => (
          <TouchableOpacity style={styles.itemContainer} onPress={() => this.confirmDelete(item.id)}>
            <Text>{item.name}</Text>
            <Text>{item.email}</Text>
          </TouchableOpacity>
        )}
        style={styles.container}
        keyExtractor={item => item.email}
      />
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 20
  },
  itemContainer: {
    paddingVertical: 10
  }
})

export default UserListContainer
