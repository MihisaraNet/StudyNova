import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Modal,
  FlatList,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle } from 'react-native-svg';
import { COLORS } from '../../constants/colors';
import useTimerStore, { TIMER_MODES } from '../../store/timerStore';
import useSubjectStore from '../../store/subjectStore';
import useTimetableStore from '../../store/timetableStore';

// ─── SVG Ring ─────────────────────────────────────────────────────────────────
const RING_SIZE   = 240;
const STROKE_W    = 14;
const RADIUS      = (RING_SIZE - STROKE_W) / 2;
const CIRCUMF     = 2 * Math.PI * RADIUS;

function TimerRing({ progress, color }) {
  const strokeDash = CIRCUMF * (1 - progress);
  return (
    <Svg width={RING_SIZE} height={RING_SIZE} style={{ transform: [{ rotate: '-90deg' }] }}>
      {/* Track */}
      <Circle
        cx={RING_SIZE / 2}
        cy={RING_SIZE / 2}
        r={RADIUS}
        stroke="rgba(255,255,255,0.07)"
        strokeWidth={STROKE_W}
        fill="none"
      />
      {/* Progress */}
      <Circle
        cx={RING_SIZE / 2}
        cy={RING_SIZE / 2}
        r={RADIUS}
        stroke={color}
        strokeWidth={STROKE_W}
        fill="none"
        strokeDasharray={CIRCUMF}
        strokeDashoffset={strokeDash}
        strokeLinecap="round"
      />
    </Svg>
  );
}

// ─── Mode Button ──────────────────────────────────────────────────────────────
function ModeBtn({ modeKey, currentMode, onPress }) {
  const active = modeKey === currentMode;
  const info   = TIMER_MODES[modeKey];
  return (
    <TouchableOpacity
      style={[styles.modeBtn, active && { backgroundColor: info.color + '30', borderColor: info.color }]}
      onPress={() => onPress(modeKey)}
      activeOpacity={0.75}
    >
      <Text style={[styles.modeBtnText, active && { color: info.color }]}>{info.label}</Text>
    </TouchableOpacity>
  );
}

// ─── Format seconds ───────────────────────────────────────────────────────────
function fmt(secs) {
  const m = String(Math.floor(secs / 60)).padStart(2, '0');
  const s = String(secs % 60).padStart(2, '0');
  return `${m}:${s}`;
}

// ─── Main Screen ─────────────────────────────────────────────────────────────
export default function PomodoroScreen({ navigation }) {
  const {
    mode, secondsLeft, isRunning, sessionCount, selectedSubject,
    setMode, setSubject, tick, start, pause, reset,
  } = useTimerStore();

  const { subjects, fetchSubjects } = useSubjectStore();
  const { addSession }              = useTimetableStore();

  const [showSubjectPicker, setShowSubjectPicker] = useState(false);
  const [completed, setCompleted]                 = useState(false); // flash on finish
  const intervalRef = useRef(null);

  // ── Load subjects ──────────────────────────────────────────────────────────
  useEffect(() => { fetchSubjects(); }, []);

  // ── Tick interval ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        tick();
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, tick]);

  // ── Detect finish ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (secondsLeft === 0 && !completed) {
      setCompleted(true);
      clearInterval(intervalRef.current);
      handleTimerComplete();
    }
    if (secondsLeft > 0) setCompleted(false);
  }, [secondsLeft]);

  const handleTimerComplete = useCallback(async () => {
    if (mode === 'FOCUS') {
      // Auto-save a study session
      const now   = new Date();
      const start = new Date(now.getTime() - TIMER_MODES.FOCUS.seconds * 1000);
      const sessionData = {
        subjectId:   selectedSubject?.id   || null,
        subjectName: selectedSubject?.name || 'Pomodoro Session',
        title:       `Pomodoro — ${selectedSubject?.name || 'Study'}`,
        startTime:   start.toISOString(),
        endTime:     now.toISOString(),
        notes:       'Auto-saved from Pomodoro timer',
        reminderEnabled: false,
      };
      await addSession(sessionData);

      Alert.alert(
        '🎉 Pomodoro Complete!',
        `Great work! A 25-minute study session has been saved to your timetable.\n\nSessions today: ${sessionCount + 1}`,
        [
          { text: 'Take Short Break', onPress: () => { setMode('SHORT_BREAK'); reset(); } },
          { text: 'Keep Going',       onPress: () => reset(), style: 'cancel' },
        ]
      );
    } else {
      Alert.alert(
        '☕ Break Over!',
        'Ready to focus again?',
        [{ text: 'Start Focusing', onPress: () => { setMode('FOCUS'); reset(); } }]
      );
    }
  }, [mode, selectedSubject, sessionCount]);

  // ── Progress fraction ──────────────────────────────────────────────────────
  const total    = TIMER_MODES[mode].seconds;
  const progress = secondsLeft / total;
  const color    = TIMER_MODES[mode].color;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <LinearGradient
        colors={['#0F0C29', '#302B63', '#24243E']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

        {/* ── Header ── */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Pomodoro Timer</Text>
          <View style={styles.sessionBadge}>
            <Ionicons name="flame" size={14} color={COLORS.warning} />
            <Text style={styles.sessionCount}>{sessionCount}</Text>
          </View>
        </View>

        {/* ── Mode Selector ── */}
        <View style={styles.modeRow}>
          {Object.keys(TIMER_MODES).map(k => (
            <ModeBtn key={k} modeKey={k} currentMode={mode} onPress={(m) => { setMode(m); reset(); }} />
          ))}
        </View>

        {/* ── Ring ── */}
        <View style={styles.ringContainer}>
          <TimerRing progress={progress} color={color} />
          <View style={styles.ringInner}>
            <Text style={[styles.timerText, { color }]}>{fmt(secondsLeft)}</Text>
            <Text style={styles.modeLabel}>{TIMER_MODES[mode].label}</Text>
          </View>
        </View>

        {/* ── Subject Selector ── */}
        <TouchableOpacity
          style={styles.subjectBtn}
          onPress={() => setShowSubjectPicker(true)}
          activeOpacity={0.8}
        >
          <Ionicons name="book-outline" size={16} color={COLORS.textSecondary} style={{ marginRight: 8 }} />
          <Text style={styles.subjectBtnText}>
            {selectedSubject ? selectedSubject.name : 'Select Subject (optional)'}
          </Text>
          <Ionicons name="chevron-down" size={14} color={COLORS.textLight} />
        </TouchableOpacity>

        {/* ── Controls ── */}
        <View style={styles.controls}>
          <TouchableOpacity style={styles.resetBtn} onPress={reset} activeOpacity={0.8}>
            <Ionicons name="refresh" size={22} color={COLORS.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.playBtn, { backgroundColor: color }]}
            onPress={isRunning ? pause : start}
            activeOpacity={0.85}
          >
            <Ionicons name={isRunning ? 'pause' : 'play'} size={32} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.resetBtn}
            onPress={() => { pause(); setMode('FOCUS'); reset(); }}
            activeOpacity={0.8}
          >
            <Ionicons name="stop" size={22} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* ── Session info ── */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="flame-outline" size={16} color={COLORS.warning} />
            <Text style={styles.infoText}>{sessionCount} Pomodoro{sessionCount !== 1 ? 's' : ''} completed today</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="save-outline" size={16} color={COLORS.success} />
            <Text style={styles.infoText}>Focus sessions auto-save to your timetable</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="information-circle-outline" size={16} color={COLORS.primary} />
            <Text style={styles.infoText}>25 min focus · 5 min short break · 15 min long break</Text>
          </View>
        </View>

      </ScrollView>

      {/* ── Subject Picker Modal ── */}
      <Modal
        visible={showSubjectPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowSubjectPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Select Subject</Text>

            <TouchableOpacity
              style={[styles.subjectItem, !selectedSubject && styles.subjectItemActive]}
              onPress={() => { setSubject(null); setShowSubjectPicker(false); }}
            >
              <Ionicons name="remove-circle-outline" size={18} color={COLORS.textSecondary} />
              <Text style={styles.subjectItemText}>No subject</Text>
            </TouchableOpacity>

            <FlatList
              data={subjects}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.subjectItem,
                    selectedSubject?.id === item.id && styles.subjectItemActive,
                  ]}
                  onPress={() => { setSubject({ id: item.id, name: item.name }); setShowSubjectPicker(false); }}
                >
                  <View style={[styles.subjectDot, { backgroundColor: item.color || COLORS.primary }]} />
                  <Text style={styles.subjectItemText}>{item.name}</Text>
                  {selectedSubject?.id === item.id && (
                    <Ionicons name="checkmark-circle" size={18} color={COLORS.primary} />
                  )}
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity style={styles.modalClose} onPress={() => setShowSubjectPicker(false)}>
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 56,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerTitle: { flex: 1, fontSize: 20, fontWeight: '800', color: '#fff' },
  sessionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,179,71,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,179,71,0.3)',
  },
  sessionCount: { color: COLORS.warning, fontWeight: '700', fontSize: 14 },

  modeRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 32,
  },
  modeBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  modeBtnText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '700',
  },

  ringContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
    position: 'relative',
  },
  ringInner: {
    position: 'absolute',
    alignItems: 'center',
  },
  timerText:  { fontSize: 56, fontWeight: '800', letterSpacing: -2 },
  modeLabel:  { fontSize: 14, color: 'rgba(255,255,255,0.5)', fontWeight: '600', marginTop: 4 },

  subjectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 24,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    marginBottom: 28,
  },
  subjectBtnText: { flex: 1, color: COLORS.textSecondary, fontSize: 13, fontWeight: '600' },

  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    marginBottom: 32,
  },
  resetBtn: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: 'rgba(255,255,255,0.07)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  playBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },

  infoCard: {
    marginHorizontal: 24,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
  },
  infoRow:  { flexDirection: 'row', alignItems: 'center', gap: 10 },
  infoText: { color: COLORS.textSecondary, fontSize: 12, flex: 1, lineHeight: 18 },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#1A1740',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '70%',
    borderTopWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalTitle: { fontSize: 17, fontWeight: '700', color: '#fff', marginBottom: 16 },
  subjectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    gap: 12,
    marginBottom: 6,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  subjectItemActive: {
    backgroundColor: 'rgba(108,99,255,0.15)',
    borderWidth: 1,
    borderColor: COLORS.primary + '60',
  },
  subjectItemText: { flex: 1, color: '#fff', fontSize: 14, fontWeight: '600' },
  subjectDot: { width: 10, height: 10, borderRadius: 5 },
  modalClose: {
    marginTop: 8,
    padding: 16,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  modalCloseText: { color: COLORS.textSecondary, fontSize: 14, fontWeight: '600' },
});
