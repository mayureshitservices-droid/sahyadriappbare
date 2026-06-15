import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, StatusBar, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors, spacing, typography, globalStyles } from '../utils/theme';

export default function ApplicationSuccess() {
  const navigation = useNavigation<any>();

  // Generate a random 12-digit ID
  const appId = React.useMemo(() => {
    let id = '';
    for (let i = 0; i < 12; i++) {
      id += Math.floor(Math.random() * 10).toString();
    }
    return `SHF-2026-${id}`;
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />
      
      {/* Top Navigation */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Icon name="security" size={24} color={colors.primary} />
        </TouchableOpacity>
        
        <View style={styles.headerTitleContainer}>
          <Icon name="shield" size={24} color={colors.primary} style={{ marginRight: 8 }} />
          <Text style={styles.headerTitle}>Sahyadri Finance</Text>
        </View>

        <TouchableOpacity>
          <Icon name="account-circle" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {/* Success Animation & Headline Section */}
        <View style={styles.heroSection}>
          <View style={styles.successIconContainer}>
            <View style={styles.successIconCircle}>
              <Icon name="check" size={64} color={colors.secondary} />
            </View>
          </View>
          <Text style={styles.title}>🎉 Congratulations!</Text>
          <Text style={styles.subtitle}>Your application has been successfully accepted.</Text>
          <Text style={styles.bodyText}>
            Our team is completing the final verification process. Funds will be credited to your registered bank account once verification is completed.
          </Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Application Progress</Text>
            <Text style={styles.progressPercent}>100%</Text>
          </View>
          <View style={styles.progressBarTrack}>
            <View style={[styles.progressBarFill, { width: '100%' }]} />
          </View>
        </View>

        {/* Application Details Grid */}
        <View style={styles.grid}>
          {/* Status Card */}
          <View style={[globalStyles.glassCard, styles.card]}>
            <Text style={styles.cardLabel}>APPLICATION ID</Text>
            <Text style={styles.cardValue}>{appId}</Text>
            
            <Text style={styles.cardLabel}>CURRENT STATUS</Text>
            <View style={styles.statusRow}>
              <Icon name="check-circle" size={20} color={colors.secondary} style={styles.statusIcon} />
              <Text style={styles.statusText}>Application Accepted</Text>
            </View>
            <View style={styles.statusRow}>
              <Icon name="sync" size={20} color={colors.primaryContainer} style={styles.statusIcon} />
              <Text style={styles.statusText}>Verification In Progress</Text>
            </View>
          </View>

          {/* Timeline Card */}
          <View style={[globalStyles.glassCard, styles.card]}>
            <Text style={styles.cardLabel}>TIMELINE</Text>
            
            <View style={styles.timeline}>
              {/* Step 1 */}
              <View style={styles.timelineStep}>
                <View style={styles.timelineDotActive} />
                <View style={styles.timelineLineActive} />
                <Text style={styles.timelineTextActive}>Application Submitted</Text>
              </View>
              {/* Step 2 */}
              <View style={styles.timelineStep}>
                <View style={styles.timelineDotActive} />
                <View style={styles.timelineLineInactive} />
                <Text style={styles.timelineTextActive}>Verification In Progress</Text>
              </View>
              {/* Step 3 */}
              <View style={[styles.timelineStep, { borderLeftWidth: 0, paddingLeft: 22, marginLeft: 1 }]}>
                <View style={[styles.timelineDotInactive, { left: -7 }]} />
                <Text style={styles.timelineTextInactive}>Disbursal Pending</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.primaryButton}>
            <Icon name="track-changes" size={20} color={colors.onPrimary} />
            <Text style={styles.primaryButtonText}>Track Application</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('LandingPage')}
          >
            <Icon name="home" size={20} color={colors.primaryContainer} />
            <Text style={styles.secondaryButtonText}>Return Home</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.marginMobile,
    height: 64,
    backgroundColor: 'rgba(241, 251, 255, 0.8)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(217, 228, 233, 0.4)',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    ...typography.titleMd,
    color: colors.primary,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    paddingHorizontal: spacing.marginMobile,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl * 2,
    alignItems: 'center',
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    maxWidth: 600,
  },
  successIconContainer: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  successIconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(75, 221, 183, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.secondary,
  },
  title: {
    ...typography.headlineLgMobile,
    color: colors.primary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.titleMd,
    color: colors.secondary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  bodyText: {
    ...typography.bodyLg,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
  },
  progressSection: {
    width: '100%',
    maxWidth: 600,
    marginBottom: spacing.xl,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  progressLabel: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
  },
  progressPercent: {
    ...typography.labelSm,
    color: colors.secondary,
    fontWeight: 'bold',
  },
  progressBarTrack: {
    width: '100%',
    height: 8,
    backgroundColor: colors.surfaceVariant,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.secondary,
    borderRadius: 4,
  },
  grid: {
    width: '100%',
    maxWidth: 600,
    gap: spacing.lg,
    marginBottom: spacing.xl,
  },
  card: {
    padding: spacing.lg,
    width: '100%',
  },
  cardLabel: {
    ...typography.labelSm,
    color: colors.outline,
    marginBottom: spacing.sm,
  },
  cardValue: {
    ...typography.titleMd,
    color: colors.primary,
    marginBottom: spacing.lg,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statusIcon: {
    marginRight: spacing.sm,
  },
  statusText: {
    ...typography.bodyLg,
    fontWeight: '500',
    color: colors.onSurface,
  },
  timeline: {
    marginLeft: spacing.sm,
    marginTop: spacing.xs,
  },
  timelineStep: {
    paddingLeft: 20,
    borderLeftWidth: 2,
    borderLeftColor: colors.surfaceVariant,
    paddingBottom: spacing.lg,
    position: 'relative',
  },
  timelineDotActive: {
    position: 'absolute',
    left: -9,
    top: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.secondary,
    borderWidth: 2,
    borderColor: colors.surface,
  },
  timelineDotInactive: {
    position: 'absolute',
    left: -9,
    top: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.surfaceVariant,
    borderWidth: 2,
    borderColor: colors.surface,
  },
  timelineLineActive: {
    position: 'absolute',
    left: -2,
    top: 20,
    bottom: -4,
    width: 2,
    backgroundColor: colors.surfaceVariant, // The border covers this, but for visual separation if needed
  },
  timelineLineInactive: {
    position: 'absolute',
    left: -2,
    top: 20,
    bottom: -4,
    width: 2,
    backgroundColor: colors.surfaceVariant,
  },
  timelineTextActive: {
    ...typography.bodyMd,
    color: colors.onSurface,
  },
  timelineTextInactive: {
    ...typography.bodyMd,
    color: colors.outline,
  },
  actionButtons: {
    width: '100%',
    maxWidth: 600,
    gap: spacing.md,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    gap: spacing.sm,
  },
  primaryButtonText: {
    ...typography.titleMd,
    color: colors.onPrimary,
  },
  secondaryButton: {
    backgroundColor: 'rgba(241, 251, 255, 0.5)',
    borderWidth: 2,
    borderColor: colors.primaryContainer,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    gap: spacing.sm,
  },
  secondaryButtonText: {
    ...typography.titleMd,
    color: colors.primaryContainer,
  },
});
