import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, SafeAreaView, StatusBar, Modal, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
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

export default function PersonalDetails() {
  const navigation = useNavigation<any>();

  const [formData, setFormData] = useState({
    fullName: '',
    aadhaar: '',
    dob: '',
    gender: '',
    maritalStatus: '',
    mobile: '',
    altMobile: '',
    spouseMobile: '',
    siblingMobile: '',
    friendMobile: '',
    address: '',
    city: '',
    state: '',
    certified: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const { updatePersonalDetails } = useApplicationData();

  const updateForm = (key: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: '' }));
    }
  };

  const validateForm = () => {
    // DEV MODE: Skip validation for testing
    return true;

    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
    if (!/^\d{12}$/.test(formData.aadhaar)) newErrors.aadhaar = 'Valid 12-digit Aadhaar required';
    if (!formData.dob) newErrors.dob = 'Date of birth is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.maritalStatus) newErrors.maritalStatus = 'Marital status is required';
    
    if (!/^\d{10}$/.test(formData.mobile)) newErrors.mobile = 'Valid 10-digit mobile required';
    if (formData.altMobile && !/^\d{10}$/.test(formData.altMobile)) newErrors.altMobile = 'Invalid mobile number';
    if (formData.spouseMobile && !/^\d{10}$/.test(formData.spouseMobile)) newErrors.spouseMobile = 'Invalid mobile number';
    if (formData.siblingMobile && !/^\d{10}$/.test(formData.siblingMobile)) newErrors.siblingMobile = 'Invalid mobile number';
    if (formData.friendMobile && !/^\d{10}$/.test(formData.friendMobile)) newErrors.friendMobile = 'Invalid mobile number';

    // Check unique mobile numbers
    const mobiles = [
      formData.mobile,
      formData.altMobile,
      formData.spouseMobile,
      formData.siblingMobile,
      formData.friendMobile
    ].filter(Boolean); // keep only non-empty

    const uniqueMobiles = new Set(mobiles);
    if (uniqueMobiles.size !== mobiles.length) {
      newErrors.mobile = 'All mobile numbers must be unique';
      newErrors.altMobile = 'All mobile numbers must be unique';
      newErrors.spouseMobile = 'All mobile numbers must be unique';
      newErrors.siblingMobile = 'All mobile numbers must be unique';
      newErrors.friendMobile = 'All mobile numbers must be unique';
    }

    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state) newErrors.state = 'State is required';
    
    if (!formData.certified) newErrors.certified = 'You must certify the information';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validateForm()) {
      updatePersonalDetails(formData);
      navigation.navigate('BankDetails');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />
      
      {/* TopAppBar */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sahyadri Finance</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {/* Header & Progress */}
        <View style={styles.progressSection}>
          <View style={styles.logoPlaceholder}>
            <Icon name="shield" size={32} color={colors.primary} />
          </View>
          <Text style={styles.pageTitle}>Personal Details</Text>
          <Text style={styles.pageSubtitle}>Step 1 of 4: Tell us about yourself</Text>
          <View style={styles.progressBarTrack}>
            <View style={[styles.progressBarFill, { width: '25%' }]} />
          </View>
        </View>

        {/* Core Identity Section */}
        <View style={[globalStyles.glassCard, styles.sectionCard]}>
          <View style={styles.sectionHeader}>
            <Icon name="person" size={20} color={colors.primary} />
            <Text style={styles.sectionTitle}>Personal Details</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name (As per Aadhaar)</Text>
            <TextInput
              style={[styles.input, errors.fullName && styles.inputError]}
              placeholder="e.g. Rahul Sharma"
              placeholderTextColor={colors.outline}
              value={formData.fullName}
              onChangeText={(text) => updateForm('fullName', text)}
            />
            {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Aadhaar Number</Text>
            <TextInput
              style={[styles.input, errors.aadhaar && styles.inputError]}
              placeholder="XXXX XXXX XXXX"
              placeholderTextColor={colors.outline}
              keyboardType="number-pad"
              maxLength={12}
              value={formData.aadhaar}
              onChangeText={(text) => updateForm('aadhaar', text)}
            />
            {errors.aadhaar && <Text style={styles.errorText}>{errors.aadhaar}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date Of Birth (YYYY-MM-DD)</Text>
            <TouchableOpacity 
              style={[styles.input, styles.selectInput, errors.dob && styles.inputError]}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={{ color: formData.dob ? colors.onSurface : colors.outline }}>
                {formData.dob || 'Select Date'}
              </Text>
              <Icon name="calendar-today" size={24} color={colors.onSurfaceVariant} />
            </TouchableOpacity>
            {errors.dob && <Text style={styles.errorText}>{errors.dob}</Text>}
          </View>
          
          {showDatePicker && (
            <DateTimePicker
              value={formData.dob ? new Date(formData.dob) : new Date(2000, 0, 1)}
              mode="date"
              display="default"
              maximumDate={new Date()}
              onChange={(event, date) => {
                setShowDatePicker(false);
                if (date) {
                  updateForm('dob', date.toISOString().split('T')[0]);
                }
              }}
            />
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Gender</Text>
            <TouchableOpacity 
              style={[styles.input, styles.selectInput, errors.gender && styles.inputError]}
              onPress={() => setActiveModal('gender')}
            >
              <Text style={{ color: formData.gender ? colors.onSurface : colors.outline }}>
                {formData.gender || 'Select Gender'}
              </Text>
              <Icon name="arrow-drop-down" size={24} color={colors.onSurfaceVariant} />
            </TouchableOpacity>
            {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Marital Status</Text>
            <TouchableOpacity 
              style={[styles.input, styles.selectInput, errors.maritalStatus && styles.inputError]}
              onPress={() => setActiveModal('maritalStatus')}
            >
              <Text style={{ color: formData.maritalStatus ? colors.onSurface : colors.outline }}>
                {formData.maritalStatus || 'Select Status'}
              </Text>
              <Icon name="arrow-drop-down" size={24} color={colors.onSurfaceVariant} />
            </TouchableOpacity>
            {errors.maritalStatus && <Text style={styles.errorText}>{errors.maritalStatus}</Text>}
          </View>
        </View>

        {/* Contact Information Section */}
        <View style={[globalStyles.glassCard, styles.sectionCard]}>
          <View style={styles.sectionHeader}>
            <Icon name="call" size={20} color={colors.primary} />
            <Text style={styles.sectionTitle}>Contact Information</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mobile Number</Text>
            <View style={styles.phoneInputContainer}>
              <View style={styles.phonePrefix}>
                <Text style={styles.phonePrefixText}>+91</Text>
              </View>
              <TextInput
                style={[styles.phoneInput, errors.mobile && styles.inputError]}
                placeholder="9876543210"
                placeholderTextColor={colors.outline}
                keyboardType="phone-pad"
                maxLength={10}
                value={formData.mobile}
                onChangeText={(text) => updateForm('mobile', text)}
              />
            </View>
            {errors.mobile && <Text style={styles.errorText}>{errors.mobile}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Alternate Mobile Number</Text>
            <View style={styles.phoneInputContainer}>
              <View style={styles.phonePrefix}>
                <Text style={styles.phonePrefixText}>+91</Text>
              </View>
              <TextInput
                style={[styles.phoneInput, errors.altMobile && styles.inputError]}
                placeholder="Optional"
                placeholderTextColor={colors.outline}
                keyboardType="phone-pad"
                maxLength={10}
                value={formData.altMobile}
                onChangeText={(text) => updateForm('altMobile', text)}
              />
            </View>
            {errors.altMobile && <Text style={styles.errorText}>{errors.altMobile}</Text>}
          </View>

          <View style={styles.subSection}>
            <Text style={styles.subSectionTitle}>FRIENDS & FAMILY</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Spouse Number</Text>
              <TextInput
                style={[styles.input, errors.spouseMobile && styles.inputError]}
                placeholder="10 Digits"
                placeholderTextColor={colors.outline}
                keyboardType="phone-pad"
                maxLength={10}
                value={formData.spouseMobile}
                onChangeText={(text) => updateForm('spouseMobile', text)}
              />
              {errors.spouseMobile && <Text style={styles.errorText}>{errors.spouseMobile}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Brother/Sister Number</Text>
              <TextInput
                style={[styles.input, errors.siblingMobile && styles.inputError]}
                placeholder="10 Digits"
                placeholderTextColor={colors.outline}
                keyboardType="phone-pad"
                maxLength={10}
                value={formData.siblingMobile}
                onChangeText={(text) => updateForm('siblingMobile', text)}
              />
              {errors.siblingMobile && <Text style={styles.errorText}>{errors.siblingMobile}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Friend Number</Text>
              <TextInput
                style={[styles.input, errors.friendMobile && styles.inputError]}
                placeholder="10 Digits"
                placeholderTextColor={colors.outline}
                keyboardType="phone-pad"
                maxLength={10}
                value={formData.friendMobile}
                onChangeText={(text) => updateForm('friendMobile', text)}
              />
              {errors.friendMobile && <Text style={styles.errorText}>{errors.friendMobile}</Text>}
            </View>
          </View>
        </View>

        {/* Address Section */}
        <View style={[globalStyles.glassCard, styles.sectionCard]}>
          <View style={styles.sectionHeader}>
            <Icon name="pin-drop" size={20} color={colors.primary} />
            <Text style={styles.sectionTitle}>Current Address</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Street Address, Flat/House No.</Text>
            <TextInput
              style={[styles.input, styles.textArea, errors.address && styles.inputError]}
              placeholder="Enter complete address..."
              placeholderTextColor={colors.outline}
              multiline
              numberOfLines={2}
              value={formData.address}
              onChangeText={(text) => updateForm('address', text)}
            />
            {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>City</Text>
            <TextInput
              style={[styles.input, errors.city && styles.inputError]}
              placeholder="e.g. Pune"
              placeholderTextColor={colors.outline}
              value={formData.city}
              onChangeText={(text) => updateForm('city', text)}
            />
            {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>State</Text>
            <TouchableOpacity 
              style={[styles.input, styles.selectInput, errors.state && styles.inputError]}
              onPress={() => setActiveModal('state')}
            >
              <Text style={{ color: formData.state ? colors.onSurface : colors.outline }}>
                {formData.state || 'Select State'}
              </Text>
              <Icon name="arrow-drop-down" size={24} color={colors.onSurfaceVariant} />
            </TouchableOpacity>
            {errors.state && <Text style={styles.errorText}>{errors.state}</Text>}
          </View>
        </View>

        {/* Certification & Action */}
        <View style={styles.actionSection}>
          <TouchableOpacity 
            style={styles.checkboxContainer} 
            activeOpacity={0.8}
            onPress={() => updateForm('certified', !formData.certified)}
          >
            <View style={[styles.checkbox, formData.certified && styles.checkboxChecked]}>
              {formData.certified && <Icon name="check" size={16} color={colors.onPrimary} />}
            </View>
            <Text style={styles.checkboxText}>
              I certify that the information provided is accurate and I authorize Sahyadri Finance to verify these details.
            </Text>
          </TouchableOpacity>
          {errors.certified && <Text style={[styles.errorText, { marginLeft: 32 }]}>{errors.certified}</Text>}

          <TouchableOpacity style={styles.primaryButton} onPress={handleContinue}>
            <Text style={styles.primaryButtonText}>Continue</Text>
            <Icon name="arrow-forward" size={20} color={colors.onPrimary} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modals */}
      <SelectModal
        visible={activeModal === 'gender'}
        title="Select Gender"
        options={[
          { label: 'Male', value: 'Male' },
          { label: 'Female', value: 'Female' },
          { label: 'Other', value: 'Other' },
        ]}
        onSelect={(val) => updateForm('gender', val)}
        onClose={() => setActiveModal(null)}
      />
      <SelectModal
        visible={activeModal === 'maritalStatus'}
        title="Marital Status"
        options={[
          { label: 'Single', value: 'Single' },
          { label: 'Married', value: 'Married' },
          { label: 'Divorced', value: 'Divorced' },
          { label: 'Widowed', value: 'Widowed' },
        ]}
        onSelect={(val) => updateForm('maritalStatus', val)}
        onClose={() => setActiveModal(null)}
      />
      <SelectModal
        visible={activeModal === 'state'}
        title="Select State"
        options={[
          { label: 'Maharashtra', value: 'Maharashtra' },
          { label: 'Gujarat', value: 'Gujarat' },
          { label: 'Karnataka', value: 'Karnataka' },
          { label: 'Delhi', value: 'Delhi' },
        ]}
        onSelect={(val) => updateForm('state', val)}
        onClose={() => setActiveModal(null)}
      />
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
  headerButton: {
    padding: spacing.xs,
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
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  logoPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  pageTitle: {
    ...typography.headlineLgMobile,
    color: colors.primary,
  },
  pageSubtitle: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    marginTop: spacing.sm,
  },
  progressBarTrack: {
    width: '100%',
    height: 8,
    backgroundColor: '#F1F2F6',
    borderRadius: 4,
    marginTop: spacing.md,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.secondary,
    borderRadius: 4,
  },
  sectionCard: {
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceVariant,
    paddingBottom: spacing.xs,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.titleMd,
    color: colors.primary,
    marginLeft: spacing.xs,
  },
  inputGroup: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: 6,
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
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  phonePrefix: {
    position: 'absolute',
    left: 0,
    zIndex: 1,
    paddingHorizontal: spacing.md,
    borderRightWidth: 1,
    borderRightColor: colors.outlineVariant,
    height: '100%',
    justifyContent: 'center',
  },
  phonePrefixText: {
    ...typography.bodyLg,
    color: colors.onSurfaceVariant,
  },
  phoneInput: {
    flex: 1,
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: 6,
    paddingLeft: 64,
    paddingRight: spacing.md,
    paddingVertical: 12,
    ...typography.bodyLg,
    color: colors.onSurface,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  subSection: {
    backgroundColor: colors.surfaceContainerLow,
    padding: spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(217, 228, 233, 0.5)',
    marginTop: spacing.sm,
  },
  subSectionTitle: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
  actionSection: {
    marginTop: spacing.md,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 2,
    backgroundColor: colors.surfaceContainerLowest,
    marginRight: spacing.sm,
    marginTop: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
  },
  checkboxText: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    flex: 1,
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
