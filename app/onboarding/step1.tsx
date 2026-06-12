import React, { useRef, useEffect, useState } from 'react';
import {
  View, Text, Image, StyleSheet, TouchableOpacity,
  SafeAreaView, Animated, Modal, TextInput,
} from 'react-native';
import { router } from 'expo-router';
import { Colors, Fonts, Spacing, Radius } from '../../constants/theme';
import { ProgressBar } from '../../components/ProgressBar';

export default function OnboardingStep1() {
  const fade = useRef(new Animated.Value(0)).current;
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newGender, setNewGender] = useState('');
  const [newRelation, setNewRelation] = useState('');

  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} hitSlop={{ top:10,bottom:10,left:10,right:10 }}>
            <Text style={styles.back}>←</Text>
          </TouchableOpacity>
          <View style={styles.progressWrap}>
            <ProgressBar current={0} total={3} />
          </View>
          <Text style={styles.stepLabel}>1/3</Text>
        </View>

        <Animated.View style={[styles.body, { opacity: fade }]}>
          {/* Real avatar illustration */}
          <Image
            source={require('../../assets/images/add-contact-avatar.png')}
            style={styles.heroImage}
            resizeMode="contain"
          />

          <Text style={styles.heading}>Add a trusted{'\n'}contact</Text>
          <Text style={styles.sub}>They will get your alert when{'\n'}you send help</Text>

          <TouchableOpacity
              onPress={() => setShowAddModal(true)}
              activeOpacity={0.78}
            >
            <Image
              source={require('../../assets/images/add-contact-card.png')}
              style={styles.addContactCard}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <View style={styles.privacyRow}>
            <Image
              source={require('../../assets/images/safepulse-icon.png')}
              style={styles.privacyIcon}
              resizeMode="contain"
            />
            <Text style={styles.privacyText}>Your information is private and always protected.</Text>
          </View>
        </Animated.View>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.btn} onPress={() => router.push('/onboarding/step2')} activeOpacity={0.82}>
            <Text style={styles.btnText}>Continue</Text>
            <Text style={styles.arrow}>→</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/onboarding/step2')}>
            <Text style={styles.skip}>Skip for now</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <Modal visible={showAddModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>

            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setShowAddModal(false)}
            >
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Add New Contact</Text>

            <View style={styles.inputRow}>
              <Text style={styles.inputIcon}>👤</Text>
              <View style={styles.inputDivider} />
              <TextInput
                style={styles.input}
                placeholder="Name"
                value={newName}
                onChangeText={setNewName}
                placeholderTextColor="rgba(255,255,255,0.6)"
              />
            </View>

            <View style={styles.inputRow}>
              <Text style={styles.inputIcon}>📞</Text>
              <View style={styles.inputDivider} />
              <TextInput
                style={styles.input}
                placeholder="Contact number"
                value={newPhone}
                onChangeText={setNewPhone}
                keyboardType="phone-pad"
                placeholderTextColor="rgba(255,255,255,0.6)"
              />
            </View>

            <Text style={styles.relationLabel}>
              How is the person related to you ?
            </Text>

            <View style={styles.relationInputWrap}>
              <TextInput
                style={styles.relationInput}
                placeholder="e.g family, friends or neighbour"
                value={newRelation}
                onChangeText={setNewRelation}
                placeholderTextColor="rgba(255,255,255,0.6)"
              />
            </View>

            <TouchableOpacity
              style={styles.modalBtn}
              onPress={() => {
                setShowAddModal(false);
                router.push('/onboarding/step2');
              }}
              activeOpacity={0.82}
            >
              <Text style={styles.modalBtnText}>Add Contact</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bgMain },
  container: { flex: 1, paddingHorizontal: Spacing.lg, paddingTop: 50, paddingBottom: Spacing.xl },
  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.xl },
  back: { fontSize: 22, color: Colors.textDark, fontWeight: '600' },
  progressWrap: { flex: 1 },
  addContactCard: {width: 350,height: 100,},
  stepLabel: { fontSize: 13, color: Colors.textMuted, fontWeight: '500' },
  body: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.md },
  heroImage: { width: 160, height: 160, marginBottom: Spacing.md,paddingTop: 20 },
  heading: { fontFamily: Fonts.boldItalic, fontSize: 26, color: Colors.textDark, textAlign: 'center', lineHeight: 34 },
  sub: { fontSize: 14, color: Colors.textMuted, textAlign: 'center', lineHeight: 21 },
  privacyRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm, marginTop: Spacing.sm, paddingHorizontal: Spacing.sm },
  privacyIcon: { width: 30, height: 25, marginTop: 1 },
  privacyText: { flex: 1, fontSize: 12, color: Colors.textMuted, lineHeight: 18 },
  footer: { gap: Spacing.md },
  btn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.primary, borderRadius: Radius.full, paddingVertical: 17, gap: 10 },
  btnText: { color: Colors.textLight, fontSize: 16, fontFamily: Fonts.bold },
  arrow: { color: Colors.textLight, fontSize: 18 },
  skip: { textAlign: 'center', fontSize: 15, fontFamily: Fonts.bold, color: Colors.textDark },
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20,
  },
  modalCard: {
    backgroundColor: Colors.primaryLight, borderRadius: 24,
    padding: 24, width: '100%', gap: 12, position: 'relative',
  },
  closeBtn: {
    position: 'absolute', top: 14, right: 14,
    width: 32, height: 32, borderRadius: 16,
    borderWidth: 1.5, borderColor: Colors.textLight,
    alignItems: 'center', justifyContent: 'center', zIndex: 10,
  },
  closeBtnText: { color: Colors.textLight, fontSize: 14, fontWeight: '600' },
  modalTitle: {
    fontFamily: Fonts.bold, fontSize: 18,
    color: Colors.textLight, textAlign: 'center',
    marginBottom: 4, marginTop: 8,
  },
  inputRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: Radius.full, paddingHorizontal: 16, paddingVertical: 14, gap: 12,
  },
  inputIcon: { fontSize: 16 },
  inputDivider: { width: 1, height: 18, backgroundColor: 'rgba(255,255,255,0.5)' },
  input: { flex: 1, fontSize: 15, color: Colors.textLight },
  relationLabel: { fontSize: 13, color: Colors.textLight, fontWeight: '500', marginTop: 4 },
  relationInputWrap: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: Radius.xl, paddingHorizontal: 16, paddingVertical: 14,
  },
  relationInput: { fontSize: 15, color: Colors.textLight },
  modalBtn: {
    backgroundColor: Colors.primary, borderRadius: Radius.full,
    paddingVertical: 16, alignItems: 'center', marginTop: 8,
  },
  modalBtnText: { color: Colors.textLight, fontFamily: Fonts.bold, fontSize: 16 },
});
