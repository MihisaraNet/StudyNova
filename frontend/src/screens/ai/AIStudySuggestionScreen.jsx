import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Alert,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as geminiService from '../../services/geminiService';
import { COLORS } from '../../constants/colors';

export default function AIStudySuggestionScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState(0);
  const [suggestions, setSuggestions] = useState('');

  const loadingPhases = [
    'Initializing AI engine...',
    'Analyzing weekly course subjects...',
    'Evaluating scheduled study timetable...',
    'Calculating assignment priority scores...',
    'Querying Gemini Pro model...',
    'Structuring personalized academic plan...'
  ];

  const fetchSuggestions = async () => {
    setLoading(true);
    setLoadingPhase(0);
    setSuggestions('');

    // Rotate loading text phases every 1.5 seconds to look premium and advanced
    const phaseInterval = setInterval(() => {
      setLoadingPhase((prev) => (prev < loadingPhases.length - 1 ? prev + 1 : prev));
    }, 1500);

    try {
      const response = await geminiService.getAISuggestions();
      if (response.success) {
        setSuggestions(response.data);
      } else {
        Alert.alert('AI Request Failed', response.message || 'Could not fetch study suggestions.');
      }
    } catch (e) {
      Alert.alert('Connection Error', 'Failed to reach the AI planner backend.');
    } finally {
      clearInterval(phaseInterval);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, []);

  // Extremely premium lightweight React Native markdown parser
  const renderMarkdown = (text) => {
    if (!text) return null;

    const lines = text.split('\n');
    let insideList = false;

    return lines.map((line, index) => {
      const cleanLine = line.trim();

      // ─── Header 1 (# Title) ────────────────────────────────────────────────
      if (cleanLine.startsWith('# ')) {
        return (
          <Text key={index} style={styles.mdH1}>
            {cleanLine.substring(2)}
          </Text>
        );
      }

      // ─── Header 2 (## Subhead) ──────────────────────────────────────────────
      if (cleanLine.startsWith('## ')) {
        return (
          <View key={index} style={styles.h2Container}>
            <Text style={styles.mdH2}>
              {cleanLine.substring(3)}
            </Text>
            <View style={styles.h2Underline} />
          </View>
        );
      }

      // ─── Header 3 (### Sub-subhead) ──────────────────────────────────────────
      if (cleanLine.startsWith('### ')) {
        return (
          <Text key={index} style={styles.mdH3}>
            {cleanLine.substring(4)}
          </Text>
        );
      }

      // ─── Blockquote (> Quote) ──────────────────────────────────────────────
      if (cleanLine.startsWith('> ')) {
        return (
          <View key={index} style={styles.mdBlockquote}>
            <Ionicons name="bulb" size={18} color={COLORS.warning} style={styles.quoteIcon} />
            <Text style={styles.mdBlockquoteText}>
              {parseInlineStyles(cleanLine.substring(2))}
            </Text>
          </View>
        );
      }

      // ─── Bullet points (- List / * List) ───────────────────────────────────
      if (cleanLine.startsWith('- ') || cleanLine.startsWith('* ')) {
        return (
          <View key={index} style={styles.listItemRow}>
            <Text style={styles.bulletDot}>•</Text>
            <Text style={styles.listItemText}>
              {parseInlineStyles(cleanLine.substring(2))}
            </Text>
          </View>
        );
      }

      // ─── Numbered points (1. List) ──────────────────────────────────────────
      const numMatch = cleanLine.match(/^(\d+)\.\s(.*)/);
      if (numMatch) {
        return (
          <View key={index} style={styles.numberedItemRow}>
            <View style={styles.numberBadge}>
              <Text style={styles.numberBadgeText}>{numMatch[1]}</Text>
            </View>
            <Text style={styles.numberedItemText}>
              {parseInlineStyles(numMatch[2])}
            </Text>
          </View>
        );
      }

      // ─── Empty lines ───────────────────────────────────────────────────────
      if (cleanLine === '') {
        return <View key={index} style={{ height: 12 }} />;
      }

      // ─── Standard Paragraph Text ───────────────────────────────────────────
      return (
        <Text key={index} style={styles.mdParagraph}>
          {parseInlineStyles(line)}
        </Text>
      );
    });
  };

  // Parses bold (**word**) or highlights inside lines
  const parseInlineStyles = (text) => {
    const parts = text.split('**');
    return parts.map((part, i) => {
      // Every odd element is bold
      const isBold = i % 2 !== 0;
      
      // Secondary check for inline code blocks (e.g. `CS201`)
      const codeParts = part.split('`');
      if (codeParts.length > 1) {
        return codeParts.map((subPart, j) => {
          const isCode = j % 2 !== 0;
          return (
            <Text
              key={`${i}-${j}`}
              style={[
                isBold && styles.boldText,
                isCode && styles.codeText
              ]}
            >
              {subPart}
            </Text>
          );
        });
      }

      return (
        <Text key={i} style={isBold ? styles.boldText : null}>
          {part}
        </Text>
      );
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
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
        <Text style={styles.headerTitle}>AI Study Suggestions</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        // Glowing Robot Loader View
        <View style={styles.loaderContainer}>
          <View style={styles.avatarGlowContainer}>
            <View style={styles.glowOuter} />
            <View style={styles.glowInner}>
              <Ionicons name="hardware-chip-outline" size={44} color={COLORS.primaryLight} />
            </View>
          </View>
          <Text style={styles.loaderTitle}>Analyzing Workload</Text>
          <Text style={styles.loaderSubtitle}>
            {loadingPhases[loadingPhase]}
          </Text>
          <ActivityIndicator size="small" color={COLORS.primaryLight} style={{ marginTop: 24 }} />
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {renderMarkdown(suggestions)}
            
            {/* Action button in scroll */}
            <TouchableOpacity
              style={styles.regenerateBtn}
              onPress={fetchSuggestions}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={COLORS.gradientPrimary}
                style={styles.regenerateBtnGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="sparkles" size={18} color={COLORS.white} />
                <Text style={styles.regenerateBtnText}>Refresh Study Recommendations</Text>
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        </View>
      )}
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
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  avatarGlowContainer: {
    width: 90,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 28,
  },
  glowOuter: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: COLORS.primary,
    opacity: 0.15,
    transform: [{ scale: 1.15 }],
  },
  glowInner: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: COLORS.surfaceAlt,
    borderWidth: 2,
    borderColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  loaderSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    height: 20, // Keep height persistent to prevent jumping layout
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 50,
  },
  mdH1: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginTop: 10,
    marginBottom: 16,
    lineHeight: 30,
  },
  h2Container: {
    marginTop: 22,
    marginBottom: 12,
  },
  mdH2: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.primaryLight,
    lineHeight: 24,
  },
  h2Underline: {
    width: 40,
    height: 3,
    backgroundColor: COLORS.primary,
    borderRadius: 2,
    marginTop: 6,
  },
  mdH3: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.secondaryLight,
    marginTop: 14,
    marginBottom: 8,
  },
  mdParagraph: {
    fontSize: 14,
    color: COLORS.textPrimary,
    lineHeight: 22,
    marginBottom: 10,
  },
  boldText: {
    fontWeight: '700',
    color: COLORS.white,
  },
  codeText: {
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    color: COLORS.secondaryLight,
    backgroundColor: 'rgba(255,255,255,0.06)',
    paddingHorizontal: 4,
    borderRadius: 4,
    fontSize: 13,
    fontWeight: '600',
  },
  mdBlockquote: {
    flexDirection: 'row',
    backgroundColor: COLORS.surfaceAlt,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.warning,
    borderRadius: 12,
    padding: 14,
    marginVertical: 14,
    alignItems: 'flex-start',
    gap: 10,
  },
  quoteIcon: {
    marginTop: 2,
  },
  mdBlockquoteText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.warningLight,
    lineHeight: 20,
    fontWeight: '500',
  },
  listItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 4,
    paddingLeft: 6,
  },
  bulletDot: {
    fontSize: 18,
    color: COLORS.primaryLight,
    marginRight: 10,
    lineHeight: 18,
  },
  listItemText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textPrimary,
    lineHeight: 22,
  },
  numberedItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 6,
    gap: 12,
  },
  numberBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  numberBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.white,
  },
  numberedItemText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textPrimary,
    lineHeight: 22,
  },
  regenerateBtn: {
    marginTop: 36,
    height: 50,
    borderRadius: 14,
    overflow: 'hidden',
  },
  regenerateBtnGradient: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  regenerateBtnText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
});
