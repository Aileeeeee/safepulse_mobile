import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Colors, Fonts, Spacing, Radius } from '../constants/theme';

export default function SignalSentScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.center}>
        <Image
          source={require('../assets/images/checkmark.png')}
          style={styles.checkmark}
          resizeMode="contain"
        />
        <Text style={styles.heading}>Signal sent</Text>
        <Text style={styles.contactsNotified}>Contacts notified</Text>
        <Text style={styles.sub}>Stay in a safe place. wait for help.</Text>
      </View>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => router.replace('/signal-received')}
        activeOpacity={0.82}
      >
        <Text style={styles.btnText}>Dismiss</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: Colors.bgDark,
    alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 80, paddingHorizontal: Spacing.xl,
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.md },
  checkmark: { width: 180, height: 180 },
  heading: {
    fontFamily: Fonts.boldItalic, fontSize: 28,
    color: Colors.textLight, textAlign: 'center', marginTop: Spacing.lg,
  },
  contactsNotified: { fontSize: 16, color: 'rgba(255,255,255,0.85)', fontWeight: '500' },
  sub: { fontSize: 14, color: 'rgba(255,255,255,0.65)', textAlign: 'center', lineHeight: 21 },
  btn: {
    backgroundColor: Colors.primaryLight, borderRadius: Radius.full,
    paddingVertical: 17, width: '100%', alignItems: 'center',
  },
  btnText: { color: Colors.textLight, fontSize: 16, fontFamily: Fonts.bold },
});
