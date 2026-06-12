import React, { useRef, useEffect, useState } from 'react';
import {
  View, Text, Image, StyleSheet,
  TouchableOpacity, SafeAreaView, Animated, ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { Colors, Fonts, Spacing, Radius } from '../../constants/theme';
import { ProgressBar } from '../../components/ProgressBar';
import { DisguiseType, DisguiseOption } from '../../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DISGUISE_OPTIONS = [
  {
    id: 'calculator',
    label: 'Calculator app',
    image: require('../../assets/images/calculator-preview.png'),
  },
  {
    id: 'weather',
    label: 'Weather app',
    image: require('../../assets/images/weather-preview.png'),
  },
  {
    id: 'note',
    label: 'Notes app',
    image: require('../../assets/images/note-preview.png'),
  },
  {
    id: 'budget',
    label: 'Budget app',
    image: require('../../assets/images/budget-preview.png'),
  },
  {
    id: 'meditation',
    label: 'Meditation app',
    image: require('../../assets/images/meditation-preview.png'),
  },
];

export default function OnboardingStep2() {
  const [selected, setSelected] = useState<DisguiseType>('calculator');
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  }, []);

  const selectedOption = DISGUISE_OPTIONS.find((o) => o.id === selected)!;

  return (
  <SafeAreaView style={styles.safe}>
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={{ top:10,bottom:10,left:10,right:10 }}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <View style={styles.progressWrap}>
          <ProgressBar current={1} total={3} />
        </View>
        <Text style={styles.stepLabel}>2/3</Text>
      </View>

      {/* Heading */}
      <Text style={styles.heading}>Choose how{'\n'}SafePulse appears</Text>
      <Text style={styles.sub}>
        Your SafePulse app can look like{'\n'}something ordinary on your phone
      </Text>

      {/* Horizontal scroll cards */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cardsScroll}
        style={styles.cardsContainer}
      >
        {DISGUISE_OPTIONS.map((opt) => (
          <TouchableOpacity
            key={opt.id}
            style={[
              styles.card,
              selected === opt.id && styles.cardSelected,
            ]}
            onPress={() => setSelected(opt.id)}
            activeOpacity={0.85}
          >
            <Image
              source={opt.image}
              style={styles.cardImage}
              resizeMode="contain"
            />
            <Text style={styles.cardLabel}>{opt.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.btn}
          onPress={async () => {
            await AsyncStorage.setItem('safepulse_disguise', selected);
            router.push('/onboarding/step3');
          }}
          activeOpacity={0.82}
        >
          <Text style={styles.btnText}>Continue</Text>
          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/onboarding/step3')}>
          <Text style={styles.skip}>Skip for now</Text>
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
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  header: {
    flexDirection: 'row', alignItems: 'center',
    gap: Spacing.md, marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.lg,
  },
  back: { fontSize: 22, color: Colors.textDark, fontWeight: '600' },
  progressWrap: { flex: 1 },
  stepLabel: { fontSize: 13, color: Colors.textMuted, fontWeight: '500' },
  heading: {
    fontFamily: Fonts.boldItalic,
    fontSize: 28, color: Colors.textDark,
    textAlign: 'center', lineHeight: 36,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  sub: {
    fontSize: 14, color: Colors.textMuted,
    textAlign: 'center', lineHeight: 21,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  cardsContainer: {
    flexGrow: 0,
  },
  cardsScroll: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  card: {
    width: 160,
    backgroundColor: Colors.primaryPale,
    borderRadius: Radius.xl,
    padding: Spacing.md,
    alignItems: 'center',
    gap: Spacing.sm,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  cardSelected: {
    borderColor: Colors.primaryMid,
    backgroundColor: Colors.primaryMint,
  },
  cardImage: {
    width: 140,
    height: 160,
    borderRadius: Radius.md,
  },
  cardLabel: {
    fontSize: 14,
    fontFamily: Fonts.bold,
    color: Colors.textDark,
    textAlign: 'center',
  },
  footer: {
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.xl,
  },
  btn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.primary, borderRadius: Radius.full,
    paddingVertical: 17, gap: 10,
  },
  btnText: { color: Colors.textLight, fontSize: 16, fontFamily: Fonts.bold },
  arrow: { color: Colors.textLight, fontSize: 18 },
  skip: { textAlign: 'center', fontSize: 15, fontFamily: Fonts.bold, color: Colors.textDark },
});
