import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import useTaskStore from '../../store/taskStore';
import { COLORS } from '../../constants/colors';
import AlertPopup from '../../components/common/AlertPopup';

export default function TaskDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params || {};

  const { tasks, removeTask, editTask, isLoading } = useTaskStore();
  const [task, setTask] = useState(null);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  useEffect(() => {
    const found = tasks.find((t) => t.id === id);
    if (found) {
      setTask(found);
    } else {
      // Fallback go back
      navigation.goBack();
    }
  }, [id, tasks]);

  if (!task) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const isCompleted = task.status === 'COMPLETED';

  // Calculate time remaining / relative deadline
  const getTimeRemaining = (dateStr) => {
    try {
      const dueDate = new Date(dateStr);
      const now = new Date();
      const diffTime = dueDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (isCompleted) return 'Task completed successfully! 🏆';
      if (diffDays === 0) return '🚨 Due Today! Finish up soon.';
      if (diffDays === 1) return '⏳ Due Tomorrow. Keep working!';
      if (diffDays < 0) return '⚠️ Overdue task! Please submit ASAP.';
      return `📅 Due in ${diffDays} days (${dueDate.toLocaleDateString()})`;
    } catch (e) {
      return '';
    }
  };

  const handleToggleComplete = async () => {
    const updatedStatus = isCompleted ? 'PENDING' : 'COMPLETED';
    const result = await editTask(task.id, {
      ...task,
      status: updatedStatus
    });
    if (!result.success) {
      Alert.alert('Error', result.message || 'Failed to update status.');
    }
  };

  const handleDelete = () => {
    setShowDeleteAlert(true);
  };

  // Get Priority color & label
  const getPriorityInfo = (priority) => {
    switch (priority?.toUpperCase()) {
      case 'HIGH': return { label: 'High Priority', color: COLORS.priorityHigh };
      case 'MEDIUM': return { label: 'Medium Priority', color: COLORS.priorityMedium };
      case 'LOW': return { label: 'Low Priority', color: COLORS.priorityLow };
      default: return { label: 'Medium Priority', color: COLORS.primary };
    }
  };

  const priorityInfo = getPriorityInfo(task.priority);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0F0C29', '#302B63', '#24243E']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
      />

      {/* Header bar */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Task Details</Text>
        <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
          <Ionicons name="trash-outline" size={22} color={COLORS.error} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Main Details Panel */}
        <View style={styles.card}>
          <View style={styles.statusRow}>
            <View style={[styles.statusBadge, isCompleted ? styles.badgeComplete : styles.badgePending]}>
              <Text style={[styles.statusText, isCompleted ? styles.textComplete : styles.textPending]}>
                {isCompleted ? 'Completed' : 'Active'}
              </Text>
            </View>
            {task.subjectName ? (
              <View style={styles.subjectBadge}>
                <Text style={styles.subjectText} numberOfLines={1}>
                  📚 {task.subjectName}
                </Text>
              </View>
            ) : null}
          </View>

          <Text style={[styles.title, isCompleted && styles.completedTitle]}>
            {task.title}
          </Text>

          <Text style={[styles.timeRemaining, isOverdue(task) && !isCompleted && styles.overdueText]}>
            {getTimeRemaining(task.dueDate)}
          </Text>
        </View>

        {/* 3-Column Metrics Panel */}
        <View style={styles.metricsRow}>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Priority</Text>
            <Text style={[styles.metricValue, { color: priorityInfo.color }]}>
              {task.priority || 'MEDIUM'}
            </Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Study Time</Text>
            <Text style={[styles.metricValue, { color: COLORS.primaryLight }]}>
              {task.estimatedHours || 2.0}h
            </Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Alarm Mins</Text>
            <Text style={[styles.metricValue, { color: COLORS.warning }]}>
              {task.reminderMinutesBefore || 60}m
            </Text>
          </View>
        </View>

        {/* Description Panel */}
        <Text style={styles.sectionLabel}>Notes & Instructions</Text>
        <View style={styles.descCard}>
          {task.description ? (
            <Text style={styles.descText}>{task.description}</Text>
          ) : (
            <Text style={styles.descPlaceholder}>No additional notes logged for this task.</Text>
          )}
        </View>

        {/* Action Buttons Panel */}
        <View style={styles.actionsPanel}>
          
          {/* Toggle Complete */}
          <TouchableOpacity
            style={[styles.actionBtn, isCompleted ? styles.btnActive : styles.btnComplete]}
            onPress={handleToggleComplete}
            disabled={isLoading}
          >
            <Ionicons
              name={isCompleted ? "close-circle-outline" : "checkmark-circle-outline"}
              size={20}
              color={COLORS.white}
            />
            <Text style={styles.actionBtnText}>
              {isCompleted ? 'Mark as Inactive' : 'Mark as Completed'}
            </Text>
          </TouchableOpacity>

          {/* Edit Button */}
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => navigation.navigate('AddTask', { task })}
          >
            <Ionicons name="create-outline" size={20} color={COLORS.textPrimary} />
            <Text style={styles.editBtnText}>Edit Task Details</Text>
          </TouchableOpacity>

        </View>

      </ScrollView>

      {/* Custom Destructive Alert Popup */}
      <AlertPopup
        visible={showDeleteAlert}
        title="Delete Task"
        message="Are you sure you want to permanently delete this task? This action is irreversible."
        type="danger"
        confirmLabel="Delete"
        onConfirm={async () => {
          setShowDeleteAlert(false);
          const result = await removeTask(task.id);
          if (result.success) {
            navigation.goBack();
          } else {
            Alert.alert('Delete Failed', result.message || 'Could not delete task.');
          }
        }}
        onCancel={() => setShowDeleteAlert(false)}
      />
    </View>
  );
}

const isOverdue = (t) => {
  return new Date(t.dueDate) < new Date() && t.status !== 'COMPLETED';
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 15,
    paddingTop: 55,
    paddingBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F0C29',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    padding: 20,
    marginBottom: 20,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  statusBadge: {
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  badgeComplete: {
    backgroundColor: 'rgba(76, 175, 130, 0.12)',
  },
  badgePending: {
    backgroundColor: 'rgba(108, 99, 255, 0.12)',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  textComplete: {
    color: COLORS.success,
  },
  textPending: {
    color: COLORS.primaryLight,
  },
  subjectBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    paddingVertical: 3,
    paddingHorizontal: 10,
    maxWidth: 160,
  },
  subjectText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textPrimary,
    lineHeight: 28,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: COLORS.textLight,
  },
  timeRemaining: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500',
    marginTop: 8,
  },
  overdueText: {
    color: COLORS.error,
  },
  metricsRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.borderLight,
    paddingVertical: 14,
    marginBottom: 24,
    alignItems: 'center',
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  metricDivider: {
    width: 1.5,
    height: 24,
    backgroundColor: COLORS.borderLight,
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textLight,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 4,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primaryLight,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  descCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    padding: 16,
    marginBottom: 32,
  },
  descText: {
    fontSize: 14,
    color: COLORS.textPrimary,
    lineHeight: 22,
  },
  descPlaceholder: {
    fontSize: 13,
    color: COLORS.textLight,
    fontStyle: 'italic',
  },
  actionsPanel: {
    gap: 12,
  },
  actionBtn: {
    height: 48,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  btnComplete: {
    backgroundColor: COLORS.success,
  },
  btnActive: {
    backgroundColor: COLORS.primary,
  },
  actionBtnText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
  editBtn: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  editBtnText: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
});
