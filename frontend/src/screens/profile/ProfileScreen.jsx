import React from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, StatusBar, Alert, Platform,
  Modal, Switch, ActivityIndicator, Linking, KeyboardAvoidingView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import useAuthStore from '../../store/authStore';
import AlertPopup from '../../components/common/AlertPopup';
import InputField from '../../components/common/InputField';
import Button from '../../components/common/Button';
import * as authService from '../../services/authService';
import * as storage from '../../utils/storage';

export default function ProfileScreen() {
  const { user, logout, setUser } = useAuthStore();
  const [showLogoutAlert, setShowLogoutAlert] = React.useState(false);
  
  // Modal & Form States
  const [activeModal, setActiveModal] = React.useState(null); // 'edit_profile' | 'change_password' | 'notifications' | 'support' | 'about' | null
  const [loading, setLoading] = React.useState(false);
  const [formError, setFormError] = React.useState('');

  // Edit Profile Form
  const [editName, setEditName] = React.useState('');

  // Change Password Form
  const [currentPassword, setCurrentPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');

  // Notification Settings Form
  const [studyReminders, setStudyReminders] = React.useState(true);
  const [deadlineAlerts, setDeadlineAlerts] = React.useState(true);
  const [weeklyDigest, setWeeklyDigest] = React.useState(false);
  const [aiAlerts, setAiAlerts] = React.useState(true);

  // Help & Support Form
  const [supportSubject, setSupportSubject] = React.useState('');
  const [supportMessage, setSupportMessage] = React.useState('');
  const [activeFaq, setActiveFaq] = React.useState(null); // FAQ Accordion active index

  // Load notification preferences on mount
  React.useEffect(() => {
    loadNotificationSettings();
  }, []);

  const loadNotificationSettings = async () => {
    try {
      const reminders = await storage.getItem('setting_study_reminders');
      const deadlines = await storage.getItem('setting_deadline_alerts');
      const digest = await storage.getItem('setting_weekly_digest');
      const ai = await storage.getItem('setting_ai_alerts');

      if (reminders !== null) setStudyReminders(reminders === 'true');
      if (deadlines !== null) setDeadlineAlerts(deadlines === 'true');
      if (digest !== null) setWeeklyDigest(digest === 'true');
      if (ai !== null) setAiAlerts(ai === 'true');
    } catch (e) {
      console.log('Error loading settings', e);
    }
  };

  const saveNotificationSettings = async (key, val) => {
    try {
      await storage.setItem(key, val ? 'true' : 'false');
    } catch (e) {
      console.log('Error saving setting', e);
    }
  };

  const handleLogout = () => {
    setShowLogoutAlert(true);
  };

  // ─── API Submit Handlers ──────────────────────────────────────────────────

  const handleSaveProfile = async () => {
    if (!editName.trim()) {
      setFormError('Name is required');
      return;
    }
    setLoading(true);
    setFormError('');
    try {
      const response = await authService.updateProfile({ name: editName.trim() });
      if (response && response.success) {
        // Update user in global store and storage
        const updatedUser = { ...user, name: editName.trim() };
        await setUser(updatedUser);
        setActiveModal(null);
        Alert.alert('Success', 'Profile updated successfully!');
      } else {
        setFormError(response?.message || 'Failed to update profile');
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'An error occurred while updating profile';
      setFormError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setFormError('All fields are required');
      return;
    }
    if (newPassword.length < 6) {
      setFormError('New password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }

    setLoading(true);
    setFormError('');
    try {
      const response = await authService.changePassword(currentPassword, newPassword);
      if (response && response.success) {
        setActiveModal(null);
        Alert.alert('Success', 'Password changed successfully!');
      } else {
        setFormError(response?.message || 'Failed to change password');
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Incorrect current password or change failed';
      setFormError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleSendSupportTicket = () => {
    if (!supportSubject.trim() || !supportMessage.trim()) {
      setFormError('Subject and message are required');
      return;
    }
    setLoading(true);
    setFormError('');
    
    // Simulate API request
    setTimeout(() => {
      setLoading(false);
      setActiveModal(null);
      Alert.alert(
        'Support Ticket Submitted',
        `Thank you for contacting us! We've received your request and will get back to you at ${user?.email || 'your registered email'} within 24 hours.`
      );
    }, 1200);
  };

  const menuItems = [
    { 
      icon: 'person-outline', 
      label: 'Edit Profile', 
      color: COLORS.primary,
      action: () => {
        setEditName(user?.name ?? '');
        setFormError('');
        setActiveModal('edit_profile');
      }
    },
    { 
      icon: 'lock-closed-outline', 
      label: 'Change Password', 
      color: COLORS.warning,
      action: () => {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setFormError('');
        setActiveModal('change_password');
      }
    },
    { 
      icon: 'notifications-outline', 
      label: 'Notifications', 
      color: COLORS.success,
      action: () => {
        loadNotificationSettings();
        setActiveModal('notifications');
      }
    },
    { 
      icon: 'help-circle-outline', 
      label: 'Help & Support', 
      color: '#00D2FF',
      action: () => {
        setSupportSubject('');
        setSupportMessage('');
        setFormError('');
        setActiveFaq(null);
        setActiveModal('support');
      }
    },
    { 
      icon: 'information-circle-outline', 
      label: 'About App', 
      color: COLORS.secondary,
      action: () => {
        setActiveModal('about');
      }
    },
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

        <LinearGradient
          colors={COLORS.gradientPrimary}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.avatarBig}>
            <Text style={styles.avatarText}>
              {user?.name?.[0]?.toUpperCase() ?? 'S'}
            </Text>
          </View>
          <Text style={styles.name}>{user?.name ?? 'Student'}</Text>
          <Text style={styles.email}>{user?.email ?? ''}</Text>
        </LinearGradient>

        <View style={styles.body}>
          {/* Menu */}
          <View style={styles.menu}>
            {menuItems.map((item, i) => (
              <TouchableOpacity key={i} style={styles.menuItem} activeOpacity={0.8} onPress={item.action}>
                <View style={[styles.menuIcon, { backgroundColor: item.color + '18' }]}>
                  <Ionicons name={item.icon} size={20} color={item.color} />
                </View>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Ionicons name="chevron-forward" size={16} color={COLORS.textLight} />
              </TouchableOpacity>
            ))}
          </View>

          {/* Logout */}
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.85}>
            <Ionicons name="log-out-outline" size={20} color={COLORS.error} />
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>

          <Text style={styles.version}>StudyNova v1.0.0</Text>
          <Text style={styles.copyright}>© 2026 Isula Mihisara. All Rights Reserved.</Text>
        </View>
      </ScrollView>

      {/* ─── 1. EDIT PROFILE MODAL ─── */}
      <Modal
        visible={activeModal === 'edit_profile'}
        animationType="slide"
        transparent
        onRequestClose={() => setActiveModal(null)}
      >
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalContainer}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <View style={styles.modalHeaderTitleRow}>
                  <Ionicons name="person-outline" size={20} color={COLORS.primary} />
                  <Text style={styles.modalTitle}>Edit Profile</Text>
                </View>
                <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setActiveModal(null)}>
                  <Ionicons name="close" size={24} color={COLORS.textLight} />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
                <InputField
                  label="FULL NAME"
                  placeholder="Enter your name"
                  value={editName}
                  onChangeText={setEditName}
                  icon="person-outline"
                  error={formError}
                />

                <Button
                  title="Save Changes"
                  onPress={handleSaveProfile}
                  loading={loading}
                  style={{ marginTop: 10 }}
                />
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      {/* ─── 2. CHANGE PASSWORD MODAL ─── */}
      <Modal
        visible={activeModal === 'change_password'}
        animationType="slide"
        transparent
        onRequestClose={() => setActiveModal(null)}
      >
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalContainer}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <View style={styles.modalHeaderTitleRow}>
                  <Ionicons name="lock-closed-outline" size={20} color={COLORS.warning} />
                  <Text style={styles.modalTitle}>Change Password</Text>
                </View>
                <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setActiveModal(null)}>
                  <Ionicons name="close" size={24} color={COLORS.textLight} />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
                {formError ? (
                  <View style={styles.modalErrorBanner}>
                    <Ionicons name="alert-circle-outline" size={16} color={COLORS.error} />
                    <Text style={styles.modalErrorText}>{formError}</Text>
                  </View>
                ) : null}

                <InputField
                  label="CURRENT PASSWORD"
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  secureTextEntry
                  icon="lock-closed-outline"
                />

                <InputField
                  label="NEW PASSWORD"
                  placeholder="Enter new password (min. 6 characters)"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry
                  icon="lock-open-outline"
                />

                <InputField
                  label="CONFIRM NEW PASSWORD"
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  icon="checkmark-done-outline"
                />

                <Button
                  title="Update Password"
                  onPress={handleUpdatePassword}
                  loading={loading}
                  style={{ marginTop: 10 }}
                />
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      {/* ─── 3. NOTIFICATIONS MODAL ─── */}
      <Modal
        visible={activeModal === 'notifications'}
        animationType="slide"
        transparent
        onRequestClose={() => setActiveModal(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <View style={styles.modalHeaderTitleRow}>
                  <Ionicons name="notifications-outline" size={20} color={COLORS.success} />
                  <Text style={styles.modalTitle}>Notifications</Text>
                </View>
                <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setActiveModal(null)}>
                  <Ionicons name="close" size={24} color={COLORS.textLight} />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
                <Text style={styles.modalSectionDesc}>
                  Configure how and when StudyNova sends you study updates and alerts.
                </Text>

                <View style={styles.settingRow}>
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingTitle}>Study Reminders</Text>
                    <Text style={styles.settingDesc}>Get reminded before your scheduled classes or self-study sessions</Text>
                  </View>
                  <Switch
                    trackColor={{ false: '#3A3859', true: COLORS.primary + '80' }}
                    thumbColor={studyReminders ? COLORS.primary : '#A0A0C0'}
                    value={studyReminders}
                    onValueChange={(val) => {
                      setStudyReminders(val);
                      saveNotificationSettings('setting_study_reminders', val);
                    }}
                  />
                </View>

                <View style={styles.settingRow}>
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingTitle}>Task Deadlines</Text>
                    <Text style={styles.settingDesc}>Alerts for upcoming high priority task deadlines</Text>
                  </View>
                  <Switch
                    trackColor={{ false: '#3A3859', true: COLORS.success + '80' }}
                    thumbColor={deadlineAlerts ? COLORS.success : '#A0A0C0'}
                    value={deadlineAlerts}
                    onValueChange={(val) => {
                      setDeadlineAlerts(val);
                      saveNotificationSettings('setting_deadline_alerts', val);
                    }}
                  />
                </View>

                <View style={styles.settingRow}>
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingTitle}>Weekly Digest</Text>
                    <Text style={styles.settingDesc}>A progress report of your completed tasks and subjects every weekend</Text>
                  </View>
                  <Switch
                    trackColor={{ false: '#3A3859', true: COLORS.warning + '80' }}
                    thumbColor={weeklyDigest ? COLORS.warning : '#A0A0C0'}
                    value={weeklyDigest}
                    onValueChange={(val) => {
                      setWeeklyDigest(val);
                      saveNotificationSettings('setting_weekly_digest', val);
                    }}
                  />
                </View>

                <View style={styles.settingRow}>
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingTitle}>AI Assistant Alerts</Text>
                    <Text style={styles.settingDesc}>Receive smart suggestions and tips from the Gemini Study Advisor</Text>
                  </View>
                  <Switch
                    trackColor={{ false: '#3A3859', true: COLORS.primaryLight + '80' }}
                    thumbColor={aiAlerts ? COLORS.primaryLight : '#A0A0C0'}
                    value={aiAlerts}
                    onValueChange={(val) => {
                      setAiAlerts(val);
                      saveNotificationSettings('setting_ai_alerts', val);
                    }}
                  />
                </View>

                <Button
                  title="Close & Save"
                  onPress={() => setActiveModal(null)}
                  style={{ marginTop: 20 }}
                />
              </ScrollView>
            </View>
          </View>
        </View>
      </Modal>

      {/* ─── 4. HELP & SUPPORT MODAL ─── */}
      <Modal
        visible={activeModal === 'support'}
        animationType="slide"
        transparent
        onRequestClose={() => setActiveModal(null)}
      >
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalContainer}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <View style={styles.modalHeaderTitleRow}>
                  <Ionicons name="help-circle-outline" size={20} color="#00D2FF" />
                  <Text style={styles.modalTitle}>Help & Support</Text>
                </View>
                <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setActiveModal(null)}>
                  <Ionicons name="close" size={24} color={COLORS.textLight} />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
                
                <Text style={styles.supportSectionHeader}>Frequently Asked Questions</Text>
                
                {[
                  {
                    q: "How do I sync or edit my timetable?",
                    a: "Navigate to the Timetable tab in the bottom bar where you can click 'Add Class' to set self-study hours or classes. Click on any class to edit or delete it."
                  },
                  {
                    q: "How does the AI Study Advisor work?",
                    a: "It parses your active subjects, pending task priorities, and timetable using Google Gemini to construct an optimized hour-by-hour workload plan and performance strategies."
                  },
                  {
                    q: "Can I use the app offline?",
                    a: "Local features (viewing timetable, checking off tasks, editing profile) are available offline. AI generation and backend syncing require an active internet connection."
                  }
                ].map((faq, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.faqCard}
                    activeOpacity={0.7}
                    onPress={() => setActiveFaq(activeFaq === index ? null : index)}
                  >
                    <View style={styles.faqHeader}>
                      <Text style={styles.faqQuestion}>{faq.q}</Text>
                      <Ionicons
                        name={activeFaq === index ? "chevron-up" : "chevron-down"}
                        size={16}
                        color={COLORS.primary}
                      />
                    </View>
                    {activeFaq === index && (
                      <Text style={styles.faqAnswer}>{faq.a}</Text>
                    )}
                  </TouchableOpacity>
                ))}

                <Text style={styles.supportSectionHeader}>Contact the Developer</Text>
                <View style={styles.devContactRow}>
                  <TouchableOpacity 
                    style={styles.contactBtn}
                    onPress={() => Linking.openURL('mailto:isuimk@gmail.com')}
                  >
                    <Ionicons name="mail" size={20} color={COLORS.primary} />
                    <Text style={styles.contactBtnText}>isuimk@gmail.com</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={styles.contactBtn}
                    onPress={() => Linking.openURL('https://github.com/MihisaraNet')}
                  >
                    <Ionicons name="logo-github" size={20} color={COLORS.white} />
                    <Text style={styles.contactBtnText}>GitHub: MihisaraNet</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.supportSectionHeader}>Submit a Support Ticket</Text>

                {formError ? (
                  <Text style={styles.errorTextSmall}>{formError}</Text>
                ) : null}

                <InputField
                  label="SUBJECT"
                  placeholder="Brief description of the issue"
                  value={supportSubject}
                  onChangeText={setSupportSubject}
                  icon="bookmark-outline"
                />

                <InputField
                  label="MESSAGE"
                  placeholder="Describe your issue or feedback in detail..."
                  value={supportMessage}
                  onChangeText={setSupportMessage}
                  multiline
                  numberOfLines={4}
                  icon="chatbubble-ellipses-outline"
                />

                <Button
                  title="Submit Ticket"
                  onPress={handleSendSupportTicket}
                  loading={loading}
                  style={{ marginTop: 10, marginBottom: 20 }}
                />
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      {/* ─── 5. ABOUT APP MODAL ─── */}
      <Modal
        visible={activeModal === 'about'}
        animationType="slide"
        transparent
        onRequestClose={() => setActiveModal(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <View style={styles.modalHeaderTitleRow}>
                  <Ionicons name="information-circle-outline" size={20} color={COLORS.secondary} />
                  <Text style={styles.modalTitle}>About StudyNova</Text>
                </View>
                <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setActiveModal(null)}>
                  <Ionicons name="close" size={24} color={COLORS.textLight} />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
                
                <View style={styles.aboutLogoContainer}>
                  <LinearGradient
                    colors={COLORS.gradientPrimary}
                    style={styles.aboutLogoRing}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Ionicons name="rocket-outline" size={36} color={COLORS.white} />
                  </LinearGradient>
                  <Text style={styles.aboutAppName}>StudyNova</Text>
                  <Text style={styles.aboutVersion}>v1.0.0 (Production Release)</Text>
                </View>

                <Text style={styles.aboutDesc}>
                  StudyNova is an intelligent student study companion built to help you optimize learning schedules, organize tasks, and boost your daily academic productivity. Powered by advanced Gemini Pro AI advisor.
                </Text>

                <Text style={styles.aboutSectionTitle}>Key Tech & Credits</Text>
                <View style={styles.techBulletRow}>
                  <Ionicons name="hardware-chip-outline" size={16} color={COLORS.primary} />
                  <Text style={styles.techBulletText}>Frontend: React Native, Expo, Zustand</Text>
                </View>
                <View style={styles.techBulletRow}>
                  <Ionicons name="server-outline" size={16} color={COLORS.primary} />
                  <Text style={styles.techBulletText}>Backend: Spring Boot, MongoDB, Spring Security</Text>
                </View>
                <View style={styles.techBulletRow}>
                  <Ionicons name="color-palette-outline" size={16} color={COLORS.primary} />
                  <Text style={styles.techBulletText}>Author: Isula Mihisara</Text>
                </View>

                <Text style={styles.aboutSectionTitle}>Developer Links</Text>
                
                <TouchableOpacity 
                  style={styles.aboutLinkCard}
                  onPress={() => Linking.openURL('https://github.com/MihisaraNet')}
                >
                  <Ionicons name="logo-github" size={20} color={COLORS.white} />
                  <View style={styles.aboutLinkTextContainer}>
                    <Text style={styles.aboutLinkTitle}>GitHub Profile</Text>
                    <Text style={styles.aboutLinkUrl}>github.com/MihisaraNet</Text>
                  </View>
                  <Ionicons name="open-outline" size={16} color={COLORS.textLight} />
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.aboutLinkCard}
                  onPress={() => Linking.openURL('mailto:isuimk@gmail.com')}
                >
                  <Ionicons name="mail-outline" size={20} color={COLORS.primary} />
                  <View style={styles.aboutLinkTextContainer}>
                    <Text style={styles.aboutLinkTitle}>Email Developer</Text>
                    <Text style={styles.aboutLinkUrl}>isuimk@gmail.com</Text>
                  </View>
                  <Ionicons name="open-outline" size={16} color={COLORS.textLight} />
                </TouchableOpacity>

                <Text style={styles.aboutCopyright}>© 2026 Isula Mihisara. All Rights Reserved.</Text>

                <Button
                  title="Close"
                  onPress={() => setActiveModal(null)}
                  style={{ marginTop: 12, marginBottom: 20 }}
                />
              </ScrollView>
            </View>
          </View>
        </View>
      </Modal>

      {/* Custom Premium Alert Popup */}
      <AlertPopup
        visible={showLogoutAlert}
        title="Sign Out"
        message="Are you sure you want to log out of your StudyNova workspace?"
        type="warning"
        confirmLabel="Sign Out"
        onConfirm={() => {
          setShowLogoutAlert(false);
          logout();
        }}
        onCancel={() => setShowLogoutAlert(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1 },
  container:   { flex: 1 },
  header: {
    paddingTop: 60,
    paddingBottom: 32,
    alignItems: 'center',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  avatarBig: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.5)',
    marginBottom: 12,
  },
  avatarText: { fontSize: 36, fontWeight: '800', color: COLORS.white },
  name:       { fontSize: 22, fontWeight: '800', color: COLORS.white, marginBottom: 4 },
  email:      { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginBottom: 10 },
  badge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  badgeText: { color: COLORS.white, fontSize: 12, fontWeight: '700' },
  body:      { padding: 20 },
  gpaCard: {
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(108,99,255,0.2)',
  },
  gpaLabel: { fontSize: 14, fontWeight: '600', color: COLORS.primary },
  gpaValue: { fontSize: 20, fontWeight: '800', color: COLORS.primary },
  menu: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: COLORS.borderLight,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1.5,
    borderBottomColor: COLORS.borderLight,
    gap: 14,
  },
  menuIcon:  { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  menuLabel: { flex: 1, fontSize: 14, fontWeight: '600', color: COLORS.textPrimary },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,92,106,0.1)',
    borderRadius: 14,
    padding: 16,
    gap: 10,
    marginBottom: 24,
    borderWidth: 1.5,
    borderColor: 'rgba(255,92,106,0.2)',
  },
  logoutText: { color: COLORS.error, fontSize: 15, fontWeight: '700' },
  version:   { textAlign: 'center', color: COLORS.textLight, fontSize: 12 },
  copyright: { textAlign: 'center', color: COLORS.textLight, fontSize: 10, marginTop: 4, opacity: 0.8 },
  aboutCopyright: { textAlign: 'center', color: COLORS.textLight, fontSize: 11, marginTop: 16, marginBottom: 4, opacity: 0.8 },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(10, 8, 30, 0.82)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 400,
    maxHeight: '90%',
  },
  modalContent: {
    backgroundColor: '#161334',
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 24,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1.5,
    borderBottomColor: COLORS.borderLight,
    paddingBottom: 14,
    marginBottom: 16,
  },
  modalHeaderTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.white,
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalScroll: {
    maxHeight: '100%',
  },
  modalErrorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 92, 106, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 92, 106, 0.2)',
    borderRadius: 12,
    padding: 12,
    gap: 8,
    marginBottom: 16,
  },
  modalErrorText: {
    fontSize: 13,
    color: COLORS.error,
    fontWeight: '600',
    flex: 1,
  },
  modalSectionDesc: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: 18,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1.2,
    borderColor: COLORS.borderLight,
    gap: 14,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 4,
  },
  settingDesc: {
    fontSize: 11,
    color: COLORS.textLight,
    lineHeight: 14,
  },
  supportSectionHeader: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.primary,
    marginTop: 16,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  faqCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderWidth: 1.2,
    borderColor: COLORS.borderLight,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  faqQuestion: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.white,
  },
  faqAnswer: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.04)',
    paddingTop: 8,
  },
  devContactRow: {
    flexDirection: 'column',
    gap: 8,
    marginBottom: 12,
  },
  contactBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1.2,
    borderColor: COLORS.borderLight,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  contactBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  errorTextSmall: {
    fontSize: 12,
    color: COLORS.error,
    marginBottom: 10,
    fontWeight: '600',
  },
  aboutLogoContainer: {
    alignItems: 'center',
    marginVertical: 14,
  },
  aboutLogoRing: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  aboutAppName: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.white,
  },
  aboutVersion: {
    fontSize: 12,
    color: COLORS.primaryLight,
    fontWeight: '600',
    marginTop: 2,
  },
  aboutDesc: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 18,
    paddingHorizontal: 4,
  },
  aboutSectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.primary,
    marginTop: 14,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  techBulletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
    paddingLeft: 6,
  },
  techBulletText: {
    fontSize: 12,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  aboutLinkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1.2,
    borderColor: COLORS.borderLight,
    marginBottom: 10,
    gap: 12,
  },
  aboutLinkTextContainer: {
    flex: 1,
  },
  aboutLinkTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.white,
  },
  aboutLinkUrl: {
    fontSize: 11,
    color: COLORS.textLight,
    marginTop: 2,
  },
});

