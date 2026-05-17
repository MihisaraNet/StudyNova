import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';

export default function TimetableScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🗓️</Text>
      <Text style={styles.title}>Timetable</Text>
      <Text style={styles.subtitle}>Week 5 task — coming soon!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.background },
  emoji:    { fontSize: 48, marginBottom: 12 },
  title:    { fontSize: 20, fontWeight: '700', color: COLORS.textPrimary },
  subtitle: { fontSize: 14, color: COLORS.textSecondary, marginTop: 6 },
});
