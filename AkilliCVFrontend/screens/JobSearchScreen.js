import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native';
import Header from '../components/Header';

const JobSearchScreen = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [jobResults, setJobResults] = useState([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://192.168.1.105:7131/api/Auth/login');
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error('Veri alınamadı:', error);
        Alert.alert('Hata', 'Kullanıcı verileri alınırken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSearchJobs = async () => {
    if (!userData || !userData.id) {
      Alert.alert('Hata', 'Kullanıcı bilgisi eksik.');
      return;
    }

    setSearching(true);
    try {
      const response = await fetch(`http://192.168.1.105:5189/api/JobSearch/getJobPostings/${userData.id}`);
      const result = await response.json();
      setJobResults(result.jobs || result);
    } catch (error) {
      console.error('İş ilanları alınamadı:', error);
      Alert.alert('Hata', 'İş ilanları alınırken bir hata oluştu.');
    } finally {
      setSearching(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3182ce" />
        <Text>Yükleniyor...</Text>
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.container}>
        <Text>Kullanıcı verisi bulunamadı.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Header />
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Kullanıcı Bilgileri</Text>

        <View style={styles.card}>
          <Text style={styles.infoLabel}>Ad Soyad:</Text>
          <Text style={styles.infoText}>{userData.name} {userData.surname}</Text>

          <Text style={styles.infoLabel}>Email:</Text>
          <Text style={styles.infoText}>{userData.email}</Text>

          <Text style={styles.infoLabel}>Telefon:</Text>
          <Text style={styles.infoText}>{userData.phone}</Text>

          <Text style={styles.infoLabel}>Pozisyon:</Text>
          <Text style={styles.infoText}>{userData.position}</Text>

          <Text style={styles.infoLabel}>Deneyim:</Text>
          <Text style={styles.infoText}>{userData.experience} yıl</Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSearchJobs} disabled={searching}>
          <Text style={styles.buttonText}>{searching ? 'Aranıyor...' : 'Aramayı Başlat'}</Text>
        </TouchableOpacity>

        {jobResults.length > 0 && (
          <View style={{ marginTop: 30 }}>
            <Text style={styles.title}>İş İlanları</Text>
            {jobResults.map((job, index) => (
              <View key={index} style={styles.jobCard}>
                <Text style={styles.infoLabel}>Pozisyon:</Text>
                <Text style={styles.infoText}>{job.title}</Text>

                <Text style={styles.infoLabel}>Şirket:</Text>
                <Text style={styles.infoText}>{job.company || 'Belirtilmemiş'}</Text>

                <Text style={styles.infoLabel}>Konum:</Text>
                <Text style={styles.infoText}>{job.location || 'Belirtilmemiş'}</Text>

                <Text style={styles.infoLabel}>Link:</Text>
                <Text style={[styles.infoText, { color: 'blue' }]}>{job.link}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  infoText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#3182ce',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  jobCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 3,
  }
});

export default JobSearchScreen;
