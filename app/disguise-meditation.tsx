import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  SafeAreaView, ScrollView, Vibration,
  Animated, Pressable, Modal, Image,
  useWindowDimensions,
} from 'react-native';
import { router } from 'expo-router';

const DARK_GREEN = '#1A5C45';
const MED_GREEN = '#2E7D60';
const LIGHT_GREEN = '#E8F5F0';
const BG = '#F5F5F0';
const WHITE = '#FFFFFF';
const PURPLE = '#9B8EC4';
const BLUE = '#6B9FD4';

const SESSIONS = [
  { id: 'stress', title: 'Stress Relief',  duration: '10 min', level: 'Beginner', iconBg: '#D0ECD8', icon: '🌿', playColor: MED_GREEN },
  { id: 'sleep',  title: 'Better Sleep',   duration: '15 min', level: 'Beginner', iconBg: '#D0DFFF', icon: '🌙', playColor: BLUE },
  { id: 'peace',  title: 'Inner Peace',    duration: '12 min', level: 'Beginner', iconBg: '#E0D4FF', icon: '🪷', playColor: PURPLE },
];

export default function MeditationDisguiseScreen() {
  const { width } = useWindowDimensions();
  const [activeTab, setActiveTab] = useState('home');
  const [showSession, setShowSession] = useState(false);
  const [activeSession, setActiveSession] = useState<any>(null);
  const [showBreathing, setShowBreathing] = useState(false);
  const [timerActive, setTimerActive] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(600);
  const breathScale = useRef(new Animated.Value(1)).current;
  const [breathLabel, setBreathLabel] = useState('Breathe in...');
  const longPressTimer = useRef<any>(null);

  // Secret: long press lotus hero image 2 seconds
  const handleHeroPress = () => {
    longPressTimer.current = setTimeout(() => {
      Vibration.vibrate([0, 60, 60, 60]);
      router.replace('/(main)/home');
    }, 2000);
  };
  const handleHeroRelease = () => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
  };

  // Breathing animation
  useEffect(() => {
    if (!showBreathing) return;
    let cancelled = false;
    let phase = 0;
    const phases = [
      { label: 'Breathe in...', to: 1.35, dur: 4000 },
      { label: 'Hold...',       to: 1.35, dur: 2000 },
      { label: 'Breathe out...', to: 1.0, dur: 4000 },
      { label: 'Rest...',        to: 1.0, dur: 2000 },
    ];
    const run = () => {
      if (cancelled) return;
      const p = phases[phase % phases.length];
      setBreathLabel(p.label);
      Animated.timing(breathScale, {
        toValue: p.to, duration: p.dur, useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished && !cancelled) { phase++; run(); }
      });
    };
    run();
    return () => { cancelled = true; breathScale.stopAnimation(); };
  }, [showBreathing]);

  // Focus timer
  useEffect(() => {
    if (!timerActive) return;
    const i = setInterval(() => {
      setTimerSeconds(p => {
        if (p <= 0) { setTimerActive(false); return 0; }
        return p - 1;
      });
    }, 1000);
    return () => clearInterval(i);
  }, [timerActive]);

  const fmt = (s: number) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  // Image width fills screen minus horizontal padding
  const imgWidth = width - 32;

  const HomeTab = () => (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      {/* ── Hero banner (long press = unlock) ── */}
      <Pressable
        onPressIn={handleHeroPress}
        onPressOut={handleHeroRelease}
        style={[styles.imgContainer, { width: imgWidth, height: imgWidth * 0.52 }]}
      >
        <Image
          source={require('../assets/images/meditation-hero.png')}
          style={styles.fullImg}
          resizeMode="cover"
        />
      </Pressable>

      {/* ── Daily Mindful Moment card ── */}
      {/* Start button is roughly in the right 25% of the card */}
      <View style={[styles.imgContainer, { width: imgWidth, height: imgWidth * 0.22 }]}>
        <Image
          source={require('../assets/images/meditation-daily.png')}
          style={styles.fullImg}
          resizeMode="cover"
        />
        {/* Tap zone over "Start" button — right portion */}
        <TouchableOpacity
          style={[styles.tapZone, { left: '72%', top: 0, right: 0, bottom: 0 }]}
          onPress={() => { setActiveSession(SESSIONS[0]); setShowSession(true); }}
          activeOpacity={0.7}
        />
      </View>

      {/* ── Section heading ── */}
      <View style={styles.sectionRow}>
        <Text style={styles.sectionTitle}>Meditation for you</Text>
        <TouchableOpacity>
          <Text style={styles.viewAll}>View all</Text>
        </TouchableOpacity>
      </View>

      {/* ── Session cards (3 equal tap zones) ── */}
      <View style={[styles.imgContainer, { width: imgWidth, height: imgWidth * 0.52 }]}>
        <Image
          source={require('../assets/images/meditation-sessions.png')}
          style={styles.fullImg}
          resizeMode="cover"
        />
        {/* Left third → Stress Relief */}
        <TouchableOpacity
          style={[styles.tapZone, { left: 0, top: 0, width: '33%', bottom: 0 }]}
          onPress={() => { setActiveSession(SESSIONS[0]); setShowSession(true); }}
          activeOpacity={0.7}
        />
        {/* Middle third → Better Sleep */}
        <TouchableOpacity
          style={[styles.tapZone, { left: '33%', top: 0, width: '34%', bottom: 0 }]}
          onPress={() => { setActiveSession(SESSIONS[1]); setShowSession(true); }}
          activeOpacity={0.7}
        />
        {/* Right third → Inner Peace */}
        <TouchableOpacity
          style={[styles.tapZone, { left: '67%', top: 0, right: 0, bottom: 0 }]}
          onPress={() => { setActiveSession(SESSIONS[2]); setShowSession(true); }}
          activeOpacity={0.7}
        />
      </View>

      {/* ── Quick Tools heading ── */}
      <Text style={[styles.sectionTitle, { paddingHorizontal: 16, marginTop: 12, marginBottom: 10 }]}>
        Quick Tools
      </Text>

      {/* ── Quick Tools card (4 equal tap zones) ── */}
      <View style={[styles.imgContainer, { width: imgWidth, height: imgWidth * 0.28 }]}>
        <Image
          source={require('../assets/images/meditation-tools.png')}
          style={styles.fullImg}
          resizeMode="cover"
        />
        {/* Breathing */}
        <TouchableOpacity
          style={[styles.tapZone, { left: 0, top: 0, width: '25%', bottom: 0 }]}
          onPress={() => setShowBreathing(true)}
          activeOpacity={0.7}
        />
        {/* Calm Sounds */}
        <TouchableOpacity
          style={[styles.tapZone, { left: '25%', top: 0, width: '25%', bottom: 0 }]}
          onPress={() => {}}
          activeOpacity={0.7}
        />
        {/* Daily Affirmations */}
        <TouchableOpacity
          style={[styles.tapZone, { left: '50%', top: 0, width: '25%', bottom: 0 }]}
          onPress={() => {}}
          activeOpacity={0.7}
        />
        {/* Focus Timer */}
        <TouchableOpacity
          style={[styles.tapZone, { left: '75%', top: 0, right: 0, bottom: 0 }]}
          onPress={() => { setTimerSeconds(600); setTimerActive(true); setActiveTab('meditate'); }}
          activeOpacity={0.7}
        />
      </View>

      {/* ── Remember quote card ── */}
      <View style={[styles.imgContainer, { width: imgWidth, height: imgWidth * 0.22, marginBottom: 8 }]}>
        <Image
          source={require('../assets/images/meditation-quote.png')}
          style={styles.fullImg}
          resizeMode="cover"
        />
      </View>

    </ScrollView>
  );

  const MeditateTab = () => (
    <ScrollView contentContainerStyle={{ paddingBottom: 100, paddingTop: 20 }}>
      <Text style={[styles.sectionTitle, { paddingHorizontal: 16, marginBottom: 16 }]}>
        All Sessions
      </Text>
      {SESSIONS.map((s) => (
        <TouchableOpacity
          key={s.id}
          style={styles.sessionListCard}
          onPress={() => { setActiveSession(s); setShowSession(true); }}
        >
          <View style={[styles.sessionListIcon, { backgroundColor: s.iconBg }]}>
            <Text style={{ fontSize: 26 }}>{s.icon}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.sessionListTitle}>{s.title}</Text>
            <Text style={styles.sessionListMeta}>{s.duration} • {s.level}</Text>
          </View>
          <Text style={{ fontSize: 20, color: s.playColor }}>▶</Text>
        </TouchableOpacity>
      ))}
      {timerActive && (
        <View style={styles.timerCard}>
          <Text style={styles.timerLabel}>Focus Timer</Text>
          <Text style={styles.timerTime}>{fmt(timerSeconds)}</Text>
          <TouchableOpacity
            style={styles.timerStopBtn}
            onPress={() => setTimerActive(false)}
          >
            <Text style={styles.timerStopText}>Stop</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );

  const ProfileTab = () => (
    <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
      <View style={styles.profileCard}>
        <View style={styles.profileAvatar}>
          <Text style={{ fontSize: 38 }}>🧘</Text>
        </View>
        <Text style={styles.profileName}>Mindful User</Text>
        <Text style={styles.profileStreak}>7-day streak 🔥</Text>
      </View>
      {[
        { icon: '🏆', label: 'My Achievements' },
        { icon: '📊', label: 'Progress Stats' },
        { icon: '🔔', label: 'Reminders' },
        { icon: '❤️', label: 'Favourites' },
        { icon: '⚙️', label: 'Settings' },
      ].map((item) => (
        <TouchableOpacity key={item.label} style={styles.profileRow}>
          <Text style={{ fontSize: 20, width: 32 }}>{item.icon}</Text>
          <Text style={styles.profileRowLabel}>{item.label}</Text>
          <Text style={{ color: '#CCC', fontSize: 18 }}>›</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.safe}>

      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity hitSlop={{ top:10,bottom:10,left:10,right:10 }}>
          <Text style={styles.topBarIcon}>☰</Text>
        </TouchableOpacity>
        <TouchableOpacity hitSlop={{ top:10,bottom:10,left:10,right:10 }}>
          <Text style={styles.topBarIcon}>🔔</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'home'     && <HomeTab />}
      {activeTab === 'meditate' && <MeditateTab />}
      {activeTab === 'profile'  && <ProfileTab />}

      {/* ── Bottom nav using PNG image with tap zones ── */}
      <View style={styles.bottomNavWrap}>
        <Image
          source={require('../assets/images/meditation-nav.png')}
          style={styles.bottomNavImg}
          resizeMode="cover"
        />
        {/* Home */}
        <TouchableOpacity
          style={[styles.tapZone, { left: 0, top: 0, width: '33%', bottom: 0 }]}
          onPress={() => setActiveTab('home')}
          activeOpacity={0.7}
        />
        {/* Meditate */}
        <TouchableOpacity
          style={[styles.tapZone, { left: '33%', top: 0, width: '34%', bottom: 0 }]}
          onPress={() => setActiveTab('meditate')}
          activeOpacity={0.7}
        />
        {/* Profile */}
        <TouchableOpacity
          style={[styles.tapZone, { left: '67%', top: 0, right: 0, bottom: 0 }]}
          onPress={() => setActiveTab('profile')}
          activeOpacity={0.7}
        />
      </View>

      {/* Session player modal */}
      <Modal visible={showSession} animationType="slide">
        <SafeAreaView style={[styles.safe, { backgroundColor: LIGHT_GREEN }]}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center' }}>
            <TouchableOpacity onPress={() => setShowSession(false)}>
              <Text style={{ fontSize: 22, color: DARK_GREEN, fontWeight: '600' }}>← Back</Text>
            </TouchableOpacity>
            <Text style={{ fontSize: 16, fontWeight: '700', color: DARK_GREEN }}>
              {activeSession?.title}
            </Text>
            <View style={{ width: 60 }} />
          </View>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 20 }}>
            <Text style={{ fontSize: 80 }}>{activeSession?.icon}</Text>
            <Text style={{ fontSize: 28, fontWeight: '700', color: DARK_GREEN }}>
              {activeSession?.title}
            </Text>
            <Text style={{ fontSize: 14, color: '#666' }}>
              {activeSession?.duration} • {activeSession?.level}
            </Text>
            <View style={[styles.sessionCircle, { backgroundColor: activeSession?.iconBg || LIGHT_GREEN }]}>
              <Text style={{ fontSize: 50 }}>{activeSession?.icon}</Text>
              <Text style={{ fontSize: 13, color: '#666', marginTop: 8 }}>Focus here</Text>
            </View>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Breathing modal */}
      <Modal visible={showBreathing} animationType="fade">
        <SafeAreaView style={[styles.safe, { backgroundColor: '#E8F5F0', alignItems: 'center', justifyContent: 'center' }]}>
          <Text style={{ fontSize: 22, fontWeight: '700', color: DARK_GREEN, marginBottom: 40 }}>
            Breathing Exercise
          </Text>
          <Animated.View style={[styles.breathOuter, { transform: [{ scale: breathScale }] }]}>
            <View style={styles.breathInner}>
              <Text style={{ fontSize: 36 }}>🌬️</Text>
              <Text style={{ fontSize: 14, color: DARK_GREEN, fontWeight: '600', marginTop: 8 }}>
                {breathLabel}
              </Text>
            </View>
          </Animated.View>
          <Text style={{ fontSize: 13, color: '#888', marginTop: 40 }}>
            4s in · 2s hold · 4s out
          </Text>
          <TouchableOpacity
            style={styles.doneBtn}
            onPress={() => setShowBreathing(false)}
          >
            <Text style={styles.doneBtnText}>Done</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },

  topBar: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingHorizontal: 20,
    paddingTop: 8, paddingBottom: 10,
  },
  topBarIcon: { fontSize: 24, color: '#333' ,paddingTop: 35},

  // Reusable image container with relative positioning
  imgContainer: {
    alignSelf: 'center',
    marginHorizontal: 4,
    marginBottom: 13,
    borderRadius: 4,
    overflow: 'hidden',
    position: 'relative',
  },
  fullImg: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  // Invisible tap overlay
  tapZone: {
    position: 'absolute',
  },

  sectionRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingHorizontal: 10,
    marginBottom: 10, marginTop: 4,
  },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1A1A1A' },
  viewAll: { fontSize: 13, color: MED_GREEN, fontWeight: '600' },

  // Bottom nav
  bottomNavWrap: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    height: 72,
  },
  bottomNavImg: {
    width: '100%',
    height: '100%',
  },

  // Session list
  sessionListCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: WHITE, borderRadius: 16,
    marginHorizontal: 16, marginBottom: 10, padding: 14,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 2,
  },
  sessionListIcon: {
    width: 52, height: 52, borderRadius: 26,
    alignItems: 'center', justifyContent: 'center',
  },
  sessionListTitle: { fontSize: 15, fontWeight: '700', color: '#1A1A1A' },
  sessionListMeta: { fontSize: 12, color: '#888', marginTop: 2 },

  // Timer
  timerCard: {
    backgroundColor: DARK_GREEN, borderRadius: 16,
    marginHorizontal: 16, marginTop: 16,
    padding: 24, alignItems: 'center',
  },
  timerLabel: { fontSize: 14, color: 'rgba(255,255,255,0.75)', marginBottom: 8 },
  timerTime: { fontSize: 56, fontWeight: '200', color: WHITE, letterSpacing: -2 },
  timerStopBtn: {
    backgroundColor: WHITE, borderRadius: 20,
    paddingHorizontal: 28, paddingVertical: 10, marginTop: 16,
  },
  timerStopText: { fontWeight: '700', color: DARK_GREEN, fontSize: 14 },

  // Session circle in player
  sessionCircle: {
    width: 200, height: 200, borderRadius: 100,
    alignItems: 'center', justifyContent: 'center', marginTop: 16,
  },

  // Breathing
  breathOuter: {
    width: 200, height: 200, borderRadius: 100,
    backgroundColor: 'rgba(46,125,96,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  breathInner: {
    width: 150, height: 150, borderRadius: 75,
    backgroundColor: 'rgba(46,125,96,0.25)',
    alignItems: 'center', justifyContent: 'center',
  },
  doneBtn: {
    backgroundColor: DARK_GREEN, borderRadius: 24,
    paddingHorizontal: 40, paddingVertical: 14, marginTop: 40,
  },
  doneBtnText: { color: WHITE, fontWeight: '700', fontSize: 15 },

  // Profile
  profileCard: {
    backgroundColor: WHITE, borderRadius: 16,
    padding: 24, alignItems: 'center', marginBottom: 20,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 2,
  },
  profileAvatar: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: LIGHT_GREEN,
    alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  profileName: { fontSize: 18, fontWeight: '700', color: '#1A1A1A' },
  profileStreak: { fontSize: 13, color: '#888', marginTop: 4 },
  profileRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: WHITE, borderRadius: 12,
    padding: 14, marginBottom: 8, gap: 14,
    shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 3, elevation: 1,
  },
  profileRowLabel: { flex: 1, fontSize: 15, fontWeight: '500', color: '#1A1A1A' },
});