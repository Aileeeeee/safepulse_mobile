import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Radius, Spacing } from '../constants/theme';
import { Contact } from '../types';

interface ContactCardProps {
  contact: Contact;
  showCheck?: boolean;
  onPress?: () => void;
}

const AVATAR_COLORS = [
  '#E07050', // warm orange-red
  '#5B8A6E', // muted green
  '#7A6FAC', // soft purple
  '#D4875C', // amber
  '#6CA3C8', // slate blue
];

export const ContactCard: React.FC<ContactCardProps> = ({
  contact,
  showCheck = true,
  onPress,
}) => {
  const avatarColor = AVATAR_COLORS[contact.name.charCodeAt(0) % AVATAR_COLORS.length];

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={onPress ? 0.75 : 1}
    >
      <View style={[styles.avatar, { backgroundColor: avatarColor + '30' }]}>
        <Text style={[styles.avatarText, { color: avatarColor }]}>
          {contact.initial}
        </Text>
      </View>
      <Text style={styles.name}>{contact.name}</Text>
      {showCheck && contact.isAdded && (
        <View style={styles.checkContainer}>
          <Text style={styles.checkIcon}>✓</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgWhite,
    borderRadius: Radius.full,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    gap: Spacing.md,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 17,
    fontWeight: '600',
  },
  name: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: Colors.textDark,
  },
  checkContainer: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkIcon: {
    fontSize: 18,
    color: Colors.primaryMid,
    fontWeight: '700',
  },
});
