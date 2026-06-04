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
import useTaskStore from '../../store/taskStore';
import TaskCard from '../../components/cards/TaskCard';

export default function TaskListScreen({ navigation }) {
  const { tasks, isLoading, fetchTasks, editTask } = useTaskStore();
  const [activeFilter, setActiveFilter] = useState('ALL'); // ALL, PENDING, COMPLETED, OVERDUE
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleToggleComplete = async (task) => {
    const updatedStatus = task.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
    await editTask(task.id, {
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      subjectId: task.subjectId,
      subjectName: task.subjectName,
      status: updatedStatus,
      priority: task.priority,
      estimatedHours: task.estimatedHours,
      reminderMinutesBefore: task.reminderMinutesBefore
    });
  };

  const isOverdue = (task) => {
    return new Date(task.dueDate) < new Date() && task.status !== 'COMPLETED';
  };

  // Filter & Search Logic
  const filteredTasks = tasks.filter((item) => {
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
        return tasks.filter(t => t.status === 'PENDING' && !isOverdue(t)).length;
      case 'COMPLETED':
        return tasks.filter(t => t.status === 'COMPLETED').length;
      case 'OVERDUE':
        return tasks.filter(t => isOverdue(t)).length;
      default:
        return tasks.length;
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
        colors={COLORS.gradientDark}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
      />
      
      {/* Dynamic light blobs */}
      <View style={styles.blurBlob1} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tasks</Text>
        <Text style={styles.headerSubtitle}>Manage your study goals and action items</Text>
      </View>

      {/* Search Input Panel */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color={COLORS.textLight} />
          <TextInput
            placeholder="Search tasks..."
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
          <ActivityIndicator size="large" color={COLORS.primaryLight} />
        </View>
      ) : (
        <FlatList
          data={filteredTasks}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TaskCard
              task={item}
              onToggleComplete={() => handleToggleComplete(item)}
              onPress={() => navigation.navigate('TaskDetail', { id: item.id })}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyEmoji}>🎉</Text>
              <Text style={styles.emptyText}>No tasks found</Text>
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
        style={[styles.fab, COLORS.glowIndigo]}
        onPress={() => navigation.navigate('AddTask')}
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
  blurBlob1: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(108, 99, 255, 0.08)',
    top: 100,
    left: -50,
  },
  header: {
    paddingTop: 64,
    paddingHorizontal: 20,
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
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 12,
    height: 48,
  },
  searchInput: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 14,
    marginLeft: 8,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 8,
    flexWrap: 'wrap',
  },
  filterTab: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  activeFilterTab: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primaryLight,
  },
  hasOverdueTab: {
    borderColor: 'rgba(248, 113, 113, 0.4)',
  },
  filterTabText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '700',
  },
  activeFilterTabText: {
    color: COLORS.white,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
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
    fontWeight: '800',
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
  },
  fabGradient: {
    flex: 1,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
