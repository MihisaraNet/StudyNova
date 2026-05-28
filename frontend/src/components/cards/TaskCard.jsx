import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';

export default function TaskCard({ task, onToggleComplete, onPress }) {
  const isCompleted = task.status === 'COMPLETED';

  // Format Due Date elegantly
  const getDueLabel = (dateStr) => {
    if (!dateStr) return '';
    try {
      const dueDate = new Date(dateStr);
      const now = new Date();
      
      // Calculate diff in days
      const diffTime = dueDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      const hours = dueDate.getHours().toString().padStart(2, '0');
      const minutes = dueDate.getMinutes().toString().padStart(2, '0');
      
      if (diffDays === 0) {
        return `Today at ${hours}:${minutes}`;
      } else if (diffDays === 1) {
        return `Tomorrow at ${hours}:${minutes}`;
      } else if (diffDays === -1) {
        return `Overdue (Yesterday)`;
      } else if (diffDays < -1) {
        return `Overdue (${Math.abs(diffDays)} days ago)`;
      } else if (diffDays > 1 && diffDays <= 7) {
        return `In ${diffDays} days (${dueDate.toLocaleDateString('en-US', { weekday: 'short' })})`;
      } else {
        return dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' });
      }
    } catch (e) {
      return dateStr;
    }
  };

  // Get Priority color
  const getPriorityColor = (priority) => {
    switch (priority?.toUpperCase()) {
      case 'HIGH': return COLORS.priorityHigh;
      case 'MEDIUM': return COLORS.priorityMedium;
      case 'LOW': return COLORS.priorityLow;
      default: return COLORS.primary;
    }
  };

  const priorityColor = getPriorityColor(task.priority);

  return (
    <TouchableOpacity
      style={[
        styles.card,
        isCompleted && styles.completedCard,
        { borderLeftColor: priorityColor }
      ]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <View style={styles.cardContent}>
        {/* Left Checkbox */}
        <TouchableOpacity
          style={[styles.checkbox, isCompleted && { backgroundColor: COLORS.success, borderColor: COLORS.success }]}
          onPress={onToggleComplete}
          activeOpacity={0.7}
        >
          {isCompleted && <Ionicons name="checkmark" size={14} color={COLORS.white} />}
        </TouchableOpacity>

        {/* Text Details */}
        <View style={styles.infoArea}>
          <Text
            style={[styles.title, isCompleted && styles.completedText]}
            numberOfLines={1}
          >
            {task.title}
          </Text>

          {/* Badges Area */}
          <View style={styles.badgeRow}>
            {task.subjectName ? (
              <View style={styles.subjectBadge}>
                <Text style={styles.subjectText} numberOfLines={1}>
                  📚 {task.subjectName}
                </Text>
              </View>
            ) : null}

            {task.estimatedHours ? (
              <View style={styles.hoursBadge}>
                <Text style={styles.hoursText}>
                  ⏱️ {task.estimatedHours}h
                </Text>
              </View>
            ) : null}
          </View>
        </View>

        {/* Right Info (Due Label) */}
        <View style={styles.dueArea}>
          <Ionicons
            name="calendar-outline"
            size={12}
            color={isCompleted ? COLORS.textLight : (task.status === 'OVERDUE' || (new Date(task.dueDate) < new Date() && !isCompleted)) ? COLORS.error : COLORS.textSecondary}
          />
          <Text
            style={[
              styles.dueText,
              (task.status === 'OVERDUE' || (new Date(task.dueDate) < new Date() && !isCompleted)) && styles.overdueText,
              isCompleted && styles.completedText
            ]}
          >
            {getDueLabel(task.dueDate)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.borderLight,
    borderLeftWidth: 5,
    marginBottom: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  completedCard: {
    opacity: 0.6,
    borderColor: 'transparent',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoArea: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: COLORS.textLight,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  subjectBadge: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 6,
    paddingVertical: 2,
    paddingHorizontal: 6,
    maxWidth: 120,
  },
  subjectText: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  hoursBadge: {
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: 6,
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  hoursText: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.primaryLight,
  },
  dueArea: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 4,
  },
  dueText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  overdueText: {
    color: COLORS.error,
  },
});
