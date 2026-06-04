// Color palette for StudyNova - Sleek Glassmorphism Edition
// Primary: Indigo/Purple — Modern, calm, study-focused

export const COLORS = {
  // ─── Primary ───────────────────────────────────
  primary:        '#6C63FF',  // Indigo Purple
  primaryDark:    '#5A52D5',
  primaryLight:   '#8B85FF',
  primaryPale:    'rgba(108, 99, 255, 0.15)', // Updated for glassmorphism contrast

  // ─── Secondary ─────────────────────────────────
  secondary:      '#FF6584',  // Coral Pink (accents)
  secondaryLight: '#FF8FA3',

  // ─── Success / Warning / Error ─────────────────
  success:        '#34D399',  // Vibrant Emerald Green
  successLight:   'rgba(52, 211, 153, 0.15)',
  warning:        '#FBBF24',  // Vibrant Gold
  warningLight:   'rgba(251, 191, 36, 0.15)',
  error:          '#F87171',  // Vibrant Rose Red
  errorLight:     'rgba(248, 113, 113, 0.15)',

  // ─── Priority colors ───────────────────────────
  priorityHigh:   '#F87171',
  priorityMedium: '#FBBF24',
  priorityLow:    '#34D399',

  // ─── Neutrals ──────────────────────────────────
  white:          '#FFFFFF',
  background:     '#080616',  // Deeper Space Black/Purple
  
  // ─── Glassmorphism Tokens ──────────────────────
  surface:        'rgba(255, 255, 255, 0.05)',  // Standard Glass Surface
  surfaceAlt:     'rgba(108, 99, 255, 0.08)',   // Tinted Indigo Glass Surface
  surfaceGlass:   'rgba(255, 255, 255, 0.03)',  // Ultra-Light Frosted Glass
  border:         'rgba(255, 255, 255, 0.10)',  // Fine White Glass Border
  borderLight:    'rgba(255, 255, 255, 0.06)',  // Faint Glass Border
  borderGlow:     'rgba(108, 99, 255, 0.35)',   // Indigo Glowing Glass Border

  // ─── Text ──────────────────────────────────────
  textPrimary:    '#FFFFFF',
  textSecondary:  'rgba(255, 255, 255, 0.65)',
  textLight:      'rgba(255, 255, 255, 0.40)',
  textOnPrimary:  '#FFFFFF',

  // ─── Gradients (use with LinearGradient) ───────
  gradientPrimary:   ['#6C63FF', '#8B85FF'],
  gradientSuccess:   ['#34D399', '#6EE7B7'],
  gradientWarm:      ['#FF6584', '#FBBF24'],
  gradientDark:      ['#080616', '#140E36', '#0B091B'], // Sleek Radial Dark Gradient
  gradientGlass:     ['rgba(255, 255, 255, 0.07)', 'rgba(255, 255, 255, 0.02)'],
  gradientGlassAlt:  ['rgba(108, 99, 255, 0.12)', 'rgba(108, 99, 255, 0.03)'],
  
  // ─── Glow Presets ─────────────────────────────
  glowIndigo: {
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  glowEmerald: {
    shadowColor: '#34D399',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
};

export default COLORS;
