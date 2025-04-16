import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation }) => {
  const [hasCV, setHasCV] = useState(false);
  const [isProfileComplete, setIsProfileComplete] = useState(false);

  useEffect(() => {
    const checkCVAndProfile = async () => {
      const userCV = await AsyncStorage.getItem('userCV');
      const profileData = await AsyncStorage.getItem('userProfile');
      if (userCV) {
        setHasCV(true);
      }
      if (profileData) {
        setIsProfileComplete(true);
      }
    };
    checkCVAndProfile();
  }, []);

  const handleCVUpload = () => {
    navigation.navigate('CVUpload');
  };

  const handleCVUpdate = () => {
    navigation.navigate('CVUpdate');
  };

  const handleProfileEdit = () => {
    navigation.navigate('ProfileEdit');
  };

  const handleJobSearch = () => {
    navigation.navigate('JobSearch');
  };

  return (
    <View style={styles.container}>
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>75+</Text>
          <Text style={styles.statTitle}>Üye</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>100+</Text>
          <Text style={styles.statTitle}>Başarılı CV Analizi</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>25+</Text>
          <Text style={styles.statTitle}>İş Bulma</Text>
        </View>
      </View>

      <View style={styles.rowContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CV Durumu</Text>
          {!hasCV ? (
            <View style={styles.alertBox}>
              <Text style={styles.alertText}>CV'nizi yüklemediniz. CV'nizi yükleyip analiz ettirmeye başlayabilirsiniz.</Text>
              <TouchableOpacity onPress={handleCVUpload} style={styles.button}>
                <Text style={styles.buttonText}>CV Yükle</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.alertBox}>
              <Text style={styles.alertText}>CV'nizi güncelleyebilirsiniz.</Text>
              <TouchableOpacity onPress={handleCVUpdate} style={styles.button}>
                <Text style={styles.buttonText}>CV'yi Güncelle</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profil Durumu</Text>
          {!isProfileComplete ? (
            <View style={styles.alertBox}>
              <Text style={styles.alertText}>Profilinizi tam doldurduğunuzdan emin olun.</Text>
              <TouchableOpacity onPress={handleProfileEdit} style={styles.button}>
                <Text style={styles.buttonText}>Profil Düzenle</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Text style={styles.alertText}>Profiliniz tam olarak doldurulmuş.</Text>
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>İş Bulma</Text>
        <TouchableOpacity onPress={handleJobSearch} style={styles.button}>
          <Text style={styles.buttonText}>İş Arama</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
    paddingHorizontal: 20,
    paddingTop: 20,
    
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  statNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#3182ce',
  },
  statTitle: {
    fontSize: 14,
    color: '#333',
    marginTop: 5,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  section: {
    flex: 1,
    marginHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  alertBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  alertText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#3182ce',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default HomeScreen;
