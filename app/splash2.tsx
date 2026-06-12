import React, { useEffect, useRef } from 'react';
import { View, Image, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Colors, Fonts, Spacing, Radius } from '../constants/theme';

export default function SplashScreen2() {
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slide, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fade, transform: [{ translateY: slide }] }]}>
        {/* Real logo image */}
        <View style={styles.logoWrap}>
          <Image
            source={require('../assets/images/logo-icon.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* CTA */}
        <TouchableOpacity
          style={styles.btn}
          onPress={() => router.push('/onboarding/step0')}
          activeOpacity={0.82}
        >
          <Text style={styles.btnText}>Get Started</Text>
          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>
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
    paddingHorizontal: Spacing.xl,
    paddingBottom: 60,
  },
  content: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 80,
  },
  logoWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 260,
    height: 260,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingVertical: 17,
    paddingHorizontal: 40,
    width: '100%',
    gap: 10,
  },
  btnText: {
    color: Colors.textLight,
    fontSize: 16,
    fontFamily: Fonts.bold,
  },
  arrow: {
    color: Colors.textLight,
    fontSize: 18,
  },
});
