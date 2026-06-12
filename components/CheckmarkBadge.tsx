import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Colors } from '../constants/theme';

interface CheckmarkBadgeProps {
  size?: number;
  animate?: boolean;
}

export const CheckmarkBadge: React.FC<CheckmarkBadgeProps> = ({
  size = 160,
  animate = true,
}) => {
  const scale = useRef(new Animated.Value(0.6)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!animate) return;
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        damping: 12,
        stiffness: 120,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          transform: [{ scale }],
          opacity,
        },
      ]}
    >
      {/* Outer ring */}
      <View
        style={[
          styles.ring,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
          },
        ]}
      />
      {/* Inner circle */}
      <View
        style={[
          styles.inner,
          {
            width: size * 0.82,
            height: size * 0.82,
            borderRadius: (size * 0.82) / 2,
          },
        ]}
      >
        {/* Checkmark drawn with rotated views */}
        <View style={styles.checkWrapper}>
          <View style={[styles.checkLong, { backgroundColor: Colors.primaryMid }]} />
          <View style={[styles.checkShort, { backgroundColor: Colors.primaryMid }]} />
        </View>
        {/* Bottom wave accent */}
        <View style={styles.wave} />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  ring: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  inner: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  checkWrapper: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  // Simplified checkmark using two rectangles
  checkLong: {
    position: 'absolute',
    width: 50,
    height: 8,
    borderRadius: 4,
    transform: [{ rotate: '-45deg' }, { translateX: 8 }, { translateY: 6 }],
  },
  checkShort: {
    position: 'absolute',
    width: 26,
    height: 8,
    borderRadius: 4,
    transform: [{ rotate: '45deg' }, { translateX: -14 }, { translateY: 14 }],
  },
  wave: {
    position: 'absolute',
    bottom: -10,
    width: 140,
    height: 40,
    borderRadius: 70,
    backgroundColor: 'rgba(46,125,96,0.18)',
  },
});
