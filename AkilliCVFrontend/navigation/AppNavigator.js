// /src/navigation/AppNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import JobSearchScreen from '../screens/JobSearchScreen';
import CVAnalizScreen from '../screens/CVAnalizScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import Header from '../components/Header';
import TabBar from '../components/TabBar';
import MyProfileScreen from '../screens/MyProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator tabBar={(props) => <TabBar {...props} />}>
      <Tab.Screen name="Ana Sayfa" component={HomeScreen} options={{ headerShown: false }} />
      <Tab.Screen name="İş İlanları" component={JobSearchScreen} options={{ headerShown: false }} />
      <Tab.Screen name="CV Analiz" component={CVAnalizScreen} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ header: () => <Header /> }}>

      <Stack.Screen name="My Profile" component={MyProfileScreen} options={{ headerShown: false }} />
      <Stack.Screen name="HomeTabs" component={TabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />

      
      
    </Stack.Navigator>
  );
}
