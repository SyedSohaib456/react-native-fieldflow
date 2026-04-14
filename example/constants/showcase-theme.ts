/**
 * Sleek, minimal light-mode design tokens.
 * Inspired by clean SaaS onboarding flows — white space, soft grays, green accent.
 */

export const ShowcaseColors = {
  // ── Backgrounds ──────────────────────────────────────
  bgPrimary: '#FFFFFF',
  bgSecondary: '#FAFAFA',
  bgCard: '#F5F5F7',
  bgInput: '#F2F2F7',
  bgInputFocused: '#FFFFFF',

  // ── Accent ───────────────────────────────────────────
  accent: '#34C759',        // iOS green
  accentLight: '#34C75915', // green with opacity
  accentBorder: '#34C75940',

  // ── Text ─────────────────────────────────────────────
  textPrimary: '#1C1C1E',
  textSecondary: '#8E8E93',
  textTertiary: '#AEAEB2',
  textOnAccent: '#FFFFFF',

  // ── Borders ──────────────────────────────────────────
  border: '#E5E5EA',
  borderFocused: '#34C759',
  borderSubtle: '#F2F2F7',

  // ── Status ───────────────────────────────────────────
  success: '#34C759',
  info: '#007AFF',
  warning: '#FF9500',
  danger: '#FF3B30',

  // ── Brand Identity ───────────────────────────────────
  marloGold: '#D4AF37',
  pulseRose: '#FF2D55',
  wayfarerSky: '#007AFF',
  velaNavy: '#0A1128',
  threadTeal: '#008080',

  // ── Misc ─────────────────────────────────────────────
  separator: '#E5E5EA',
  tabBar: '#FFFFFF',
  tabBarBorder: '#E5E5EA',
} as const;

export const ShowcaseSpacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const ShowcaseRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;
