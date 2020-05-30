import * as React from 'react';
import { StyleSheet, SafeAreaView, Text, View,Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator} from '@react-navigation/stack';
//import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
//import SignUpContainer from './containers/SignUpContainer';
//import UserListContainer from './containers/UserListContainer';
import AddModules from './components/AddModuleList';
import SignUp from './components/signup';
import Login from './components/login';
import Dashboard from './components/dashboard';
//const Tab = createBottomTabNavigator();

const Stack = createStackNavigator();


function StackFn(){
  return(
    <Stack.Navigator 
      initialRouteName = 'Login'
        screenOptions = {{
        headerTitleAlign: 'left',
        headerStyle:{
          backgroundColor:"#00ffff"
        },
        headerTintColor:'#fff',
        headerTitleStyle:{
          fontWeight: 'bold',
        },
      }}>
      <Stack.Screen 
        name = "SignUp" 
        component = {SignUp} 
        options = {
          {title: 'SignUp'},
          {headerLeft:null}
        }
      />
      
      <Stack.Screen 
        name = "Login" 
        component = {Login} 
        options = {{title: 'Login'}}
      />
      
      <Stack.Screen 
        name = "Dashboard" 
        component = {Dashboard} 
        options = {
          {title: 'Dashboard'},
          {headerLeft:null}
        }
      />

      <Stack.Screen 
        name = "AddModule" 
        component = {AddModules} 
        options = {
          {title: 'AddModule'},
          {headerLeft:null}
        }
      />
    </Stack.Navigator>
  )
}

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
        <NavigationContainer>
          <StackFn/>
        </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});