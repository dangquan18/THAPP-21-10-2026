export const colors = {
  primary: '#5CC8FF',
  onPrimary: '#0B1020',
  primarySoft: 'rgba(92, 200, 255, 0.14)',
  background: '#0E1120',
  surface: '#161A2E',
  surfaceAlt: '#1D2238',
  border: '#262B45',
  text: '#F2F4FA',
  textSecondary: '#8A90A8',
  textMuted: '#5D6380',
  danger: '#FF5A3C',
  dangerSoft: 'rgba(255, 90, 60, 0.16)',
  error: '#FF5468',
  badge: '#FF4D4F',
  online: '#2ED47A',
  offline: '#5D6380',
  overlay: 'rgba(5, 7, 15, 0.7)',
  white: '#FFFFFF',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  pill: 999,
};

export const typography = {
  screenTitle: {
    fontSize: 28,
    fontWeight: '800' as const,
    color: colors.text,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: colors.textSecondary,
    letterSpacing: 0.6,
    textTransform: 'uppercase' as const,
  },
};
