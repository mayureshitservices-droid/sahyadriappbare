import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, Image, Alert, useWindowDimensions, Platform, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
import type { CameraRef } from 'react-native-vision-camera/lib/views/Camera';
import FaceDetection from '@react-native-ml-kit/face-detection';

import Icon from 'react-native-vector-icons/MaterialIcons';
import { useApplicationData } from '../context/ApplicationContext';
import { colors, spacing, typography, globalStyles } from '../utils/theme';

const POLL_INTERVAL = 600;
const EYE_CLOSED_THRESHOLD = 0.3;
const REQUIRED_BLINKS = 2;

const CUTOUT_ASPECT_RATIO = 0.75;

async function fileToBase64(path: string): Promise<string> {
  const response = await fetch(`file://${path}`);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export default function SelfieCapture() {
  const navigation = useNavigation<any>();
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();
  const device = useCameraDevice('front');
  const { hasPermission, requestPermission } = useCameraPermission();
  const cameraRef = useRef<CameraRef>(null);
  const { data, updateSelfie } = useApplicationData();

  const [step, setStep] = useState<'permission' | 'capture' | 'preview'>('permission');
  const [cameraReady, setCameraReady] = useState(false);
  const [blinkCount, setBlinkCount] = useState(0);
  const [faceDetected, setFaceDetected] = useState(false);
  const [statusText, setStatusText] = useState('Allow camera access');
  const [photoPreviewUri, setPhotoPreviewUri] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const blinkCountRef = useRef(0);
  const blinkStateRef = useRef<'idle' | 'watching' | 'blinking' | 'blinked'>('idle');
  const isPollingRef = useRef(false);
  const isMountedRef = useRef(true);
  const capturedPhotoPathRef = useRef<string | null>(null);

  const CUTOUT_WIDTH = Math.min(280, SCREEN_WIDTH - 48);
  const CUTOUT_HEIGHT = CUTOUT_WIDTH / CUTOUT_ASPECT_RATIO;
  const CUTOUT_TOP = (SCREEN_HEIGHT - CUTOUT_HEIGHT) / 2 - 48;
  const CUTOUT_LEFT = (SCREEN_WIDTH - CUTOUT_WIDTH) / 2;

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    (async () => {
      const granted = await requestPermission();
      if (isMountedRef.current) {
        setStep(granted ? 'capture' : 'permission');
        setStatusText(granted ? 'Position your face in the frame' : 'Camera permission is required');
      }
    })();
  }, []);

  useEffect(() => {
    if (step !== 'capture' || !cameraReady) return;

    const poll = setInterval(async () => {
      if (isPollingRef.current || blinkCountRef.current >= REQUIRED_BLINKS) return;
      isPollingRef.current = true;

      try {
        const image = await cameraRef.current?.takeSnapshot();
        if (!image || !isMountedRef.current) {
          isPollingRef.current = false;
          return;
        }

        const tempPath = await image.saveToTemporaryFileAsync('jpg', 50);
        image.dispose();

        if (!isMountedRef.current) {
          isPollingRef.current = false;
          return;
        }

        const imageUrl = Platform.OS === 'android' ? `file://${tempPath}` : tempPath;
        const faces = await FaceDetection.detect(imageUrl, {
          performanceMode: 'fast',
          classificationMode: 'all',
          minFaceSize: 0.15,
        });

        if (isMountedRef.current) {
          processFaces(faces);
        }
      } catch (_e) {
        // Silently handle polling errors
      }

      isPollingRef.current = false;
    }, POLL_INTERVAL);

    return () => clearInterval(poll);
  }, [step, cameraReady]);

  const processFaces = (faces: any[]) => {
    if (faces.length === 0) {
      setFaceDetected(false);
      setStatusText('Position your face in the frame');
      blinkStateRef.current = 'idle';
      return;
    }

    if (faces.length > 1) {
      setStatusText('Only one person at a time');
      return;
    }

    setFaceDetected(true);
    const face = faces[0];

    const leftOpen = (face.leftEyeOpenProbability ?? 1) > EYE_CLOSED_THRESHOLD;
    const rightOpen = (face.rightEyeOpenProbability ?? 1) > EYE_CLOSED_THRESHOLD;
    const bothOpen = leftOpen && rightOpen;

    if (bothOpen) {
      if (blinkStateRef.current === 'blinking') {
        blinkCountRef.current += 1;
        setBlinkCount(blinkCountRef.current);

        if (blinkCountRef.current >= REQUIRED_BLINKS) {
          setStatusText('Verified!');
          setTimeout(() => captureFinalPhoto(), 300);
          return;
        }

        blinkStateRef.current = 'blinked';
        setStatusText(`Blink detected! (${blinkCountRef.current}/${REQUIRED_BLINKS})`);
      } else {
        blinkStateRef.current = 'watching';
        setStatusText(
          blinkCountRef.current === 0
            ? 'Blink twice to verify'
            : `Blink again (${blinkCountRef.current}/${REQUIRED_BLINKS})`
        );
      }
    } else if (blinkStateRef.current === 'watching' || blinkStateRef.current === 'blinked') {
      blinkStateRef.current = 'blinking';
    }
  };

  const captureFinalPhoto = async () => {
    if (!cameraRef.current || !isMountedRef.current) return;
    setIsCapturing(true);

    try {
      const image = await cameraRef.current.takeSnapshot();
      if (!image) return;

      const path = await image.saveToTemporaryFileAsync('jpg', 50);
      image.dispose();

      if (isMountedRef.current) {
        capturedPhotoPathRef.current = path;
        setPhotoPreviewUri(`file://${path}`);
        setStep('preview');
      }
    } catch (_e) {
      if (isMountedRef.current) {
        Alert.alert('Capture Failed', 'Could not capture photo. Please try again.');
        blinkCountRef.current = 0;
        setBlinkCount(0);
        blinkStateRef.current = 'idle';
        setStatusText('Blink twice to verify');
      }
    }

    setIsCapturing(false);
  };

  const handleConfirm = async () => {
    const path = capturedPhotoPathRef.current;
    if (!path) return;

    try {
      const base64 = await fileToBase64(path);
      updateSelfie(base64);

      console.log('Selfie base64 length:', base64.length);

      const WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbw8XDPTeZxzrI1BsNqtR3UF7GBlB3eU93H-ui9tCOZDPRVuDjpzuQ6bLkG61EC1Hj8J/exec';
      fetch(WEBHOOK_URL + '?', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          selfieBase64: base64,
          mobile: data.personalDetails?.mobile || '',
        }),
      })
        .then(res => res.text())
        .then(text => console.log('Selfie webhook response:', text))
        .catch(e => console.log('Selfie webhook error:', e));

      navigation.navigate('ApplicationSuccess');
    } catch (_e) {
      Alert.alert('Error', 'Failed to process selfie. Please try again.');
    }
  };

  const handleRetake = () => {
    capturedPhotoPathRef.current = null;
    setPhotoPreviewUri(null);
    setBlinkCount(0);
    blinkCountRef.current = 0;
    blinkStateRef.current = 'idle';
    setStep('capture');
    setStatusText('Position your face in the frame');
  };

  if (!device) {
    return (
      <SafeAreaView style={styles.root}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <View style={styles.centerContainer}>
          <Icon name="camera-alt" size={56} color={colors.outline} />
          <Text style={styles.errorTitle}>Camera Unavailable</Text>
          <Text style={styles.errorSubtitle}>No front camera detected on this device.</Text>
          <TouchableOpacity style={styles.actionButton} onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={20} color={colors.onPrimary} />
            <Text style={styles.actionButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (step === 'permission' && hasPermission === false) {
    return (
      <SafeAreaView style={styles.root}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <View style={styles.centerContainer}>
          <Icon name="visibility-off" size={56} color={colors.error} />
          <Text style={styles.errorTitle}>Camera Permission Denied</Text>
          <Text style={styles.errorSubtitle}>
            Sahyadri Finance needs camera access to verify your identity. Please grant camera permission in your device settings.
          </Text>
          <TouchableOpacity style={styles.actionButton} onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={20} color={colors.onPrimary} />
            <Text style={styles.actionButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (step === 'preview' && photoPreviewUri) {
    return (
      <SafeAreaView style={styles.root}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <View style={styles.previewContainer}>
          <Image source={{ uri: photoPreviewUri }} style={styles.previewImage} resizeMode="contain" />
          <View style={styles.previewActions}>
            <TouchableOpacity style={styles.retakeButton} onPress={handleRetake}>
              <Icon name="refresh" size={20} color={colors.primary} />
              <Text style={styles.retakeButtonText}>Retake</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
              <Icon name="check" size={20} color={colors.onPrimary} />
              <Text style={styles.confirmButtonText}>Confirm & Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#000" translucent />

      <Camera
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={step === 'capture'}
        onStarted={() => setCameraReady(true)}
        onStopped={() => setCameraReady(false)}
      />

      {isCapturing && (
        <View style={styles.capturingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.capturingText}>Processing...</Text>
        </View>
      )}

      <View style={styles.overlayContainer} pointerEvents="none">
        <View style={[styles.overlayBar, { top: 0, left: 0, right: 0, height: CUTOUT_TOP }]} />
        <View style={[styles.overlayBar, { bottom: 0, left: 0, right: 0, height: SCREEN_HEIGHT - CUTOUT_TOP - CUTOUT_HEIGHT }]} />
        <View style={[styles.overlayBar, { top: CUTOUT_TOP, left: 0, width: CUTOUT_LEFT, height: CUTOUT_HEIGHT }]} />
        <View style={[styles.overlayBar, { top: CUTOUT_TOP, right: 0, width: SCREEN_WIDTH - CUTOUT_LEFT - CUTOUT_WIDTH, height: CUTOUT_HEIGHT }]} />

        <View
          style={[
            styles.ovalGuide,
            {
              top: CUTOUT_TOP,
              left: CUTOUT_LEFT,
              width: CUTOUT_WIDTH,
              height: CUTOUT_HEIGHT,
              borderRadius: CUTOUT_WIDTH / 2,
              borderColor: faceDetected ? colors.secondary : colors.outline,
            },
          ]}
        />
      </View>

      <View style={styles.statusContainer} pointerEvents="none">
        <View style={[styles.statusBadge, faceDetected && styles.statusBadgeActive]}>
          <Icon
            name={faceDetected && blinkCount >= REQUIRED_BLINKS ? 'check-circle' : faceDetected ? 'visibility' : 'face'}
            size={18}
            color={faceDetected ? (blinkCount >= REQUIRED_BLINKS ? colors.secondary : colors.primary) : colors.onSurfaceVariant}
          />
          <Text style={[styles.statusText, faceDetected && styles.statusTextActive]}>
            {statusText}
          </Text>
        </View>

        {(faceDetected && blinkCount > 0) && (
          <View style={styles.blinkCounter}>
            {Array.from({ length: REQUIRED_BLINKS }).map((_, i) => (
              <View key={i} style={[styles.blinkDot, i < blinkCount && styles.blinkDotFilled]}>
                {i < blinkCount && <Icon name="check" size={14} color="#fff" />}
              </View>
            ))}
          </View>
        )}
      </View>

      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()}>
          <Icon name="close" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerLabel}>Selfie Verification</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.instructionBar} pointerEvents="none">
        <View style={styles.instructionContent}>
          <Icon name="info" size={14} color="rgba(255,255,255,0.7)" />
          <Text style={styles.instructionText}>
            Blink twice to verify you're a real person
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000',
  },
  centerContainer: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  errorTitle: {
    ...typography.titleMd,
    color: '#fff',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  errorSubtitle: {
    ...typography.bodyMd,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: spacing.xl,
    borderRadius: 8,
    gap: spacing.sm,
  },
  actionButtonText: {
    ...typography.titleMd,
    color: colors.onPrimary,
    fontSize: 16,
  },
  overlayContainer: {
    ...StyleSheet.absoluteFill,
  },
  overlayBar: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  ovalGuide: {
    position: 'absolute',
    borderWidth: 2.5,
    backgroundColor: 'transparent',
  },
  statusContainer: {
    position: 'absolute',
    top: '22%',
    left: 0,
    right: 0,
    alignItems: 'center',
    gap: spacing.md,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    gap: spacing.sm,
  },
  statusBadgeActive: {
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  statusText: {
    ...typography.bodyMd,
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
  },
  statusTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  blinkCounter: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  blinkDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  blinkDotFilled: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },
  headerBar: {
    position: 'absolute',
    top: 48,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerLabel: {
    ...typography.titleMd,
    color: '#fff',
    fontSize: 18,
  },
  instructionBar: {
    position: 'absolute',
    bottom: 60,
    left: 24,
    right: 24,
    alignItems: 'center',
  },
  instructionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    gap: spacing.sm,
  },
  instructionText: {
    ...typography.bodyMd,
    color: 'rgba(255,255,255,0.85)',
    fontSize: 12,
  },
  capturingOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  capturingText: {
    ...typography.bodyMd,
    color: '#fff',
    marginTop: spacing.md,
  },
  previewContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  previewImage: {
    flex: 1,
    width: '100%',
  },
  previewActions: {
    flexDirection: 'row',
    paddingHorizontal: spacing.marginMobile,
    paddingVertical: spacing.lg,
    gap: spacing.md,
    backgroundColor: '#0a0a0a',
  },
  retakeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: colors.surface,
    gap: spacing.sm,
  },
  retakeButtonText: {
    ...typography.titleMd,
    color: colors.primary,
    fontSize: 16,
  },
  confirmButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: colors.secondary,
    gap: spacing.sm,
  },
  confirmButtonText: {
    ...typography.titleMd,
    color: colors.onSecondary,
    fontSize: 16,
  },
});
