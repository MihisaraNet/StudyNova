import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Alert,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { COLORS } from '../../constants/colors';
import useAuthStore from '../../store/authStore';

const schema = yup.object({
  name:     yup.string().min(2, 'Min 2 characters').required('Full name is required'),
  email:    yup.string().email('Enter a valid email').required('Email is required'),
  password: yup.string().min(6, 'Min 6 characters').required('Password is required'),
  confirm:  yup.string()
    .oneOf([yup.ref('password')], 'Passwords do not match')
    .required('Please confirm password'),
});

// ─── Dark Glass Input ─────────────────────────────────────────────────────────
function DarkInput({ label, placeholder, value, onChangeText, secureEntry, keyboardType = 'default', icon, error, autoCapitalize = 'none' }) {
  const [showPass, setShowPass] = useState(false);
  const [focused,  setFocused]  = useState(false);

  return (
    <View style={inputSt.wrap}>
      <Text style={inputSt.label}>{label}</Text>
      <View style={[inputSt.row, focused && inputSt.focused, error && inputSt.errored]}>
        <Ionicons name={icon} size={16} color={focused ? COLORS.primaryLight : 'rgba(255,255,255,0.3)'} style={{ marginRight: 10 }} />
        <TextInput
          style={inputSt.input}
          placeholder={placeholder}
          placeholderTextColor="rgba(255,255,255,0.22)"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureEntry && !showPass}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {secureEntry && (
          <TouchableOpacity onPress={() => setShowPass(!showPass)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Ionicons name={showPass ? 'eye-off-outline' : 'eye-outline'} size={16} color="rgba(255,255,255,0.3)" />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={inputSt.error}>{error}</Text>}
    </View>
  );
}

const inputSt = StyleSheet.create({
  wrap:    { marginBottom: 12 },
  label:   { fontSize: 11, fontWeight: '700', color: COLORS.textSecondary, marginBottom: 6, letterSpacing: 0.8, textTransform: 'uppercase' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 52,
  },
  focused: { borderColor: COLORS.primaryLight, backgroundColor: 'rgba(108,99,255,0.08)' },
  errored: { borderColor: COLORS.error },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '500',
    height: '100%',
  },
  error: { fontSize: 11, color: COLORS.error, marginTop: 4 },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function RegisterScreen({ navigation }) {
  const { register: registerUser } = useAuthStore();
  const [loading,  setLoading]  = useState(false);
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { name: '', email: '', password: '', confirm: '' },
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const result = await registerUser({
        name: data.name.trim(),
        email: data.email.trim(),
        password: data.password,
      });
      setLoading(false);
      if (!result.success) {
        Alert.alert('Registration Failed', result.message || 'Unknown error occurred.');
      }
    } catch (error) {
      setLoading(false);
      Alert.alert(
        'Registration Error',
        error.message || 'A network error occurred. Please try again.'
      );
    }
  };

  const onInvalid = (validationErrors) => {
    console.warn('Form validation failed:', validationErrors);
    const errorKeys = Object.keys(validationErrors);
    if (errorKeys.length > 0) {
      const firstError = validationErrors[errorKeys[0]];
      Alert.alert('Validation Error', firstError.message || 'Please correct the highlighted fields.');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <LinearGradient
        colors={COLORS.gradientDark}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
      />
      <View style={styles.blobTR} />
      <View style={styles.blobBL} />

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Back */}
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <View style={styles.backCircle}>
              <Ionicons name="chevron-back" size={20} color="#fff" />
            </View>
          </TouchableOpacity>

          {/* Hero */}
          <View style={styles.hero}>
            <Text style={styles.heroTitle}>Create Account</Text>
            <Text style={styles.heroSub}>
              Join thousands of students already planning smarter.
            </Text>
          </View>

          {/* Form Card (Glassmorphic) */}
          <View style={styles.formCard}>
            {/* Tab Switcher */}
            <View style={styles.tabBar}>
              <TouchableOpacity style={styles.tabBtn} onPress={() => navigation.navigate('Login')}>
                <Text style={styles.tabText}>Log In</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.tabBtn, styles.tabActive]}>
                <Text style={styles.tabTextActive}>Sign Up</Text>
              </TouchableOpacity>
            </View>

            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, value } }) => (
                <DarkInput
                  label="FULL NAME"
                  placeholder="e.g. Name with Initials"
                  value={value}
                  onChangeText={onChange}
                  icon="person-outline"
                  autoCapitalize="words"
                  error={errors.name?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <DarkInput
                  label="EMAIL ADDRESS"
                  placeholder="user@studynova.com"
                  value={value}
                  onChangeText={onChange}
                  keyboardType="email-address"
                  icon="mail-outline"
                  error={errors.email?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <DarkInput
                  label="PASSWORD"
                  placeholder="Min. 6 characters"
                  value={value}
                  onChangeText={onChange}
                  secureEntry
                  icon="lock-closed-outline"
                  error={errors.password?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="confirm"
              render={({ field: { onChange, value } }) => (
                <DarkInput
                  label="CONFIRM PASSWORD"
                  placeholder="Re-enter your password"
                  value={value}
                  onChangeText={onChange}
                  secureEntry
                  icon="shield-checkmark-outline"
                  error={errors.confirm?.message}
                />
              )}
            />

            {/* Sign Up button */}
            <TouchableOpacity
              onPress={handleSubmit(onSubmit, onInvalid)}
              disabled={loading}
              style={[styles.btnWrap, !loading && COLORS.glowIndigo]}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={loading ? ['#3F3F46', '#27272A'] : COLORS.gradientPrimary}
                style={styles.btn}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.btnText}>{loading ? 'Creating account...' : 'Sign Up →'}</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Terms */}
            <Text style={styles.termsText}>
              By signing up, you accept the company's{' '}
              <Text style={styles.termsLink}>Terms of Use</Text>
              {' '}and{' '}
              <Text style={styles.termsLink}>Privacy Policy</Text>.
            </Text>

            <View style={styles.loginRow}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>Log In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 48,
  },
  blobTR: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(108,99,255,0.12)',
    top: -50,
    right: -60,
  },
  blobBL: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,101,132,0.08)',
    bottom: 80,
    left: -50,
  },
  backBtn:   { marginBottom: 20 },
  backCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hero:      { marginBottom: 24, paddingLeft: 4 },
  heroTitle: { fontSize: 32, fontWeight: '900', color: '#FFFFFF', letterSpacing: -0.5, marginBottom: 8 },
  heroSub:   { fontSize: 13, color: COLORS.textSecondary, lineHeight: 19 },

  // Frosted Card Wrapper
  formCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
  },

  // Tab switcher
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 16,
    padding: 4,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  tabBtn:        { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 12 },
  tabActive: {
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  tabText:       { color: 'rgba(255,255,255,0.4)', fontWeight: '700', fontSize: 13 },
  tabTextActive: { color: '#FFFFFF', fontWeight: '800', fontSize: 13 },

  btnWrap: { borderRadius: 14, overflow: 'hidden', marginTop: 8, marginBottom: 16 },
  btn:     { paddingVertical: 16, alignItems: 'center', borderRadius: 14 },
  btnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '800', letterSpacing: 0.5 },

  termsText: { color: 'rgba(255,255,255,0.3)', fontSize: 11, textAlign: 'center', lineHeight: 17, marginBottom: 20 },
  termsLink: { color: COLORS.primaryLight, fontWeight: '600' },
  loginRow:  { flexDirection: 'row', justifyContent: 'center' },
  loginText: { color: 'rgba(255,255,255,0.4)', fontSize: 13 },
  loginLink: { color: COLORS.primaryLight, fontSize: 13, fontWeight: '800' },
});
