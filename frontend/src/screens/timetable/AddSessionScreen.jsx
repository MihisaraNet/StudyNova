import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import useSubjectStore from '../../store/subjectStore';
import useTimetableStore from '../../store/timetableStore';
import { COLORS } from '../../constants/colors';

const PRESETS = {
  days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  offsets: [5, 15, 30, 60],
  colors: ['#6366f1', '#10b981', '#8b5cf6', '#f43f5e', '#f59e0b', '#06b6d4'],
};

export default function AddSessionScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const editingSession = route.params?.session;

  const { subjects, fetchSubjects } = useSubjectStore();
  const { addSession, editSession, isLoading, error, clearError } = useTimetableStore();

  // ─── Form State ─────────────────────────────────────────────────────────────
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [title, setTitle] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState('Monday');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:30');
  const [location, setLocation] = useState('');
  const [color, setColor] = useState('#6366f1');
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [reminderMinutesBefore, setReminderMinutesBefore] = useState(15);

  useEffect(() => {
    fetchSubjects();
    clearError();

    if (editingSession) {
      setSelectedSubjectId(editingSession.subjectId || '');
      setTitle(editingSession.title);
      setDayOfWeek(editingSession.dayOfWeek);
      setStartTime(editingSession.startTime);
      setEndTime(editingSession.endTime);
      setLocation(editingSession.location || '');
      setColor(editingSession.color || '#6366f1');
      setReminderEnabled(editingSession.reminderEnabled);
      setReminderMinutesBefore(editingSession.reminderMinutesBefore || 15);
    }
  }, [editingSession]);

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Required Field', 'Please enter a study session title.');
      return;
    }

    // Validate times (basic check: HH:MM format)
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
      Alert.alert('Invalid Time', 'Please use the HH:MM 24-hour time format.');
      return;
    }

    if (startTime.localeCompare(endTime) >= 0) {
      Alert.alert('Invalid Duration', 'Start time must be strictly before the end time.');
      return;
    }

    // Find the subject name for caching
    const matchedSubject = subjects.find(sub => sub.id === selectedSubjectId);
    const subjectName = matchedSubject ? matchedSubject.name : 'General Study';

    const payload = {
      subjectId: selectedSubjectId || null,
      subjectName,
      title: title.trim(),
      dayOfWeek,
      startTime,
      endTime,
      location: location.trim(),
      color,
      reminderEnabled,
      reminderMinutesBefore,
    };

    let result;
    if (editingSession) {
      result = await editSession(editingSession.id, payload);
    } else {
      result = await addSession(payload);
    }

    if (result.success) {
      navigation.goBack();
    } else {
      Alert.alert('Save Failed', result.message || 'An error occurred while saving.');
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0F0C29', '#302B63', '#24243E']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
      />

      {/* ─── Header bar ──────────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {editingSession ? 'Edit Study Session' : 'Add Study Session'}
        </Text>
        <View style={{ width: 40 }} /> {/* Spacer */}
      </View>

      <ScrollView contentContainerStyle={styles.formContainer} showsVerticalScrollIndicator={false}>
        {/* ─── SUBJECT SELECTOR ────────────────────────────────────────────────── */}
        <Text style={styles.label}>Select Course Subject</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.subjectChipsScroll}
        >
          <TouchableOpacity
            style={[
              styles.subjectChip,
              selectedSubjectId === '' && styles.subjectChipActive
            ]}
            onPress={() => setSelectedSubjectId('')}
          >
            <Text style={[styles.subjectChipText, selectedSubjectId === '' && styles.subjectChipTextActive]}>
              General Study
            </Text>
          </TouchableOpacity>
          {subjects.map((sub) => {
            const isSelected = sub.id === selectedSubjectId;
            return (
              <TouchableOpacity
                key={sub.id}
                style={[
                  styles.subjectChip,
                  isSelected && styles.subjectChipActive
                ]}
                onPress={() => setSelectedSubjectId(sub.id)}
              >
                <Text style={[styles.subjectChipText, isSelected && styles.subjectChipTextActive]}>
                  {sub.code}: {sub.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* ─── SESSION TITLE ──────────────────────────────────────────────────── */}
        <Text style={styles.label}>Session Title / Topic</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Midterm Preparation, Homework..."
          placeholderTextColor={COLORS.textLight}
          value={title}
          onChangeText={setTitle}
        />

        {/* ─── DAY OF THE WEEK ────────────────────────────────────────────────── */}
        <Text style={styles.label}>Day of the Week</Text>
        <View style={styles.daysGrid}>
          {PRESETS.days.map((day) => {
            const isSelected = day === dayOfWeek;
            return (
              <TouchableOpacity
                key={day}
                style={[
                  styles.dayChip,
                  isSelected && styles.dayChipActive
                ]}
                onPress={() => setDayOfWeek(day)}
              >
                <Text style={[styles.dayChipText, isSelected && styles.dayChipTextActive]}>
                  {day.substring(0, 3)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ─── TIME RANGE ─────────────────────────────────────────────────────── */}
        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={styles.label}>Start Time (HH:MM)</Text>
            <TextInput
              style={styles.inputTime}
              placeholder="09:00"
              placeholderTextColor={COLORS.textLight}
              value={startTime}
              onChangeText={setStartTime}
              maxLength={5}
            />
          </View>
          <View style={styles.col}>
            <Text style={styles.label}>End Time (HH:MM)</Text>
            <TextInput
              style={styles.inputTime}
              placeholder="10:30"
              placeholderTextColor={COLORS.textLight}
              value={endTime}
              onChangeText={setEndTime}
              maxLength={5}
            />
          </View>
        </View>

        {/* ─── LOCATION ───────────────────────────────────────────────────────── */}
        <Text style={styles.label}>Location / Room (Optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Library Room 3, Online, Home..."
          placeholderTextColor={COLORS.textLight}
          value={location}
          onChangeText={setLocation}
        />

        {/* ─── COLOR SELECTOR ─────────────────────────────────────────────────── */}
        <Text style={styles.label}>Tag Color Theme</Text>
        <View style={styles.colorRow}>
          {PRESETS.colors.map((c) => {
            const isSelected = c === color;
            return (
              <TouchableOpacity
                key={c}
                style={[
                  styles.colorCircle,
                  { backgroundColor: c },
                  isSelected && styles.colorCircleActive
                ]}
                onPress={() => setColor(c)}
              >
                {isSelected && (
                  <Ionicons name="checkmark" size={16} color={COLORS.white} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ─── REMINDERS / LOCAL NOTIFICATIONS ─────────────────────────────────── */}
        <View style={styles.switchRow}>
          <View>
            <Text style={styles.switchLabel}>Activate Notification Alert</Text>
            <Text style={styles.switchSubtitle}>Schedule local push alarm on your device</Text>
          </View>
          <Switch
            value={reminderEnabled}
            onValueChange={setReminderEnabled}
            trackColor={{ false: '#767577', true: COLORS.primaryLight }}
            thumbColor={reminderEnabled ? COLORS.primary : '#f4f3f4'}
          />
        </View>

        {reminderEnabled && (
          <View style={styles.offsetsContainer}>
            <Text style={styles.label}>Reminder Offset (minutes before)</Text>
            <View style={styles.offsetsRow}>
              {PRESETS.offsets.map((offset) => {
                const isSelected = offset === reminderMinutesBefore;
                return (
                  <TouchableOpacity
                    key={offset}
                    style={[
                      styles.offsetChip,
                      isSelected && styles.offsetChipActive
                    ]}
                    onPress={() => setReminderMinutesBefore(offset)}
                  >
                    <Text style={[styles.offsetChipText, isSelected && styles.offsetChipTextActive]}>
                      {offset}m before
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* ─── ERROR BANNER ───────────────────────────────────────────────────── */}
        {error && (
          <View style={styles.errorBanner}>
            <Ionicons name="alert-circle-outline" size={18} color={COLORS.error} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* ─── SUBMIT BUTTON ──────────────────────────────────────────────────── */}
        <TouchableOpacity
          style={styles.saveBtn}
          onPress={handleSave}
          disabled={isLoading}
        >
          <LinearGradient
            colors={COLORS.gradientPrimary}
            style={styles.saveBtnGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={COLORS.white} />
            ) : (
              <>
                <Ionicons name="checkmark-circle-outline" size={20} color={COLORS.white} />
                <Text style={styles.saveBtnText}>
                  {editingSession ? 'Save Session Changes' : 'Confirm Study Session'}
                </Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

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
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  formContainer: {
    padding: 20,
    paddingBottom: 60,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primaryLight,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
    marginTop: 15,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    height: 48,
    paddingHorizontal: 16,
    color: COLORS.textPrimary,
    fontSize: 14,
    marginBottom: 5,
  },
  subjectChipsScroll: {
    paddingVertical: 5,
    flexDirection: 'row',
    gap: 8,
  },
  subjectChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  subjectChipActive: {
    backgroundColor: 'rgba(108, 99, 255, 0.15)',
    borderColor: COLORS.primaryLight,
  },
  subjectChipText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  subjectChipTextActive: {
    color: COLORS.primaryLight,
    fontWeight: '600',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 5,
  },
  dayChip: {
    flex: 1,
    minWidth: 70,
    height: 40,
    borderRadius: 10,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayChipActive: {
    backgroundColor: 'rgba(108, 99, 255, 0.15)',
    borderColor: COLORS.primaryLight,
  },
  dayChipText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  dayChipTextActive: {
    color: COLORS.primaryLight,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 5,
  },
  col: {
    flex: 1,
  },
  inputTime: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    height: 48,
    textAlign: 'center',
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  colorRow: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 5,
  },
  colorCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorCircleActive: {
    borderWidth: 2,
    borderColor: COLORS.white,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    marginTop: 20,
    marginBottom: 10,
  },
  switchLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  switchSubtitle: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  offsetsContainer: {
    marginTop: 10,
  },
  offsetsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  offsetChip: {
    flex: 1,
    minWidth: 80,
    height: 38,
    borderRadius: 8,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  offsetChipActive: {
    backgroundColor: 'rgba(255, 179, 71, 0.15)',
    borderColor: COLORS.warning,
  },
  offsetChipText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  offsetChipTextActive: {
    color: COLORS.warning,
    fontWeight: '600',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 92, 106, 0.08)',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 92, 106, 0.2)',
    marginTop: 20,
  },
  errorText: {
    fontSize: 12,
    color: COLORS.error,
    fontWeight: '600',
  },
  saveBtn: {
    marginTop: 35,
    height: 52,
    borderRadius: 14,
    overflow: 'hidden',
  },
  saveBtnGradient: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  saveBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.white,
  },
});
