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
import { getDayOfWeekString, formatTimeHHMM } from '../../utils/dateUtils';

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
        stroke="rgba(255,255,255,0.06)"
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
      style={[
        styles.modeBtn,
        active && { backgroundColor: info.color + '20', borderColor: info.color }
      ]}
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
        dayOfWeek:   getDayOfWeekString(now),
        startTime:   formatTimeHHMM(start),
        endTime:     formatTimeHHMM(now),
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
        colors={COLORS.gradientDark}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
      />
      
      {/* Decorative Blob */}
      <View style={styles.blurBlob} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

        {/* ── Header ── */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Focus Timer</Text>
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
            <Ionicons name="refresh" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.playBtn, { backgroundColor: color, shadowColor: color }]}
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
            <Ionicons name="stop" size={20} color={COLORS.textSecondary} />
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
            <Ionicons name="information-circle-outline" size={16} color={COLORS.primaryLight} />
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
                    <Ionicons name="checkmark-circle" size={18} color={COLORS.primaryLight} />
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
  blurBlob: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(108, 99, 255, 0.08)',
    top: 150,
    right: -60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 64,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerTitle: { flex: 1, fontSize: 20, fontWeight: '850', color: '#fff', letterSpacing: -0.5 },
  sessionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,179,71,0.12)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,179,71,0.22)',
  },
  sessionCount: { color: COLORS.warning, fontWeight: '750', fontSize: 13 },

  modeRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 32,
  },
  modeBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.06)',
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  modeBtnText: {
    color: COLORS.textSecondary,
    fontSize: 12,
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
  timerText:  { fontSize: 56, fontWeight: '900', letterSpacing: -1.5 },
  modeLabel:  { fontSize: 14, color: 'rgba(255,255,255,0.5)', fontWeight: '700', marginTop: 4 },

  subjectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 24,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.06)',
    marginBottom: 28,
  },
  subjectBtnText: { flex: 1, color: COLORS.textSecondary, fontSize: 13, fontWeight: '700' },

  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    marginBottom: 32,
  },
  resetBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.04)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  playBtn: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },

  infoCard: {
    marginHorizontal: 24,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16,
    padding: 16,
    gap: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  infoRow:  { flexDirection: 'row', alignItems: 'center', gap: 10 },
  infoText: { color: COLORS.textSecondary, fontSize: 12, flex: 1, lineHeight: 18, fontWeight: '600' },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#0E0B1F',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '70%',
    borderTopWidth: 1.5,
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
  modalTitle: { fontSize: 17, fontWeight: '800', color: '#fff', marginBottom: 16 },
  subjectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    gap: 12,
    marginBottom: 6,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  subjectItemActive: {
    backgroundColor: 'rgba(108,99,255,0.12)',
    borderColor: COLORS.primary + '50',
  },
  subjectItemText: { flex: 1, color: '#fff', fontSize: 14, fontWeight: '700' },
  subjectDot: { width: 10, height: 10, borderRadius: 5 },
  modalClose: {
    marginTop: 12,
    padding: 16,
    alignItems: 'center',
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  modalCloseText: { color: COLORS.textSecondary, fontSize: 14, fontWeight: '700' },
});
