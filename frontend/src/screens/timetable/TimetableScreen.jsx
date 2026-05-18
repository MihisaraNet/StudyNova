import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';

import { LinearGradient } from 'expo-linear-gradient';

export default function TimetableScreen() {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0F0C29', '#302B63', '#24243E']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
      />
      <View style={styles.content}>
        <Text style={styles.emoji}>📅</Text>
        <Text style={styles.title}>Timetable</Text>
        <Text style={styles.subtitle}>Organize your week — coming soon!</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emoji:    { fontSize: 48, marginBottom: 12 },
  title:    { fontSize: 20, fontWeight: '700', color: COLORS.textPrimary },
  subtitle: { fontSize: 14, color: COLORS.textSecondary, marginTop: 6 },
});
