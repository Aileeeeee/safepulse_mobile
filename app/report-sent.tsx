import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Colors, Fonts, Spacing, Radius } from '../constants/theme';

export default function ReportSentScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.center}>
        <Image
          source={require('../assets/images/checkmark.png')}
          style={styles.checkmark}
          resizeMode="contain"
        />
        <Text style={styles.heading}>Report sent</Text>
        <Text style={styles.sub}>Your alert has been sent. Help is coming.</Text>
      </View>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => router.replace('/(main)/home')}
        activeOpacity={0.82}
      >
        <Text style={styles.btnText}>Back to Home</Text>
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
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.lg },
  checkmark: { width: 180, height: 180 },
  heading: {
    fontFamily: Fonts.boldItalic, fontSize: 28,
    color: Colors.textLight, textAlign: 'center',
  },
  sub: { fontSize: 15, color: 'rgba(255,255,255,0.75)', textAlign: 'center', lineHeight: 22 },
  btn: {
    backgroundColor: Colors.primaryLight, borderRadius: Radius.full,
    paddingVertical: 17, width: '100%', alignItems: 'center',
  },
  btnText: { color: Colors.textLight, fontSize: 16, fontFamily: Fonts.bold },
});
