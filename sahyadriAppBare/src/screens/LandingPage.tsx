import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors, spacing, typography, globalStyles } from '../utils/theme';

export default function LandingPage() {
  const navigation = useNavigation<any>();
  const [lang, setLang] = React.useState('EN');

  const toggleLanguage = () => {
    if (lang === 'EN') setLang('HI');
    else if (lang === 'HI') setLang('MR');
    else setLang('EN');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Icon name="shield" size={24} color={colors.primary} style={styles.logoIcon} />
          <Text style={styles.headerTitle}>Sahyadri Finance</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={toggleLanguage}>
            <Text style={styles.languageSelect}>{lang}</Text>
          </TouchableOpacity>
          <Icon name="account-circle" size={24} color={colors.primary} style={{ marginLeft: spacing.sm }} />
        </View>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.chip}>
            <Icon name="bolt" size={16} color={colors.secondary} />
            <Text style={styles.chipText}>FAST APPROVAL PROCESS</Text>
          </View>
          
          <Text style={styles.heroTitle}>
            Get Up To <Text style={{ color: colors.secondary }}>₹50,000</Text> Within 24 Hours
          </Text>
          
          <Text style={styles.heroSubtitle}>
            No lengthy paperwork. Simple application process. Fast verification and direct bank transfer.
          </Text>

          <Text style={[styles.heroSubtitle, { color: colors.secondary, fontWeight: 'bold' }]}>
            Timely EMI payments can increase your credit limit.
          </Text>

          <View style={styles.buttonGroup}>
            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={() => navigation.navigate('PersonalDetails')}
            >
              <Text style={styles.primaryButtonText}>Apply Now</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Check Eligibility</Text>
            </TouchableOpacity>
          </View>

          {/* Hero Visual (Glass Card) */}
          <View style={styles.visualContainer}>
            <View style={[globalStyles.glassCard, styles.balanceCard]}>
              <View style={styles.balanceHeader}>
                <Text style={styles.balanceLabel}>Available Limit</Text>
                <Icon name="shield" size={20} color={colors.primary} />
              </View>
              <Text style={styles.balanceAmount}>₹50,000</Text>
              <View style={styles.balanceStatus}>
                <Icon name="check-circle" size={16} color={colors.secondary} />
                <Text style={styles.balanceStatusText}>Pre-approved</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Trust Banner */}
        <View style={styles.trustBanner}>
          <View style={styles.trustHeader}>
            <Icon name="verified-user" size={24} color={colors.secondaryFixed} />
            <Text style={styles.trustHeaderText}>Your information is encrypted and protected.</Text>
          </View>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>50,000+</Text>
              <Text style={styles.statLabel}>APPLICATIONS</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>24 Hrs</Text>
              <Text style={styles.statLabel}>AVG PROCESSING</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>100%</Text>
              <Text style={styles.statLabel}>DIGITAL</Text>
            </View>
          </View>
        </View>

        {/* Benefits Bento Grid */}
        <View style={styles.benefitsSection}>
          <Text style={styles.sectionTitle}>Why Choose Sahyadri Finance?</Text>
          <Text style={styles.sectionSubtitle}>Experience seamless borrowing designed for the modern Indian context.</Text>

          <View style={[globalStyles.glassCard, styles.bentoCard]}>
            <View style={[styles.iconBox, { backgroundColor: colors.primaryContainer }]}>
              <Icon name="description" size={24} color={colors.onPrimaryContainer} />
            </View>
            <Text style={styles.bentoTitle}>Minimal Documentation</Text>
            <Text style={styles.bentoBody}>Skip the heavy paperwork. We require only the essential details to process your application swiftly.</Text>
            <View style={styles.bentoTags}>
              <View style={styles.tag}>
                <Text style={styles.tagText}>NO PAN CARD REQUIRED</Text>
              </View>
            </View>
          </View>

          <View style={[globalStyles.glassCard, styles.bentoCard]}>
            <View style={[styles.iconBox, { backgroundColor: colors.secondaryContainer }]}>
              <Icon name="speed" size={24} color={colors.onSecondaryContainer} />
            </View>
            <Text style={styles.bentoTitle}>Fast Processing</Text>
            <Text style={styles.bentoBody}>Approvals typically happen within hours, not days.</Text>
          </View>

          <View style={[globalStyles.glassCard, styles.bentoCard]}>
            <View style={[styles.iconBox, { backgroundColor: colors.surfaceVariant }]}>
              <Icon name="account-balance" size={24} color={colors.primary} />
            </View>
            <Text style={styles.bentoTitle}>Direct Transfer</Text>
            <Text style={styles.bentoBody}>Funds are routed directly to your verified bank account immediately after approval.</Text>
          </View>

          <View style={[globalStyles.glassCard, styles.bentoCard]}>
            <View style={[styles.iconBox, { backgroundColor: colors.primaryContainer }]}>
              <Icon name="language" size={24} color={colors.onPrimaryContainer} />
            </View>
            <Text style={styles.bentoTitle}>Multilingual Support</Text>
            <Text style={styles.bentoBody}>Our app and support teams communicate in English, Hindi, and Marathi to ensure you fully understand your terms.</Text>
            <View style={styles.langTags}>
              <TouchableOpacity onPress={() => setLang('EN')}>
                <Text style={[styles.langTag, lang === 'EN' && styles.langTagActive]}>English</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setLang('HI')}>
                <Text style={[styles.langTag, lang === 'HI' && styles.langTagActive]}>हिन्दी</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setLang('MR')}>
                <Text style={[styles.langTag, lang === 'MR' && styles.langTagActive]}>मराठी</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIcon: {
    marginRight: spacing.xs,
  },
  headerTitle: {
    ...typography.titleMd,
    color: colors.primary,
    letterSpacing: -0.5,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageSelect: {
    ...typography.labelSm,
    color: colors.primary,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    paddingBottom: spacing.xl * 2,
  },
  heroSection: {
    paddingHorizontal: spacing.marginMobile,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerHigh,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(217, 228, 233, 0.5)',
    marginBottom: spacing.md,
  },
  chipText: {
    ...typography.labelSm,
    color: colors.primary,
    marginLeft: 4,
  },
  heroTitle: {
    ...typography.headlineLgMobile,
    color: colors.primary,
    marginBottom: spacing.md,
  },
  heroSubtitle: {
    ...typography.bodyLg,
    color: colors.onSurfaceVariant,
    marginBottom: spacing.lg,
  },
  buttonGroup: {
    gap: spacing.md,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: spacing.xl,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: colors.primaryContainer,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 4,
  },
  primaryButtonText: {
    ...typography.titleMd,
    fontSize: 16,
    color: colors.onPrimary,
  },
  secondaryButton: {
    backgroundColor: 'rgba(241, 251, 255, 0.5)',
    borderWidth: 1,
    borderColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: spacing.xl,
    borderRadius: 8,
    alignItems: 'center',
  },
  secondaryButtonText: {
    ...typography.titleMd,
    fontSize: 16,
    color: colors.primary,
  },
  visualContainer: {
    alignItems: 'center',
    marginTop: spacing.xl,
    paddingVertical: spacing.lg,
  },
  balanceCard: {
    width: '85%',
    padding: spacing.lg,
    transform: [{ rotate: '-2deg' }],
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  balanceLabel: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
  },
  balanceAmount: {
    ...typography.displayLg,
    fontSize: 32,
    lineHeight: 40,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  balanceStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceStatusText: {
    ...typography.labelSm,
    color: colors.secondary,
    marginLeft: 4,
  },
  trustBanner: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.marginMobile,
  },
  trustHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  trustHeaderText: {
    ...typography.titleMd,
    color: colors.onPrimary,
    marginLeft: spacing.sm,
    flex: 1,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  statItem: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  statValue: {
    ...typography.headlineLgMobile,
    color: colors.secondaryFixed,
  },
  statLabel: {
    ...typography.labelSm,
    color: colors.onPrimary,
    opacity: 0.8,
    marginTop: spacing.xs,
  },
  benefitsSection: {
    paddingHorizontal: spacing.marginMobile,
    paddingVertical: spacing.xl,
    backgroundColor: colors.surfaceContainerLow,
  },
  sectionTitle: {
    ...typography.headlineLgMobile,
    color: colors.primary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  sectionSubtitle: {
    ...typography.bodyLg,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  bentoCard: {
    padding: spacing.lg,
    marginBottom: spacing.gutter,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  bentoTitle: {
    ...typography.titleMd,
    color: colors.primary,
    marginBottom: spacing.xs,
    marginTop: spacing.xs,
  },
  bentoBody: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
  },
  bentoTags: {
    marginTop: spacing.md,
    flexDirection: 'row',
  },
  tag: {
    backgroundColor: colors.surfaceVariant,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  tagText: {
    ...typography.labelSm,
    fontSize: 10,
    color: colors.primary,
  },
  langTags: {
    marginTop: spacing.md,
    flexDirection: 'row',
    gap: spacing.sm,
  },
  langTag: {
    ...typography.labelSm,
    color: colors.outline,
    backgroundColor: 'transparent',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    overflow: 'hidden',
  },
  langTagActive: {
    color: colors.secondary,
    backgroundColor: 'rgba(0, 107, 85, 0.1)',
    borderColor: 'rgba(0, 107, 85, 0.2)',
  },
});
