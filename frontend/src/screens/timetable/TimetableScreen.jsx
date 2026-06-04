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
        colors={COLORS.gradientDark}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
      />
      
      {/* Dynamic light blob */}
      <View style={styles.blurBlob} />
      
      {/* ─── Top Header Card ──────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>Timetable</Text>
            <Text style={styles.headerSubtitle}>Schedule your routine for academic success</Text>
          </View>
          <View style={styles.iconContainer}>
            <Ionicons name="calendar" size={22} color={COLORS.primaryLight} />
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
                activeOpacity={0.8}
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
          <ActivityIndicator size="large" color={COLORS.primaryLight} />
          <Text style={styles.loadingText}>Syncing scheduled study blocks...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.agendaScroll} showsVerticalScrollIndicator={false}>
          {filteredSessions.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconCircle}>
                <Ionicons name="sparkles-outline" size={38} color={COLORS.textLight} />
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
                <View style={[styles.colorTag, { backgroundColor: session.color || COLORS.primary }]} />

                <View style={styles.sessionCardContent}>
                  <View style={styles.sessionHeader}>
                    <Text style={styles.subjectName}>{session.subjectName || 'General Study'}</Text>
                    <View style={styles.actionButtons}>
                      <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={() => navigation.navigate('AddSession', { session })}
                      >
                        <Ionicons name="pencil" size={15} color={COLORS.primaryLight} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={() => handleDeleteSession(session.id, session.title)}
                      >
                        <Ionicons name="trash" size={15} color={COLORS.error} />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <Text style={styles.sessionTitle}>{session.title}</Text>

                  <View style={styles.detailsRow}>
                    <View style={styles.detailItem}>
                      <Ionicons name="time-outline" size={13} color={COLORS.textSecondary} />
                      <Text style={styles.detailText}>
                        {session.startTime} - {session.endTime}
                      </Text>
                    </View>
                    
                    {session.location && session.location.trim() !== '' && (
                      <View style={styles.detailItem}>
                        <Ionicons name="location-outline" size={13} color={COLORS.textSecondary} />
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
        style={[styles.fab, COLORS.glowIndigo]}
        onPress={() => navigation.navigate('AddSession')}
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
  container: { flex: 1 },
  blurBlob: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(108, 99, 255, 0.08)',
    bottom: 100,
    left: -60,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 64,
    paddingBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  daySelectorContainer: {
    paddingVertical: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.01)',
    borderBottomWidth: 1.5,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
  },
  daySelectorScroll: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    gap: 8,
  },
  dayCard: {
    width: 62,
    height: 70,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  dayCardActive: {
    borderColor: 'transparent',
  },
  dayShortText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  dayFullText: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 4,
    fontWeight: '600',
  },
  dayTextActive: {
    color: COLORS.white,
  },
  daySubTextActive: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '700',
  },
  agendaScroll: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 100,
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
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIconCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 20,
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  emptyStateSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 30,
    marginTop: 8,
    lineHeight: 19,
  },
  sessionCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 16,
    marginBottom: 14,
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
    fontWeight: '800',
    color: COLORS.primaryLight,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    padding: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 8,
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 6,
  },
  detailsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
    marginTop: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  detailText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  reminderBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(251, 191, 36, 0.08)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 12,
  },
  reminderText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.warning,
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
