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
    const fetchProfile = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (storedUserId) {
          // Fetch basic profile info
          const profileResponse = await axios.get(`http://192.168.0.115:5189/api/Auth/profile/${storedUserId}`);
          const profileData = profileResponse.data;
          setProfile({ name: profileData.name, surname: profileData.surname, email: profileData.email, password: profileData.password });

          // Fetch detailed profile info
          const detailsResponse = await axios.get(`http://192.168.0.115:5189/api/UserProfile/getProfile/${storedUserId}`);
          const detailsData = detailsResponse.data;
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

          // Fetch CV info
          setCvInfo({
            userId: storedUserId,
            filePath: detailsData.filePath || '',
            fileName: detailsData.fileName || '',
            uploadDate: detailsData.uploadDate || '',
          });
        } else {
          Alert.alert('Error', 'User ID not found');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        Alert.alert('Error', 'Could not fetch profile information');
      }
    };

    fetchProfile();
  }, []);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const storedUserId = await AsyncStorage.getItem('userId');
      const profilePayload = { userId: storedUserId, ...details };

      // Check if profile exists, then update or create
      const checkResponse = await axios.get(`http://192.168.0.115:5189/api/UserProfile/getProfile/${storedUserId}`);
      const existingProfile = checkResponse.data;

      if (existingProfile) {
        await axios.put(`http://192.168.0.115:5189/api/UserProfile/updateProfile/${storedUserId}`, profilePayload);
        Alert.alert('Success', 'Profile updated');
      } else {
        await axios.post('http://192.168.0.115:5189/api/UserProfile/createProfile', profilePayload);
        Alert.alert('Success', 'Profile created');
      }

      setEditingBasic(false);
      setEditingDetails(false);
    } catch (error) {
      console.error('Update error:', error);
      Alert.alert('Error', 'Profile could not be updated or created');
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

        Alert.alert('Success', 'CV uploaded successfully');
        setEditingCV(false);
        setCvInfo({
          ...cvInfo,
          filePath: file.uri,
          fileName: file.name,
          uploadDate: new Date().toISOString().slice(0, 10),
        });
      }
    } catch (error) {
      console.error('CV upload error:', error);
      Alert.alert('Error', 'Could not upload CV');
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
          onChangeText={(text) => setState({ ...details, [key]: text })}
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
          {/* Basic Info Section */}
          <View style={{ backgroundColor: '#fff', padding: 16, borderRadius: 10, marginBottom: 20 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
              <Text style={{ fontSize: 18, fontWeight: '700' }}>Basic Info</Text>
              <TouchableOpacity onPress={() => setEditingBasic(!editingBasic)}>
                <Text style={{ color: '#3182ce', fontWeight: '600' }}>
                  {editingBasic ? 'Cancel' : 'Edit'}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
              {renderInputOrText('Name', profile.name, 'name', editingBasic, setProfile)}
              {renderInputOrText('Surname', profile.surname, 'surname', editingBasic, setProfile)}
              {renderInputOrText('Email', profile.email, 'email', editingBasic, setProfile)}
              {renderInputOrText('Password', '******', 'password', false, () => {})}
            </View>
            {editingBasic && (
              <View style={{ marginTop: 20 }}>
                <Button
                  title={loading ? 'Saving...' : 'Save'}
                  onPress={handleUpdate}
                  disabled={loading}
                  color="#3182ce"
                />
              </View>
            )}
          </View>

          {/* Detailed Info Section */}
          <View style={{ backgroundColor: '#fff', padding: 16, borderRadius: 10, marginBottom: 20 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
              <Text style={{ fontSize: 18, fontWeight: '700' }}>Detailed Info</Text>
              <TouchableOpacity onPress={() => setEditingDetails(!editingDetails)}>
                <Text style={{ color: '#3182ce', fontWeight: '600' }}>
                  {editingDetails ? 'Cancel' : 'Edit'}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
              {renderInputOrText('Date of Birth', details.dateOfBirth, 'dateOfBirth', editingDetails, setDetails)}
              {renderInputOrText('Phone Number', details.phoneNumber, 'phoneNumber', editingDetails, setDetails)}
              {renderInputOrText('Education', details.education, 'education', editingDetails, setDetails)}
              {renderInputOrText('Work Experience', details.workExperience, 'workExperience', editingDetails, setDetails)}
              {renderInputOrText('Skills', details.skills, 'skills', editingDetails, setDetails)}
              {renderInputOrText('Languages', details.languages, 'languages', editingDetails, setDetails)}
              {renderInputOrText('References', details.references, 'references', editingDetails, setDetails)}
              {renderInputOrText('Portfolio Link', details.portfolioLink, 'portfolioLink', editingDetails, setDetails)}
              {renderInputOrText('Desired Salary', details.desiredSalary, 'desiredSalary', editingDetails, setDetails)}
              {renderInputOrText('Work Type Preference', details.workTypePreference, 'workTypePreference', editingDetails, setDetails)}
            </View>
            {editingDetails && (
              <View style={{ marginTop: 20 }}>
                <Button
                  title={loading ? 'Saving...' : 'Save'}
                  onPress={handleUpdate}
                  disabled={loading}
                  color="#3182ce"
                />
              </View>
            )}
          </View>

          {/* CV Info Section */}
          <View style={{ backgroundColor: '#fff', padding: 16, borderRadius: 10 }}>
            <View style={{ marginBottom: 12 }}>
              <Text style={{ fontSize: 18, fontWeight: '700' }}>CV Info</Text>
              <TouchableOpacity onPress={() => setEditingCV(!editingCV)}>
                <Text style={{ color: '#3182ce', fontWeight: '600' }}>
                  {editingCV ? 'Cancel' : 'Edit'}
                </Text>
              </TouchableOpacity>
            </View>
            {cvInfo.fileName ? (
              <Text>CV File: {cvInfo.fileName}</Text>
            ) : (
              <Text>No CV Uploaded</Text>
            )}
            {editingCV && (
              <TouchableOpacity onPress={handleSelectPDF} style={{ marginTop: 10 }}>
                <Text style={{ color: '#3182ce' }}>Choose a CV File</Text>
              </TouchableOpacity>
            )}
            {editingCV && cvInfo.filePath && (
              <Button
                title={loading ? 'Saving...' : 'Save CV'}
                onPress={handleUpdate}
                disabled={loading}
                color="#3182ce"
              />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default MyProfileScreen;
