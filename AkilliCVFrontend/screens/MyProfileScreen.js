import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, Button, StyleSheet,
  Alert, TouchableOpacity, KeyboardAvoidingView, Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Header from '../components/Header';
import * as DocumentPicker from 'expo-document-picker';

const MyProfileScreen = () => {
  const [profile, setProfile] = useState({
    name: '',
    surname: '',
    email: '',
    password: '',
  });

  const [details, setDetails] = useState({
    dateOfBirth: '',
    phoneNumber: '',
    education: '',
    workExperience: '',
    skills: '',
    languages: '',
    references: '',
    portfolioLink: '',
    desiredSalary: '',
    workTypePreference: '',
  });

  const [cvInfo, setCvInfo] = useState({
    userId: '',
    filePath: '',
    fileName: '',
    uploadDate: '',
  });

  const [editingBasic, setEditingBasic] = useState(false);
  const [editingDetails, setEditingDetails] = useState(false);
  const [editingCV, setEditingCV] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (storedUserId) {
          const response = await axios.get(`https://senin-api-urlun.com/api/Auth/profile/${storedUserId}`);
          const data = response.data;
          setProfile({
            name: data.name,
            surname: data.surname,
            email: data.email,
            password: data.password,
          });
          setDetails({
            dateOfBirth: data.dateOfBirth || '',
            phoneNumber: data.phoneNumber || '',
            education: data.education || '',
            workExperience: data.workExperience || '',
            skills: data.skills || '',
            languages: data.languages || '',
            references: data.references || '',
            portfolioLink: data.portfolioLink || '',
            desiredSalary: data.desiredSalary || '',
            workTypePreference: data.workTypePreference || '',
          });
          setCvInfo({
            userId: storedUserId,
            filePath: data.filePath || '',
            fileName: data.fileName || '',
            uploadDate: data.uploadDate || '',
          });
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
      const payload = { ...profile, ...details };
      await axios.put('https://senin-api-urlun.com/api/Auth/updateProfile', payload);
      Alert.alert('Başarılı', 'Profiliniz güncellendi.');
      setEditingBasic(false);
      setEditingDetails(false);
    } catch (error) {
      console.error('Güncelleme hatası:', error);
      Alert.alert('Hata', 'Profil güncellenemedi.');
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

        await axios.post('https://senin-api-urlun.com/api/CV/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        Alert.alert('Başarılı', 'CV başarıyla güncellendi.');
        setEditingCV(false);
        setCvInfo({
          ...cvInfo,
          filePath: file.uri,
          fileName: file.name,
          uploadDate: new Date().toISOString().slice(0, 10),
        });
      }
    } catch (error) {
      console.error('PDF yükleme hatası:', error);
      Alert.alert('Hata', 'CV güncellenemedi.');
    }
  };

  const renderInputOrText = (label, value, key, isEditing) => (
    <View style={styles.infoRow} key={key}>
      <Text style={styles.infoLabel}>{label}</Text>
      {isEditing ? (
        <TextInput
          style={styles.infoInput}
          value={value}
          onChangeText={(text) => setDetails({ ...details, [key]: text })}
        />
      ) : (
        <Text style={styles.infoValue}>{value || '-'}</Text>
      )}
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <Header />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.container}>
          {/* Temel Bilgiler Kutusu */}
          <View style={styles.box}>
            <View style={styles.boxHeader}>
              <Text style={styles.boxTitle}>Temel Bilgiler</Text>
              <TouchableOpacity onPress={() => setEditingBasic(!editingBasic)}>
                <Text style={styles.editButton}>{editingBasic ? 'İptal' : 'Düzenle'}</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.label}>Ad</Text>
            {editingBasic ? (
              <TextInput
                style={styles.input}
                value={profile.name}
                onChangeText={(text) => setProfile({ ...profile, name: text })}
              />
            ) : (
              <Text style={styles.text}>{profile.name}</Text>
            )}

            <Text style={styles.label}>Soyad</Text>
            {editingBasic ? (
              <TextInput
                style={styles.input}
                value={profile.surname}
                onChangeText={(text) => setProfile({ ...profile, surname: text })}
              />
            ) : (
              <Text style={styles.text}>{profile.surname}</Text>
            )}

            <Text style={styles.label}>E-posta</Text>
            {editingBasic ? (
              <TextInput
                style={styles.input}
                value={profile.email}
                onChangeText={(text) => setProfile({ ...profile, email: text })}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            ) : (
              <Text style={styles.text}>{profile.email}</Text>
            )}

            <Text style={styles.label}>Şifre</Text>
            {editingBasic ? (
              <TextInput
                style={styles.input}
                value={profile.password}
                onChangeText={(text) => setProfile({ ...profile, password: text })}
                secureTextEntry
              />
            ) : (
              <Text style={styles.text}>******</Text>
            )}

            {editingBasic && (
              <View style={styles.buttonContainer}>
                <Button
                  title={loading ? 'Kaydediliyor...' : 'Kaydet'}
                  onPress={handleUpdate}
                  disabled={loading}
                  color="#3182ce"
                />
              </View>
            )}
          </View>

          {/* Detaylı Bilgiler Kutusu */}
          <View style={styles.box}>
            <View style={styles.boxHeader}>
              <Text style={styles.boxTitle}>Detaylı Bilgiler</Text>
              <TouchableOpacity onPress={() => setEditingDetails(!editingDetails)}>
                <Text style={styles.editButton}>{editingDetails ? 'İptal' : 'Düzenle'}</Text>
              </TouchableOpacity>
            </View>
            {renderInputOrText('Doğum Tarihi', details.dateOfBirth, 'dateOfBirth', editingDetails)}
            {renderInputOrText('Telefon Numarası', details.phoneNumber, 'phoneNumber', editingDetails)}
            {renderInputOrText('Eğitim', details.education, 'education', editingDetails)}
            {renderInputOrText('İş Deneyimi', details.workExperience, 'workExperience', editingDetails)}
            {renderInputOrText('Yetenekler', details.skills, 'skills', editingDetails)}
            {renderInputOrText('Diller', details.languages, 'languages', editingDetails)}
            {renderInputOrText('Referanslar', details.references, 'references', editingDetails)}
            {renderInputOrText('Portföy Linki', details.portfolioLink, 'portfolioLink', editingDetails)}
            {renderInputOrText('Beklenen Maaş', details.desiredSalary, 'desiredSalary', editingDetails)}
            {renderInputOrText('Çalışma Tercihi', details.workTypePreference, 'workTypePreference', editingDetails)}

            {editingDetails && (
              <View style={styles.buttonContainer}>
                <Button
                  title={loading ? 'Kaydediliyor...' : 'Kaydet'}
                  onPress={handleUpdate}
                  disabled={loading}
                  color="#3182ce"
                />
              </View>
            )}
          </View>

          {/* CV Bilgileri Kutusu */}
          <View style={styles.box}>
            <View style={styles.boxHeader}>
              <Text style={styles.boxTitle}>CV Bilgileri</Text>
              <TouchableOpacity onPress={() => setEditingCV(!editingCV)}>
                <Text style={styles.editButton}>{editingCV ? 'İptal' : 'Düzenle'}</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.label}>CV Önizlemesi:</Text>
            <Text style={styles.text}>{cvInfo.fileName ? `Ad: ${cvInfo.fileName}` : '-'}</Text>
            <Text style={styles.label}>Yükleme Tarihi:</Text>
            <Text style={styles.text}>{cvInfo.uploadDate || '-'}</Text>

            {editingCV && (
              <View style={styles.buttonContainer}>
                <Button
                  title="Yeni CV Yükle (PDF)"
                  onPress={handleSelectPDF}
                  color="#3182ce"
                />
              </View>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 80,
    backgroundColor: '#f7f7f7',
  },
  box: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  boxHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  boxTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  editButton: {
    color: '#3182ce',
    fontWeight: '600',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginVertical: 5,
  },
  input: {
    borderColor: '#ddd',
    borderWidth: 1,
    padding: 10,
    borderRadius: 6,
    fontSize: 16,
    marginBottom: 15,
  },
  text: {
    fontSize: 16,
    marginBottom: 15,
  },
  infoRow: {
    marginBottom: 10,
  },
  infoLabel: {
    fontWeight: '500',
  },
  infoInput: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    fontSize: 16,
    borderColor: '#ddd',
    marginTop: 5,
  },
  infoValue: {
    fontSize: 16,
    marginTop: 5,
  },
  buttonContainer: {
    marginTop: 20,
  },
});

export default MyProfileScreen;
