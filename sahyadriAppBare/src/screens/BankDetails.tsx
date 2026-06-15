import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, SafeAreaView, StatusBar, Modal, FlatList, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useApplicationData } from '../context/ApplicationContext';
import { colors, spacing, typography, globalStyles } from '../utils/theme';

interface SelectModalProps {
  visible: boolean;
  options: { label: string; value: string }[];
  onSelect: (value: string) => void;
  onClose: () => void;
  title: string;
}

const SelectModal: React.FC<SelectModalProps> = ({ visible, options, onSelect, onClose, title }) => (
  <Modal visible={visible} transparent animationType="slide">
    <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
      <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>{title}</Text>
          <TouchableOpacity onPress={onClose}>
            <Icon name="close" size={24} color={colors.onSurfaceVariant} />
          </TouchableOpacity>
        </View>
        <FlatList
          data={options}
          keyExtractor={(item) => item.value}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.modalOption}
              onPress={() => { onSelect(item.value); onClose(); }}
            >
              <Text style={styles.modalOptionText}>{item.label}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </TouchableOpacity>
  </Modal>
);

export default function BankDetails() {
  const navigation = useNavigation<any>();

  const [formData, setFormData] = useState({
    accountName: '',
    accountNumber: '',
    confirmAccountNumber: '',
    bankName: '',
    otherBankName: '',
    ifscCode: '',
    branchName: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const { updateBankDetails } = useApplicationData();

  const updateForm = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: '' }));
    }
  };

  const validateForm = () => {
    // DEV MODE: Skip validation for testing
    return true;

    const newErrors: Record<string, string> = {};

    if (!formData.accountName.trim()) newErrors.accountName = 'Account Holder Name is required';
    if (!formData.accountNumber.trim()) newErrors.accountNumber = 'Account Number is required';
    if (formData.accountNumber !== formData.confirmAccountNumber) {
      newErrors.confirmAccountNumber = 'Account numbers do not match';
    }
    
    if (!formData.bankName) newErrors.bankName = 'Bank Name is required';
    if (formData.bankName === 'other' && !formData.otherBankName.trim()) {
      newErrors.otherBankName = 'Other Bank Name is required';
    }

    if (!formData.branchName.trim()) newErrors.branchName = 'Branch Name is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validateForm()) {
      updateBankDetails(formData);
      navigation.navigate('LocationVerification');
    }
  };

  const bankOptions = [
    { label: 'State Bank of India (SBI)', value: 'sbi' },
    { label: 'HDFC Bank', value: 'hdfc' },
    { label: 'ICICI Bank', value: 'icici' },
    { label: 'Axis Bank', value: 'axis' },
    { label: 'Kotak Mahindra Bank', value: 'kotak' },
    { label: 'Other Bank', value: 'other' },
  ];

  const selectedBankLabel = bankOptions.find(opt => opt.value === formData.bankName)?.label || 'Select your bank';

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />
      
      {/* Top Navigation */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        
        <View style={styles.headerTitleContainer}>
          <Icon name="shield" size={24} color={colors.primary} style={{ marginRight: 8 }} />
          <Text style={styles.headerTitle}>Sahyadri Finance</Text>
        </View>

        <TouchableOpacity>
          <Icon name="help-outline" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {/* Progress Bar */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Step 3 of 6</Text>
            <Text style={styles.progressPercent}>50% Completed</Text>
          </View>
          <View style={styles.progressBarTrack}>
            <View style={[styles.progressBarFill, { width: '50%' }]} />
          </View>
        </View>

        <View style={[globalStyles.glassCard, styles.card]}>
          <View style={styles.cardHeader}>
            <View style={styles.iconContainer}>
              <Icon name="account-balance" size={24} color={colors.primary} />
            </View>
            <Text style={styles.title}>Bank Details</Text>
            <Text style={styles.subtitle}>Please provide your bank details for secure disbursements and EMIs.</Text>
          </View>

          {/* Trust Badge */}
          <View style={styles.badgeContainer}>
            <View style={styles.badge}>
              <Icon name="lock" size={16} color={colors.secondary} />
            </View>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Account Holder Name</Text>
              <TextInput
                style={[styles.input, errors.accountName && styles.inputError]}
                placeholder="As per bank records"
                placeholderTextColor={colors.outline}
                value={formData.accountName}
                onChangeText={(text) => updateForm('accountName', text)}
              />
              {errors.accountName && <Text style={styles.errorText}>{errors.accountName}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Account Number</Text>
              <TextInput
                style={[styles.input, errors.accountNumber && styles.inputError]}
                placeholder="Enter account number"
                placeholderTextColor={colors.outline}
                keyboardType="number-pad"
                value={formData.accountNumber}
                onChangeText={(text) => updateForm('accountNumber', text)}
              />
              {errors.accountNumber && <Text style={styles.errorText}>{errors.accountNumber}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm Account Number</Text>
              <TextInput
                style={[styles.input, errors.confirmAccountNumber && styles.inputError]}
                placeholder="Re-enter account number"
                placeholderTextColor={colors.outline}
                keyboardType="number-pad"
                value={formData.confirmAccountNumber}
                onChangeText={(text) => updateForm('confirmAccountNumber', text)}
              />
              {errors.confirmAccountNumber && <Text style={styles.errorText}>{errors.confirmAccountNumber}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Bank Name</Text>
              <TouchableOpacity 
                style={[styles.input, styles.selectInput, errors.bankName && styles.inputError]}
                onPress={() => setActiveModal('bank')}
              >
                <Text style={{ color: formData.bankName ? colors.onSurface : colors.outline }}>
                  {selectedBankLabel}
                </Text>
                <Icon name="expand-more" size={24} color={colors.onSurfaceVariant} />
              </TouchableOpacity>
              {errors.bankName && <Text style={styles.errorText}>{errors.bankName}</Text>}
            </View>

            {formData.bankName === 'other' && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Other Bank Name</Text>
                <TextInput
                  style={[styles.input, errors.otherBankName && styles.inputError]}
                  placeholder="Enter bank name"
                  placeholderTextColor={colors.outline}
                  value={formData.otherBankName}
                  onChangeText={(text) => updateForm('otherBankName', text)}
                />
                {errors.otherBankName && <Text style={styles.errorText}>{errors.otherBankName}</Text>}
              </View>
            )}

            <View style={styles.rowGroup}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>IFSC Code (Optional)</Text>
                <TextInput
                  style={[styles.input, errors.ifscCode && styles.inputError]}
                  placeholder="e.g. SBIN0001234"
                  placeholderTextColor={colors.outline}
                  autoCapitalize="characters"
                  value={formData.ifscCode}
                  onChangeText={(text) => updateForm('ifscCode', text.toUpperCase())}
                />
                {errors.ifscCode && <Text style={styles.errorText}>{errors.ifscCode}</Text>}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Branch Name</Text>
              <TextInput
                style={[styles.input, errors.branchName && styles.inputError]}
                placeholder="Branch location"
                placeholderTextColor={colors.outline}
                value={formData.branchName}
                onChangeText={(text) => updateForm('branchName', text)}
              />
              {errors.branchName && <Text style={styles.errorText}>{errors.branchName}</Text>}
            </View>

            <View style={styles.actionSection}>
              <TouchableOpacity style={styles.primaryButton} onPress={handleContinue}>
                <Text style={styles.primaryButtonText}>Continue</Text>
                <Icon name="arrow-forward" size={20} color={colors.onPrimary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.infoSection}>
          <Icon name="info" size={16} color={colors.onSurfaceVariant} style={{ marginTop: 2 }} />
          <Text style={styles.infoText}>We use penny drop verification to authenticate your account.</Text>
        </View>
      </ScrollView>

      {/* Modals */}
      <SelectModal
        visible={activeModal === 'bank'}
        title="Select your bank"
        options={bankOptions}
        onSelect={(val) => updateForm('bankName', val)}
        onClose={() => setActiveModal(null)}
      />
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
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    paddingHorizontal: spacing.marginMobile,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl * 2,
  },
  progressSection: {
    marginBottom: spacing.lg,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  progressLabel: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
  },
  progressPercent: {
    ...typography.labelSm,
    color: colors.secondary,
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
  card: {
    padding: spacing.lg,
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.headlineLgMobile,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
  },
  badgeContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  badge: {
    backgroundColor: 'rgba(0, 107, 85, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  form: {},
  inputGroup: {
    marginBottom: spacing.md,
  },
  rowGroup: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  label: {
    ...typography.labelSm,
    color: colors.onSurface,
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: 4,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    ...typography.bodyLg,
    color: colors.onSurface,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    ...typography.labelSm,
    color: colors.error,
    marginTop: 4,
  },
  selectInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionSection: {
    marginTop: spacing.sm,
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
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    gap: spacing.sm,
  },
  primaryButtonText: {
    ...typography.titleMd,
    color: colors.onPrimary,
  },
  infoSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginTop: spacing.md,
    gap: 4,
  },
  infoText: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: spacing.lg,
    maxHeight: '50%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceVariant,
  },
  modalTitle: {
    ...typography.titleMd,
    color: colors.primary,
  },
  modalOption: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceContainerHigh,
  },
  modalOptionText: {
    ...typography.bodyLg,
    color: colors.onSurface,
  },
});
