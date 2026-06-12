import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors, Radius } from '../constants/theme';

interface ProgressBarProps {
  current: number; // 0-indexed current step
  total: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.segment,
            { flex: 1 },
            i <= current ? styles.active : styles.inactive,
            i === 0 && styles.first,
            i === total - 1 && styles.last,
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 4,
    gap: 4,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  segment: {
    height: 4,
    borderRadius: Radius.full,
  },
  active: {
    backgroundColor: Colors.primary,
  },
  inactive: {
    backgroundColor: Colors.border,
  },
  first: {},
  last: {},
});
