import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/Header';
import { useFocusEffect } from '@react-navigation/native';

const CVAnalizScreen = () => {
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState('');
  const [lastAnalysis, setLastAnalysis] = useState('');

  useEffect(() => {
    // Uygulama açıldığında son analiz varsa getir
    const fetchLastAnalysis = async () => {
      const savedAnalysis = await AsyncStorage.getItem('lastAnalysis');
      if (savedAnalysis) {
        setLastAnalysis(savedAnalysis);
      }
    };
    fetchLastAnalysis();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      // Sayfa her odaklandığında geçici analiz sonucu temizlenir
      setAnalysisResult('');
    }, [])
  );

  const analyzeCV = async () => {
    try {
      setLoading(true);

      const userId = await AsyncStorage.getItem('userId');

      const response = await fetch(`http://localhost:5189/api/AI/users/${userId}/analyze-cv`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const result = await response.json();  // JSON olarak alıyoruz

      if (response.ok) {
        // JSON'dan sadece analiz metnini alıyoruz
        const analysisText = result.candidates[0]?.content?.parts[0]?.text || 'Analiz sonucu bulunamadı';
        setAnalysisResult(analysisText);
        setLastAnalysis(analysisText);
        await AsyncStorage.setItem('lastAnalysis', analysisText);
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

        {analysisResult ? (
          <View style={styles.resultContainer}>
            <Text style={styles.sectionTitle}>Analiz Sonucu</Text>
            <ScrollView style={styles.scrollBox}>
              <Text style={styles.resultText}>{analysisResult}</Text>
            </ScrollView>
          </View>
        ) : null}

        {lastAnalysis && !analysisResult ? (
          <View style={styles.lastAnalysisContainer}>
            <Text style={styles.sectionTitle}>Son Analiz</Text>
            <ScrollView style={styles.scrollBox}>
              <Text style={styles.resultText}>{lastAnalysis}</Text>
            </ScrollView>
          </View>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f0f4f8',
    padding: 16,
  },
  circleButton: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    marginVertical: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  resultContainer: {
    marginTop: 20,
    width: '100%',
    backgroundColor: '#d0f0c0',
    padding: 12,
    borderRadius: 10,
  },
  lastAnalysisContainer: {
    marginTop: 20,
    width: '100%',
    backgroundColor: '#e6f0ff',
    padding: 12,
    borderRadius: 10,
  },
  scrollBox: {
    maxHeight: 200,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#007AFF',
  },
  resultText: {
    fontSize: 16,
    color: '#333',
  },
});

export default CVAnalizScreen;