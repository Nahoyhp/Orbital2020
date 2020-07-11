import * as React from 'react';
import {SafeAreaView} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator} from '@react-navigation/stack';
import AddModules from './components/AddModuleList';
import SignUp from './components/signup';
import DashBoard from './containers/DashBoard';
import CreateEvent from './containers/CreateEvent';
import SignIn from './containers/SignIn'

const Stack = createStackNavigator();



function StackFn(){
  return(
    <Stack.Navigator 
      initialRouteName = 'SignIn'
        screenOptions = {{
        headerTitleAlign: 'center',
        headerStyle:{
          backgroundColor:"#45B39D"
        },
        headerTintColor:'#fff',
        headerTitleStyle:{
          fontWeight: 'bold',
        }
      }}>

      <Stack.Screen 
        name = "SignIn" 
        component = {SignIn}  
        options = {
          {headerShown: false}
        }
      />

      <Stack.Screen 
        name = "SignUp" 
        component = {SignUp}  
        options = {
          {headerShown: false}
        }
      />
    {/*
      <Stack.Screen 
        name = "Login" 
        component = {Login} 
        options = {{title: 'Login'}}
      />
    */}
      <Stack.Screen 
        name = "Dashboard" 
        component = {DashBoard} 
        options = {
          {title: 'Dashboard'},
          {headerLeft:null}
        }
      />

      <Stack.Screen 
        name = "AddModules" 
        component = {AddModules} 
        options = {
          {title: 'AddModules'},
          {headerLeft:null}
        }
      />

      <Stack.Screen 
        name = "CreateEvent" 
        component = {CreateEvent} 
        options = {
          {title: 'CreateEvent'},
          {headerLeft:null}
        }
      />

    </Stack.Navigator>
  )
}

export default function App() {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
        <NavigationContainer>
          <StackFn/>
        </NavigationContainer>
    </SafeAreaView>
  );
}


{/*
import React from 'react';
import { Button, View, Text } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator} from '@react-navigation/stack';

const TabA = createBottomTabNavigator();

function HomeScreen() {
  return (
    <TabA.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
     let iconName;
     if (route.name === 'TabA') {
        iconName = focused
        ? 'ios-information-circle'
        : 'ios-information-circle-outline';
      } else if (route.name === 'TabB') {
        iconName = focused
        ? 'ios-list-box'
        : 'ios-list';
      }
        return <Text>"Hello"</Text>;
        },
      })}
      tabBarOptions={{
      activeTintColor: 'tomato',
      inactiveTintColor: 'gray',
      }}
    >
        <TabA.Screen name="TabA" component={TabAScreen} />
        <TabA.Screen name="TabB" component={TabBScreen} />
    </TabA.Navigator>
  );
}

function NotificationsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>No New Notifications!</Text>
      <Button 
      onPress={() => navigation.goBack()}
      title="Go back home"
      />
    </View>
  );
}

const Stack = createStackNavigator();

function TabAScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="TabA Details" component={Details} />
      <Stack.Screen name="TabA Home" component={TabADetailsScreen} />
    </Stack.Navigator>
  );
}
function TabADetailsScreen({navigation}) {
  return (
    <View style={{ flex: 1, justifyContent: 'center',  alignItems: 'center' }}>
      <Text>
        Welcome to TabA page!
      </Text>
      <Button 
      onPress={() => navigation.navigate('TabA Details')}
      title="Go to TabA Details"
      />
    </View>
  );
}

function Details() {
  return (
    <View style={{ flex: 1, justifyContent: 'center',  alignItems: 'center' }}>
      <Text>
        TabA Details here!
      </Text>
    </View>
  );
}
function TabBScreen() {
  return (
    <View>
      <Text style={{textAlign: 'center', marginTop: 300}}>
        Welcome to TabB page!
      </Text>
    </View>
  );
}
const Drawer = createDrawerNavigator();


export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Notifications" component={NotificationsScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  )
}
*/}