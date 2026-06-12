import React, { useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';
import { Colors, Radius, Spacing } from '../constants/theme';

interface LoaderModalProps {
  visible: boolean;
  message?: string;
  subMessage?: string;
}

export const LoaderModal: React.FC<LoaderModalProps> = ({
  visible,
  message = 'Sending Quietly...',
  subMessage = 'This will only take a few secs.',
}) => {
  const dot1 = useRef(new Animated.Value(0.4)).current;
  const dot2 = useRef(new Animated.Value(0.4)).current;
  const dot3 = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    if (!visible) return;

    const animate = (dot: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0.4,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      );

    const a1 = animate(dot1, 0);
    const a2 = animate(dot2, 160);
    const a3 = animate(dot3, 320);
    a1.start();
    a2.start();
    a3.start();

    return () => {
      a1.stop();
      a2.stop();
      a3.stop();
    };
  }, [visible]);

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.dots}>
            {[dot1, dot2, dot3].map((dot, i) => (
              <Animated.View
                key={i}
                style={[styles.dot, { opacity: dot }]}
              />
            ))}
          </View>
          <Text style={styles.message}>{message}</Text>
          <Text style={styles.sub}>{subMessage}</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: Colors.primaryMint,
    borderRadius: Radius.xl,
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.xxl,
    alignItems: 'center',
    gap: Spacing.sm,
    minWidth: 260,
  },
  dots: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: Spacing.sm,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
  },
  message: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textDark,
    textAlign: 'center',
  },
  sub: {
    fontSize: 13,
    color: Colors.textBody,
    textAlign: 'center',
    marginTop: 4,
  },
});
