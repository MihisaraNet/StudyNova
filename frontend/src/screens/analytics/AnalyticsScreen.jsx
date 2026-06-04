import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { BarChart, PieChart } from 'react-native-gifted-charts';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { COLORS } from '../../constants/colors';
import useTaskStore from '../../store/taskStore';
import useTimetableStore from '../../store/timetableStore';
import useSubjectStore from '../../store/subjectStore';

const { width } = Dimensions.get('window');
const CHART_WIDTH = width - 48;

// ─── Helpers ──────────────────────────────────────────────────────────────────
function minutesToHours(mins) {
  return parseFloat((mins / 60).toFixed(1));
}

function totalStudyMinutes(sessions) {
  return sessions.reduce((sum, s) => {
    if (!s.startTime || !s.endTime) return sum;
    const start = new Date(s.startTime);
    const end   = new Date(s.endTime);
    const diff  = (end - start) / 60000;
    return sum + (diff > 0 ? diff : 0);
  }, 0);
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, color, sub }) {
  return (
    <View style={[styles.statCard, { borderColor: 'rgba(255,255,255,0.06)' }]}>
      <View style={[styles.statIcon, { backgroundColor: color + '12' }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
      {sub ? <Text style={styles.statSub}>{sub}</Text> : null}
    </View>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────
function SectionHeader({ title, emoji }) {
  return (
    <View style={styles.sectionRow}>
      <Text style={styles.sectionEmoji}>{emoji}</Text>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
}

// ─── Main Screen ─────────────────────────────────────────────────────────────
export default function AnalyticsScreen({ navigation }) {
  const { tasks }    = useTaskStore();
  const { sessions } = useTimetableStore();
  const { subjects } = useSubjectStore();

  // ── Task status breakdown ──────────────────────────────────────────────────
  const completed = tasks.filter(t => t.status === 'COMPLETED').length;
  const overdue   = tasks.filter(t => t.status === 'OVERDUE').length;
  const pending   = tasks.filter(t => t.status === 'PENDING').length;
  const total     = tasks.length;
  const compRate  = total > 0 ? Math.round((completed / total) * 100) : 0;

  const donutData = useMemo(() => [
    { value: completed || 0.001, color: COLORS.success,  label: 'Done' },
    { value: pending   || 0.001, color: COLORS.primary,  label: 'Pending' },
    { value: overdue   || 0.001, color: COLORS.error,    label: 'Overdue' },
  ], [completed, pending, overdue]);

  // ── Study hours per subject (bar chart) ────────────────────────────────────
  const barData = useMemo(() => {
    const subjectHoursMap = {};
    sessions.forEach(s => {
      const key   = s.subjectId || 'Other';
      const label = s.subjectName || 'Other';
      if (!subjectHoursMap[key]) subjectHoursMap[key] = { label, mins: 0 };
      if (s.startTime && s.endTime) {
        const diff = (new Date(s.endTime) - new Date(s.startTime)) / 60000;
        if (diff > 0) subjectHoursMap[key].mins += diff;
      }
    });

    const palette = [COLORS.primaryLight, COLORS.success, COLORS.secondary, COLORS.warning, '#A78BFA', '#34D399'];
    return Object.values(subjectHoursMap).map((item, i) => ({
      value:          parseFloat((item.mins / 60).toFixed(1)),
      label:          item.label.length > 8 ? item.label.substring(0, 7) + '…' : item.label,
      frontColor:     palette[i % palette.length],
      gradientColor:  palette[i % palette.length] + '60',
      topLabelComponent: () => (
        <Text style={{ color: COLORS.textSecondary, fontSize: 9, marginBottom: 2, fontWeight: '750' }}>
          {parseFloat((item.mins / 60).toFixed(1))}h
        </Text>
      ),
    }));
  }, [sessions]);

  // ── Weekly heatmap (last 7 days) ───────────────────────────────────────────
  const weekDays = useMemo(() => {
    const today = new Date();
    const weekStart = startOfWeek(today, { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => {
      const day = addDays(weekStart, i);
      const hasSessions = sessions.some(s => s.startTime && isSameDay(new Date(s.startTime), day));
      const isToday = isSameDay(day, today);
      return { day, hasSessions, isToday, label: format(day, 'EEE') };
    });
  }, [sessions]);

  // ── Total study hours ──────────────────────────────────────────────────────
  const totalHours = minutesToHours(totalStudyMinutes(sessions));

  // ── Per-subject quick stats ────────────────────────────────────────────────
  const subjectStats = useMemo(() => {
    return subjects.map(sub => {
      const subTasks    = tasks.filter(t => t.subjectId === sub.id);
      const subSessions = sessions.filter(s => s.subjectId === sub.id);
      const subHours    = minutesToHours(totalStudyMinutes(subSessions));
      const subDone     = subTasks.filter(t => t.status === 'COMPLETED').length;
      return { ...sub, taskCount: subTasks.length, doneCount: subDone, hours: subHours };
    });
  }, [subjects, tasks, sessions]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <LinearGradient
        colors={COLORS.gradientDark}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
      />
      
      {/* Decorative Blob */}
      <View style={styles.blurBlob} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

        {/* ── Header Card (Floating Frosted Panel) ── */}
        <View style={[styles.headerCard, COLORS.glowIndigo]}>
          <LinearGradient
            colors={['rgba(108, 99, 255, 0.18)', 'rgba(255, 255, 255, 0.02)']}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          <Text style={styles.headerTitle}>Analytics</Text>
          <Text style={styles.headerSub}>Your study performance overview</Text>

          {/* Productivity score row */}
          <View style={styles.scoreRow}>
            <View style={styles.scoreBadge}>
              <Text style={styles.scoreNum}>{compRate}%</Text>
              <Text style={styles.scoreLabel}>Completion Rate</Text>
            </View>
            <View style={styles.scoreBadge}>
              <Text style={styles.scoreNum}>{totalHours}h</Text>
              <Text style={styles.scoreLabel}>Total Study Time</Text>
            </View>
            <View style={styles.scoreBadge}>
              <Text style={styles.scoreNum}>{sessions.length}</Text>
              <Text style={styles.scoreLabel}>Sessions Logged</Text>
            </View>
          </View>
        </View>

        <View style={styles.body}>

          {/* ── Quick Stats ── */}
          <SectionHeader emoji="📌" title="Task Overview" />
          <View style={styles.statsRow}>
            <StatCard icon="checkmark-circle-outline" label="Completed" value={completed} color={COLORS.success} />
            <StatCard icon="time-outline"             label="Pending"   value={pending}   color={COLORS.primaryLight} />
            <StatCard icon="alert-circle-outline"     label="Overdue"   value={overdue}   color={COLORS.error} />
          </View>

          {/* ── Donut Chart — Task Status ── */}
          {total > 0 ? (
            <>
              <SectionHeader emoji="🎯" title="Task Breakdown" />
              <View style={styles.chartCard}>
                <View style={styles.donutRow}>
                  <PieChart
                    data={donutData}
                    donut
                    radius={70}
                    innerRadius={46}
                    innerCircleColor={'#0D0B1F'}
                    centerLabelComponent={() => (
                      <View style={{ alignItems: 'center' }}>
                        <Text style={{ color: '#fff', fontSize: 22, fontWeight: '900' }}>{compRate}%</Text>
                        <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: '700' }}>Done</Text>
                      </View>
                    )}
                  />
                  <View style={styles.legend}>
                    {[
                      { label: 'Completed', color: COLORS.success, val: completed },
                      { label: 'Pending',   color: COLORS.primaryLight, val: pending },
                      { label: 'Overdue',   color: COLORS.error,   val: overdue },
                    ].map(item => (
                      <View key={item.label} style={styles.legendItem}>
                        <View style={[styles.dot, { backgroundColor: item.color }]} />
                        <Text style={styles.legendText}>{item.label}</Text>
                        <Text style={styles.legendVal}>{item.val}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            </>
          ) : (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyEmoji}>📋</Text>
              <Text style={styles.emptyText}>Add tasks to see your progress breakdown</Text>
            </View>
          )}

          {/* ── Bar Chart — Study Hours per Subject ── */}
          <SectionHeader emoji="📚" title="Study Hours by Subject" />
          {barData.length > 0 ? (
            <View style={styles.chartCard}>
              <BarChart
                data={barData}
                width={CHART_WIDTH - 40}
                height={160}
                barWidth={28}
                spacing={16}
                roundedTop
                hideRules
                xAxisThickness={1}
                xAxisColor={'rgba(255,255,255,0.08)'}
                yAxisThickness={0}
                yAxisTextStyle={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: '600' }}
                xAxisLabelTextStyle={{ color: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: '600' }}
                noOfSections={4}
                maxValue={Math.max(...barData.map(d => d.value), 1) + 0.5}
                isAnimated
              />
            </View>
          ) : (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyEmoji}>⏱️</Text>
              <Text style={styles.emptyText}>Log study sessions to see hours per subject</Text>
            </View>
          )}

          {/* ── Weekly Heatmap ── */}
          <SectionHeader emoji="🗓️" title="This Week" />
          <View style={styles.chartCard}>
            <View style={styles.heatmapRow}>
              {weekDays.map(({ day, hasSessions, isToday, label }) => (
                <View key={label} style={styles.heatmapCol}>
                  <View style={[
                    styles.heatmapCell,
                    hasSessions && styles.heatmapActive,
                    isToday    && styles.heatmapToday,
                  ]}>
                    {hasSessions && <Ionicons name="checkmark" size={12} color="#fff" />}
                  </View>
                  <Text style={[styles.heatmapLabel, isToday && { color: COLORS.primaryLight }]}>{label}</Text>
                  <Text style={styles.heatmapDate}>{format(day, 'd')}</Text>
                </View>
              ))}
            </View>
            <View style={styles.heatmapLegend}>
              <View style={styles.heatmapDot} /><Text style={styles.heatmapLegendText}>Studied</Text>
              <View style={[styles.heatmapDot, { backgroundColor: COLORS.primary, marginLeft: 12 }]} />
              <Text style={styles.heatmapLegendText}>Today</Text>
            </View>
          </View>

          {/* ── Per-Subject Cards ── */}
          {subjectStats.length > 0 && (
            <>
              <SectionHeader emoji="🏷️" title="Subject Details" />
              {subjectStats.map(sub => (
                <View key={sub.id} style={styles.subjectCard}>
                  <View style={[styles.subjectDot, { backgroundColor: sub.color || COLORS.primary }]} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.subjectName}>{sub.name}</Text>
                    <Text style={styles.subjectMeta}>
                      {sub.doneCount}/{sub.taskCount} tasks completed · {sub.hours}h studied
                    </Text>
                    {/* Mini progress bar */}
                    <View style={styles.progressTrack}>
                      <View style={[
                        styles.progressFill,
                        {
                          width: sub.taskCount > 0
                            ? `${Math.round((sub.doneCount / sub.taskCount) * 100)}%`
                            : '0%',
                          backgroundColor: sub.color || COLORS.primary,
                        }
                      ]} />
                    </View>
                  </View>
                  <Text style={[styles.subjectPct, { color: sub.color || COLORS.primary }]}>
                    {sub.taskCount > 0 ? Math.round((sub.doneCount / sub.taskCount) * 100) : 0}%
                  </Text>
                </View>
              ))}
            </>
          )}

        </View>
      </ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
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
  headerTitle: { fontSize: 28, fontWeight: '950', color: '#fff', marginBottom: 4, letterSpacing: -0.5 },
  headerSub:   { fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 20, fontWeight: '500' },
  scoreRow: { flexDirection: 'row', gap: 12 },
  scoreBadge: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  scoreNum:   { fontSize: 20, fontWeight: '900', color: '#fff' },
  scoreLabel: { fontSize: 10, color: 'rgba(255,255,255,0.5)', marginTop: 2, textAlign: 'center', fontWeight: '600' },

  body: { padding: 20, paddingTop: 8 },

  sectionRow:  { flexDirection: 'row', alignItems: 'center', marginBottom: 12, marginTop: 12 },
  sectionEmoji:{ fontSize: 18, marginRight: 8 },
  sectionTitle:{ fontSize: 14, fontWeight: '800', color: COLORS.textPrimary, textTransform: 'uppercase', letterSpacing: 0.8 },

  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  statIcon:  { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  statValue: { fontSize: 20, fontWeight: '800', color: COLORS.textPrimary },
  statLabel: { fontSize: 10, color: COLORS.textSecondary, fontWeight: '700', marginTop: 2, textAlign: 'center', textTransform: 'uppercase', letterSpacing: 0.3 },
  statSub:   { fontSize: 9, color: COLORS.textLight, marginTop: 2 },

  chartCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 18,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },

  donutRow:   { flexDirection: 'row', alignItems: 'center', gap: 24 },
  legend:     { flex: 1, gap: 10 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dot:        { width: 10, height: 10, borderRadius: 5 },
  legendText: { flex: 1, color: COLORS.textSecondary, fontSize: 13, fontWeight: '600' },
  legendVal:  { color: COLORS.textPrimary, fontWeight: '800', fontSize: 14 },

  heatmapRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  heatmapCol: { alignItems: 'center', gap: 4 },
  heatmapCell: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.03)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  heatmapActive: { backgroundColor: COLORS.success + 'CC', borderColor: COLORS.success },
  heatmapToday:  { borderColor: COLORS.primaryLight, borderWidth: 2 },
  heatmapLabel:  { fontSize: 10, color: COLORS.textSecondary, fontWeight: '700' },
  heatmapDate:   { fontSize: 9, color: COLORS.textLight, fontWeight: '600' },
  heatmapLegend: { flexDirection: 'row', alignItems: 'center' },
  heatmapDot:    { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.success, marginRight: 4 },
  heatmapLegendText: { color: COLORS.textLight, fontSize: 11, fontWeight: '600' },

  subjectCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.06)',
    gap: 12,
  },
  subjectDot:  { width: 12, height: 12, borderRadius: 6 },
  subjectName: { fontSize: 14, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 3 },
  subjectMeta: { fontSize: 11, color: COLORS.textSecondary, marginBottom: 6, fontWeight: '500' },
  progressTrack: {
    height: 5,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: { height: 5, borderRadius: 3 },
  subjectPct: { fontSize: 15, fontWeight: '900' },

  emptyCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 16,
    padding: 28,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  emptyEmoji: { fontSize: 32, marginBottom: 10 },
  emptyText:  { color: COLORS.textSecondary, fontSize: 13, textAlign: 'center', lineHeight: 20, fontWeight: '600' },
});
