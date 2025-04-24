import React from 'react';
import { View, Text, TextInput, Button, TouchableOpacity } from 'react-native';

const DetailedInfoSection = ({
  details,
  editingDetails,
  setEditingDetails,
  handleUpdate,
  loading,
  setDetails,
}) => {
  const renderInputOrText = (label, value, key) => (
    <View style={{ width: '48%', marginBottom: 15 }} key={key}> {/* 2'li düzen için genişlik ayarı */}
      <Text style={{ fontWeight: '500' }}>{label}</Text>
      {editingDetails ? (
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
          onChangeText={(text) => setDetails({ ...details, [key]: text })}
        />
      ) : (
        <Text style={{ fontSize: 16, marginTop: 5 }}>{value || '-'}</Text>
      )}
    </View>
  );

  return (
    <View style={{ backgroundColor: '#fff', padding: 16, borderRadius: 10, marginBottom: 20 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
        <Text style={{ fontSize: 18, fontWeight: '700' }}>Detaylı Bilgiler</Text>
        <TouchableOpacity onPress={() => setEditingDetails(!editingDetails)}>
          <Text style={{ color: '#3182ce', fontWeight: '600' }}>
            {editingDetails ? 'İptal' : 'Düzenle'}
          </Text> {/* Metni bir <Text> bileşeninin içine aldım */}
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        {renderInputOrText('Doğum Tarihi', details.dateOfBirth, 'dateOfBirth')}
        {renderInputOrText('Telefon Numarası', details.phoneNumber, 'phoneNumber')}
        {renderInputOrText('Eğitim', details.education, 'education')}
        {renderInputOrText('İş Deneyimi', details.workExperience, 'workExperience')}
        {renderInputOrText('Yetenekler', details.skills, 'skills')}
        {renderInputOrText('Diller', details.languages, 'languages')}
        {renderInputOrText('Referanslar', details.references, 'references')}
        {renderInputOrText('Portföy Linki', details.portfolioLink, 'portfolioLink')}
        {renderInputOrText('Beklenen Maaş', details.desiredSalary, 'desiredSalary')}
        {renderInputOrText('Çalışma Tercihi', details.workTypePreference, 'workTypePreference')}
      </View>
      {editingDetails && (
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

export default DetailedInfoSection;
