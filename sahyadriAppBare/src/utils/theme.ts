import { StyleSheet } from 'react-native';

export const colors = {
  primary: '#002743',
  onPrimary: '#ffffff',
  primaryContainer: '#0a3d62',
  onPrimaryContainer: '#80a8d3',
  secondary: '#006b55',
  onSecondary: '#ffffff',
  secondaryContainer: '#6dfad2',
  onSecondaryContainer: '#00725b',
  secondaryFixed: '#6dfad2',
  background: '#f1fbff',
  onBackground: '#131d21',
  surface: '#f1fbff',
  onSurface: '#131d21',
  surfaceVariant: '#d9e4e9',
  onSurfaceVariant: '#42474e',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerLow: '#eaf5fa',
  surfaceContainer: '#e4f0f4',
  surfaceContainerHigh: '#dfeaef',
  outline: '#72777f',
  outlineVariant: '#c2c7cf',
  error: '#ba1a1a',
  transparent: 'transparent',
  primaryFixed: '#cfe5ff',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  gutter: 16,
  marginMobile: 20,
  marginDesktop: 64,
};

export const typography = StyleSheet.create({
  titleMd: {
    fontFamily: 'Inter',
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600',
  },
  bodyLg: {
    fontFamily: 'Inter',
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
  },
  labelSm: {
    fontFamily: 'Inter',
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.6, // 0.05em of 12px
    fontWeight: '500',
  },
  headlineLg: {
    fontFamily: 'Inter',
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: -0.32, // -0.01em of 32px
    fontWeight: '600',
  },
  bodyMd: {
    fontFamily: 'Inter',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
  },
  headlineLgMobile: {
    fontFamily: 'Inter',
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '600',
  },
  displayLg: {
    fontFamily: 'Inter',
    fontSize: 40,
    lineHeight: 48,
    letterSpacing: -0.8, // -0.02em of 40px
    fontWeight: '700',
  },
});

export const globalStyles = StyleSheet.create({
  glassCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    shadowColor: '#0a3d62',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 32,
    elevation: 5,
    borderRadius: 12,
  },
});
