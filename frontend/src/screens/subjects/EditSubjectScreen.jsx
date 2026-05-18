import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import InputField from '../../components/common/InputField';
import Button from '../../components/common/Button';
import useSubjectStore from '../../store/subjectStore';
import { COLORS } from '../../constants/colors';

export default function EditSubjectScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { subject } = route.params;
  const { editSubject, isLoading } = useSubjectStore();

  const [formData, setFormData] = useState({
    name: subject.name,
    code: subject.code,
    credits: subject.credits.toString(),
    semester: subject.semester,
    grade: subject.grade || '',
  });

  const handleSave = async () => {
    if (!formData.name || !formData.code || !formData.credits || !formData.semester) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }
    
    const payload = {
      ...formData,
      credits: parseInt(formData.credits, 10) || 3,
    };
    
    const result = await editSubject(subject.id, payload);
    if (result.success) {
      navigation.goBack();
    } else {
      Alert.alert('Error', result.message || 'Failed to update subject');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#0F0C29', '#302B63', '#24243E']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
      />
      
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <Ionicons name="arrow-back" size={24} color={COLORS.white} onPress={() => navigation.goBack()} />
          <Text style={styles.headerTitle}>Edit Subject</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.formCard}>
            <InputField
              label="Subject Name *"
              placeholder="e.g. Data Structures"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              icon="book-outline"
            />
            
            <InputField
              label="Subject Code *"
              placeholder="e.g. CS201"
              value={formData.code}
              onChangeText={(text) => setFormData({ ...formData, code: text })}
              icon="barcode-outline"
              autoCapitalize="characters"
            />
            
            <InputField
              label="Credits *"
              placeholder="e.g. 3"
              value={formData.credits}
              onChangeText={(text) => setFormData({ ...formData, credits: text })}
              icon="star-outline"
              keyboardType="numeric"
            />
            
            <InputField
              label="Semester *"
              placeholder="e.g. Spring 2026"
              value={formData.semester}
              onChangeText={(text) => setFormData({ ...formData, semester: text })}
              icon="calendar-outline"
            />
            
            <InputField
              label="Target/Achieved Grade (Optional)"
              placeholder="e.g. A"
              value={formData.grade}
              onChangeText={(text) => setFormData({ ...formData, grade: text })}
              icon="ribbon-outline"
              autoCapitalize="characters"
            />
            
            <Button
              title="Update Subject"
              onPress={handleSave}
              loading={isLoading}
              style={styles.saveBtn}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  scrollContent: {
    padding: 20,
  },
  formCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  saveBtn: {
    marginTop: 10,
  }
});
