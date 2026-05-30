import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert, SafeAreaView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import useSubjectStore from '../../store/subjectStore';
import SubjectCard from '../../components/cards/SubjectCard';
import EmptyState from '../../components/common/EmptyState';
import { COLORS } from '../../constants/colors';
import AlertPopup from '../../components/common/AlertPopup';

export default function SubjectListScreen() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const { subjects, isLoading, fetchSubjects, removeSubject } = useSubjectStore();
  const [refreshing, setRefreshing] = useState(false);

  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState(null);

  useEffect(() => {
    if (isFocused) {
      fetchSubjects();
    }
  }, [isFocused]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchSubjects();
    setRefreshing(false);
  };

  const handleEdit = (subject) => {
    navigation.navigate('EditSubject', { subject });
  };

  const handleDelete = (id) => {
    setSubjectToDelete(id);
    setShowDeleteAlert(true);
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>My Subjects</Text>
    </View>
  );



  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#0F0C29', '#302B63', '#24243E']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
      />
      {renderHeader()}
      
      {isLoading && !refreshing ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : subjects.length === 0 ? (
        <EmptyState
          icon="book-outline"
          title="No subjects yet"
          description="Add your first subject to get started organizing your semester."
          actionLabel="Add Subject"
          onAction={() => navigation.navigate('AddSubject')}
        />
      ) : (
        <FlatList
          data={subjects}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SubjectCard subject={item} onEdit={handleEdit} onDelete={handleDelete} />
          )}
          contentContainerStyle={styles.listContent}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddSubject')}
      >
        <Ionicons name="add" size={24} color="#FFF" />
      </TouchableOpacity>

      {/* Custom Destructive Alert Popup */}
      <AlertPopup
        visible={showDeleteAlert}
        title="Delete Subject"
        message="Are you sure you want to permanently delete this subject? This will remove all timetable classes associated with it."
        type="danger"
        confirmLabel="Delete"
        onConfirm={() => {
          setShowDeleteAlert(false);
          if (subjectToDelete) {
            removeSubject(subjectToDelete);
          }
        }}
        onCancel={() => {
          setShowDeleteAlert(false);
          setSubjectToDelete(null);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 20,
    paddingBottom: 100,
  },
  sectionHeader: {
    marginBottom: 12,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.primary,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
