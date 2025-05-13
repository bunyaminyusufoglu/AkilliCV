import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import Header from '../components/Header';
import MyProfile from '../components/MyProfile';
import MyDetayProfile from '../components/MyDetayProfile'
import MyCV from '../components/MyCV'

const MyProfileScreen = () => {
  return (
    <View style={styles.container}>
      <Header />
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        bounces={true}
      >
        <MyProfile />
        <MyDetayProfile />
        <MyCV />
      </ScrollView>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  scrollView: {
    flex: 1,
    maxHeight: 600,
  },
  scrollContent: {
    padding: 10,
  }
});

export default MyProfileScreen;
