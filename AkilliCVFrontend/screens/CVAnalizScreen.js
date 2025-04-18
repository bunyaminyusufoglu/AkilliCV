import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import Header from '../components/Header';

const CVAnalizScreen = () => {
  const [loading, setLoading] = useState(false);
  const userId = 1; // örnek kullanıcı id, login'den çekiyorsan buraya ekle

  const analyzeCV = async () => {
    try {
      setLoading(true);

      const response = await fetch(`http://192.168.1.105:5189/api/CV/analyzeCV?userId=${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const result = await response.text();

      if (response.ok) {
        Alert.alert('Analiz Başarılı', result);
      } else {
        Alert.alert('Hata', result || 'CV analizi başarısız oldu.');
      }
    } catch (error) {
      Alert.alert('Hata', 'Sunucuya bağlanırken bir hata oluştu.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (

    <View style={{ flex: 1 }}>
      <Header />
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.circleButton}
          onPress={analyzeCV}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="large" />
          ) : (
            <Text style={styles.buttonText}>Analizi Başlat</Text>
          )}
        </TouchableOpacity>
      </View>
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
  circleButton: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default CVAnalizScreen;

