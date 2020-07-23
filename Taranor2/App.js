import * as React from 'react';
import {SafeAreaView} from 'react-native';
import CreateModule from './components/CreateModule';
import SignUp from './components/signup';
import Dashboard from './containers/DashBoard';
import CreateEvent from './containers/CreateEvent';
import SignIn from './containers/SignIn'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator} from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as colors from './colours'
import UpdateEvent from './components/UpdateEvent';
import ManagePermission from './components/ManagePermission';

const Stack = createStackNavigator();

const Tab = createBottomTabNavigator();

const StackTwo = createStackNavigator();

const StackThree = createStackNavigator();

function DashboardOverlay() {
 return (
  <StackTwo.Navigator 
    initialRouteName = 'Dashboard'
      screenOptions = {{
      headerTitleAlign: 'center',
      headerStyle:{
        backgroundColor:colors.darkblue
      },
      headerTintColor:'#fff',
      headerTitleStyle:{
        fontWeight: 'bold',
      }
    }}>

    <Stack.Screen 
      name = "Dashboard" 
      component = {Dashboard}  
      options = {
        {
        headerShown: false,
        animationEnabled: false,
        }
      }
    />

    <Stack.Screen
      name = "UpdateEvent"
      component = {UpdateEvent}
      options = {
        {
        headerShown: false,
        animationEnabled: false,
        }
      }
    />
  </StackTwo.Navigator>)
}


function Content() {
  return (
    <Tab.Navigator
    initialRouteName = "Dashboard"
    backBehavior = "history"
    lazy = {true}
    screenOptions = {({route}) => ({
      tabBarIcon: ({focused, color, size}) => {
        let iconName
        if (route.name === 'Dashboard') {
          iconName = focused 
          ? 'view-dashboard'
          : 'view-dashboard-outline'
        } else if (route.name == 'Create Module') {
          iconName = focused 
          ? 'alpha-m-box'
          : 'alpha-m-box-outline'
        } else if (route.name == 'Create Event') {
          iconName = focused 
          ? 'calendar'
          : 'calendar-outline'
        } else {
          iconName = focused 
          ? 'database-edit'
          : 'database-edit'
        }
        color = (focused) ? 'white' : 'black'
        return <MaterialCommunityIcons name = {iconName} size = {size} color = {color} />
      },
    })}
    tabBarOptions = {{
      activeTintColor: 'white',
      inactiveTintColor: 'gray',
      activeBackgroundColor: colors.darkblue,
      inactiveBackgroundColor: 'white',
      keyboardHidesTabBar: true,
    }}
    >
      <Tab.Screen name = "Dashboard" component = {DashboardOverlay}/>
      <Tab.Screen name = "Create Module" component = {CreateModule}/>
      <Tab.Screen name = "Create Event" component = {CreateEvent}/>
      <Tab.Screen name = "Manage" component = {ManagePermission}/>
    </Tab.Navigator>
  )
}

function ManageModule() {
  return (
    <StackThree.Navigator 
    initialRouteName = 'CreateModule'
      screenOptions = {{
      headerTitleAlign: 'center',
      headerStyle:{
        backgroundColor:colors.lightblue
      },
      headerTintColor:'#fff',
      headerTitleStyle:{
        fontWeight: 'bold',
      }
    }}>

    <Stack.Screen 
      name = "CreateModule" 
      component = {CreateModule}  
      options = {
        {
        headerShown: false,
        animationEnabled: false,
        }
      }
    />
    {/*
    <Stack.Screen
      name = "UpdateModule"
      component = {UpdateModule}
      options = {
        {
        headerShown: false,
        animationEnabled: false,
        }
      }
    />
    */}
  </StackThree.Navigator>)
}


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

      <Stack.Screen 
        name = "Content" 
        component = {Content}  
        options = {
          {headerShown: false}
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