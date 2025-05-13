import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Header from '../components/Header';
import { API_BASE_URL } from '../config/api';

const HomeScreen = ({ navigation }) => {
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/Auth/profile/count`);
        const text = await response.text();
        const count = parseInt(text, 10);
        setUserCount(count);
      } catch (error) {
        console.error('Kullanıcı sayısı alınamadı:', error);
      }
    };
  
    fetchUserCount();
  }, []);

  const handleCVUpdate = () => {
    navigation.navigate('Profilim');
  };

  const handleProfileEdit = () => {
    navigation.navigate('Profilim');
  };

  const handleJobSearch = () => {
    navigation.navigate('İş İlanları');
  };

  return (
    <View style={{ flex: 1 }}>
      <Header />
      <View style={styles.container}>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{userCount}+</Text>
            <Text style={styles.statTitle}>Üye</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>46+</Text>
            <Text style={styles.statTitle}>Başarılı CV Analizi</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>18+</Text>
            <Text style={styles.statTitle}>İş Bulma</Text>
          </View>
        </View>

        <View style={styles.rowContainer}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>CV Durumu</Text>
            <View style={styles.alertBox}>
              <Text style={styles.alertText}>CV'nizi güncel tutun.</Text>
              <TouchableOpacity onPress={handleCVUpdate} style={styles.button}>
                <Text style={styles.buttonText}>CV'yi Güncelle</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Profil Durumu</Text>
            <View style={styles.alertBox}>
              <Text style={styles.alertText}>Profilinizi güncel tutun.</Text>
              <TouchableOpacity onPress={handleProfileEdit} style={styles.button}>
                <Text style={styles.buttonText}>Profil Düzenle</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>İş Bulma</Text>
          <TouchableOpacity onPress={handleJobSearch} style={styles.button}>
            <Text style={styles.buttonText}>İş Arama</Text>
          </TouchableOpacity>
        </View>
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
