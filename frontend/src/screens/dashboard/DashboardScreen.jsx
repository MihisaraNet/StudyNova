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
    { icon: 'book-outline',             label: 'Subjects',    value: subjects.length.toString(), color: COLORS.primaryLight, onPress: () => navigation.navigate('Subjects') },
    { icon: 'checkmark-circle-outline', label: 'Active Tasks', value: pendingTasksCount.toString(), color: COLORS.warning, onPress: () => navigation.navigate('Tasks') },
    { icon: 'calendar-outline',         label: 'Sessions',    value: sessions.length.toString(), color: COLORS.success, onPress: () => navigation.navigate('Timetable') },
  ];

  const quickActions = [
    { icon: 'add-circle-outline', label: 'Add Subject',   color: COLORS.primaryLight, onPress: () => navigation.navigate('Subjects',  { screen: 'AddSubject' }) },
    { icon: 'clipboard-outline',  label: 'New Task',       color: COLORS.warning,       onPress: () => navigation.navigate('Tasks',     { screen: 'AddTask' }) },
    { icon: 'time-outline',       label: 'Study Session',  color: COLORS.success,       onPress: () => navigation.navigate('Timetable', { screen: 'AddSession' }) },
    { icon: 'sparkles-outline',   label: 'AI Suggestions', color: COLORS.secondary,     onPress: () => navigation.navigate('AIStudySuggestion') },
    { icon: 'timer-outline',      label: 'Pomodoro Timer', color: '#A78BFA',            onPress: () => navigation.navigate('Timetable', { screen: 'Pomodoro' }) },
    { icon: 'bar-chart-outline',  label: 'My Progress',    color: '#34D399',            onPress: () => navigation.navigate('Progress') },
  ];

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Deep space radial background */}
      <LinearGradient
        colors={COLORS.gradientDark}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
      />
      
      {/* Dynamic light blobs */}
      <View style={styles.blurBlob1} />
      <View style={styles.blurBlob2} />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

        {/* ── Floating Frosted Header Card ── */}
        <View style={[styles.headerCard, COLORS.glowIndigo]}>
          <LinearGradient
            colors={['rgba(108, 99, 255, 0.18)', 'rgba(255, 255, 255, 0.02)']}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
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
        </View>

        <View style={styles.body}>

          {/* Quick Stats Grid */}
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.statsGrid}>
            {quickStats.map((stat, i) => (
              <TouchableOpacity key={i} style={styles.statCard} onPress={stat.onPress} activeOpacity={0.7}>
                <View style={[styles.statIcon, { backgroundColor: stat.color + '12' }]}>
                  <Ionicons name={stat.icon} size={22} color={stat.color} />
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* ── Premium Frosted Productivity Progress Card ── */}
          <TouchableOpacity
            style={styles.productivityCard}
            onPress={() => navigation.navigate('Progress')}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.06)', 'rgba(255, 255, 255, 0.02)']}
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

            {/* Glowing Horizontal Progress Bar */}
            <View style={styles.progressContainer}>
              <View style={styles.progressBarBg}>
                <LinearGradient
                  colors={COLORS.gradientPrimary}
                  style={[styles.progressBarFill, { width: `${compRate}%` }]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                />
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

          {/* Quick Actions Grid */}
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action, i) => (
              <TouchableOpacity key={i} style={styles.actionBtn} onPress={action.onPress} activeOpacity={0.8}>
                <View style={[styles.actionIcon, { backgroundColor: action.color + '12' }]}>
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
  
  // Background Blobs
  blurBlob1: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(108, 99, 255, 0.12)',
    top: 50,
    right: -50,
  },
  blurBlob2: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(255, 101, 132, 0.06)',
    bottom: 150,
    left: -100,
  },

  // Floating Frosted Header Card
  headerCard: {
    marginTop: 60,
    marginHorizontal: 20,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  headerTop:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  greeting:     { fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: '600', letterSpacing: 0.3 },
  userName:     { fontSize: 28, fontWeight: '900', color: COLORS.white, marginTop: 2, letterSpacing: -0.5 },
  semester:     { fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 4, fontWeight: '500' },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  avatarText: { color: COLORS.white, fontSize: 20, fontWeight: '800' },
  body:       { padding: 20, paddingTop: 8 },

  sectionTitle: { fontSize: 14, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 14, marginTop: 12, letterSpacing: 0.8, textTransform: 'uppercase' },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 16 },
  statCard: {
    flex: 1,
    minWidth: '28%',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  statIcon:  { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  statValue: { fontSize: 22, fontWeight: '800', color: COLORS.textPrimary },
  statLabel: { fontSize: 11, color: COLORS.textSecondary, fontWeight: '600', marginTop: 2, textAlign: 'center' },

  // Productivity card
  productivityCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
  },
  prodRow:     { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  prodStat:    { flex: 1, alignItems: 'center' },
  prodNum:     { fontSize: 20, fontWeight: '900', color: COLORS.textPrimary },
  prodLabel:   { fontSize: 10, color: COLORS.textSecondary, marginTop: 2, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  prodDivider: { width: 1, height: 32, backgroundColor: 'rgba(255,255,255,0.08)' },
  
  // Progress Bar styles
  progressContainer: {
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  progressBarBg: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.06)',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },

  prodFooter:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  prodFooterText: { color: COLORS.primaryLight, fontSize: 12, fontWeight: '700' },
  timerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(52,211,153,0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 5,
    borderWidth: 1,
    borderColor: 'rgba(52,211,153,0.2)',
  },
  timerDot:      { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.success },
  timerPillText: { color: COLORS.success, fontSize: 11, fontWeight: '600' },

  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  actionBtn: {
    flex: 1,
    minWidth: '44%',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  actionIcon:  { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  actionLabel: { fontSize: 12, fontWeight: '700', color: COLORS.textPrimary, textAlign: 'center' },
});
