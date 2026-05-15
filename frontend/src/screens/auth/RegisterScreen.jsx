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
import { SEMESTERS } from '../../constants/config';
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
        <Ionicons name={icon} size={16} color={focused ? '#6C63FF' : 'rgba(255,255,255,0.3)'} style={{ marginRight: 10 }} />
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
  label:   { fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.45)', marginBottom: 6, letterSpacing: 0.8, textTransform: 'uppercase' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 52,
  },
  focused: { borderColor: '#6C63FF', backgroundColor: 'rgba(108,99,255,0.1)' },
  errored: { borderColor: '#FF5C6A' },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '500',
    height: '100%',
  },
  error: { fontSize: 11, color: '#FF5C6A', marginTop: 4 },
});

// ─── Semester Selector ────────────────────────────────────────────────────────
function SemesterSelector({ selected, onSelect }) {
  const [open, setOpen] = useState(false);
  return (
    <View style={semSt.wrap}>
      <Text style={inputSt.label}>CURRENT SEMESTER</Text>
      <TouchableOpacity
        style={[semSt.btn]}
        onPress={() => setOpen(!open)}
        activeOpacity={0.8}
      >
        <Ionicons name="school-outline" size={16} color="rgba(255,255,255,0.3)" style={{ marginRight: 10 }} />
        <Text style={semSt.val}>{selected || 'Select semester'}</Text>
        <Ionicons
          name={open ? 'chevron-up' : 'chevron-down'}
          size={15}
          color="rgba(255,255,255,0.35)"
        />
      </TouchableOpacity>
      {open && (
        <View style={semSt.dropdown}>
          <ScrollView nestedScrollEnabled style={{ maxHeight: 180 }}>
            {SEMESTERS.map((s) => (
              <TouchableOpacity
                key={s}
                style={[semSt.option, selected === s && semSt.optionActive]}
                onPress={() => { onSelect(s); setOpen(false); }}
              >
                <Text style={[semSt.optionText, selected === s && semSt.optionTextActive]}>{s}</Text>
                {selected === s && <Ionicons name="checkmark" size={14} color="#6C63FF" />}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const semSt = StyleSheet.create({
  wrap: { marginBottom: 12 },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 52,
  },
  val:  { flex: 1, fontSize: 15, color: 'rgba(255,255,255,0.7)', fontWeight: '500' },
  dropdown: {
    backgroundColor: '#1E1B3A',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    marginTop: 4,
    overflow: 'hidden',
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  optionActive:     { backgroundColor: 'rgba(108,99,255,0.15)' },
  optionText:       { fontSize: 14, color: 'rgba(255,255,255,0.6)', fontWeight: '500' },
  optionTextActive: { color: '#6C63FF', fontWeight: '700' },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function RegisterScreen({ navigation }) {
  const { register: registerUser } = useAuthStore();
  const [loading,  setLoading]  = useState(false);
  const [semester, setSemester] = useState('Y1S1');

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { name: '', email: '', password: '', confirm: '' },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    const result = await registerUser({ name: data.name.trim(), email: data.email.trim(), password: data.password, semester });
    setLoading(false);
    if (!result.success) Alert.alert('Registration Failed', result.message);
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

          {/* Tab Switcher */}
          <View style={styles.tabBar}>
            <TouchableOpacity style={styles.tabBtn} onPress={() => navigation.navigate('Login')}>
              <Text style={styles.tabText}>Log In</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tabBtn, styles.tabActive]}>
              <Text style={styles.tabTextActive}>Sign Up</Text>
            </TouchableOpacity>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, value } }) => (
                <DarkInput
                  label="FULL NAME"
                  placeholder="e.g. Mihisara Perera"
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
                  placeholder="student@university.com"
                  value={value}
                  onChangeText={onChange}
                  keyboardType="email-address"
                  icon="mail-outline"
                  error={errors.email?.message}
                />
              )}
            />

            <SemesterSelector selected={semester} onSelect={setSemester} />

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
              onPress={handleSubmit(onSubmit)}
              disabled={loading}
              style={styles.btnWrap}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={loading ? ['#444', '#444'] : ['#6C63FF', '#8B85FF']}
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
    bottom: 80,
    left: -50,
  },
  backBtn:   { marginBottom: 28 },
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
  hero:      { marginBottom: 28 },
  heroTitle: { fontSize: 34, fontWeight: '900', color: '#FFFFFF', letterSpacing: -0.5, marginBottom: 8 },
  heroSub:   { fontSize: 14, color: 'rgba(255,255,255,0.4)', lineHeight: 21 },

  // Tab
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 16,
    padding: 4,
    marginBottom: 28,
  },
  tabBtn:        { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 12 },
  tabActive: {
    backgroundColor: '#6C63FF',
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  tabText:       { color: 'rgba(255,255,255,0.4)', fontWeight: '700', fontSize: 14 },
  tabTextActive: { color: '#FFFFFF', fontWeight: '800', fontSize: 14 },

  form: {},

  btnWrap: { borderRadius: 14, overflow: 'hidden', marginTop: 8, marginBottom: 16 },
  btn:     { paddingVertical: 17, alignItems: 'center', borderRadius: 14 },
  btnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800', letterSpacing: 0.3 },

  termsText: { color: 'rgba(255,255,255,0.3)', fontSize: 12, textAlign: 'center', lineHeight: 18, marginBottom: 20 },
  termsLink: { color: '#6C63FF', fontWeight: '600' },
  loginRow:  { flexDirection: 'row', justifyContent: 'center' },
  loginText: { color: 'rgba(255,255,255,0.4)', fontSize: 14 },
  loginLink: { color: '#6C63FF', fontSize: 14, fontWeight: '800' },
});
