import React, { useState, useEffect } from 'react';
import {
  View, Text, Image, StyleSheet, TouchableOpacity,
  SafeAreaView, Switch, ScrollView, Modal,
} from 'react-native';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import {
  requestNotificationPermission,
  requestLocationPermission,
  getNotificationStatus,
  getLocationStatus,
  stopLocationTracking,
} from '../../hooks/usePermissions';
import { useLocationTracker } from '../../hooks/useLocationTracker';
import { router } from 'expo-router';
import { Colors, Fonts, Spacing, Radius } from '../../constants/theme';
import { DISGUISE_META, DISGUISE_ROUTES } from '../../hooks/useDisguise';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DisguiseType } from '../../types';

const ALL_DISGUISES = Object.entries(DISGUISE_META) as [DisguiseType, typeof DISGUISE_META[DisguiseType]][];

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(false);
  const [location, setLocation] = useState(false);
  const { enableTracking, disableTracking } = useLocationTracker();
  const [showDisguisePicker, setShowDisguisePicker] = useState(false);

  const [activeDisguise, setActiveDisguise] = useState<DisguiseType>('calculator');

  useEffect(() => {
    AsyncStorage.getItem('safepulse_disguise').then((saved) => {
      if (saved) setActiveDisguise(saved as DisguiseType);
    });
  }, []);
  

  useEffect(() => {
    const loadStatuses = async () => {
      const notif = await getNotificationStatus();
      setNotifications(notif === 'granted');

      // Read user's saved preference, not just phone permission
      const savedPref = await AsyncStorage.getItem('safepulse_location_sharing');
      if (savedPref !== null) {
        setLocation(savedPref === 'true');
      } else {
        const loc = await getLocationStatus();
        setLocation(loc === 'granted');
      }
    };
    loadStatuses();
  }, []);

  const handleNotificationToggle = async (value: boolean) => {
    if (value) {
      const granted = await requestNotificationPermission();
      setNotifications(granted);
    } else {
      setNotifications(false);
    }
  };

  const handleLocationToggle = async (value: boolean) => {
    if (value) {
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status === 'granted') {
        // Permission already granted — just save preference as ON
        await AsyncStorage.setItem('safepulse_location_sharing', 'true');
        setLocation(true);
      } else {
        // Ask for permission
        const { status: newStatus } = await Location.requestForegroundPermissionsAsync();
        if (newStatus === 'granted') {
          await AsyncStorage.setItem('safepulse_location_sharing', 'true');
          setLocation(true);
        } else {
          await AsyncStorage.setItem('safepulse_location_sharing', 'false');
          setLocation(false);
          Alert.alert(
            'Permission Required',
            'Please allow location in Settings.',
            [
              { text: 'Not Now' },
              { text: 'Open Settings', onPress: () => Linking.openSettings() },
            ]
          );
        }
      }
    } else {
      // User turned it OFF — save that preference
      await AsyncStorage.setItem('safepulse_location_sharing', 'false');
      await disableTracking();
      setLocation(false);
    }
  };

  const toggleRows = [
    { key: 'notifications', label: 'Notifications', sub: 'Alert contacts when pulse is sent', emoji: '🔔', value: notifications, setter: handleNotificationToggle },
    { key: 'location', label: 'Location Access', sub: 'Share approximate area with responders', emoji: '📍', value: location, setter: handleLocationToggle },
  ];

  const navRows = [
    { emoji: '📞', label: 'Emergency Contacts'  , action: () => router.push('/(main)/contacts') },
    { emoji: '🔒', label: 'Privacy Policy', action: () => {} },
    { emoji: 'ℹ️', label: 'About SafePulse', action: () => router.push('/about') },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Stealth disguise picker */}
        <Text style={styles.section}>Stealth Mode</Text>
        <TouchableOpacity
          style={styles.disguiseCard}
          onPress={() => setShowDisguisePicker(true)}
          activeOpacity={0.85}
        >
          <View style={[styles.disguiseIconWrap, { backgroundColor: DISGUISE_META[activeDisguise].accentColor + '22' }]}>
            <Text style={styles.disguiseEmoji}>{DISGUISE_META[activeDisguise].emoji}</Text>
          </View>
          <View style={styles.disguiseText}>
            <Text style={styles.disguiseLabel}>Active Disguise</Text>
            <Text style={styles.disguiseName}>{DISGUISE_META[activeDisguise].label}</Text>
            <Text style={styles.disguiseDesc}>{DISGUISE_META[activeDisguise].description}</Text>
          </View>
          <View style={styles.changeBtn}>
            <Text style={styles.changeBtnText}>Change</Text>
          </View>
        </TouchableOpacity>

        {/* Test stealth button */}
        <TouchableOpacity
          style={[styles.testBtn, { backgroundColor: DISGUISE_META[activeDisguise].accentColor }]}
          onPress={() => router.push(DISGUISE_ROUTES[activeDisguise] as any)}
          activeOpacity={0.82}
        >
          <Text style={styles.testBtnEmoji}>{DISGUISE_META[activeDisguise].emoji}</Text>
          <Text style={styles.testBtnText}>Preview {DISGUISE_META[activeDisguise].label} disguise</Text>
        </TouchableOpacity>

        {/* Toggle settings */}
        <Text style={[styles.section, { marginTop: Spacing.xl }]}>Preferences</Text>
        {toggleRows.map((row) => (
          <View key={row.key} style={styles.row}>
            <View style={styles.rowIcon}>
              <Text style={styles.rowEmoji}>{row.emoji}</Text>
            </View>
            <View style={styles.rowText}>
              <Text style={styles.rowLabel}>{row.label}</Text>
              <Text style={styles.rowSub}>{row.sub}</Text>
            </View>
            <Switch
              value={row.value}
              onValueChange={row.setter}
              trackColor={{ false: Colors.border, true: Colors.primaryLight }}
              thumbColor={Colors.bgWhite}
            />
          </View>
        ))}

        {/* Nav rows */}
        <Text style={[styles.section, { marginTop: Spacing.xl }]}>Account</Text>
        {navRows.map((item) => (
          <TouchableOpacity key={item.label} style={styles.row} onPress={item.action} activeOpacity={0.8}>
            <View style={styles.rowIcon}>
              <Text style={styles.rowEmoji}>{item.emoji}</Text>
            </View>
            <Text style={[styles.rowLabel, { flex: 1 }]}>{item.label}</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        ))}

        <View style={styles.versionWrap}>
          <Text style={styles.version}>SafePulse v1.0.0</Text>
          <Text style={styles.versionSub}>Built for safety, designed with care.</Text>
        </View>
      </ScrollView>

      {/* Disguise Picker Modal */}
      <Modal visible={showDisguisePicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Choose your disguise</Text>
            <Text style={styles.modalSub}>SafePulse will open as this app when stealth mode is activated</Text>

            <View style={styles.pickerGrid}>
              {ALL_DISGUISES.map(([id, meta]) => (
                <TouchableOpacity
                  key={id}
                  style={[
                    styles.pickerItem,
                    activeDisguise === id && { borderColor: meta.accentColor, borderWidth: 2.5 },
                  ]}
                  onPress={async () => {
                    setActiveDisguise(id);
                    await AsyncStorage.setItem('safepulse_disguise', id);
                    setShowDisguisePicker(false);
                  }}
                  activeOpacity={0.8}
                >
                  <View style={[styles.pickerIconWrap, { backgroundColor: meta.accentColor + '22' }]}>
                    <Text style={styles.pickerEmoji}>{meta.emoji}</Text>
                  </View>
                  <Text style={styles.pickerLabel}>{meta.label}</Text>
                  {activeDisguise === id && (
                    <View style={[styles.pickerCheck, { backgroundColor: meta.accentColor }]}>
                      <Text style={styles.pickerCheckText}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setShowDisguisePicker(false)}
            >
              <Text style={styles.modalCloseBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bgMain },
  header: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, paddingBottom: Spacing.sm },
  title: { fontFamily: Fonts.bold, fontSize: 22, color: Colors.textDark },
  content: { paddingHorizontal: Spacing.lg, paddingBottom: 100 },
  section: {
    fontSize: 11, fontWeight: '600', color: Colors.textMuted,
    letterSpacing: 1.4, textTransform: 'uppercase',
    marginBottom: Spacing.sm, marginTop: Spacing.sm,
  },

  // Disguise card
  disguiseCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.bgWhite, borderRadius: Radius.lg,
    padding: Spacing.md, gap: Spacing.md, marginBottom: Spacing.sm,
  },
  disguiseIconWrap: {
    width: 52, height: 52, borderRadius: 26,
    alignItems: 'center', justifyContent: 'center',
  },
  disguiseEmoji: { fontSize: 26 },
  disguiseText: { flex: 1 },
  disguiseLabel: { fontSize: 11, color: Colors.textMuted, fontWeight: '500', textTransform: 'uppercase', letterSpacing: 0.8 },
  disguiseName: { fontFamily: Fonts.bold, fontSize: 16, color: Colors.textDark, marginTop: 2 },
  disguiseDesc: { fontSize: 12, color: Colors.textMuted, marginTop: 2, lineHeight: 16 },
  changeBtn: {
    backgroundColor: Colors.primaryPale, borderRadius: Radius.full,
    paddingHorizontal: 12, paddingVertical: 6,
  },
  changeBtnText: { fontSize: 13, fontFamily: Fonts.bold, color: Colors.primaryMid },

  // Test button
  testBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderRadius: Radius.full, paddingVertical: 14, gap: 8, marginBottom: Spacing.sm,
  },
  testBtnEmoji: { fontSize: 16 },
  testBtnText: { color: Colors.textLight, fontFamily: Fonts.bold, fontSize: 14 },

  // Toggle rows
  row: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.bgWhite, borderRadius: Radius.md,
    padding: Spacing.md, marginBottom: Spacing.sm, gap: Spacing.md,
  },
  rowIcon: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.primaryPale, alignItems: 'center', justifyContent: 'center',
  },
  rowEmoji: { fontSize: 18 },
  rowText: { flex: 1 },
  rowLabel: { fontSize: 15, fontFamily: Fonts.bold, color: Colors.textDark },
  rowSub: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  chevron: { fontSize: 22, color: Colors.textMuted },

  versionWrap: { alignItems: 'center', marginTop: Spacing.xxl, gap: 4 },
  version: { fontSize: 13, fontWeight: '600', color: Colors.textMuted },
  versionSub: { fontSize: 12, color: Colors.textMuted },

  // Modal
  modalOverlay: {
    flex: 1, backgroundColor: Colors.overlay,
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: Colors.bgWhite,
    borderTopLeftRadius: Radius.xl, borderTopRightRadius: Radius.xl,
    padding: Spacing.xl, gap: Spacing.md,
  },
  modalTitle: { fontFamily: Fonts.boldItalic, fontSize: 20, color: Colors.textDark, textAlign: 'center' },
  modalSub: { fontSize: 13, color: Colors.textMuted, textAlign: 'center', lineHeight: 19 },
  pickerGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, justifyContent: 'center', marginTop: Spacing.sm },
  pickerItem: {
    width: '28%', backgroundColor: Colors.bgMain, borderRadius: Radius.lg,
    padding: Spacing.md, alignItems: 'center', gap: Spacing.xs,
    borderWidth: 2, borderColor: 'transparent', position: 'relative',
  },
  pickerIconWrap: {
    width: 50, height: 50, borderRadius: 25,
    alignItems: 'center', justifyContent: 'center',
  },
  pickerEmoji: { fontSize: 24 },
  pickerLabel: { fontSize: 12, fontFamily: Fonts.bold, color: Colors.textDark, textAlign: 'center' },
  pickerCheck: {
    position: 'absolute', top: 6, right: 6,
    width: 20, height: 20, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  pickerCheckText: { color: Colors.textLight, fontSize: 11, fontWeight: '700' },
  modalCloseBtn: {
    borderRadius: Radius.full, paddingVertical: 16,
    alignItems: 'center', backgroundColor: Colors.bgMain, marginTop: Spacing.sm,
  },
  modalCloseBtnText: { fontFamily: Fonts.bold, fontSize: 15, color: Colors.textMuted },
});
