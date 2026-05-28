import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import useAssignmentStore from '../../store/assignmentStore';
import AssignmentCard from '../../components/cards/AssignmentCard';

export default function AssignmentListScreen({ navigation }) {
  const { assignments, isLoading, fetchAssignments, editAssignment } = useAssignmentStore();
  const [activeFilter, setActiveFilter] = useState('ALL'); // ALL, PENDING, COMPLETED, OVERDUE
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  const handleToggleComplete = async (assignment) => {
    const updatedStatus = assignment.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
    await editAssignment(assignment.id, {
      title: assignment.title,
      description: assignment.description,
      dueDate: assignment.dueDate,
      subjectId: assignment.subjectId,
      subjectName: assignment.subjectName,
      status: updatedStatus,
      priority: assignment.priority,
      estimatedHours: assignment.estimatedHours,
      reminderMinutesBefore: assignment.reminderMinutesBefore
    });
  };

  const isOverdue = (assignment) => {
    return new Date(assignment.dueDate) < new Date() && assignment.status !== 'COMPLETED';
  };

  // Filter & Search Logic
  const filteredAssignments = assignments.filter((item) => {
    // 1. Search Query filter
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.subjectName && item.subjectName.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    // 2. Tab Filter
    switch (activeFilter) {
      case 'PENDING':
        return item.status === 'PENDING' && !isOverdue(item);
      case 'COMPLETED':
        return item.status === 'COMPLETED';
      case 'OVERDUE':
        return isOverdue(item);
      default:
        return true;
    }
  });

  // Count metrics for filters
  const getFilterCount = (filter) => {
    switch (filter) {
      case 'PENDING':
        return assignments.filter(a => a.status === 'PENDING' && !isOverdue(a)).length;
      case 'COMPLETED':
        return assignments.filter(a => a.status === 'COMPLETED').length;
      case 'OVERDUE':
        return assignments.filter(a => isOverdue(a)).length;
      default:
        return assignments.length;
    }
  };

  const filterTabs = [
    { key: 'ALL', label: 'All' },
    { key: 'PENDING', label: 'Active' },
    { key: 'COMPLETED', label: 'Done' },
    { key: 'OVERDUE', label: 'Overdue' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#0F0C29', '#302B63', '#24243E']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
      />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Assignments</Text>
        <Text style={styles.headerSubtitle}>Manage your academic milestones</Text>
      </View>

      {/* Search Input Panel */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color={COLORS.textLight} />
          <TextInput
            placeholder="Search tasks or subjects..."
            placeholderTextColor={COLORS.textLight}
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={COLORS.textLight} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Filter Horiz Scroll Menu */}
      <View style={styles.filterContainer}>
        {filterTabs.map((tab) => {
          const isActive = activeFilter === tab.key;
          const count = getFilterCount(tab.key);
          return (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.filterTab,
                isActive && styles.activeFilterTab,
                tab.key === 'OVERDUE' && count > 0 && !isActive && styles.hasOverdueTab
              ]}
              onPress={() => setActiveFilter(tab.key)}
              activeOpacity={0.7}
            >
              <Text style={[styles.filterTabText, isActive && styles.activeFilterTabText]}>
                {tab.label} ({count})
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Tasks List */}
      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredAssignments}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <AssignmentCard
              assignment={item}
              onToggleComplete={() => handleToggleComplete(item)}
              onPress={() => navigation.navigate('AssignmentDetail', { id: item.id })}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyEmoji}>🎉</Text>
              <Text style={styles.emptyText}>No assignments found</Text>
              <Text style={styles.emptySubtext}>
                {searchQuery
                  ? "Try checking your spelling or clear search filters"
                  : "You're completely caught up! Tap (+) to log a new task."}
              </Text>
            </View>
          }
        />
      )}

      {/* Floating Action Button (FAB) */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddAssignment')}
        activeOpacity={0.85}
      >
        <LinearGradient
          colors={COLORS.gradientPrimary}
          style={styles.fabGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons name="add" size={28} color={COLORS.white} />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 64,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
    fontWeight: '500',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 14,
    marginLeft: 8,
    fontFamily: 'System',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 8,
    flexWrap: 'wrap',
  },
  filterTab: {
    backgroundColor: COLORS.surface,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  activeFilterTab: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  hasOverdueTab: {
    borderColor: 'rgba(255, 92, 106, 0.4)',
  },
  filterTabText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  activeFilterTabText: {
    color: COLORS.white,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100, // Cushion for FAB
  },
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
    paddingHorizontal: 32,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  emptySubtext: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 20,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  fabGradient: {
    flex: 1,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
