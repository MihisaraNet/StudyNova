import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';

export default function SubjectCard({ subject, onEdit, onDelete }) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{subject.name}</Text>
          <Text style={styles.code}>{subject.code}</Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity onPress={() => onEdit(subject)} style={styles.actionButton}>
            <Ionicons name="pencil" size={18} color={COLORS.primaryLight} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onDelete(subject.id)} style={styles.actionButton}>
            <Ionicons name="trash" size={18} color={COLORS.error} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
    marginRight: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  code: {
    fontSize: 13,
    color: COLORS.primaryLight,
    fontWeight: '750',
    letterSpacing: 0.8,
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
