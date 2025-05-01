import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View } from 'react-native';

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
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      const userId = await AsyncStorage.getItem('userId');
      setInitialRoute(userId ? 'AnaSayfa' : 'Giris Yap');
    };
    checkUser();
  }, []);

  if (!initialRoute) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#3182ce" />
      </View>
    );
  }

  return (
    <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ header: () => <Header /> }}>
      <Stack.Screen name="Giris Yap" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Profilim" component={MyProfileScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Kaydol" component={RegisterScreen} options={{ headerShown: false }} />
      <Stack.Screen name="AnaSayfa" component={TabNavigator} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
