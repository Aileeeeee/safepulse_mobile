import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Animated,
} from 'react-native';
import { router } from 'expo-router';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { Colors, Fonts, Spacing, Radius } from '../../constants/theme';
import { ProgressBar } from '../../components/ProgressBar';
import { startBackgroundTracking } from '../../hooks/useLocationTracker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  requestNotificationPermission,
  requestLocationPermission,
} from '../../hooks/usePermissions';

export default function OnboardingStep3() {
  const fade = useRef(new Animated.Value(0)).current;
  const [notifStatus, setNotifStatus] = useState<'idle' | 'granted' | 'denied'>('idle');
  const [locationStatus, setLocationStatus] = useState<'idle' | 'granted' | 'denied'>('idle');

  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  }, []);

  const handleNotification = async () => {
    const { status: current } = await Notifications.getPermissionsAsync();

    if (current === 'granted') {
      setNotifStatus('granted');
      return;
    }

    // This line triggers the real Android popup
    const { status } = await Notifications.requestPermissionsAsync();

    if (status === 'granted') {
      setNotifStatus('granted');
    } else {
      setNotifStatus('denied');
    }
  };

  const handleLocation = async () => {
    try {
      // Check current status first
      const { status: existing } = await Location.getForegroundPermissionsAsync();

      if (existing === 'granted') {
        // Already granted — just save and mark done
        await AsyncStorage.setItem('safepulse_location_sharing', 'true');
        setLocationStatus('granted');
        return;
      }

      // This triggers the exact popup in your screenshots
      // User sees: Precise/Approximate + While using/Only this time/Don't allow
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === 'granted') {
        // User picked "While using the app" or "Only this time"
        await AsyncStorage.setItem('safepulse_location_sharing', 'true');
        setLocationStatus('granted');
        await startBackgroundTracking();
      } else {
        // User picked "Don't allow"
        await AsyncStorage.setItem('safepulse_location_sharing', 'false');
        setLocationStatus('denied');
      }
    } catch (e) {
      console.log('Location permission error:', e);
      setLocationStatus('denied');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} hitSlop={{ top:10,bottom:10,left:10,right:10 }}>
            <Text style={styles.back}>←</Text>
          </TouchableOpacity>
          <View style={styles.progressWrap}>
            <ProgressBar current={2} total={3} />
          </View>
          <Text style={styles.stepLabel}>3/3</Text>
        </View>

        <Animated.View style={[styles.body, { opacity: fade }]}>
          <Text style={styles.heading}>Enable Important{'\n'}permissions</Text>
          <Text style={styles.sub}>
            These permissions help SafePulse keep you safe and connected
          </Text>

          <View style={styles.permList}>

            {/* Notification */}
            <TouchableOpacity
              style={[
                styles.permCard,
                notifStatus === 'granted' && styles.permCardGranted,
                notifStatus === 'denied' && styles.permCardDenied,
              ]}
              onPress={handleNotification}
              activeOpacity={0.8}
            >
              <Image
                source={require('../../assets/images/icon-bell.png')}
                style={styles.permIconImage}
                resizeMode="contain"
              />
              <View style={styles.permText}>
                <Text style={styles.permTitle}>Allow Notification</Text>
                <Text style={styles.permDesc}>
                  Allow notifications to confirm reports and alert trusted contacts
                </Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>

            {/* Location */}
            <TouchableOpacity
              style={[
                styles.permCard,
                locationStatus === 'granted' && styles.permCardGranted,
                locationStatus === 'denied' && styles.permCardDenied,
              ]}
              onPress={handleLocation}
              activeOpacity={0.8}
            >
              <Image
                source={require('../../assets/images/icon-location.png')}
                style={styles.permIconImage}
                resizeMode="contain"
              />
              <View style={styles.permText}>
                <Text style={styles.permTitle}>Allow Location Access</Text>
                <Text style={styles.permDesc}>
                  Your approximate area helps responders identity incidents hotspots faster
                </Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>

          </View>
        </Animated.View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => router.replace('/ready')}
            activeOpacity={0.82}
          >
            <Text style={styles.btnText}>
              {notifStatus === 'idle' && locationStatus === 'idle'
                ? 'Skip for now'
                : locationStatus === 'denied' || notifStatus === 'denied'
                ? 'Continue anyway'
                : 'Continue'}
            </Text>
            <Text style={styles.arrow}>→</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bgMain },
  container: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  header: {
    flexDirection: 'row', alignItems: 'center',
    gap: Spacing.md, marginBottom: Spacing.xl,
  },
  back: { fontSize: 22, color: Colors.textDark, fontWeight: '600' },
  progressWrap: { flex: 1 },
  stepLabel: { fontSize: 13, color: Colors.textMuted, fontWeight: '500' },
  body: { flex: 1, justifyContent: 'center', gap: Spacing.xl },
  heading: {
    fontFamily: Fonts.boldItalic,
    fontSize: 28, color: Colors.textDark,
    textAlign: 'center', lineHeight: 36,
  },
  sub: {
    fontSize: 14, color: Colors.textMuted,
    textAlign: 'center', lineHeight: 21,
    marginTop: -Spacing.md,
  },
  permList: { gap: Spacing.md },
  permCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.primaryPale,
    borderRadius: Radius.lg, padding: Spacing.md,
    gap: Spacing.md, borderWidth: 1.5,
    borderColor: 'transparent',
  },
  permCardGranted: {
    borderColor: '#2E7D60',
    backgroundColor: '#E8F5F0',
  },
  permCardDenied: {
    borderColor: '#E05050',
    backgroundColor: '#FFF0F0',
  },
  permIconImage: {
    width: 32,
    height: 32,
  },
  permText: { flex: 1 },
  permTitle: {
    fontSize: 15, fontWeight: '700',
    color: Colors.textDark, marginBottom: 4,
  },
  permDesc: {
    fontSize: 12, color: Colors.textMuted,
    lineHeight: 17,
  },
  permStatus: { fontSize: 12, fontWeight: '600' },
  chevron: {
    fontSize: 22, color: Colors.textMuted,
    fontWeight: '300',
  },
  footer: { gap: Spacing.md },
  btn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.primary, borderRadius: Radius.full,
    paddingVertical: 17, gap: 10,
  },
  btnText: { color: Colors.textLight, fontSize: 16, fontFamily: Fonts.bold },
  arrow: { color: Colors.textLight, fontSize: 18 },
  skip: {
    textAlign: 'center', fontSize: 15,
    fontFamily: Fonts.bold, color: Colors.textDark,
  },
});