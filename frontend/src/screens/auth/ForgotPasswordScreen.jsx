import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';

export default function ForgotPasswordScreen({ navigation }) {
  const [email,   setEmail]   = useState('');
  const [focused, setFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);

  const isValid = email.trim().includes('@') && email.trim().includes('.');

  const handleSend = async () => {
    if (!isValid) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }
    setLoading(true);
    // TODO: await api.post('/api/auth/forgot-password', { email })
    setTimeout(() => { setLoading(false); setSent(true); }, 1600);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <LinearGradient
        colors={['#0F0C29', '#302B63', '#24243E']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
      />

      {/* Blobs */}
      <View style={styles.blobTR} />
      <View style={styles.blobBL} />

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

          {/* Back button */}
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <View style={styles.backCircle}>
              <Ionicons name="chevron-back" size={20} color="#fff" />
            </View>
          </TouchableOpacity>

          {!sent ? (
            <>
              {/* Header */}
              <View style={styles.iconWrap}>
                <LinearGradient
                  colors={['#6C63FF', '#FF6584']}
                  style={styles.iconGrad}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={{ fontSize: 32 }}>🔑</Text>
                </LinearGradient>
              </View>

              <Text style={styles.title}>Forgot Password?</Text>
              <Text style={styles.subtitle}>
                No worries! Enter your registered email and we'll send you a reset link.
              </Text>

              {/* Email input */}
              <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>EMAIL ADDRESS</Text>
                <View style={[styles.inputRow, focused && styles.inputFocused]}>
                  <Ionicons
                    name="mail-outline"
                    size={17}
                    color={focused ? '#6C63FF' : 'rgba(255,255,255,0.3)'}
                    style={{ marginRight: 10 }}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="user@studynova.com"
                    placeholderTextColor="rgba(255,255,255,0.22)"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                  />
                  {email.length > 0 && (
                    <Ionicons
                      name={isValid ? 'checkmark-circle' : 'close-circle'}
                      size={17}
                      color={isValid ? '#4CAF82' : 'rgba(255,255,255,0.2)'}
                    />
                  )}
                </View>
              </View>

              {/* Submit */}
              <TouchableOpacity
                onPress={handleSend}
                disabled={loading}
                style={styles.btnWrap}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={loading ? ['#444', '#444'] : (isValid ? ['#6C63FF', '#8B85FF'] : ['rgba(108,99,255,0.4)', 'rgba(139,133,255,0.4)'])}
                  style={styles.btn}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  {loading ? (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <Text style={styles.btnText}>Sending...</Text>
                    </View>
                  ) : (
                    <Text style={styles.btnText}>Send Reset Link</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              {/* Help note */}
              <View style={styles.noteCard}>
                <Ionicons name="information-circle-outline" size={16} color="rgba(108,99,255,0.7)" style={{ marginRight: 8 }} />
                <Text style={styles.noteText}>
                  Check your spam folder if you don't see the email in a few minutes.
                </Text>
              </View>

              {/* Back to login */}
              <View style={styles.backRow}>
                <Text style={styles.backText}>Remember your password? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text style={styles.backLink}>Log In</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            /* ── Success State ── */
            <View style={styles.successSection}>
              <View style={styles.successIconWrap}>
                <LinearGradient
                  colors={['#4CAF82', '#6BCFA0']}
                  style={styles.successIconGrad}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={{ fontSize: 40 }}>✉️</Text>
                </LinearGradient>
                {/* Pulse ring */}
                <View style={styles.pulseRing} />
              </View>

              <Text style={styles.successTitle}>Yayy! All Set</Text>
              <Text style={styles.successMsg}>
                Your username and password has been sent to your mail
              </Text>
              <Text style={styles.emailChip}>{email}</Text>

              <TouchableOpacity
                style={styles.btnWrap}
                onPress={() => navigation.navigate('Login')}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={['#6C63FF', '#8B85FF']}
                  style={styles.btn}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.btnText}>Back to Login →</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 48,
  },
  blobTR: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(108,99,255,0.12)',
    top: -50,
    right: -60,
  },
  blobBL: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255,101,132,0.08)',
    bottom: 100,
    left: -50,
  },
  backBtn:    { marginBottom: 36 },
  backCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Icon
  iconWrap: { alignItems: 'center', marginBottom: 28 },
  iconGrad: {
    width: 90,
    height: 90,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 18,
    elevation: 12,
  },

  title:    { fontSize: 32, fontWeight: '900', color: '#FFFFFF', letterSpacing: -0.5, marginBottom: 12 },
  subtitle: { fontSize: 14, color: 'rgba(255,255,255,0.4)', lineHeight: 22, marginBottom: 36 },

  // Input
  inputSection: { marginBottom: 24 },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.45)',
    marginBottom: 8,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 56,
  },
  inputFocused: { borderColor: '#6C63FF', backgroundColor: 'rgba(108,99,255,0.1)' },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '500',
    height: '100%',
  },

  // Button
  btnWrap: { borderRadius: 14, overflow: 'hidden', marginBottom: 20 },
  btn:     { paddingVertical: 17, alignItems: 'center', borderRadius: 14 },
  btnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800', letterSpacing: 0.3 },

  // Note
  noteCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(108,99,255,0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(108,99,255,0.2)',
    padding: 14,
    marginBottom: 32,
  },
  noteText: { flex: 1, fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 18 },

  backRow:  { flexDirection: 'row', justifyContent: 'center' },
  backText: { color: 'rgba(255,255,255,0.4)', fontSize: 14 },
  backLink: { color: '#6C63FF', fontSize: 14, fontWeight: '800' },

  // Success
  successSection: { flex: 1, alignItems: 'center', paddingTop: 20 },
  successIconWrap: { alignItems: 'center', justifyContent: 'center', marginBottom: 32 },
  successIconGrad: {
    width: 110,
    height: 110,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4CAF82',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 14,
  },
  pulseRing: {
    position: 'absolute',
    width: 135,
    height: 135,
    borderRadius: 42,
    borderWidth: 2,
    borderColor: 'rgba(76,175,130,0.3)',
  },
  successTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 14,
    letterSpacing: -0.5,
  },
  successMsg: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.45)',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  emailChip: {
    backgroundColor: 'rgba(108,99,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(108,99,255,0.3)',
    color: '#6C63FF',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 30,
    fontWeight: '700',
    fontSize: 13,
    marginBottom: 40,
    width: '100%',
    textAlign: 'center',
  },
});
