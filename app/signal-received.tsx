import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Animated,
} from 'react-native';
import { router } from 'expo-router';
import { Colors, Spacing, Radius } from '../constants/theme';

export default function SignalReceivedScreen() {
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slide, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  const resources = [
    {
      icon: '📍',
      title: 'Nearest Support',
      lines: ['Community Center', '12 Freedom way, yaba', '080-123-4567'],
      hasChevron: false,
    },
    {
      icon: '📞',
      title: 'Emergency Contact',
      lines: ['• Aisha', '• Femi'],
      hasChevron: true,
    },
    {
      icon: '💡',
      title: 'Safety Tip',
      lines: ['Stay in a safe place and trust your instinct.'],
      hasChevron: false,
    },
  ];

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* Check icon */}
          <View style={styles.checkWrap}>
            <View style={styles.checkCircle}>
              <Text style={styles.checkText}>✓</Text>
            </View>
          </View>

          <Animated.View style={[styles.content, { opacity: fade, transform: [{ translateY: slide }] }]}>
            <Text style={styles.heading}>Signal received</Text>
            <Text style={styles.sub}>
              Help is on the way. Here are some{'\n'}resources that might help.
            </Text>

            {/* Resource cards */}
            {resources.map((res) => (
              <View key={res.title} style={styles.card}>
                <View style={styles.cardIconWrap}>
                  <Text style={styles.cardIcon}>{res.icon}</Text>
                </View>
                <View style={styles.cardBody}>
                  <Text style={styles.cardTitle}>{res.title}</Text>
                  {res.lines.map((line, i) => (
                    <Text
                      key={i}
                      style={[
                        styles.cardLine,
                        i === 0 && res.title === 'Nearest Support' && styles.cardLineGreen,
                        line.startsWith('080') && styles.cardLinePhone,
                      ]}
                    >
                      {line}
                    </Text>
                  ))}
                </View>
                {res.hasChevron && (
                  <Text style={styles.chevron}>›</Text>
                )}
              </View>
            ))}
          </Animated.View>
        </ScrollView>

        {/* Dismiss button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.dismissBtn}
            onPress={() => router.replace('/(main)/home')}
            activeOpacity={0.82}
          >
            <Text style={styles.dismissText}>Dismiss</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryLight,
  },
  scroll: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 100,
  },
  checkWrap: {
    alignItems: 'center',
    paddingTop: 50,
    marginBottom: Spacing.lg,
  },
  checkCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2.5,
    borderColor: 'rgba(255,255,255,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkText: {
    fontSize: 22,
    color: Colors.textLight,
    fontWeight: '700',
  },
  content: { gap: Spacing.md },
  heading: {
    fontFamily: 'serif',
    fontStyle: 'italic',
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textLight,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  sub: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.sm,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.bgWhite,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  cardIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: Colors.primaryPale,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  cardIcon: { fontSize: 20 },
  cardBody: { flex: 1, gap: 3 },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textDark,
    marginBottom: 2,
  },
  cardLine: {
    fontSize: 14,
    color: Colors.textBody,
    lineHeight: 20,
  },
  cardLineGreen: { color: Colors.primaryMid, fontWeight: '500' },
  cardLinePhone: { color: Colors.primaryMid, fontWeight: '600' },
  chevron: { fontSize: 22, color: Colors.textMuted, alignSelf: 'center' },

  footer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    paddingTop: Spacing.sm,
  },
  dismissBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingVertical: 17,
    alignItems: 'center',
  },
  dismissText: {
    color: Colors.textLight,
    fontSize: 16,
    fontWeight: '600',
  },
});
