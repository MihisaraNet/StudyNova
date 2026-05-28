import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import useSubjectStore from '../../store/subjectStore';
import useAssignmentStore from '../../store/assignmentStore';
import { COLORS } from '../../constants/colors';

export default function AddAssignmentScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const editingAssignment = route.params?.assignment;

  const { subjects, fetchSubjects } = useSubjectStore();
  const { addAssignment, editAssignment, isLoading, error, clearError } = useAssignmentStore();

  // ─── Form State ─────────────────────────────────────────────────────────────
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [dueDate, setDueDate] = useState(''); // YYYY-MM-DD
  const [dueTime, setDueTime] = useState('23:59'); // HH:MM
  const [priority, setPriority] = useState('MEDIUM'); // LOW, MEDIUM, HIGH
  const [estimatedHours, setEstimatedHours] = useState('2.0');
  const [reminderMinutesBefore, setReminderMinutesBefore] = useState('60');

  useEffect(() => {
    fetchSubjects();
    clearError();

    // Default due date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const dd = String(tomorrow.getDate()).padStart(2, '0');
    setDueDate(`${yyyy}-${mm}-${dd}`);

    if (editingAssignment) {
      setTitle(editingAssignment.title || '');
      setDescription(editingAssignment.description || '');
      setSelectedSubjectId(editingAssignment.subjectId || '');
      
      // Parse ISO LocalDateTime from backend (e.g. 2026-05-28T15:00:00)
      if (editingAssignment.dueDate) {
        try {
          const parts = editingAssignment.dueDate.split('T');
          setDueDate(parts[0]);
          if (parts[1]) {
            setDueTime(parts[1].substring(0, 5));
          }
        } catch (e) {
          // Fallback
        }
      }
      
      setPriority(editingAssignment.priority || 'MEDIUM');
      setEstimatedHours(String(editingAssignment.estimatedHours || '2.0'));
      setReminderMinutesBefore(String(editingAssignment.reminderMinutesBefore || '60'));
    }
  }, [editingAssignment]);

  const handleQuickDate = (type) => {
    const d = new Date();
    if (type === 'tomorrow') {
      d.setDate(d.getDate() + 1);
    } else if (type === 'nextWeek') {
      d.setDate(d.getDate() + 7);
    }
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    setDueDate(`${yyyy}-${mm}-${dd}`);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Required Field', 'Please enter an assignment title.');
      return;
    }

    // Validate due date string (YYYY-MM-DD)
    const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
    if (!dateRegex.test(dueDate)) {
      Alert.alert('Invalid Date', 'Please use the YYYY-MM-DD date format.');
      return;
    }

    // Validate time string (HH:MM)
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!timeRegex.test(dueTime)) {
      Alert.alert('Invalid Time', 'Please use the HH:MM 24-hour time format.');
      return;
    }

    // Find the subject name for caching
    const matchedSubject = subjects.find(sub => sub.id === selectedSubjectId);
    const subjectName = matchedSubject ? matchedSubject.name : 'General study task';

    // Combine date & time into LocalDateTime ISO format
    const fullDueDateISO = `${dueDate}T${dueTime}:00`;

    const payload = {
      title: title.trim(),
      description: description.trim(),
      dueDate: fullDueDateISO,
      subjectId: selectedSubjectId || null,
      subjectName: selectedSubjectId ? subjectName : null,
      priority: priority.toUpperCase(),
      estimatedHours: parseFloat(estimatedHours) || 2.0,
      reminderMinutesBefore: parseInt(reminderMinutesBefore, 10) || 60,
      status: editingAssignment?.status || 'PENDING'
    };

    let result;
    if (editingAssignment) {
      result = await editAssignment(editingAssignment.id, payload);
    } else {
      result = await addAssignment(payload);
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

      {/* Header bar */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {editingAssignment ? 'Edit Assignment' : 'New Assignment'}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.formContainer} showsVerticalScrollIndicator={false}>
          
          {/* SUBJECT SELECTOR */}
          <Text style={styles.label}>Select Subject Course</Text>
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
                General / Elective
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

          {/* ASSIGNMENT TITLE */}
          <Text style={styles.label}>Assignment Title *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Lab Report 2, Term Paper Draft..."
            placeholderTextColor={COLORS.textLight}
            value={title}
            onChangeText={setTitle}
          />

          {/* ASSIGNMENT DESCRIPTION */}
          <Text style={styles.label}>Description & Notes</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="e.g. Topics to cover, research link, file details..."
            placeholderTextColor={COLORS.textLight}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
          />

          {/* DUE DATE & QUICK SELECTS */}
          <View style={styles.row}>
            <View style={{ flex: 1.3 }}>
              <Text style={styles.label}>Due Date (YYYY-MM-DD) *</Text>
              <TextInput
                style={styles.input}
                placeholder="2026-05-28"
                placeholderTextColor={COLORS.textLight}
                value={dueDate}
                onChangeText={setDueDate}
                maxLength={10}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Due Time (HH:MM)</Text>
              <TextInput
                style={[styles.input, { textAlign: 'center' }]}
                placeholder="23:59"
                placeholderTextColor={COLORS.textLight}
                value={dueTime}
                onChangeText={setDueTime}
                maxLength={5}
              />
            </View>
          </View>

          {/* Quick Date Presets */}
          <View style={styles.quickDateRow}>
            <TouchableOpacity style={styles.quickDateBtn} onPress={() => handleQuickDate('today')}>
              <Text style={styles.quickDateText}>Today</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickDateBtn} onPress={() => handleQuickDate('tomorrow')}>
              <Text style={styles.quickDateText}>Tomorrow</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickDateBtn} onPress={() => handleQuickDate('nextWeek')}>
              <Text style={styles.quickDateText}>Next Week</Text>
            </TouchableOpacity>
          </View>

          {/* PRIORITY SELECTOR */}
          <Text style={styles.label}>Priority Assessment</Text>
          <View style={styles.priorityGrid}>
            {[
              { key: 'LOW', label: '🟢 Low', color: COLORS.priorityLow },
              { key: 'MEDIUM', label: '🟡 Medium', color: COLORS.priorityMedium },
              { key: 'HIGH', label: '🔴 High', color: COLORS.priorityHigh },
            ].map((p) => {
              const isSelected = p.key === priority;
              return (
                <TouchableOpacity
                  key={p.key}
                  style={[
                    styles.priorityChip,
                    { borderColor: isSelected ? p.color : 'rgba(255,255,255,0.08)' },
                    isSelected && { backgroundColor: p.color + '18' }
                  ]}
                  onPress={() => setPriority(p.key)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.priorityText, isSelected && { color: p.color, fontWeight: '700' }]}>
                    {p.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* ESTIMATED HOURS & REMINDER OFFSET */}
          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.label}>Est. study hours</Text>
              <TextInput
                style={[styles.input, { textAlign: 'center' }]}
                placeholder="2.0"
                placeholderTextColor={COLORS.textLight}
                value={estimatedHours}
                onChangeText={setEstimatedHours}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>Alarm offset (mins)</Text>
              <TextInput
                style={[styles.input, { textAlign: 'center' }]}
                placeholder="60"
                placeholderTextColor={COLORS.textLight}
                value={reminderMinutesBefore}
                onChangeText={setReminderMinutesBefore}
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* ERROR STATUS */}
          {error && (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle-outline" size={18} color={COLORS.error} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* SUBMIT BUTTON */}
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
                    {editingAssignment ? 'Save Assignment Changes' : 'Confirm Assignment'}
                  </Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
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
    fontSize: 11,
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
  textArea: {
    height: 90,
    paddingTop: 12,
    textAlignVertical: 'top',
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
  row: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 5,
  },
  col: {
    flex: 1,
  },
  quickDateRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
    marginBottom: 5,
  },
  quickDateBtn: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  quickDateText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
  priorityGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 5,
  },
  priorityChip: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  priorityText: {
    fontSize: 13,
    color: COLORS.textSecondary,
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
