import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../constants/colors';

export default function Button({
  title,
  onPress,
  loading    = false,
  disabled   = false,
  variant    = 'primary',   // 'primary' | 'outline' | 'ghost' | 'danger'
  size       = 'md',        // 'sm' | 'md' | 'lg'
  icon,
  style,
}) {
  const isDisabled = disabled || loading;

  const sizeStyles = {
    sm: { paddingVertical: 10, paddingHorizontal: 18, borderRadius: 10 },
    md: { paddingVertical: 14, paddingHorizontal: 24, borderRadius: 12 },
    lg: { paddingVertical: 17, paddingHorizontal: 32, borderRadius: 14 },
  };

  const labelSizes = { sm: 13, md: 15, lg: 17 };

  if (variant === 'primary') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled}
        style={[styles.btnWrapper, isDisabled && styles.disabled, style]}
        activeOpacity={0.85}
      >
        <LinearGradient
          colors={isDisabled ? [COLORS.border, COLORS.border] : COLORS.gradientPrimary}
          style={[styles.gradient, sizeStyles[size]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.white} size="small" />
          ) : (
            <View style={styles.row}>
              {icon && <View style={styles.iconWrap}>{icon}</View>}
              <Text style={[styles.labelPrimary, { fontSize: labelSizes[size] }]}>
                {title}
              </Text>
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  if (variant === 'outline') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled}
        style={[styles.outline, sizeStyles[size], isDisabled && styles.disabled, style]}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator color={COLORS.primary} size="small" />
        ) : (
          <View style={styles.row}>
            {icon && <View style={styles.iconWrap}>{icon}</View>}
            <Text style={[styles.labelOutline, { fontSize: labelSizes[size] }]}>{title}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  }

  if (variant === 'danger') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled}
        style={[styles.danger, sizeStyles[size], isDisabled && styles.disabled, style]}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator color={COLORS.white} size="small" />
        ) : (
          <Text style={[styles.labelPrimary, { fontSize: labelSizes[size] }]}>{title}</Text>
        )}
      </TouchableOpacity>
    );
  }

  // ghost
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      style={[{ alignItems: 'center', padding: 8 }, style]}
      activeOpacity={0.7}
    >
      <Text style={[styles.labelOutline, { fontSize: labelSizes[size] }]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btnWrapper: { borderRadius: 12, overflow: 'hidden' },
  gradient:   { alignItems: 'center', justifyContent: 'center' },
  outline: {
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primaryPale,
  },
  danger: {
    backgroundColor: COLORS.error,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  disabled: { opacity: 0.55 },
  row:      { flexDirection: 'row', alignItems: 'center', gap: 8 },
  iconWrap: { marginRight: 2 },
  labelPrimary: {
    color: COLORS.white,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  labelOutline: {
    color: COLORS.primary,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
