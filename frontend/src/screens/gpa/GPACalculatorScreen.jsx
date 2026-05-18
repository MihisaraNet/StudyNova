import React, { useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import useGpaStore from '../../store/gpaStore';

export default function GPACalculatorScreen() {
  const { gpaData, isLoading, fetchGPA, error } = useGpaStore();

  const loadData = useCallback(() => {
    fetchGPA();
  }, [fetchGPA]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (isLoading && !gpaData) {
    return (
      <View style={[styles.mainContainer, styles.centerContent]}>
        <LinearGradient
          colors={['#0F0C29', '#302B63', '#24243E']}
          style={StyleSheet.absoluteFill}
        />
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const { overallGPA = 0, totalCredits = 0, semesterGPAs = {} } = gpaData || {};
  const sortedSemesters = Object.keys(semesterGPAs).sort();

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <LinearGradient
        colors={['#0F0C29', '#302B63', '#24243E']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
      />
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={loadData}
            tintColor={COLORS.white}
          />
        }
      >
        <LinearGradient
          colors={COLORS.gradientPrimary}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.headerTitle}>GPA Calculator</Text>
              <Text style={styles.headerSubtitle}>
                Track your academic performance
              </Text>
            </View>
            <View style={styles.iconContainer}>
              <Ionicons name="school" size={28} color={COLORS.white} />
            </View>
          </View>
        </LinearGradient>

        <View style={styles.body}>
          {error ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={24} color={COLORS.error} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* Overall GPA Card */}
          <View style={styles.overallCard}>
            <LinearGradient
              colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.02)']}
              style={StyleSheet.absoluteFill}
              borderRadius={20}
            />
            <Text style={styles.overallTitle}>Overall GPA</Text>
            <Text style={styles.overallValue}>{overallGPA.toFixed(2)}</Text>
            <Text style={styles.overallCredits}>
              Total Credits: {totalCredits}
            </Text>
          </View>

          <Text style={styles.sectionTitle}>Semester Breakdown</Text>
          {sortedSemesters.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="folder-open-outline" size={48} color={COLORS.textLight} />
              <Text style={styles.emptyText}>No GPA data found</Text>
              <Text style={styles.emptySubtext}>Add subjects with credits and grades</Text>
            </View>
          ) : (
            <View style={styles.semesterList}>
              {sortedSemesters.map((sem, idx) => (
                <View key={idx} style={styles.semesterCard}>
                  <View style={styles.semesterInfo}>
                    <Ionicons name="calendar-outline" size={24} color={COLORS.secondary} />
                    <Text style={styles.semesterName}>{sem}</Text>
                  </View>
                  <View style={styles.semesterGPAContainer}>
                    <Text style={styles.semesterGPAValue}>
                      {semesterGPAs[sem].toFixed(2)}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          <View style={styles.infoCard}>
             <Ionicons name="information-circle" size={24} color={COLORS.primaryLight} />
             <Text style={styles.infoText}>
               GPA is calculated based on the subjects you added. Make sure you entered valid credits and grades (e.g. A, B+, C).
             </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1 },
  centerContent: { justifyContent: 'center', alignItems: 'center' },
  container: { flex: 1 },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.white,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    padding: 20,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.errorLight,
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
  },
  errorText: {
    color: COLORS.error,
    marginLeft: 8,
    fontWeight: '500',
  },
  overallCard: {
    alignItems: 'center',
    padding: 32,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    marginBottom: 24,
    backgroundColor: COLORS.surface,
  },
  overallTitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginBottom: 8,
  },
  overallValue: {
    fontSize: 48,
    fontWeight: '800',
    color: COLORS.white,
  },
  overallCredits: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 8,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textPrimary,
    fontWeight: '600',
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  semesterList: {
    gap: 12,
  },
  semesterCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  semesterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  semesterName: {
    fontSize: 16,
    color: COLORS.white,
    fontWeight: '600',
    marginLeft: 12,
  },
  semesterGPAContainer: {
    backgroundColor: 'rgba(108,99,255,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  semesterGPAValue: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primaryLight,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surfaceAlt,
    padding: 16,
    borderRadius: 16,
    marginTop: 24,
    borderWidth: 1,
    borderColor: 'rgba(108,99,255,0.2)',
  },
  infoText: {
    color: COLORS.textSecondary,
    flex: 1,
    marginLeft: 12,
    fontSize: 13,
    lineHeight: 20,
  },
});
