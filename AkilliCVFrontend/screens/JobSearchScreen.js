import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, ActivityIndicator, Linking } from 'react-native';
import Header from '../components/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config/api';

const JobSearchScreen = () => {
  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [jobResults, setJobResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [expandedJobs, setExpandedJobs] = useState({});
  const [displayedJobs, setDisplayedJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreJobs, setHasMoreJobs] = useState(true);
  const jobsPerPage = 20;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        setUserId(storedUserId);
        if (!storedUserId) {
          Alert.alert('Hata', 'Kullanıcı ID bulunamadı.');
          return;
        }

        const response = await fetch(`${API_BASE_URL}/UserProfile/getProfile/${storedUserId}`);
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
      const response = await fetch(`${API_BASE_URL}/JobSearch/getJobPostings/${userData.id}`);
      
      // Response kontrolü
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const responseText = await response.text();
      //console.log('API Response:', responseText);
      
      // Boş response kontrolü
      if (!responseText || responseText.trim() === '') {
        setJobResults([]);
        setDisplayedJobs([]);
        Alert.alert('Bilgi', 'Henüz iş ilanı bulunamadı.');
        return;
      }
      
      const result = JSON.parse(responseText);
      
      // API'den gelen veriyi array olarak işle
      const jobsArray = Array.isArray(result) ? result : [result];
      setJobResults(jobsArray);
      
      // İlk 20 ilanı göster
      const initialJobs = jobsArray.slice(0, jobsPerPage);
      setDisplayedJobs(initialJobs);
      setCurrentPage(1);
      setHasMoreJobs(jobsArray.length > jobsPerPage);
    } catch (error) {
      console.error('İş ilanları alınamadı:', error);
      if (error.name === 'SyntaxError') {
        Alert.alert('Hata', 'API\'den geçersiz veri alındı.');
      } else {
        Alert.alert('Hata', 'İş ilanları alınırken bir hata oluştu.');
      }
      setJobResults([]);
      setDisplayedJobs([]);
    } finally {
      setSearching(false);
    }
  };

  const loadMoreJobs = () => {
    const nextPage = currentPage + 1;
    const startIndex = (nextPage - 1) * jobsPerPage;
    const endIndex = startIndex + jobsPerPage;
    const newJobs = jobResults.slice(startIndex, endIndex);
    
    setDisplayedJobs(prev => [...prev, ...newJobs]);
    setCurrentPage(nextPage);
    setHasMoreJobs(endIndex < jobResults.length);
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
        <Text>Kullanıcı verisi bulunamadı. {userId}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Header />
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Kullanıcı Bilgileri</Text>

        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Telefon:</Text>
              <Text style={styles.infoText}>{userData.phoneNumber}</Text>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Email:</Text>
              <Text style={styles.infoText}>{userData.email}</Text>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Doğum Tarihi:</Text>
              <Text style={styles.infoText}>{new Date(userData.dateOfBirth).toLocaleDateString()}</Text>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Eğitim:</Text>
              <Text style={styles.infoText}>{userData.education}</Text>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Deneyim:</Text>
              <Text style={styles.infoText}>{userData.workExperience}</Text>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Yetenekler:</Text>
              <Text style={styles.infoText}>{userData.skills}</Text>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Diller:</Text>
              <Text style={styles.infoText}>{userData.languages}</Text>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Referanslar:</Text>
              <Text style={styles.infoText}>{userData.references}</Text>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Portföy:</Text>
              <Text style={[styles.infoText, { color: 'blue' }]}>{userData.portfolioLink}</Text>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Maaş Tercihi:</Text>
              <Text style={styles.infoText}>{userData.desiredSalary}</Text>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Çalışma Tercihi:</Text>
              <Text style={styles.infoText}>{userData.workTypePreference}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSearchJobs} disabled={searching}>
          <Text style={styles.buttonText}>{searching ? 'Aranıyor...' : 'Aramayı Başlat'}</Text>
        </TouchableOpacity>

        {displayedJobs.length > 0 && (
          <View style={{ marginTop: 30 }}>
            <Text style={styles.title}>İş İlanları ({displayedJobs.length}/{jobResults.length})</Text>
            {displayedJobs.map((job, index) => (
              <View key={index} style={styles.jobCard}>
                <Text style={styles.jobTitle}>{job.baslik}</Text>
                
                <View style={styles.jobInfo}>
                  <Text style={styles.infoLabel}>Şirket:</Text>
                  <Text style={styles.infoText}>{job.sirket || 'Belirtilmemiş'}</Text>
                </View>

                <View style={styles.jobInfo}>
                  <Text style={styles.infoLabel}>Konum:</Text>
                  <Text style={styles.infoText}>{job.lokasyon || 'Belirtilmemiş'}</Text>
                </View>

                <View style={styles.jobInfo}>
                  <Text style={styles.infoLabel}>Yayım Tarihi:</Text>
                  <Text style={styles.infoText}>{job.yayimTarihi || 'Belirtilmemiş'}</Text>
                </View>

                <View style={styles.jobInfo}>
                  <Text style={styles.infoLabel}>Link:</Text>
                  <TouchableOpacity onPress={() => Linking.openURL(job.link)}>
                    <Text style={[styles.infoText, { color: 'blue', textDecorationLine: 'underline' }]}>
                      İlanı İncele
                    </Text>
                  </TouchableOpacity>
                </View>

                {job.beceriler && job.beceriler.length > 0 && (
                  <View style={styles.jobInfo}>
                    <Text style={styles.infoLabel}>Beceriler:</Text>
                    <View style={styles.skillsContainer}>
                      {job.beceriler.map((skill, skillIndex) => (
                        <View key={skillIndex} style={styles.skillTag}>
                          <Text style={styles.skillText}>{skill}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {job.icerik && (
                  <View style={styles.jobInfo}>
                    <Text style={styles.infoLabel}>İçerik:</Text>
                    <Text style={[styles.infoText, styles.contentText]} numberOfLines={expandedJobs[index] ? undefined : 10}>
                      {job.icerik}
                    </Text>
                    {job.icerik.length > 500 && (
                      <TouchableOpacity 
                        onPress={() => setExpandedJobs(prev => ({
                          ...prev,
                          [index]: !prev[index]
                        }))}
                        style={styles.expandButton}
                      >
                        <Text style={styles.expandButtonText}>
                          {expandedJobs[index] ? 'Daha az göster' : 'Daha fazla gör'}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </View>
            ))}
            
            {hasMoreJobs && (
              <TouchableOpacity style={styles.loadMoreButton} onPress={loadMoreJobs}>
                <Text style={styles.loadMoreButtonText}>Daha Fazla İlan Göster</Text>
              </TouchableOpacity>
            )}
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
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  infoBox: {
    width: '48%',
    marginBottom: 20,
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
    marginBottom: 5,
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
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  jobInfo: {
    marginBottom: 8,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  skillTag: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 6,
  },
  skillText: {
    fontSize: 12,
    color: '#1976d2',
    fontWeight: '500',
  },
  contentText: {
    fontSize: 14,
    lineHeight: 20,
  },
  expandButton: {
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  expandButtonText: {
    color: '#3182ce',
    fontSize: 14,
    fontWeight: '500',
  },
  loadMoreButton: {
    backgroundColor: '#3182ce',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  loadMoreButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default JobSearchScreen;