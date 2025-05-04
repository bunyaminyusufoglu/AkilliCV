import React, { useEffect, useState } from 'react';
import { View, Text, Alert, ScrollView, KeyboardAvoidingView, Platform, Button, TextInput, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as DocumentPicker from 'expo-document-picker';
import Header from '../components/Header';

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
        formData.append('userId', cvInfo.userId);  // Kullanıcı ID'sini ekliyoruz
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
          {/* Temel Bilgiler */}
          <View style={{ backgroundColor: '#fff', padding: 16, borderRadius: 10, marginBottom: 20 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
              <Text style={{ fontSize: 18, fontWeight: '700' }}>Temel Bilgiler</Text>
              <TouchableOpacity onPress={() => setEditingBasic(!editingBasic)}>
                <Text style={{ color: '#3182ce', fontWeight: '600' }}>
                  {editingBasic ? 'İptal' : 'Düzenle'}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
              {renderInputOrText('Ad', profile.name, 'name', editingBasic, setProfile)}
              {renderInputOrText('Soyad', profile.surname, 'surname', editingBasic, setProfile)}
              {renderInputOrText('E-posta', profile.email, 'email', editingBasic, setProfile)}
              {renderInputOrText('Şifre', '******', 'password', false, () => {})}
            </View>
          </View>

          {/* Detaylı Bilgi */}
          <View style={{ backgroundColor: '#fff', padding: 16, borderRadius: 10, marginBottom: 20 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
              <Text style={{ fontSize: 18, fontWeight: '700' }}>Detaylı Bilgi</Text>
              <TouchableOpacity onPress={() => setEditingDetails(!editingDetails)}>
                <Text style={{ color: '#3182ce', fontWeight: '600' }}>
                  {editingDetails ? 'İptal' : 'Düzenle'}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
              {renderInputOrText('Doğum Tarihi', details.dateOfBirth, 'dateOfBirth', editingDetails, setDetails)}
              {renderInputOrText('Telefon Numarası', details.phoneNumber, 'phoneNumber', editingDetails, setDetails)}
              {renderInputOrText('Eğitim', details.education, 'education', editingDetails, setDetails)}
              {renderInputOrText('İş Deneyimi', details.workExperience, 'workExperience', editingDetails, setDetails)}
              {renderInputOrText('Yetenekler', details.skills, 'skills', editingDetails, setDetails)}
              {renderInputOrText('Diller', details.languages, 'languages', editingDetails, setDetails)}
              {renderInputOrText('Referanslar', details.references, 'references', editingDetails, setDetails)}
              {renderInputOrText('Portfolyo Linki', details.portfolioLink, 'portfolioLink', editingDetails, setDetails)}
              {renderInputOrText('Talep Edilen Maaş', details.desiredSalary, 'desiredSalary', editingDetails, setDetails)}
              {renderInputOrText('Çalışma Tercihi', details.workTypePreference, 'workTypePreference', editingDetails, setDetails)}
            </View>
            {editingDetails && (
              <View style={{ marginTop: 20 }}>
                <Button
                  title={loading ? 'Kaydediliyor...' : 'Kaydet'}
                  onPress={handleUpdate}
                  disabled={loading}
                  color="#3182ce"
                />
              </View>
            )}
          </View>

          {/* CV Bilgileri */}
          <View style={{
            backgroundColor: '#ffffff',
            padding: 20,
            borderRadius: 12,
            marginVertical: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 4,
          }}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 16,
            }}>
              <Text style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: '#333',
              }}>
                CV Bilgileri
              </Text>
              <TouchableOpacity onPress={() => setEditingCV(!editingCV)}>
                <Text style={{
                  fontSize: 16,
                  color: '#3182ce',
                  fontWeight: '600',
                }}>
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
                  <Button title="Kaydet" onPress={handleSaveCV} color="#3182ce" />
                ) : (
                  <Button title="CV Yükle" onPress={handleSelectPDF} color="#3182ce" />
                )}
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default MyProfileScreen;
