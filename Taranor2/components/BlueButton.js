import React from 'react'
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const BlueButton = props => (
  <TouchableOpacity style={[styles.container, props.style]} onPress={props.onPress}>
    <Text style={styles.text}>{props.title}</Text>
  </TouchableOpacity>
)

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white'
  },
  text: {
    fontSize: 20,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 5,
    color: 'black',
    textAlign: 'center'
  }
})

export default BlueButton
