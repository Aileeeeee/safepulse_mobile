import React, { useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, Animated } from 'react-native';
import { router } from 'expo-router';
import { Colors, Fonts } from '../constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ReadyScreen() {
  const textFade = useRef(new Animated.Value(0)).current;
  const imgScale = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(imgScale, { toValue: 1, damping: 12, stiffness: 100, useNativeDriver: true }),
      Animated.timing(textFade, { toValue: 1, duration: 600, delay: 300, useNativeDriver: true }),
    ]).start();

    const finish = async () => {
      // Mark onboarding as complete so next launch skips to disguise
      await AsyncStorage.setItem('safepulse_onboarding_complete', 'true');
      // Also save which disguise was chosen — default calculator
      const disguise = await AsyncStorage.getItem('safepulse_disguise') || 'calculator';
      await AsyncStorage.setItem('safepulse_disguise', disguise);
      router.replace('/(main)/home');
    };

    const timer = setTimeout(finish, 2400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../assets/images/checkmark.png')}
        style={[styles.checkmark, { transform: [{ scale: imgScale }] }]}
        resizeMode="contain"
      />
      <Animated.Text style={[styles.label, { opacity: textFade }]}>
        SafePulse is ready
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: Colors.bgDark,
    alignItems: 'center', justifyContent: 'center', gap: 28,
  },
  checkmark: { width: 180, height: 180 },
  label: {
    fontFamily: Fonts.regularItalic, fontSize: 22,
    color: Colors.textLight, letterSpacing: 0.2,
  },
});
