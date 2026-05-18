import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, SectionList, TouchableOpacity, ActivityIndicator, Alert, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import useSubjectStore from '../../store/subjectStore';
import SubjectCard from '../../components/cards/SubjectCard';
import EmptyState from '../../components/common/EmptyState';
import { COLORS } from '../../constants/colors';

export default function SubjectListScreen() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const { subjects, isLoading, fetchSubjects, removeSubject } = useSubjectStore();
  const [refreshing, setRefreshing] = useState(false);

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
    Alert.alert('Delete Subject', 'Are you sure you want to delete this subject?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => removeSubject(id) },
    ]);
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>My Subjects</Text>
    </View>
  );

  const sections = useMemo(() => {
    const grouped = {};
    subjects.forEach(sub => {
      const sem = sub.semester || 'Unassigned';
      if (!grouped[sem]) {
        grouped[sem] = [];
      }
      grouped[sem].push(sub);
    });
    
    return Object.keys(grouped).map(sem => ({
      title: sem,
      data: grouped[sem],
    })).sort((a, b) => b.title.localeCompare(a.title)); // rough descending sort
  }, [subjects]);

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
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SubjectCard subject={item} onEdit={handleEdit} onDelete={handleDelete} />
          )}
          renderSectionHeader={({ section: { title } }) => (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{title}</Text>
            </View>
          )}
          contentContainerStyle={styles.listContent}
          refreshing={refreshing}
          onRefresh={onRefresh}
          stickySectionHeadersEnabled={false}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddSubject')}
      >
        <Ionicons name="add" size={24} color="#FFF" />
      </TouchableOpacity>
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
