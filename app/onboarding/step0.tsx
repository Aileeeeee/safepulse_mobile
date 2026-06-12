import React, { useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, Animated, TouchableOpacity, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { Colors, Fonts, Spacing, Radius } from '../../constants/theme';
import { ProgressBar } from '../../components/ProgressBar';

export default function OnboardingStep0() {
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 480, useNativeDriver: true }),
      Animated.timing(slide, { toValue: 0, duration: 480, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.progressRow}>
          <ProgressBar current={-1} total={3} />
        </View>

        <Animated.View style={[styles.body, { opacity: fade, transform: [{ translateY: slide }] }]}>
          {/* Real hero illustration */}
          <Image
            source={require('../../assets/images/onboarding-hero.png')}
            style={styles.heroImage}
            resizeMode="contain"
          />

          <Text style={styles.heading}>Stay Safe.{'\n'}Stay Hidden.</Text>
          <Text style={styles.sub}>SafePulse lets you send help{'\n'}without being noticed.</Text>

          <View style={styles.features}>
            {[
              { icon: require('../../assets/images/icon-silent.png'), label: 'Silent reporting' },
              { icon: require('../../assets/images/icon-person.png'), label: 'Trusted contact alert' },
              { icon: require('../../assets/images/icon-signal.png'), label: 'Instant reporting' },
            ].map((f) => (
              <View key={f.label} style={styles.featureRow}>
                <View style={styles.featureIconWrap}>
                  <Image
                    source={f.icon}
                    style={styles.featureIcon}
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.featureLabel}>{f.label}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        <TouchableOpacity
          style={styles.btn}
          onPress={() => router.push('/onboarding/step1')}
          activeOpacity={0.82}
        >
          <Text style={styles.btnText}>Continue</Text>
          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bgMain },
  container: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: 50,
    paddingBottom: Spacing.xl,
    justifyContent: 'space-between',
  },
  progressRow: { marginBottom: Spacing.lg },
  body: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.md },
  heroImage: {
    width: 220,
    height: 200,
    marginBottom: Spacing.md,
  },
  heading: {
    fontFamily: Fonts.boldItalic,
    fontSize: 30,
    color: Colors.textDark,
    textAlign: 'center',
    lineHeight: 38,
  },
  sub: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 21,
  },
  features: { width: '100%', gap: Spacing.sm, marginTop: Spacing.sm },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  featureIconWrap: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  featureIcon: { width: 20, height: 20 },
  featureLabel: { fontSize: 15, fontWeight: '500', color: Colors.textDark },
  btn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.primary, borderRadius: Radius.full,
    paddingVertical: 17, gap: 10,
  },
  btnText: { color: Colors.textLight, fontSize: 16, fontFamily: Fonts.bold },
  arrow: { color: Colors.textLight, fontSize: 18 },
});
