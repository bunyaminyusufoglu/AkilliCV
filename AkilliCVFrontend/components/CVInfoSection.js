import React from 'react';
import { View, Text, Button, TouchableOpacity } from 'react-native';

const CVInfoSection = ({ cvInfo, editingCV, setEditingCV, handleSelectPDF }) => {
  return (
    <View style={{ backgroundColor: '#fff', padding: 16, borderRadius: 10, marginBottom: 20 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
        <Text style={{ fontSize: 18, fontWeight: '700' }}>CV Bilgileri</Text>
        <TouchableOpacity onPress={() => setEditingCV(!editingCV)}>
          <Text style={{ color: '#3182ce', fontWeight: '600' }}>{editingCV ? 'İptal' : 'Düzenle'}</Text>
        </TouchableOpacity>
      </View>
      <Text style={{ fontSize: 14, fontWeight: '500', marginVertical: 5 }}>CV Önizlemesi:</Text>
      <Text style={{ fontSize: 16, marginBottom: 10 }}>{cvInfo.fileName ? `Ad: ${cvInfo.fileName}` : '-'}</Text>
      <Text style={{ fontSize: 14, fontWeight: '500', marginVertical: 5 }}>Yükleme Tarihi:</Text>
      <Text style={{ fontSize: 16, marginBottom: 10 }}>{cvInfo.uploadDate || '-'}</Text>
      {editingCV && (
        <View style={{ marginTop: 20 }}>
          <Button
            title="Yeni CV Yükle (PDF)"
            onPress={handleSelectPDF}
            color="#3182ce"
          />
        </View>
      )}
    </View>
  );
};

export default CVInfoSection;
