import React, { useEffect, useState } from 'react';
import { View, Text, Alert, Button, TextInput, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const MyDetayProfile = () => {
  const [details, setDetails] = useState({
    dateOfBirth: '', phoneNumber: '', education: '', workExperience: '',
    skills: '', languages: '', references: '', portfolioLink: '',
    desiredSalary: '', workTypePreference: ''
  });
  const [editingDetails, setEditingDetails] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (!storedUserId) return Alert.alert('Hata', 'Kullanıcı ID bulunamadı');

        console.log('Kayıtlı User ID:', storedUserId);

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
      if (!storedUserId) {
        Alert.alert('Hata', 'Kullanıcı ID bulunamadı');
        return;
      }

      const payload = {
        userId: storedUserId,
        dateOfBirth: details.dateOfBirth || '',
        phoneNumber: details.phoneNumber || '',
        email: details.email || '',
        education: details.education || '',
        workExperience: details.workExperience || '',
        skills: details.skills || '',
        languages: details.languages || '',
        references: details.references || '',
        portfolioLink: details.portfolioLink || '',
        desiredSalary: details.desiredSalary || '',
        workTypePreference: details.workTypePreference || '',
      };

      // Güncelleme işlemi
      const response = await axios.put(`http://localhost:5189/api/UserProfile/updateProfile/${storedUserId}`, payload);
      Alert.alert('Başarılı', 'Profil güncellendi');
      setEditingDetails(false);
    } catch (err) {
      console.error('Güncelleme hatası:', err);
      Alert.alert('Hata', 'Profil güncelleme başarısız');
    } finally {
      setLoading(false);
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
    <View>
      <View style={{ padding: 16 }}>
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
      </View>
    </View>
  );
};

export default MyDetayProfile;
