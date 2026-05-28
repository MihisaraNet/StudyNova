import React from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, StatusBar, Alert, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import useAuthStore from '../../store/authStore';
import AlertPopup from '../../components/common/AlertPopup';

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const [showLogoutAlert, setShowLogoutAlert] = React.useState(false);

  const handleLogout = () => {
    setShowLogoutAlert(true);
  };

  const menuItems = [
    { icon: 'person-outline',         label: 'Edit Profile',     color: COLORS.primary },
    { icon: 'lock-closed-outline',    label: 'Change Password',  color: COLORS.warning },
    { icon: 'notifications-outline',  label: 'Notifications',    color: COLORS.success },
    { icon: 'help-circle-outline',    label: 'Help & Support',   color: COLORS.textSecondary },
    { icon: 'information-circle-outline', label: 'About App',    color: COLORS.textSecondary },
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
        {user?.semester && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{user.semester}</Text>
          </View>
        )}
      </LinearGradient>

      <View style={styles.body}>
        {/* GPA Target */}
        <View style={styles.gpaCard}>
          <Text style={styles.gpaLabel}>GPA Target</Text>
          <Text style={styles.gpaValue}>{user?.gpaTarget?.toFixed(1) ?? '3.5'} / 4.0</Text>
        </View>

        {/* Menu */}
        <View style={styles.menu}>
          {menuItems.map((item, i) => (
            <TouchableOpacity key={i} style={styles.menuItem} activeOpacity={0.8}>
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
      </View>
      </ScrollView>

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
});
