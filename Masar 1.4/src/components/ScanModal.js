import React, { useEffect, useState, useContext } from 'react';
import { Modal, View, Text, TouchableOpacity, Animated, Easing } from 'react-native';
import { UserContext } from '../context/UserContext';
import { CheckCircle2, Zap } from 'lucide-react-native';

export default function ScanModal() {
  const { showScan, setShowScan, recordScan } = useContext(UserContext);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState('scanning'); // scanning, processing, success, error
  
  // Animation values
  const scaleAnim = useState(new Animated.Value(0.3))[0];
  const opacityAnim = useState(new Animated.Value(0))[0];
  const checkmarkScaleAnim = useState(new Animated.Value(0))[0];
  const pulseAnim = useState(new Animated.Value(1))[0];
  const cardSlideAnim = useState(new Animated.Value(500))[0];

  // Pulse animation (Apple Pay style)
  useEffect(() => {
    if (stage === 'scanning') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [stage]);

  // Initial entrance animation
  useEffect(() => {
    if (showScan) {
      setProgress(0);
      setStage('scanning');
      
      // Animate entrance
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      const progressInterval = setInterval(() => {
        setProgress((p) => {
          const newProgress = Math.min(100, p + 3);
          
          // Change stage at 100%
          if (newProgress >= 100 && stage === 'scanning') {
            setStage('processing');
            clearInterval(progressInterval);
            
            // Animate checkmark
            setTimeout(() => {
              Animated.spring(checkmarkScaleAnim, {
                toValue: 1,
                tension: 50,
                friction: 4,
                useNativeDriver: true,
              }).start();
            }, 400);

            // Complete payment
            setTimeout(() => {
              // call server to record scan and deduct balance
              (async () => {
                try {
                  const result = await recordScan({ amount: 12.5, station: 'Metro Station' });
                  if (result && result.success) {
                    setStage('success');
                  } else {
                    setStage('error');
                    console.error('Scan record failed', result?.error);
                  }
                } catch (err) {
                  setStage('error');
                  console.error('Scan call error', err);
                }
              })();
              
              // Auto-close after 1.5 seconds
              setTimeout(() => {
                handleClose();
              }, 1500);
            }, 1200);
          }
          
          return newProgress;
        });
      }, 60);

      return () => clearInterval(progressInterval);
    }
  }, [showScan]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.3,
        duration: 300,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowScan(false);
      setStage('scanning');
      checkmarkScaleAnim.setValue(0);
    });
  };

  const isScanningStage = stage === 'scanning';
  const isProcessing = stage === 'processing';
  const isSuccess = stage === 'success';

  return (
    <Modal visible={showScan} transparent animationType="none">
      {/* Animated backdrop */}
      <Animated.View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.85)',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: opacityAnim,
        }}
      >
        <Animated.View
          style={{
            width: '85%',
            borderRadius: 32,
            overflow: 'hidden',
            transform: [{ scale: scaleAnim }],
          }}
        >
          {/* Gradient header */}
          <View
            style={{
              background: 'linear-gradient(135deg, #0891B2 0%, #06B6D4 100%)',
              paddingVertical: 24,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Animated.View
              style={{
                transform: [{ scale: pulseAnim }],
              }}
            >
              <View
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 12,
                }}
              >
                {isSuccess ? (
                  <Animated.View
                    style={{
                      transform: [{ scale: checkmarkScaleAnim }],
                    }}
                  >
                    <CheckCircle2 size={48} color="#fff" strokeWidth={2} />
                  </Animated.View>
                ) : (
                  <Zap size={40} color="#fff" fill="#fff" />
                )}
              </View>
            </Animated.View>
          </View>

          {/* Content */}
          <View style={{ backgroundColor: '#fff', padding: 28 }}>
            {/* Title */}
            <Text
              style={{
                fontSize: 24,
                fontWeight: '800',
                textAlign: 'center',
                marginBottom: 8,
                color: '#1F2937',
              }}
            >
              {isScanningStage ? 'Scan Your Card' : isProcessing ? 'Processing' : 'Payment Complete!'}
            </Text>

            {/* Subtitle */}
            <Text
              style={{
                fontSize: 15,
                textAlign: 'center',
                color: '#6B7280',
                marginBottom: 24,
                fontWeight: '500',
              }}
            >
              {isScanningStage
                ? 'Hold your metro card to the device'
                : isProcessing
                ? 'Verifying your payment...'
                : 'EGP 12.50 deducted'}
            </Text>

            {/* Progress bar with animation */}
            {(isScanningStage || isProcessing) && (
              <View>
                <View
                  style={{
                    height: 6,
                    backgroundColor: '#E5E7EB',
                    borderRadius: 999,
                    overflow: 'hidden',
                    marginBottom: 12,
                  }}
                >
                  <Animated.View
                    style={{
                      width: `${progress}%`,
                      height: 6,
                      backgroundColor: '#0891B2',
                      borderRadius: 999,
                    }}
                  />
                </View>
                <Text
                  style={{
                    textAlign: 'center',
                    color: '#9CA3AF',
                    fontSize: 12,
                    fontWeight: '600',
                  }}
                >
                  {progress}%
                </Text>
              </View>
            )}

            {/* Success message */}
            {isSuccess && (
              <View
                style={{
                  backgroundColor: '#DCFCE7',
                  borderRadius: 12,
                  padding: 12,
                  marginBottom: 16,
                }}
              >
                <Text
                  style={{
                    color: '#166534',
                    textAlign: 'center',
                    fontWeight: '600',
                    fontSize: 14,
                  }}
                >
                  ✓ Payment successful! Your balance has been updated.
                </Text>
              </View>
            )}

            {/* Action buttons */}
            <View style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>
              {isScanningStage && (
                <TouchableOpacity
                  onPress={handleClose}
                  style={{
                    flex: 1,
                    paddingVertical: 14,
                    borderRadius: 12,
                    borderWidth: 2,
                    borderColor: '#E5E7EB',
                    alignItems: 'center',
                  }}
                >
                  <Text
                    style={{
                      color: '#6B7280',
                      fontWeight: '700',
                      fontSize: 15,
                    }}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
              )}

              {isSuccess && (
                <TouchableOpacity
                  onPress={handleClose}
                  style={{
                    flex: 1,
                    paddingVertical: 14,
                    borderRadius: 12,
                    backgroundColor: '#0891B2',
                    alignItems: 'center',
                  }}
                >
                  <Text
                    style={{
                      color: '#fff',
                      fontWeight: '700',
                      fontSize: 15,
                    }}
                  >
                    Done
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}