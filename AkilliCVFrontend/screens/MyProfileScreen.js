import React, { useEffect, useState } from 'react';
import { View, Text, Alert, ScrollView, KeyboardAvoidingView, Platform, Button, TextInput, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as DocumentPicker from 'expo-document-picker';
import Header from '../components/Header';

const MyProfileScreen = () => {
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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (!storedUserId) return Alert.alert('Hata', 'Kullanıcı ID bulunamadı');

        console.log('Kayıtlı User ID:', storedUserId);
        

        const userRes = await axios.get(`http://localhost:5189/api/Auth/profile/${storedUserId}`);
        const userData = userRes.data;
        setProfile({
          name: userData.name || '',
          surname: userData.surname || '',
          email: userData.email || '',
          password: userData.password || ''
        });

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

      if (result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        const formData = new FormData();
        formData.append('userId', cvInfo.userId);
        formData.append('file', {
          uri: Platform.OS === 'ios' ? file.uri.replace('file://', '') : file.uri,
          name: file.name,
          type: 'application/pdf',
        });

        await axios.post('http://192.168.0.115:5189/api/CV/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        Alert.alert('Başarılı', 'CV başarıyla yüklendi');
        setEditingCV(false);
        setCvInfo({
          ...cvInfo,
          filePath: file.uri,
          fileName: file.name,
          uploadDate: new Date().toISOString().slice(0, 10),
        });
      }
    } catch (error) {
      console.error('CV yükleme hatası:', error);
      Alert.alert('Hata', 'CV yüklenemedi');
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
          <View style={{ backgroundColor: '#fff', padding: 16, borderRadius: 10 }}>
            <View style={{ marginBottom: 12 }}>
              <Text style={{ fontSize: 18, fontWeight: '700' }}>CV Bilgileri</Text>
              <TouchableOpacity onPress={() => setEditingCV(!editingCV)}>
                <Text style={{ color: '#3182ce', fontWeight: '600' }}>
                  {editingCV ? 'İptal' : 'Düzenle'}
                </Text>
              </TouchableOpacity>
            </View>
            {cvInfo.fileName ? (
              <Text>CV Dosyası: {cvInfo.fileName}</Text>
            ) : (
              <Text>CV yüklenmedi</Text>
            )}
            {editingCV && (
              <>
                <TouchableOpacity onPress={handleSelectPDF} style={{ marginTop: 10 }}>
                  <Text style={{ color: '#3182ce' }}>CV Dosyası Seç</Text>
                </TouchableOpacity>
                {cvInfo.filePath && (
                  <Button
                    title={loading ? 'Kaydediliyor...' : 'CV\'yi Kaydet'}
                    onPress={handleUpdate}
                    disabled={loading}
                    color="#3182ce"
                    style={{ marginTop: 10 }}
                  />
                )}
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default MyProfileScreen;
