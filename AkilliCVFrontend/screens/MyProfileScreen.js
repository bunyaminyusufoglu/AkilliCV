import React, { useEffect, useState } from 'react';
import { View, Text, Alert, ScrollView, KeyboardAvoidingView, Platform, Button, TextInput, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as DocumentPicker from 'expo-document-picker';
import Header from '../components/Header';
import MyProfile from '../components/MyProfile';
import MyDetayProfile from '../components/MyDetayProfile'
import MyCV from '../components/MyCV'

const MyProfileScreen = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [profile, setProfile] = useState({ name: '', surname: '', email: '', password: '' });
  const [details, setDetails] = useState({
    dateOfBirth: '', phoneNumber: '', education: '', workExperience: '',
    skills: '', languages: '', references: '', portfolioLink: '',
    desiredSalary: '', workTypePreference: ''
  });
  const [cvInfo, setCvInfo] = useState({ userId: '', filePath: '', fileName: '', uploadDate: '' });
  const [editingBasic, setEditingBasic] = useState(false);
  const [editingDetails, setEditingDetails] = useState(false);
  const [editingCV, setEditingCV] = useState(false);
  const [cvSelected, setCvSelected] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (!storedUserId) return Alert.alert('Hata', 'Kullanıcı ID bulunamadı');

        console.log('Kayıtlı User ID:', storedUserId);

        // Kullanıcı bilgilerini al
        const userRes = await axios.get(`http://localhost:5189/api/Auth/profile/${storedUserId}`);
        const userData = userRes.data;
        setProfile({
          name: userData.name || '',
          surname: userData.surname || '',
          email: userData.email || '',
          password: userData.password || ''
        });

        // Kullanıcı detaylarını al
        const detailsRes = await axios.get(`http://localhost:5189/api/UserProfile/getProfile/${storedUserId}`);
        const detailsData = detailsRes.data;
        setDetails({
          dateOfBirth: detailsData.dateOfBirth || '',
          phoneNumber: detailsData.phoneNumber || '',
          education: detailsData.education || '',
          workExperience: detailsData.workExperience || '',
          skills: detailsData.skills || '',
          languages: detailsData.languages || '',
          references: detailsData.references || '',
          portfolioLink: detailsData.portfolioLink || '',
          desiredSalary: detailsData.desiredSalary || '',
          workTypePreference: detailsData.workTypePreference || ''
        });

        setCvInfo({
          userId: storedUserId,
          filePath: detailsData.filePath || '',
          fileName: detailsData.fileName || '',
          uploadDate: detailsData.uploadDate || '',
        });

        // CV analysis verisini al
        const cvAnalysisRes = await axios.get(`http://localhost:5189/api/CvAnalysis/view/${storedUserId}`);
        const cvAnalysisData = cvAnalysisRes.data;

        // Eğer fileName varsa, cvInfo'yu güncelle
        if (cvAnalysisData && cvAnalysisData.fileName) {
          setCvInfo((prevState) => ({
            ...prevState,
            fileName: cvAnalysisData.fileName
          }));
        }

      } catch (error) {
        console.error(error);
        Alert.alert('Hata', 'Profil verisi alınamadı');
      }
    };

    fetchData();
  }, []);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const storedUserId = await AsyncStorage.getItem('userId');
      const profilePayload = { userId: storedUserId, ...details };

      const check = await axios.get(`http://localhost:5189/api/UserProfile/getProfile/${storedUserId}`);
      if (check.data) {
        await axios.put(`http://localhost:5189/api/UserProfile/updateProfile/${storedUserId}`, profilePayload);
        Alert.alert('Başarılı', 'Profil güncellendi');
      } else {
        await axios.post(`http://localhost:5189/api/UserProfile/createProfile`, profilePayload);
        Alert.alert('Başarılı', 'Profil oluşturuldu');
      }

      setEditingDetails(false);
    } catch (err) {
      console.error('Güncelleme hatası:', err);
      Alert.alert('Hata', 'Profil güncelleme başarısız');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPDF = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
        multiple: false,
      });

      console.log("Picker sonucu:", result);

      if (result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        setSelectedFile(file);
        setCvSelected(true); 
        setCvInfo(prev => ({
          ...prev,
          filePath: file.uri,
          fileName: file.name
        }));
      }
    } catch (error) {
      console.error('PDF seçme hatası:', error);
    }
  };

  const handleSaveCV = async () => {
    setLoading(true);  // Yükleme işlemini başlatıyoruz
    try {
      const formData = new FormData();
  
      // Eğer dosya seçildiğinde dosya path'i doğru alındıysa, formData'ya dosyayı ekleyelim
      if (selectedFile) {
        formData.append('userId', string(cvInfo.userId));  // Kullanıcı ID'sini ekliyoruz
        formData.append('file', {
          uri: selectedFile.uri,  // Dosya URI'si
          name: selectedFile.name,  // Dosya adı
          type: selectedFile.mimeType || 'application/pdf',  // Dosya türü
        });
  
        // API'ye dosya yükleme isteği gönderiyoruz
        const response = await axios.post('http://localhost:5189/api/CvAnalysis/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
  
        if (response.status === 200) {
          Alert.alert('Başarılı', 'CV başarıyla yüklendi');
          setEditingCV(false);  // Düzenleme modunu kapatıyoruz
        }
      } else {
        Alert.alert('Hata', 'Lütfen bir CV dosyası seçin.');
      }
    } catch (error) {
      console.error('CV yükleme hatası:', error);
      Alert.alert('Hata', 'CV yüklenemedi');
    } finally {
      setLoading(false);  // Yükleme işlemi tamamlandı
    }
  };
  

  const renderInputOrText = (label, value, key, editing, setState) => (
    <View style={{ width: '48%', marginBottom: 15 }} key={key}>
      <Text style={{ fontWeight: '500' }}>{label}</Text>
      {editing ? (
        <TextInput
          style={{
            borderWidth: 1,
            borderRadius: 6,
            padding: 10,
            fontSize: 16,
            borderColor: '#ddd',
            marginTop: 5,
          }}
          value={value}
          onChangeText={(text) => setState(prev => ({ ...prev, [key]: text }))} 
        />
      ) : (
        <Text style={{ fontSize: 16, marginTop: 5 }}>{value || '-'}</Text>
      )}
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <Header />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 80, backgroundColor: '#f7f7f7' }}>
          <MyProfile />
          <MyDetayProfile />
          <MyCV />
        </ScrollView>
      </KeyboardAvoidingView>

      
    </View>
  );
};

export default MyProfileScreen;
