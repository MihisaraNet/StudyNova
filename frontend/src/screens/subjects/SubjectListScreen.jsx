import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, SafeAreaView } from 'react-native';
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

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={COLORS.gradientDark}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
      />
      
      {/* Decorative Blob */}
      <View style={styles.blurBlob} />

      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Subjects</Text>
        <Text style={styles.headerSubtitle}>Manage your academic courses and subject directory</Text>
      </View>
      
      {isLoading && !refreshing ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primaryLight} />
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

      {/* Glowing FAB Button */}
      <TouchableOpacity
        style={[styles.fab, COLORS.glowIndigo]}
        onPress={() => navigation.navigate('AddSubject')}
        activeOpacity={0.85}
      >
        <LinearGradient
          colors={COLORS.gradientPrimary}
          style={styles.fabGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons name="add" size={26} color="#FFF" />
        </LinearGradient>
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
  blurBlob: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(108, 99, 255, 0.08)',
    top: 50,
    right: -60,
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 64,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '950',
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
    fontWeight: '500',
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
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  fabGradient: {
    flex: 1,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
