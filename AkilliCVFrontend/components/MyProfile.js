import React, { useEffect, useState } from 'react';
import { View, Text, Alert, ScrollView, ActivityIndicator, TextInput, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const MyProfile = () => {
  const [profile, setProfile] = useState({ name: '', surname: '', email: '', password: '' });
  const [editingBasic, setEditingBasic] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (!storedUserId) return Alert.alert('Hata', 'Kullanıcı ID bulunamadı');

        setUserId(storedUserId);

        const userRes = await axios.get(`http://localhost:5189/api/Auth/profile/${storedUserId}`);
        const userData = userRes.data;

        setProfile({
          name: userData.name || '',
          surname: userData.surname || '',
          email: userData.email || '',
          password: userData.password || ''
        });
      } catch (error) {
        console.error(error);
        Alert.alert('Hata', 'Profil verisi alınamadı');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSave = async () => {
    try {
      if (!userId) return;

      await axios.put(`http://localhost:5189/api/Auth/updateProfile/${userId}`, profile);
      Alert.alert('Başarılı', 'Profil bilgileri güncellendi');
      setEditingBasic(false);
    } catch (error) {
      console.error(error);
      Alert.alert('Hata', 'Profil güncellenemedi');
    }
  };

  const renderInputOrText = (label, value, key, editing, setState) => (
    <View style={{ width: '48%', marginBottom: 15 }} key={key}>
      <Text style={{ fontWeight: '500' }}>{label}</Text>
      {editing ? (
        <TextInput
          secureTextEntry={key === 'password'}
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
        <Text style={{ fontSize: 16, marginTop: 5 }}>
          {key === 'password' ? '******' : value || '-'}
        </Text>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#3182ce" />
        <Text style={{ marginTop: 10 }}>Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
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
          {renderInputOrText('Şifre', profile.password, 'password', editingBasic, setProfile)}
        </View>

        {editingBasic && (
          <TouchableOpacity
            style={{
              marginTop: 10,
              backgroundColor: '#3182ce',
              padding: 12,
              borderRadius: 8,
              alignItems: 'center',
            }}
            onPress={handleSave}
          >
            <Text style={{ color: '#fff', fontWeight: '600' }}>Kaydet</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

export default MyProfile;
