import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Radius, Spacing } from '../constants/theme';
import { Incident } from '../types';

interface IncidentCardProps {
  incident: Incident;
  onPress: () => void;
}

// Emoji-based illustration placeholder (replaces actual illustrations)
export const IncidentCard: React.FC<IncidentCardProps> = ({ incident, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.78}>
      <View style={styles.illustration}>
        <Text style={styles.emoji}>{incident.emoji}</Text>
      </View>
      <Text style={styles.title}>{incident.title}</Text>
      <Text style={styles.subtitle}>{incident.subtitle}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: Colors.bgWhite,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    minHeight: 170,
    gap: Spacing.xs,
  },
  illustration: {
    width: '100%',
    height: 90,
    backgroundColor: Colors.primaryMint,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  emoji: {
    fontSize: 38,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textDark,
    textAlign: 'center',
    lineHeight: 18,
  },
  subtitle: {
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 15,
  },
});
