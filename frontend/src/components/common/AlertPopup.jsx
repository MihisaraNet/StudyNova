import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';

export default function AlertPopup({
  visible,
  title,
  message,
  type = 'info', // info, warning, danger, success
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}) {
  if (!visible) return null;

  // Get type-specific colors and icons
  const getTypeConfig = () => {
    switch (type) {
      case 'danger':
        return {
          icon: 'trash-outline',
          color: COLORS.error,
          btnGradient: [COLORS.error, '#FF8FA3'],
        };
      case 'warning':
        return {
          icon: 'alert-circle-outline',
          color: COLORS.warning,
          btnGradient: [COLORS.warning, '#FFF3DC'],
        };
      case 'success':
        return {
          icon: 'checkmark-circle-outline',
          color: COLORS.success,
          btnGradient: COLORS.gradientSuccess,
        };
      default:
        return {
          icon: 'information-circle-outline',
          color: COLORS.primaryLight,
          btnGradient: COLORS.gradientPrimary,
        };
    }
  };

  const config = getTypeConfig();

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        {/* Glassmorphic Modal Box */}
        <View style={styles.card}>
          {/* Top Decorative Glowing Ring & Icon */}
          <View style={[styles.iconRing, { borderColor: config.color + '30', backgroundColor: config.color + '12' }]}>
            <Ionicons name={config.icon} size={28} color={config.color} />
          </View>

          {/* Texts */}
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          {/* Action Buttons Row */}
          <View style={styles.btnRow}>
            {/* Cancel Button */}
            <TouchableOpacity style={styles.cancelBtn} onPress={onCancel} activeOpacity={0.7}>
              <Text style={styles.cancelBtnText}>{cancelLabel}</Text>
            </TouchableOpacity>

            {/* Confirm Button with Custom Gradient */}
            <TouchableOpacity style={styles.confirmBtn} onPress={onConfirm} activeOpacity={0.8}>
              <LinearGradient
                colors={config.btnGradient}
                style={styles.confirmBtnGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.confirmBtnText}>{confirmLabel}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(10, 8, 30, 0.82)', // Deep space semi-transparent backdrop
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#161334', // Rich space color panel
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 24,
    width: '88%',
    maxWidth: 360,
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  iconRing: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
    paddingHorizontal: 6,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  cancelBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  cancelBtnText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  confirmBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    overflow: 'hidden',
  },
  confirmBtnGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmBtnText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
});
