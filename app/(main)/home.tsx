import React, { useRef, useState,useEffect } from 'react';
import {
  View, Text, Image, StyleSheet,
  TouchableOpacity, SafeAreaView, Animated, Pressable,
} from 'react-native';
import { router } from 'expo-router';
import { AppIcon } from '../../components/AppIcon';
import { Colors, Fonts , Spacing, Radius } from '../../constants/theme';
import { LoaderModal } from '../../components/LoaderModal';
import { DISGUISE_ROUTES, DISGUISE_META } from '../../hooks/useDisguise';
import { sendPulse } from '../../hooks/useIncidents';
import { DisguiseType } from '../../types';
import AsyncStorage from '@react-native-async-storage/async-storage';


const BUTTON_SIZE = 220;

// In a full app this would come from global state / AsyncStorage
// For now default to calculator
let ACTIVE_DISGUISE: DisguiseType = 'calculator';
export function setActiveDisguise(d: DisguiseType) { ACTIVE_DISGUISE = d; }

export default function HomeScreen() {
  const [loading, setLoading] = useState(false);
  const pulseRing = useRef(new Animated.Value(1)).current;
  const pulseRingOpacity = useRef(new Animated.Value(0.6)).current;
  const pulseRing2 = useRef(new Animated.Value(1)).current;
  const pulseRing2Opacity = useRef(new Animated.Value(0.3)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const loopRef = useRef(null);
  const [activeDisguise, setActiveDisguise] = useState<DisguiseType>('calculator');

  useEffect(() => {
    AsyncStorage.getItem('safepulse_disguise').then((saved) => {
      if (saved) setActiveDisguise(saved as DisguiseType);
    });
  }, []);




  const startPulse = () => {
    loopRef.current = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(pulseRing, { toValue: 1.22, duration: 800, useNativeDriver: true }),
          Animated.timing(pulseRing, { toValue: 1, duration: 800, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(pulseRingOpacity, { toValue: 0, duration: 800, useNativeDriver: true }),
          Animated.timing(pulseRingOpacity, { toValue: 0.6, duration: 800, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.delay(200),
          Animated.timing(pulseRing2, { toValue: 1.4, duration: 800, useNativeDriver: true }),
          Animated.timing(pulseRing2, { toValue: 1, duration: 800, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.delay(200),
          Animated.timing(pulseRing2Opacity, { toValue: 0, duration: 800, useNativeDriver: true }),
          Animated.timing(pulseRing2Opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
        ]),
      ])
    );
    loopRef.current.start();
  };

  const stopPulse = () => {
    if (loopRef.current) loopRef.current.stop();
    pulseRing.setValue(1);
    pulseRingOpacity.setValue(0.6);
    pulseRing2.setValue(1);
    pulseRing2Opacity.setValue(0.3);
  };

  const handleSendPulse = async () => {
    stopPulse();
    setLoading(true);
    try {
      await sendPulse();
    } catch (e) {
      console.log('Pulse error:', e);
    }
    setLoading(false);
    router.push('/signal-sent');
  };

  const disguiseMeta = DISGUISE_META[activeDisguise];
  const disguiseRoute = DISGUISE_ROUTES[activeDisguise];

  return (
    <SafeAreaView style={styles.safe}>
      <LoaderModal visible={loading} />

      {/* Top bar */}
      <View style={styles.topBar}>
        <Text style={styles.appName}>Safepulse</Text>
        <View style={styles.contactsBtn}>
          <Image
            source={require('../../assets/images/contact-icon.png')}
            style={styles.contactsIcon}
            resizeMode="contain"
          />
        </View>
      </View>

      <View style={styles.content}>
        {/* Headline */}
        <View style={styles.headlineWrap}>
          <Text style={styles.headline}>Hold To Send</Text>
          <Text style={styles.subheadline}>Help is one tap away</Text>
        </View>

        {/* Big pulse button */}
        <View style={styles.pulseWrap}>
          <Animated.View style={[styles.pulseRingOuter, {
            transform: [{ scale: pulseRing2 }], opacity: pulseRing2Opacity,
          }]} />
          <Animated.View style={[styles.pulseRingInner, {
            transform: [{ scale: pulseRing }], opacity: pulseRingOpacity,
          }]} />
          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <Pressable
              onPressIn={() => {
                startPulse();
                Animated.spring(buttonScale, { toValue: 0.95, useNativeDriver: true }).start();
              }}
              onPressOut={() => {
                stopPulse();
                Animated.spring(buttonScale, { toValue: 1, useNativeDriver: true }).start();
              }}
              onLongPress={handleSendPulse}
              delayLongPress={600}
            >
              <Image
                source={require('../../assets/images/send-pulse-btn.png')}
                style={styles.pulseButtonImage}
                resizeMode="contain"
              />
            </Pressable>
          </Animated.View>
        </View>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>Or</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Report card */}
        <TouchableOpacity style={styles.reportCard} onPress={() => router.push('/report')} activeOpacity={0.82}>
          <View style={styles.reportLeft}>
            <Image
              source={require('../../assets/images/icon-edit.png')}
              style={{ width: 22, height: 22 }}
              resizeMode="contain"
            />
            <View>
              <Text style={styles.reportTitle}>Report Something</Text>
              <Text style={styles.reportSub}>Report safely and anonymously</Text>
            </View>
          </View>
          <Text style={styles.reportChevron}>›</Text>
        </TouchableOpacity>

        {/* Stealth button — shows active disguise name */}
        <TouchableOpacity
          style={styles.stealthBtn}
          onPress={() => router.push(disguiseRoute as any)}
          activeOpacity={0.82}
        >
          
          <Text style={styles.stealthText}>
            Switch to stealth mode
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bgMain },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: 45,
    paddingBottom: Spacing.sm,
    backgroundColor: Colors.bgMain,
  },
  appName: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    color: Colors.primary,
    letterSpacing: -0.3,
  },
  topLogo: { width: 130, height: 36 },
  contactsBtn: {
    width: 44,
    height: 44,
    backgroundColor: Colors.primaryPale,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  contactsIcon: { width: 26, height: 26 },
  content: {
    flex: 1, paddingHorizontal: Spacing.lg, paddingBottom: Spacing.md,
    alignItems: 'center', justifyContent: 'space-evenly',
  },
  headlineWrap: { alignItems: 'center' },
  headline: { fontFamily: Fonts.bold, fontSize: 22, color: Colors.textDark, letterSpacing: -0.2 },
  subheadline: { fontSize: 14, color: Colors.textMuted, marginTop: 2 },
  pulseWrap: {
    width: BUTTON_SIZE + 60, height: BUTTON_SIZE + 60,
    alignItems: 'center', justifyContent: 'center',
  },
  pulseRingOuter: {
    position: 'absolute',
    width: BUTTON_SIZE + 50, height: BUTTON_SIZE + 50,
    borderRadius: (BUTTON_SIZE + 50) / 2,
    borderWidth: 2, borderColor: Colors.primaryLight,
  },
  pulseRingInner: {
    position: 'absolute',
    width: BUTTON_SIZE + 24, height: BUTTON_SIZE + 24,
    borderRadius: (BUTTON_SIZE + 24) / 2,
    borderWidth: 3, borderColor: Colors.primaryLight,
  },
  pulseButton: {
    width: BUTTON_SIZE, height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2, backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center', gap: 10,
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4, shadowRadius: 24, elevation: 12,
  },
  pulseButtonPressed: { opacity: 0.88 },
  pulseIcon: { width: 64, height: 64 },
  pulseLabel: { fontFamily: Fonts.regularItalic, color: Colors.textLight, fontSize: 18 },
  divider: { flexDirection: 'row', alignItems: 'center', width: '100%', gap: Spacing.md },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.border },
  dividerText: { fontSize: 14, color: Colors.textMuted },
  reportCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Colors.primaryPale, borderRadius: Radius.xl,
    padding: Spacing.lg, width: '100%',
  },
  reportLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  reportIconEmoji: { fontSize: 22 },
  reportTitle: { fontFamily: Fonts.bold, fontSize: 16, color: Colors.textDark },
  reportSub: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  reportChevron: { fontSize: 24, color: Colors.textMuted },
  stealthBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.primary, borderRadius: Radius.full,
    paddingVertical: 17, width: '100%', gap: 8,
  },
  stealthEmoji: { fontSize: 18 },
  stealthText: { fontFamily: Fonts.bold, color: Colors.textLight, fontSize: 15 },
});
