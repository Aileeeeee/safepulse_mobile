import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,Image,
  SafeAreaView, ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { Colors, Fonts, Spacing, Radius } from '../constants/theme';

export default function AboutScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={{ top:10,bottom:10,left:10,right:10 }}
        >
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>About SafePulse</Text>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo area */}
        <View style={styles.logoSection}>
          <Image 
                source={require('../assets/images/safepulse-icon.png')} 
                style={styles.logoImage}
                resizeMode="contain"
            />
          <Text style={styles.appName}>SafePulse</Text>
          <Text style={styles.tagline}>Report • Illuminate • Act</Text>

        </View>

        {/* What is SafePulse */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What is SafePulse?</Text>
          <Text style={styles.body}>
            SafePulse is a discreet emergency and community safety app built
            for everyday people. Whether you are in danger, witnessing a
            harmful situation, or want to report something quietly. SafePulse
            gives you a fast, anonymous way to send help without drawing attention
            to yourself.
          </Text>
          <Text style={styles.body}>
            No sign up. No login. No names stored. Just help, when you need it most.
          </Text>
        </View>

        {/* How it works */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How it works</Text>

          {[
            {
              emoji: '🚨',
              title: 'Send Pulse',
              desc: 'Press and hold the big green button when you are in immediate danger. Your location and an emergency alert are sent instantly to your trusted contacts and the nearest NGO in your area.',
            },
            {
              emoji: '📋',
              title: 'Report Something',
              desc: 'Tap "Report Something" to report a situation you witnessed or experienced. Choose the type of incident, answer a few quick questions, and submit. Your report reaches the NGO dashboard immediately.',
            },
            {
              emoji: '👥',
              title: 'Trusted Contacts',
              desc: 'Add up to 5 people you trust. When you send a pulse, they receive an SMS alert with your location so they can check on you or call for help.',
            },
            {
              emoji: '🥷',
              title: 'Stealth Mode',
              desc: 'SafePulse can disguise itself as an ordinary app on your phone so nobody knows you have it. You choose the disguise during setup and can change it anytime in Settings.',
            },
          ].map((item) => (
            <View key={item.title} style={styles.featureRow}>
              <Text style={styles.featureEmoji}>{item.emoji}</Text>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>{item.title}</Text>
                <Text style={styles.featureDesc}>{item.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Stealth mode codes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            🔐 How to open SafePulse from stealth mode
          </Text>
          <Text style={styles.body}>
            When stealth mode is active, SafePulse looks like a different app.
            Here is how to get back into it depending on which disguise you chose:
          </Text>

          {[
            {
              disguise: '🧮 Calculator',
              color: '#3D3D3D',
              steps: [
                'Type 9  1  1  on the keypad',
                'Then tap  =',
                'SafePulse opens immediately',
              ],
              alt: 'You can also hold down the  =  button for 2 seconds.',
            },
            {
              disguise: '📝 Notes',
              color: '#E8A020',
              steps: [
                'Open the Notes disguise app',
                'Tap the word "Notes" at the top of the screen 5 times quickly',
                'SafePulse opens immediately',
              ],
              alt: 'Tap fast — all 5 taps must happen within 1.5 seconds.',
            },
            {
              disguise: '⛅ Weather',
              color: '#4A90D9',
              steps: [
                'Open the Weather disguise app',
                'Press and hold the temperature number (e.g. 27°) for 2 seconds',
                'SafePulse opens immediately',
              ],
              alt: 'Hold firmly until you feel a vibration.',
            },
            {
              disguise: '💰 Budget',
              color: '#2E7D60',
              steps: [
                'Open the Budget disguise app',
                'Tap Food → Food → Transport → Savings in the category list',
                'SafePulse opens immediately',
              ],
              alt: 'Tap those four categories in that exact order.',
            },
            {
              disguise: '🧘 Meditation',
              color: '#7B5EA7',
              steps: [
                'Open the Meditation disguise app',
                'Tap Morning → Focus → Focus → Breathe in the sessions list',
                'SafePulse opens immediately',
              ],
              alt: 'Tap those four sessions in that exact order.',
            },
          ].map((item) => (
            <View
              key={item.disguise}
              style={[styles.codeCard, { borderLeftColor: item.color }]}
            >
              <Text style={styles.codeDisguise}>{item.disguise}</Text>
              {item.steps.map((step, i) => (
                <View key={i} style={styles.stepRow}>
                  <Text style={[styles.stepNum, { color: item.color }]}>
                    {i + 1}.
                  </Text>
                  <Text style={styles.stepText}>{step}</Text>
                </View>
              ))}
              <Text style={styles.codeAlt}>{item.alt}</Text>
            </View>
          ))}
        </View>

        {/* Privacy */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔒 Your privacy</Text>
          <Text style={styles.body}>
            SafePulse does not collect your name, phone number, or any personal
            information. Every report you make is completely anonymous. Your
            device is identified only by a random code that cannot be traced
            back to you. Your location is only shared when you choose to enable
            it or when you send a pulse.
          </Text>
        </View>

        {/* Built for */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Built for communities</Text>
          <Text style={styles.body}>
            SafePulse works alongside an SMS and USSD system so that even
            people without smartphones or internet access can send alerts by
            texting a shortcode. Every report,whether from the app, SMS, or
            USSD reaches the same NGO dashboard so no call for help is missed.
          </Text>
        </View>

        

        <Text style={styles.footer}>
          Made with care for the safety of every individual.
        </Text>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bgMain },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: 48,
    paddingBottom: Spacing.sm,
  },
  back: { fontSize: 22, color: Colors.textDark, fontWeight: '600' },
  title: { fontFamily: Fonts.boldItalic, fontSize: 20, color: Colors.textDark },

  content: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 60,
    gap: Spacing.lg,
  },

  // Logo section
  logoSection: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    gap: 6,
  },
  logoImage: {
    width: 100,   
    height: 100,  
    marginBottom: 10, 
  },

  appName: {
    fontFamily: Fonts.boldItalic,
    fontSize: 26, color: Colors.primary,
  },

  tagline: {
    fontSize: 13, color: Colors.textMuted,
    letterSpacing: 1.5, textTransform: 'uppercase',
  },
  
  // Sections
  section: { gap: Spacing.md },
  sectionTitle: {
    fontFamily: Fonts.bold,
    fontSize: 17, color: Colors.textDark,
    marginBottom: 2,
  },
  body: {
    fontSize: 14, color: Colors.textBody,
    lineHeight: 23,
  },

  // Feature rows
  featureRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    backgroundColor: Colors.bgWhite,
    borderRadius: Radius.lg,
    padding: Spacing.md,
  },
  featureEmoji: { fontSize: 24, marginTop: 2 },
  featureText: { flex: 1 },
  featureTitle: {
    fontFamily: Fonts.bold,
    fontSize: 15, color: Colors.textDark,
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 13, color: Colors.textMuted,
    lineHeight: 20,
  },

  // Code cards
  codeCard: {
    backgroundColor: Colors.bgWhite,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderLeftWidth: 4,
    gap: 6,
    marginBottom: 10,
  },
  codeDisguise: {
    fontFamily: Fonts.bold,
    fontSize: 15, color: Colors.textDark,
    marginBottom: 4,
  },
  stepRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
  },
  stepNum: {
    fontSize: 14, fontWeight: '700',
    width: 18,
  },
  stepText: {
    flex: 1, fontSize: 14,
    color: Colors.textBody, lineHeight: 21,
  },
  codeAlt: {
    fontSize: 12,
    color: Colors.textMuted,
    fontStyle: 'italic',
    marginTop: 4,
  },

  // Emergency box
  emergencyBox: {
    backgroundColor: '#FFF3E0',
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: '#F5A623',
    gap: 8,
  },
  emergencyTitle: {
    fontFamily: Fonts.bold,
    fontSize: 15, color: '#E65100',
  },
  emergencyText: {
    fontSize: 14, color: '#BF360C',
    lineHeight: 22,
  },
  emergencyNumber: {
    fontFamily: Fonts.bold,
    fontSize: 15,
  },

  footer: {
    textAlign: 'center',
    fontSize: 13,
    color: Colors.textMuted,
    fontStyle: 'italic',
    paddingVertical: Spacing.md,
  },
});