import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Header = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const navigation = useNavigation();

  const handleProfile = () => {
    setMenuVisible(false);
    navigation.navigate('Profilim');
  };

  const handleLogout = async () => {
    try {
      setMenuVisible(false);
      await AsyncStorage.removeItem('userId'); // Oturum bilgisini sil
      navigation.reset({
        index: 0,
        routes: [{ name: 'Giris Yap' }],
      });
    } catch (error) {
      console.error('Çıkış yapılırken hata oluştu:', error);
    }
  };

  const goToHome = () => {
    navigation.navigate('AnaSayfa');
  };

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={goToHome}>
        <Text style={styles.title}>AKILLI CV</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.iconContainer}>
        <Icon name="person-circle-outline" size={30} color="#fff" />
      </TouchableOpacity>

      
      <Modal
        animationType="fade"
        transparent={true}
        visible={menuVisible}
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setMenuVisible(false)}>
          <View style={styles.dropdownMenu}>
            <Pressable style={styles.menuItem} onPress={handleProfile}>
              <Text style={styles.menuText}>Profilim</Text>
            </Pressable>
            <Pressable style={styles.menuItem} onPress={handleLogout}>
              <Text style={styles.menuText}>Çıkış Yap</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    paddingTop: 20,
    paddingBottom: 10,
    paddingHorizontal: 15,
    backgroundColor: '#3182ce',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  iconContainer: {
    padding: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 60,
    paddingRight: 15,
  },
  dropdownMenu: {
    width: 150,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 5,
    paddingVertical: 5,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
});

export default Header;
