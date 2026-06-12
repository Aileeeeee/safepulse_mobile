import React, { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Animated } from 'react-native';
import { router } from 'expo-router';
import { Colors } from '../constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DISGUISE_ROUTES: Record<string, string> = {
  calculator: '/calculator',
  weather:    '/disguise-weather',
  note:       '/disguise-note',
  budget:     '/disguise-budget',
  meditation: '/disguise-meditation',
};

export default function SplashScreen1() {
  const scale   = useRef(new Animated.Value(0.7)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, damping: 14, stiffness: 100, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 600, useNativeDriver: true }),
    ]).start();

    const checkOnboarding = async () => {
      const completed = await AsyncStorage.getItem('safepulse_onboarding_complete');

      if (completed === 'true') {
        // Returning user — go straight to their chosen disguise
        const disguise = await AsyncStorage.getItem('safepulse_disguise') || 'calculator';
        const route = DISGUISE_ROUTES[disguise] || '/calculator';
        router.replace(route as any);
      } else {
        // First time — go through normal onboarding
        router.replace('/splash2');
      }
    };

    const timer = setTimeout(checkOnboarding, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity, transform: [{ scale }] }}>
        <Image
          source={require('../assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryMint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 220,
    height: 220,
  },
});