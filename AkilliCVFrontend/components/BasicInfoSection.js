import React from 'react';
import { View, Text, TextInput, Button, TouchableOpacity } from 'react-native';

const BasicInfoSection = ({
  profile,
  editingBasic,
  setEditingBasic,
  handleUpdate,
  loading,
  setProfile,
}) => {
  const renderInputOrText = (label, value, key) => (
    <View style={{ width: '48%', marginBottom: 15 }} key={key}>
      <Text style={{ fontWeight: '500' }}>{label}</Text>
      {editingBasic ? (
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
          onChangeText={(text) => setProfile({ ...profile, [key]: text })}
        />
      ) : (
        <Text style={{ fontSize: 16, marginTop: 5 }}>{value || '-'}</Text>
      )}
    </View>
  );

  return (
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
        {renderInputOrText('Ad', profile.name, 'name')}
        {renderInputOrText('Soyad', profile.surname, 'surname')}
        {renderInputOrText('E-posta', profile.email, 'email')}
        {renderInputOrText('Şifre', '******', 'password')}
      </View>
      {editingBasic && (
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
  );
};

export default BasicInfoSection;
