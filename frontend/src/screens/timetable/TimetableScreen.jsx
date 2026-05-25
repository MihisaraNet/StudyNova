import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import useTimetableStore from '../../store/timetableStore';
import { COLORS } from '../../constants/colors';

const DAYS_OF_WEEK = [
  { full: 'Monday', short: 'Mon' },
  { full: 'Tuesday', short: 'Tue' },
  { full: 'Wednesday', short: 'Wed' },
  { full: 'Thursday', short: 'Thu' },
  { full: 'Friday', short: 'Fri' },
  { full: 'Saturday', short: 'Sat' },
  { full: 'Sunday', short: 'Sun' },
];

export default function TimetableScreen() {
  const navigation = useNavigation();
  const { sessions, isLoading, fetchSessions, removeSession } = useTimetableStore();
  const [selectedDay, setSelectedDay] = useState('Monday');

  useEffect(() => {
    fetchSessions();
  }, []);

  // Filter sessions for the selected day of the week
  const filteredSessions = sessions.filter(
    (sess) => sess.dayOfWeek.toLowerCase() === selectedDay.toLowerCase()
  ).sort((a, b) => a.startTime.localeCompare(b.startTime));

  const handleDeleteSession = (id, title) => {
    Alert.alert(
      'Delete Study Session',
      `Are you sure you want to delete "${title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await removeSession(id);
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0F0C29', '#302B63', '#24243E']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
      />
      
      {/* ─── Top Header Card ──────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>Study Timetable</Text>
            <Text style={styles.headerSubtitle}>Schedule your routine for academic success</Text>
          </View>
          <View style={styles.iconContainer}>
            <Ionicons name="calendar" size={26} color={COLORS.primaryLight} />
          </View>
        </View>
      </View>

      {/* ─── Weekly Horizontal Day Selector ─────────────────────────────────── */}
      <View style={styles.daySelectorContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.daySelectorScroll}
        >
          {DAYS_OF_WEEK.map((day) => {
            const isActive = day.full.toLowerCase() === selectedDay.toLowerCase();
            return (
              <TouchableOpacity
                key={day.full}
                style={[
                  styles.dayCard,
                  isActive && styles.dayCardActive
                ]}
                onPress={() => setSelectedDay(day.full)}
              >
                {isActive && (
                  <LinearGradient
                    colors={COLORS.gradientPrimary}
                    style={StyleSheet.absoluteFill}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  />
                )}
                <Text style={[styles.dayShortText, isActive && styles.dayTextActive]}>
                  {day.short}
                </Text>
                <Text style={[styles.dayFullText, isActive && styles.daySubTextActive]}>
                  {day.full.substring(0, 3)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* ─── Study Sessions Scroll Agenda ────────────────────────────────────── */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Syncing scheduled study blocks...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.agendaScroll} showsVerticalScrollIndicator={false}>
          {filteredSessions.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconCircle}>
                <Ionicons name="sparkles-outline" size={44} color={COLORS.textLight} />
              </View>
              <Text style={styles.emptyStateTitle}>No sessions scheduled</Text>
              <Text style={styles.emptyStateSubtitle}>
                Take a break, or add a study block for {selectedDay} using the button below.
              </Text>
            </View>
          ) : (
            filteredSessions.map((session) => (
              <View key={session.id} style={styles.sessionCard}>
                {/* Visual colored tag border */}
                <View style={[styles.colorTag, { backgroundColor: session.color }]} />

                <View style={styles.sessionCardContent}>
                  <View style={styles.sessionHeader}>
                    <Text style={styles.subjectName}>{session.subjectName || 'General Study'}</Text>
                    <View style={styles.actionButtons}>
                      <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={() => navigation.navigate('AddSession', { session })}
                      >
                        <Ionicons name="pencil" size={16} color={COLORS.textSecondary} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={() => handleDeleteSession(session.id, session.title)}
                      >
                        <Ionicons name="trash" size={16} color={COLORS.error} />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <Text style={styles.sessionTitle}>{session.title}</Text>

                  <View style={styles.detailsRow}>
                    <View style={styles.detailItem}>
                      <Ionicons name="time-outline" size={14} color={COLORS.textSecondary} />
                      <Text style={styles.detailText}>
                        {session.startTime} - {session.endTime}
                      </Text>
                    </View>
                    
                    {session.location && session.location.trim() !== '' && (
                      <View style={styles.detailItem}>
                        <Ionicons name="location-outline" size={14} color={COLORS.textSecondary} />
                        <Text style={styles.detailText} numberOfLines={1}>
                          {session.location}
                        </Text>
                      </View>
                    )}
                  </View>

                  {session.reminderEnabled && (
                    <View style={styles.reminderBadge}>
                      <Ionicons name="notifications" size={12} color={COLORS.warning} />
                      <Text style={styles.reminderText}>
                        Alert active {session.reminderMinutesBefore}m before
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}

      {/* ─── Floating Action Button (FAB) ─────────────────────────────────────── */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddSession')}
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
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingTop: 55,
    paddingBottom: 15,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  headerSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  daySelectorContainer: {
    paddingVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  daySelectorScroll: {
    paddingHorizontal: 15,
    flexDirection: 'row',
    gap: 8,
  },
  dayCard: {
    width: 60,
    height: 70,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  dayCardActive: {
    borderColor: 'transparent',
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  dayShortText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  dayFullText: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  dayTextActive: {
    color: COLORS.white,
  },
  daySubTextActive: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '600',
  },
  agendaScroll: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 100, // Safe padding for FAB
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: COLORS.textSecondary,
    marginTop: 10,
    fontSize: 14,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 20,
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  emptyStateSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 30,
    marginTop: 8,
    lineHeight: 18,
  },
  sessionCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    marginBottom: 12,
    overflow: 'hidden',
  },
  colorTag: {
    width: 6,
    height: '100%',
  },
  sessionCardContent: {
    flex: 1,
    padding: 16,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subjectName: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primaryLight,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    padding: 4,
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginTop: 4,
  },
  detailsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
    marginTop: 10,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  detailText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  reminderBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255, 179, 71, 0.08)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 12,
  },
  reminderText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.warning,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    elevation: 6,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  fabGradient: {
    flex: 1,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
