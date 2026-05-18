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

export default function DashboardScreen() {
  const { user } = useAuthStore();

  const quickStats = [
    { icon: 'book-outline',          label: 'Subjects',    value: '0', color: COLORS.primary },
    { icon: 'checkmark-circle-outline', label: 'Assignments', value: '0', color: COLORS.warning },
    { icon: 'calendar-outline',      label: 'Sessions',    value: '0', color: COLORS.success },
    { icon: 'school-outline',        label: 'GPA',         value: '—', color: COLORS.secondary },
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
            <Text style={styles.greeting}>
              Good {getGreeting()}, 👋
            </Text>
            <Text style={styles.userName}>{user?.name ?? 'Student'}!</Text>
            {user?.semester && (
              <Text style={styles.semester}>{user.semester} · Student</Text>
            )}
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name?.[0]?.toUpperCase() ?? 'S'}
            </Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.body}>
        {/* Quick Stats */}
        <Text style={styles.sectionTitle}>Overview</Text>
        <View style={styles.statsGrid}>
          {quickStats.map((stat, i) => (
            <View key={i} style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: stat.color + '18' }]}>
                <Ionicons name={stat.icon} size={22} color={stat.color} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Welcome Card */}
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeEmoji}>🚀</Text>
          <Text style={styles.welcomeTitle}>You're all set up!</Text>
          <Text style={styles.welcomeText}>
            Start by adding your subjects, then track your assignments and build your study timetable.
          </Text>
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          {[
            { icon: 'add-circle',   label: 'Add Subject',    color: COLORS.primary },
            { icon: 'clipboard',    label: 'New Assignment', color: COLORS.warning },
            { icon: 'time',         label: 'Study Session',  color: COLORS.success },
            { icon: 'bulb',         label: 'AI Suggestions', color: COLORS.secondary },
          ].map((action, i) => (
            <TouchableOpacity key={i} style={styles.actionBtn} activeOpacity={0.8}>
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
  container: { flex: 1 },
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
  avatarText:   { color: COLORS.white, fontSize: 20, fontWeight: '800' },
  body:         { padding: 20 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 14, marginTop: 8 },
  statsGrid:    { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 20 },
  statCard: {
    flex: 1,
    minWidth: '44%',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.borderLight,
  },
  statIcon:   { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  statValue:  { fontSize: 22, fontWeight: '800', color: COLORS.textPrimary },
  statLabel:  { fontSize: 12, color: COLORS.textSecondary, fontWeight: '500', marginTop: 2 },
  welcomeCard: {
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(108,99,255,0.2)',
  },
  welcomeEmoji: { fontSize: 36, marginBottom: 10 },
  welcomeTitle: { fontSize: 16, fontWeight: '700', color: COLORS.primary, marginBottom: 8 },
  welcomeText:  { fontSize: 13, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 20 },
  actionsGrid:  { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
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
