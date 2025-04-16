// /src/screens/HomeScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CVAnalizScreen = () => {
  return (
    <View style={styles.container}>
      <Text>CV Analiz Screen Content</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4f8',
  },
});

export default CVAnalizScreen;
