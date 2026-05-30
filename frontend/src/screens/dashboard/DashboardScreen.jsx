import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import useAuthStore from '../../store/authStore';
import useSubjectStore from '../../store/subjectStore';
import useTaskStore from '../../store/taskStore';
import useTimetableStore from '../../store/timetableStore';
import useTimerStore from '../../store/timerStore';

const TIMER_MODES_LABELS = {
  FOCUS:       'Focus',
  SHORT_BREAK: 'Break',
  LONG_BREAK:  'Long Break',
};

export default function DashboardScreen({ navigation }) {
  const { user }                              = useAuthStore();
  const { subjects, fetchSubjects }           = useSubjectStore();
  const { tasks, fetchTasks }                 = useTaskStore();
  const { sessions, fetchSessions }           = useTimetableStore();
  const { sessionCount, isRunning, mode }     = useTimerStore();

  React.useEffect(() => {
    fetchSubjects();
    fetchTasks();
    fetchSessions();
  }, [fetchSubjects, fetchTasks, fetchSessions]);

  const pendingTasksCount   = tasks.filter(t => t.status !== 'COMPLETED').length;
  const completedTasksCount = tasks.filter(t => t.status === 'COMPLETED').length;
  const overdueTasksCount   = tasks.filter(t => t.status === 'OVERDUE').length;
  const compRate            = tasks.length > 0
    ? Math.round((completedTasksCount / tasks.length) * 100) : 0;

  const quickStats = [
    { icon: 'book-outline',             label: 'Subjects',    value: subjects.length.toString(), color: COLORS.primary, onPress: () => navigation.navigate('Subjects') },
    { icon: 'checkmark-circle-outline', label: 'Active Tasks', value: pendingTasksCount.toString(), color: COLORS.warning, onPress: () => navigation.navigate('Tasks') },
    { icon: 'calendar-outline',         label: 'Sessions',    value: sessions.length.toString(), color: COLORS.success, onPress: () => navigation.navigate('Timetable') },
  ];

  const quickActions = [
    { icon: 'add-circle',    label: 'Add Subject',   color: COLORS.primary,   onPress: () => navigation.navigate('Subjects',  { screen: 'AddSubject' }) },
    { icon: 'clipboard',     label: 'New Task',       color: COLORS.warning,   onPress: () => navigation.navigate('Tasks',     { screen: 'AddTask' }) },
    { icon: 'time',          label: 'Study Session',  color: COLORS.success,   onPress: () => navigation.navigate('Timetable', { screen: 'AddSession' }) },
    { icon: 'bulb',          label: 'AI Suggestions', color: COLORS.secondary, onPress: () => navigation.navigate('AIStudySuggestion') },
    { icon: 'timer-outline', label: 'Pomodoro Timer', color: '#A78BFA',        onPress: () => navigation.navigate('Timetable', { screen: 'Pomodoro' }) },
    { icon: 'bar-chart',     label: 'My Progress',    color: '#34D399',        onPress: () => navigation.navigate('Progress') },
  ];

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <LinearGradient
        colors={['#0F0C29', '#302B63', '#24243E']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
      />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <LinearGradient
          colors={COLORS.gradientPrimary}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>Good {getGreeting()}, 👋</Text>
              <Text style={styles.userName}>{user?.name ?? 'User'}!</Text>
              <Text style={styles.semester}>StudyNova Workspace</Text>
            </View>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{user?.name?.[0]?.toUpperCase() ?? 'S'}</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.body}>

          {/* Quick Stats */}
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.statsGrid}>
            {quickStats.map((stat, i) => (
              <TouchableOpacity key={i} style={styles.statCard} onPress={stat.onPress} activeOpacity={0.7}>
                <View style={[styles.statIcon, { backgroundColor: stat.color + '18' }]}>
                  <Ionicons name={stat.icon} size={22} color={stat.color} />
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* ── Live Productivity Card ── */}
          <TouchableOpacity
            style={styles.productivityCard}
            onPress={() => navigation.navigate('Progress')}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={['rgba(108,99,255,0.25)', 'rgba(108,99,255,0.08)']}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            <View style={styles.prodRow}>
              <View style={styles.prodStat}>
                <Text style={styles.prodNum}>{compRate}%</Text>
                <Text style={styles.prodLabel}>Completion</Text>
              </View>
              <View style={styles.prodDivider} />
              <View style={styles.prodStat}>
                <Text style={styles.prodNum}>{completedTasksCount}</Text>
                <Text style={styles.prodLabel}>Done</Text>
              </View>
              <View style={styles.prodDivider} />
              <View style={styles.prodStat}>
                <Text style={[styles.prodNum, overdueTasksCount > 0 && { color: COLORS.error }]}>
                  {overdueTasksCount}
                </Text>
                <Text style={styles.prodLabel}>Overdue</Text>
              </View>
              <View style={styles.prodDivider} />
              <View style={styles.prodStat}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Ionicons name="flame" size={14} color={COLORS.warning} />
                  <Text style={[styles.prodNum, { color: COLORS.warning }]}>{sessionCount}</Text>
                </View>
                <Text style={styles.prodLabel}>Pomodoros</Text>
              </View>
            </View>
            <View style={styles.prodFooter}>
              <Text style={styles.prodFooterText}>View full analytics →</Text>
              {isRunning && (
                <View style={styles.timerPill}>
                  <View style={styles.timerDot} />
                  <Text style={styles.timerPillText}>{TIMER_MODES_LABELS[mode]} running</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>

          {/* Quick Actions */}
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action, i) => (
              <TouchableOpacity key={i} style={styles.actionBtn} onPress={action.onPress} activeOpacity={0.8}>
                <View style={[styles.actionIcon, { backgroundColor: action.color + '18' }]}>
                  <Ionicons name={action.icon} size={24} color={action.color} />
                </View>
                <Text style={styles.actionLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

        </View>
      </ScrollView>
    </View>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Morning';
  if (h < 17) return 'Afternoon';
  return 'Evening';
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1 },
  container:     { flex: 1 },
  header: {
    paddingTop: 56,
    paddingBottom: 32,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerTop:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  greeting:     { fontSize: 14, color: 'rgba(255,255,255,0.8)', fontWeight: '500' },
  userName:     { fontSize: 26, fontWeight: '800', color: COLORS.white, marginTop: 2 },
  semester:     { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 4 },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  avatarText: { color: COLORS.white, fontSize: 20, fontWeight: '800' },
  body:       { padding: 20 },

  sectionTitle: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 14, marginTop: 8 },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 16 },
  statCard: {
    flex: 1,
    minWidth: '28%',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.borderLight,
  },
  statIcon:  { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  statValue: { fontSize: 22, fontWeight: '800', color: COLORS.textPrimary },
  statLabel: { fontSize: 11, color: COLORS.textSecondary, fontWeight: '600', marginTop: 2, textAlign: 'center' },

  // Productivity card
  productivityCard: {
    borderRadius: 18,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(108,99,255,0.3)',
    overflow: 'hidden',
  },
  prodRow:     { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  prodStat:    { flex: 1, alignItems: 'center' },
  prodNum:     { fontSize: 20, fontWeight: '800', color: COLORS.textPrimary },
  prodLabel:   { fontSize: 10, color: COLORS.textSecondary, marginTop: 2, fontWeight: '600' },
  prodDivider: { width: 1, height: 32, backgroundColor: 'rgba(255,255,255,0.1)' },
  prodFooter:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  prodFooterText: { color: COLORS.primary, fontSize: 12, fontWeight: '700' },
  timerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(76,175,130,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 5,
    borderWidth: 1,
    borderColor: 'rgba(76,175,130,0.3)',
  },
  timerDot:      { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.success },
  timerPillText: { color: COLORS.success, fontSize: 11, fontWeight: '600' },

  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  actionBtn: {
    flex: 1,
    minWidth: '44%',
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.borderLight,
  },
  actionIcon:  { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  actionLabel: { fontSize: 12, fontWeight: '600', color: COLORS.textPrimary, textAlign: 'center' },
});
