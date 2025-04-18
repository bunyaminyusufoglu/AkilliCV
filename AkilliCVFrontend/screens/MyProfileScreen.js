import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Header from '../components/Header';

const MyProfileScreen = () => {
  const [profile, setProfile] = useState({
    name: '',
    surname: '',
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  // AsyncStorage'dan userId'yi al ve profili getir
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (storedUserId) {
          setUserId(storedUserId);
          const response = await axios.get(`https://senin-api-urlun.com/api/Auth/profile/${storedUserId}`);
          setProfile(response.data);
        } else {
          Alert.alert('Hata', 'Kullanıcı ID bulunamadı.');
        }
      } catch (error) {
        console.error('Profil alınırken hata:', error);
        Alert.alert('Hata', 'Profil bilgileri alınamadı.');
      }
    };

    fetchProfile();
  }, []);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await axios.put('https://senin-api-urlun.com/api/Auth/updateProfile', profile);
      Alert.alert('Başarılı', 'Profiliniz güncellendi.');
    } catch (error) {
      console.error('Güncelleme hatası:', error);
      Alert.alert('Hata', 'Profil güncellenemedi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Header />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>Ad</Text>
        <TextInput
          style={styles.input}
          value={profile.name}
          onChangeText={text => setProfile({ ...profile, name: text })}
        />

        <Text style={styles.label}>Soyad</Text>
        <TextInput
          style={styles.input}
          value={profile.surname}
          onChangeText={text => setProfile({ ...profile, surname: text })}
        />

        <Text style={styles.label}>E-posta</Text>
        <TextInput
          style={styles.input}
          value={profile.email}
          keyboardType="email-address"
          autoCapitalize="none"
          onChangeText={text => setProfile({ ...profile, email: text })}
        />

        <Text style={styles.label}>Şifre</Text>
        <TextInput
          style={styles.input}
          value={profile.password}
          secureTextEntry
          onChangeText={text => setProfile({ ...profile, password: text })}
        />

        <View style={styles.buttonContainer}>
          <Button
            title={loading ? "Güncelleniyor..." : "Güncelle"}
            onPress={handleUpdate}
            disabled={loading}
            color="#3182ce"
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f7f7f7',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    marginTop: 20,
  },
});

export default MyProfileScreen;
