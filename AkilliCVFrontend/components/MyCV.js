import React, { useEffect, useState } from 'react';
import { View, Text, Alert, Button, TextInput, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as DocumentPicker from 'expo-document-picker';
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { API_BASE_URL } from '../config/api';

const MyCV = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [cvInfo, setCvInfo] = useState({ userId: '', filePath: '', fileName: '', uploadDate: '' });
  const [editingCV, setEditingCV] = useState(false);
  const [cvSelected, setCvSelected] = useState(false);
  const [loading, setLoading] = useState(false); // Yükleme durumunu ekliyoruz

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (!storedUserId) return Alert.alert('Hata', 'Kullanıcı ID bulunamadı');

        console.log('Kayıtlı User ID:', storedUserId);

        // CV Analysis verisini al
        const cvAnalysisRes = await axios.get(`${API_BASE_URL}/CvAnalysis/view/${storedUserId}`);
        const cvAnalysisData = cvAnalysisRes.data;

        // Eğer fileName varsa, cvInfo'yu güncelle
        if (cvAnalysisData && cvAnalysisData.fileName) {
          setCvInfo({
            userId: parseInt(storedUserId),
            filePath: cvAnalysisData.filePath || '',
            fileName: cvAnalysisData.fileName || '',
            uploadDate: cvAnalysisData.uploadDate || '',
          });
        }
      } catch (error) {
        console.error(error);
        Alert.alert('Hata', 'Profil verisi alınamadı');
      }
    };

    fetchData();
  }, []);

  const handleSelectPDF = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
        multiple: false,
      });
  
      if (result.assets && result.assets.length > 0) {
        const file = result.assets[0];
  
        let fileUri = file.uri;
  
        // Sadece Android veya iOS'ta gerçek dosya yolunu al
        if (Platform.OS !== 'web') {
          const fileInfo = await FileSystem.getInfoAsync(file.uri);
          fileUri = fileInfo.uri;
        }
  
        setSelectedFile({
          uri: fileUri,
          name: file.name,
          type: file.mimeType || 'application/pdf',
        });
  
        setCvSelected(true);
        setCvInfo((prev) => ({
          ...prev,
          filePath: fileUri,
          fileName: file.name,
        }));
      }
    } catch (error) {
      console.error('PDF seçme hatası:', error);
    }
  };

  const handleSaveCV = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
  
      if (!selectedFile) {
        Alert.alert('Hata', 'Lütfen bir CV dosyası seçin.');
        return;
      }
  
      let fileToUpload;
  
      if (Platform.OS === 'web') {
        const response = await fetch(selectedFile.uri);
        const blob = await response.blob();
  
        fileToUpload = new File([blob], selectedFile.name, { type: selectedFile.type });
        formData.append('file', fileToUpload);
      } else {
        // Android / iOS için
        formData.append('file', {
          uri: selectedFile.uri,
          name: selectedFile.name,
          type: selectedFile.type,
        });
      }
  
      const url = `${API_BASE_URL}/CvAnalysis/upload?userId=${cvInfo.userId}`;
  
      const response = await axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      if (response.status === 200) {
        Alert.alert('Başarılı', 'CV başarıyla yüklendi');
        setEditingCV(false);
      }
    } catch (error) {
      console.error('CV yükleme hatası detayları:', JSON.stringify(error.response?.data, null, 2));
      Alert.alert('Hata', 'CV yüklenemedi.');
    } finally {
      setLoading(false);
    }
  };
  
  

  return (
    <View style={{ padding: 20 }}>
      {/* CV Bilgileri */}
      <View
        style={{
          backgroundColor: '#ffffff',
          padding: 20,
          borderRadius: 12,
          marginVertical: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 4,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#333' }}>CV Bilgileri</Text>
          <TouchableOpacity onPress={() => setEditingCV(!editingCV)}>
            <Text style={{ fontSize: 16, color: '#3182ce', fontWeight: '600' }}>
              {editingCV ? 'İptal' : 'Düzenle'}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={{ fontSize: 16, marginBottom: 8 }}>
          {cvInfo.fileName || 'CV yüklenmedi'}
        </Text>

        {editingCV && (
          <View style={{ marginTop: 20 }}>
            {cvSelected ? (
              <Button title="Kaydet" onPress={handleSaveCV} color="#3182ce" disabled={loading} />
            ) : (
              <Button title="CV Yükle" onPress={handleSelectPDF} color="#3182ce" />
            )}
            {loading && <Text>Yükleniyor...</Text>}
          </View>
        )}
      </View>
    </View>
  );
};

export default MyCV;
