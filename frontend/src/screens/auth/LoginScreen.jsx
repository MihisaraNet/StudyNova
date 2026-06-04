import React, { useState, useRef } from 'react';
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
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { COLORS } from '../../constants/colors';
import useAuthStore from '../../store/authStore';

const { width } = Dimensions.get('window');

const schema = yup.object({
  email:    yup.string().email('Enter a valid email').required('Email is required'),
  password: yup.string().min(6, 'Min 6 characters').required('Password is required'),
});

// ─── Reusable input for this screen ──────────────────────────────────────────
function AuthInput({ label, placeholder, value, onChangeText, secureEntry, keyboardType = 'default', icon, error }) {
  const [showPass, setShowPass] = useState(false);
  const [focused, setFocused]   = useState(false);

  return (
    <View style={inputStyles.wrap}>
      <Text style={inputStyles.label}>{label}</Text>
      <View style={[inputStyles.row, focused && inputStyles.focused, error && inputStyles.errored]}>
        <Ionicons name={icon} size={17} color={focused ? COLORS.primaryLight : 'rgba(255,255,255,0.35)'} style={{ marginRight: 10 }} />
        <TextInputNative
          style={inputStyles.realInput}
          placeholder={placeholder}
          placeholderTextColor="rgba(255,255,255,0.25)"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureEntry && !showPass}
          keyboardType={keyboardType}
          autoCapitalize="none"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {secureEntry && (
          <TouchableOpacity onPress={() => setShowPass(!showPass)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Ionicons name={showPass ? 'eye-off-outline' : 'eye-outline'} size={17} color="rgba(255,255,255,0.35)" />
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <Text style={inputStyles.errorText}>
          <Ionicons name="alert-circle-outline" size={11} /> {error}
        </Text>
      )}
    </View>
  );
}

// We need the real TextInput
import { TextInput as TextInputNative } from 'react-native';

const inputStyles = StyleSheet.create({
  wrap:      { marginBottom: 16 },
  label:     { fontSize: 11, fontWeight: '700', color: COLORS.textSecondary, marginBottom: 6, letterSpacing: 0.8 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 54,
  },
  focused:    { borderColor: COLORS.primaryLight, backgroundColor: 'rgba(108,99,255,0.08)' },
  errored:    { borderColor: COLORS.error },
  realInput: {
    flex: 1,
    fontSize: 15,
    color: '#FFFFFF',
    height: '100%',
    fontWeight: '500',
  },
  errorText:  { fontSize: 11, color: COLORS.error, marginTop: 4 },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function LoginScreen({ navigation }) {
  const { login, clearError } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const tabAnim = useRef(new Animated.Value(0)).current;

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data) => {
    clearError();
    setLoading(true);
    const result = await login(data.email, data.password);
    setLoading(false);
    if (!result.success) Alert.alert('Login Failed', result.message);
  };

  const goRegister = () => {
    Animated.spring(tabAnim, { toValue: 1, useNativeDriver: false }).start();
    navigation.navigate('Register');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Dark dynamic background */}
      <LinearGradient
        colors={COLORS.gradientDark}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
      />

      {/* Decorative glass blobs */}
      <View style={styles.blobTL} />
      <View style={styles.blobBR} />

      <KeyboardAvoidingView
        style={{ flex: 1, width: '100%' }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo + Title */}
          <View style={styles.heroSection}>
            <View style={[styles.logoBox, COLORS.glowIndigo]}>
              <LinearGradient
                colors={COLORS.gradientPrimary}
                style={styles.logoGrad}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={{ fontSize: 32 }}>📚</Text>
              </LinearGradient>
            </View>
            <Text style={styles.heroTitle}>StudyNova</Text>
            <Text style={styles.heroSub}>
              Sign in to manage your studies, track assignments, and boost your GPA.
            </Text>
          </View>

          {/* Form Card (Glassmorphic) */}
          <View style={styles.formCard}>
            {/* Tab Switcher */}
            <View style={styles.tabBar}>
              <TouchableOpacity style={[styles.tabBtn, styles.tabActive]}>
                <Text style={styles.tabTextActive}>Log In</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.tabBtn} onPress={goRegister}>
                <Text style={styles.tabText}>Sign Up</Text>
              </TouchableOpacity>
            </View>

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <AuthInput
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
                <AuthInput
                  label="PASSWORD"
                  placeholder="Enter your password"
                  value={value}
                  onChangeText={onChange}
                  secureEntry
                  icon="lock-closed-outline"
                  error={errors.password?.message}
                />
              )}
            />

            {/* Forgot password */}
            <TouchableOpacity
              style={styles.forgotWrap}
              onPress={() => navigation.navigate('ForgotPassword')}
            >
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>

            {/* Sign In button */}
            <TouchableOpacity
              onPress={handleSubmit(onSubmit)}
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
                {loading ? (
                  <Text style={styles.btnText}>Signing in...</Text>
                ) : (
                  <Text style={styles.btnText}>Log In →</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or continue with</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social row */}
            <View style={styles.socialRow}>
              {[
                { icon: 'logo-google', label: 'Google' },
                { icon: 'logo-apple',  label: 'Apple' },
              ].map((s) => (
                <TouchableOpacity key={s.label} style={styles.socialBtn} activeOpacity={0.8}>
                  <Ionicons name={s.icon} size={18} color="#fff" />
                  <Text style={styles.socialText}>{s.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Register link */}
            <View style={styles.registerRow}>
              <Text style={styles.registerText}>Don't have an account? </Text>
              <TouchableOpacity onPress={goRegister}>
                <Text style={styles.registerLink}>Sign Up</Text>
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
    paddingTop: 60,
    paddingBottom: 40,
  },
  blobTL: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(108,99,255,0.12)',
    top: -100,
    left: -100,
  },
  blobBR: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(255,101,132,0.08)',
    bottom: 40,
    right: -80,
  },

  // Hero
  heroSection: { alignItems: 'center', marginBottom: 24 },
  logoBox:     { marginBottom: 16 },
  logoGrad: {
    width: 72,
    height: 72,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitle: {
    fontSize: 30,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  heroSub: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 19,
    paddingHorizontal: 20,
  },

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
  tabBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
  },
  tabActive: {
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  tabText:       { color: 'rgba(255,255,255,0.45)', fontWeight: '700', fontSize: 13 },
  tabTextActive: { color: '#FFFFFF', fontWeight: '800', fontSize: 13 },

  // Form
  forgotWrap: { alignSelf: 'flex-end', marginBottom: 24, marginTop: -4 },
  forgotText: { color: COLORS.primaryLight, fontSize: 13, fontWeight: '600' },

  // Button
  btnWrap: { borderRadius: 14, overflow: 'hidden', marginBottom: 24 },
  btn: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
  },
  btnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '800', letterSpacing: 0.5 },

  // Divider
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.08)' },
  dividerText: { color: 'rgba(255,255,255,0.3)', fontSize: 11, fontWeight: '600' },

  // Social
  socialRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  socialBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 14,
    paddingVertical: 12,
  },
  socialText: { color: '#fff', fontSize: 13, fontWeight: '700' },

  // Register row
  registerRow: { flexDirection: 'row', justifyContent: 'center' },
  registerText: { color: 'rgba(255,255,255,0.4)', fontSize: 13 },
  registerLink: { color: COLORS.primaryLight, fontSize: 13, fontWeight: '800' },
});
