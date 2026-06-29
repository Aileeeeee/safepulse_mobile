react:Report Screen:app/report.tsx
import React, { useState, useEffect } from 'react';
import {
  View, Text, Image, StyleSheet, TouchableOpacity,
  SafeAreaView, ScrollView, Alert, TextInput,
  Modal, ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store'; // 👈 FIXED: Added to retrieve local device identity
import { Colors, Fonts, Spacing, Radius } from '../constants/theme';
import { submitIncident } from '../hooks/useIncidents';
import type { Incident } from '../types';

const INCIDENTS = [
  { id: 'violence_assault',    title: 'Violence/\nAssault',      subtitle: 'Someone is hurt',                  image: require('../assets/images/incident-violence.png') },
  { id: 'harassment',          title: 'Harassment',              subtitle: 'Someone is abused or intimidated', image: require('../assets/images/incident-harassment.png') },
  { id: 'domestic_conflict',   title: 'Domestic\nConflict',      subtitle: 'Unsafe situation at home',         image: require('../assets/images/incident-domestic.png') },
  { id: 'child_endangerment',  title: 'Child\nEndangerment',     subtitle: 'Child at risk or danger',          image: require('../assets/images/incident-child.png') },
  { id: 'other',               title: 'Other',                   subtitle: 'Something else you want to report',image: require('../assets/images/incident-other.png') },
];


// ── Follow up questions per incident type ────────────────────────────────

interface Question {
  id: string;
  label: string;
  type: 'options' | 'text' | 'number';
  options?: string[];
  required?: boolean;
}

const FOLLOW_UP_QUESTIONS: Record<string, Question[]> = {
  violence_assault: [
    { id: 'still_in_danger',     label: 'Is the victim still in danger?',        type: 'options', options: ['Yes', 'No', 'Not sure'] },
    { id: 'perpetrator_present', label: 'Is the perpetrator still present?',     type: 'options', options: ['Yes', 'No', 'Not sure'] },
    { id: 'people_involved',     label: 'Approximate number of people involved', type: 'number' },
    { id: 'details',             label: 'Any additional details',                type: 'text' },
  ],
  harassment: [
    { id: 'still_ongoing',  label: 'Is this still ongoing right now?',    type: 'options', options: ['Yes', 'No'] },
    { id: 'location_type',  label: 'Where is this happening?',            type: 'options', options: ['Public', 'Home', 'Workplace', 'Online'] },
    { id: 'details',        label: 'Any additional details',              type: 'text' },
  ],
  
  domestic_conflict: [
    { id: 'physically_hurt',  label: 'Is anyone physically hurt?',         type: 'options', options: ['Yes', 'No', 'Not sure'] },
    { id: 'children_present', label: 'Are children present?',               type: 'options', options: ['Yes', 'No'] },
    { id: 'can_leave',        label: 'Is the door accessible to leave?',   type: 'options', options: ['Yes', 'No'] },
    { id: 'details',          label: 'Any additional details',             type: 'text' },
  ],
  child_endangerment: [
    { id: 'child_age',      label: 'Approximate age of child',         type: 'number' },
    { id: 'with_adult',     label: 'Is the child with an adult?',      type: 'options', options: ['Yes', 'No'] },
    { id: 'child_hurt',     label: 'Is the child physically hurt?',    type: 'options', options: ['Yes', 'No', 'Not sure'] },
    { id: 'details',        label: 'Any additional details',           type: 'text' },
  ],
  
};

// ── Build notes string from answers ─────────────────────────────────────

function buildNotes(
  incidentTitle: string,
  answers: Record<string, string>,
  description?: string,
  victimAge?: string,
  victimGender?: string,
  relationship?: string,
): string {
  const lines: string[] = [`Incident: ${incidentTitle}`];

  Object.entries(answers).forEach(([key, value]) => {
    if (!value) return;
    const label = key.replace(/_/g, ' ');
    lines.push(`${label}: ${value}`);
  });

  if (description) lines.push(`Description: ${description}`);
  if (victimAge) lines.push(`Victim age: ${victimAge}`);
  if (victimGender) lines.push(`Victim gender: ${victimGender}`);
  if (relationship) lines.push(`Reporter relationship: ${relationship}`);

  return lines.join('\n');
}

// ── Main component ───────────────────────────────────────────────────────

export default function ReportScreen() {
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [showOtherModal, setShowOtherModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deviceHash, setDeviceHash] = useState<string>(''); // 👈 FIXED: Track local device identity state

  // Follow up answers
  const [answers, setAnswers] = useState<Record<string, string>>({});

  // Other modal fields
  const [description, setDescription] = useState('');
  const [victimAge, setVictimAge] = useState('');
  const [victimGender, setVictimGender] = useState('');
  const [relationship, setRelationship] = useState('');
  const [showReporterTypeModal, setShowReporterTypeModal] = useState(false);
  const [reporterType, setReporterType] = useState<'victim' | 'bystander' | null>(null);

  // ── Retrieve Saved Device Hash ──────────────────────────────────────────
  useEffect(() => {
    async function loadDeviceCredentials() {
      try {
        const storedHash = await SecureStore.getItemAsync('device_hash');
        if (storedHash) {
          setDeviceHash(storedHash);
        }
      } catch (err) {
        console.warn('Failed to resolve stored device credentials:', err);
      }
    }
    loadDeviceCredentials();
  }, []);

  const handleSelect = (incident: Incident) => {
    setSelectedIncident(incident);
    setAnswers({});
    setReporterType(null);

    if (incident.id === 'other') {
      setDescription('');
      setVictimAge('');
      setVictimGender('');
      setRelationship('');
      setShowReporterTypeModal(true);
    } else {
      setShowReporterTypeModal(true);
    }
  };

  const handleReporterTypeSelected = (type: 'victim' | 'bystander') => {
    setReporterType(type);
    setShowReporterTypeModal(false);

    if (selectedIncident?.id === 'other') {
      setShowOtherModal(true);
    } else {
      setShowFollowUp(true);
    }
  };

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmitFollowUp = async () => {
    setLoading(true);

    const notes = buildNotes(
      selectedIncident?.title.replace('\n', ' ') || '',
      answers,
    );

    // FIXED: Now passes device_hash down so Django view knows who is reporting
    await submitIncident({
      incident_id:   selectedIncident?.id || 'other',
      notes,
      severity: answers.still_in_danger === 'Yes' ||
                answers.still_active === 'Yes' ||
                answers.still_ongoing === 'Yes'
        ? 'Critical' : 'High',
      reporter_type: reporterType || 'bystander',
      device_hash:   deviceHash || undefined, // 👈 FIXED: Injected device_hash payload parameters
    });

    setLoading(false);
    setShowFollowUp(false);
    router.push({
      pathname: '/report-sent',
      params: { title: selectedIncident?.title.replace('\n', ' ') },
    });
  };

  const handleSubmitOther = async () => {
    if (!description.trim()) {
      Alert.alert('Description required', 'Please describe what you noticed.');
      return;
    }

    setLoading(true);

    const notes = buildNotes(
      'Other',
      { reporter_type: reporterType || 'unknown' },
      description.trim(),
      victimAge,
      victimGender,
      relationship,
    );

    // FIXED: Now passes device_hash down so Django view knows who is reporting
    await submitIncident({
      incident_id:               'other',
      notes,
      severity:                  'Medium',
      reporter_type:             reporterType || 'bystander',
      victim_age:                victimAge ? parseInt(victimAge) : undefined,
      victim_gender:             victimGender || 'Unknown',
      perpetrator_relationship:  relationship || 'Unknown',
      device_hash:               deviceHash || undefined, // 👈 FIXED: Injected device_hash payload parameters
    });

    setLoading(false);
    setShowOtherModal(false);
    setDescription('');
    setVictimAge('');
    setVictimGender('');
    setRelationship('');

    router.push({
      pathname: '/report-sent',
      params: { title: 'Other' },
    });
  };

  const questions = selectedIncident
    ? FOLLOW_UP_QUESTIONS[selectedIncident.id] || []
    : [];

  const pairs: Incident[][] = [];
  for (let i = 0; i < INCIDENTS.length; i += 2) {
    pairs.push(INCIDENTS.slice(i, i + 2));
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>Report Something</Text>
          <Text style={styles.sub}>What did you notice?</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      >
        {pairs.map((pair, i) => (
          <View key={i} style={styles.row}>
            {pair.map((inc) => (
              <TouchableOpacity
                key={inc.id}
                style={styles.card}
                onPress={() => handleSelect(inc)}
                activeOpacity={0.78}
              >
                <Image
                  source={inc.image}
                  style={styles.cardImage}
                  resizeMode="cover"
                />
                <Text style={styles.cardTitle}>{inc.title}</Text>
                <Text style={styles.cardSub}>{inc.subtitle}</Text>
              </TouchableOpacity>
            ))}
            {pair.length === 1 && <View style={{ flex: 1 }} />}
          </View>
        ))}
      </ScrollView>

      {/* ── REPORTER TYPE MODAL ── */}
      <Modal visible={showReporterTypeModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.reporterCard}>

            <Text style={styles.reporterTitle}>Before you report</Text>
            <Text style={styles.reporterSub}>
              This helps us understand the situation better
            </Text>

            {/* Victim option */}
            <TouchableOpacity
              style={styles.reporterOption}
              onPress={() => handleReporterTypeSelected('victim')}
              activeOpacity={0.85}
            >
              <View style={[styles.reporterIconWrap, { backgroundColor: '#FFE8E8' }]}>
                <Text style={styles.reporterEmoji}>🙋</Text>
              </View>
              <View style={styles.reporterOptionText}>
                <Text style={styles.reporterOptionTitle}>I am the victim</Text>
                <Text style={styles.reporterOptionSub}>
                  This is happening to me right now
                </Text>
              </View>
              <Text style={styles.reporterChevron}>›</Text>
            </TouchableOpacity>

            {/* Bystander option */}
            <TouchableOpacity
              style={styles.reporterOption}
              onPress={() => handleReporterTypeSelected('bystander')}
              activeOpacity={0.85}
            >
              <View style={[styles.reporterIconWrap, { backgroundColor: '#E8F5F0' }]}>
                <Text style={styles.reporterEmoji}>👁️</Text>
              </View>
              <View style={styles.reporterOptionText}>
                <Text style={styles.reporterOptionTitle}>I am a bystander</Text>
                <Text style={styles.reporterOptionSub}>
                  I witnessed this happening to someone else
                </Text>
              </View>
              <Text style={styles.reporterChevron}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.reporterCancelBtn}
              onPress={() => setShowReporterTypeModal(false)}
            >
              <Text style={styles.reporterCancelText}>Cancel</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

      {/* ── FOLLOW UP QUESTIONS MODAL ── */}
      <Modal visible={showFollowUp} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>

            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setShowFollowUp(false)}
            >
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>

            <Text style={styles.modalTitle}>
              {selectedIncident?.title.replace('\n', ' ')}
            </Text>
            <Text style={styles.modalSub}>
              Help responders understand what happened
            </Text>

            <ScrollView
              showsVerticalScrollIndicator={false}
              style={styles.questionsScroll}
            >
              {questions.map((q) => (
                <View key={q.id} style={styles.questionBlock}>
                  <Text style={styles.questionLabel}>{q.label}</Text>

                  {/* Options */}
                  {q.type === 'options' && q.options && (
                    <View style={styles.optionsRow}>
                      {q.options.map((opt) => (
                        <TouchableOpacity
                          key={opt}
                          style={[
                            styles.optionBtn,
                            answers[q.id] === opt && styles.optionBtnSelected,
                          ]}
                          onPress={() => handleAnswer(q.id, opt)}
                        >
                          <Text style={[
                            styles.optionBtnText,
                            answers[q.id] === opt && styles.optionBtnTextSelected,
                          ]}>
                            {opt}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}

                  {/* Number */}
                  {q.type === 'number' && (
                    <TextInput
                      style={styles.textInput}
                      placeholder="Enter number..."
                      placeholderTextColor={Colors.textMuted}
                      keyboardType="number-pad"
                      value={answers[q.id] || ''}
                      onChangeText={(v) => handleAnswer(q.id, v)}
                      maxLength={3}
                    />
                  )}

                  {/* Text */}
                  {q.type === 'text' && (
                    <TextInput
                      style={[styles.textInput, styles.textArea]}
                      placeholder="Type here..."
                      placeholderTextColor={Colors.textMuted}
                      value={answers[q.id] || ''}
                      onChangeText={(v) => handleAnswer(q.id, v)}
                      multiline
                      numberOfLines={3}
                      textAlignVertical="top"
                    />
                  )}
                </View>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.submitBtn}
              onPress={handleSubmitFollowUp}
              activeOpacity={0.82}
              disabled={loading}
            >
              {loading
                ? <ActivityIndicator color={Colors.textLight} />
                : <Text style={styles.submitBtnText}>Submit Report</Text>
              }
            </TouchableOpacity>

            <View style={styles.anonRow}>
              <Text style={styles.anonIcon}>🔒</Text>
              <Text style={styles.anonText}>
                Your report is anonymous and protected
              </Text>
            </View>

          </View>
        </View>
      </Modal>

      {/* ── OTHER MODAL ── */}
      <Modal visible={showOtherModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>

            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setShowOtherModal(false)}
            >
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Report Details</Text>
            <Text style={styles.modalSub}>
              Help us understand what happened
            </Text>

            <ScrollView
              showsVerticalScrollIndicator={false}
              style={styles.questionsScroll}
            >
              {/* Description — required */}
              <View style={styles.questionBlock}>
                <Text style={styles.questionLabel}>
                  Description <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  placeholder="Describe in detail what you noticed. Include location, number of people involved, and any other relevant details..."
                  placeholderTextColor={Colors.textMuted}
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={5}
                  textAlignVertical="top"
                />
                <Text style={styles.charCount}>
                  {description.length} characters
                </Text>
              </View>

              {/* Optional section label */}
              <Text style={styles.optionalSectionLabel}>
                Optional details (helps responders)
              </Text>

              {/* Victim age */}
              <View style={styles.questionBlock}>
                <Text style={styles.questionLabel}>Victim age</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. 25"
                  placeholderTextColor={Colors.textMuted}
                  value={victimAge}
                  onChangeText={setVictimAge}
                  keyboardType="number-pad"
                  maxLength={3}
                />
              </View>

              {/* Victim gender */}
              <View style={styles.questionBlock}>
                <Text style={styles.questionLabel}>Victim gender</Text>
                <View style={styles.optionsRow}>
                  {['Male', 'Female', 'Unknown'].map((g) => (
                    <TouchableOpacity
                      key={g}
                      style={[
                        styles.optionBtn,
                        victimGender === g && styles.optionBtnSelected,
                      ]}
                      onPress={() => setVictimGender(g)}
                    >
                      <Text style={[
                        styles.optionBtnText,
                        victimGender === g && styles.optionBtnTextSelected,
                      ]}>
                        {g}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Relationship */}
              <View style={styles.questionBlock}>
                <Text style={styles.questionLabel}>
                  Your relationship to victim
                </Text>
                <View style={styles.optionsRow}>
                  {['Stranger', 'Family', 'Neighbour', 'Other'].map((r) => (
                    <TouchableOpacity
                      key={r}
                      style={[
                        styles.optionBtn,
                        relationship === r && styles.optionBtnSelected,
                      ]}
                      onPress={() => setRelationship(r)}
                    >
                      <Text style={[
                        styles.optionBtnText,
                        relationship === r && styles.optionBtnTextSelected,
                      ]}>
                        {r}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

            </ScrollView>

            <TouchableOpacity
              style={[
                styles.submitBtn,
                !description.trim() && styles.submitBtnDisabled,
              ]}
              onPress={handleSubmitOther}
              activeOpacity={0.82}
              disabled={loading || !description.trim()}
            >
              {loading
                ? <ActivityIndicator color={Colors.textLight} />
                : <Text style={styles.submitBtnText}>Submit Report</Text>
              }
            </TouchableOpacity>

            <View style={styles.anonRow}>
              <Text style={styles.anonIcon}>🔒</Text>
              <Text style={styles.anonText}>
                Your report is anonymous and protected
              </Text>
            </View>

          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bgMain },
  header: {
    flexDirection: 'row', alignItems: 'flex-start',
    paddingHorizontal: Spacing.lg, paddingTop: 50,
    paddingBottom: Spacing.md, gap: Spacing.md,
  },
  back: { fontSize: 22, color: Colors.textDark, fontWeight: '600', marginTop: 2 },
  title: { fontFamily: Fonts.boldItalic, fontSize: 20, color: Colors.textDark },
  sub: { fontSize: 13, color: Colors.textMuted, marginTop: 2 },
  grid: { paddingHorizontal: Spacing.lg, paddingBottom: 40, gap: Spacing.md },
  row: { flexDirection: 'row', gap: Spacing.md },
  card: {
    flex: 1, backgroundColor: Colors.bgWhite,
    borderRadius: Radius.lg, overflow: 'hidden', minHeight: 170,
  },
  cardImage: { width: '100%', height: 100 },
  cardTitle: {
    fontFamily: Fonts.bold, fontSize: 13, color: Colors.textDark,
    textAlign: 'center', paddingHorizontal: Spacing.sm,
    paddingTop: Spacing.sm, lineHeight: 18,
  },
  cardSub: {
    fontSize: 11, color: Colors.textMuted, textAlign: 'center',
    paddingHorizontal: Spacing.sm, paddingBottom: Spacing.sm, lineHeight: 15,
  },

  // Modal
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: Colors.bgWhite,
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    padding: Spacing.xl, gap: Spacing.md,
    maxHeight: '92%',
  },
  closeBtn: {
    position: 'absolute', top: 16, right: 16,
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: Colors.bgMain,
    alignItems: 'center', justifyContent: 'center', zIndex: 10,
  },
  closeBtnText: { fontSize: 14, fontWeight: '600', color: Colors.textDark },
  modalTitle: {
    fontFamily: Fonts.bold, fontSize: 18, color: Colors.textDark,
    textAlign: 'center', marginTop: 8,
  },
  modalSub: {
    fontSize: 13, color: Colors.textMuted,
    textAlign: 'center', marginTop: -8,
  },
  questionsScroll: { maxHeight: 420 },

  // Questions
  questionBlock: { gap: 8, marginBottom: Spacing.md },
  questionLabel: {
    fontSize: 14, fontWeight: '600', color: Colors.textDark,
  },
  required: { color: '#E05050' },
  optionsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  optionBtn: {
    paddingHorizontal: 14, paddingVertical: 9,
    borderRadius: Radius.full, backgroundColor: Colors.bgMain,
    borderWidth: 1, borderColor: Colors.border,
  },
  optionBtnSelected: {
    backgroundColor: Colors.primary, borderColor: Colors.primary,
  },
  optionBtnText: {
    fontSize: 13, fontWeight: '500', color: Colors.textDark,
  },
  optionBtnTextSelected: { color: Colors.textLight },
  textInput: {
    backgroundColor: Colors.bgMain, borderRadius: Radius.md,
    padding: Spacing.md, fontSize: 14, color: Colors.textDark,
    borderWidth: 1, borderColor: Colors.border,
  },
  textArea: { minHeight: 90, lineHeight: 21 },
  charCount: {
    fontSize: 11, color: Colors.textMuted, textAlign: 'right',
  },

  // Optional section
  optionalSectionLabel: {
    fontSize: 11, fontWeight: '700', color: Colors.textMuted,
    textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4,
  },

  // Submit
  submitBtn: {
    backgroundColor: Colors.primary, borderRadius: Radius.full,
    paddingVertical: 16, alignItems: 'center', marginTop: 4,
  },
  submitBtnDisabled: { backgroundColor: Colors.textMuted },
  submitBtnText: { color: Colors.textLight, fontFamily: Fonts.bold, fontSize: 16 },

  // Anon note
  anonRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 6,
  },
  anonIcon: { fontSize: 13 },
  anonText: { fontSize: 12, color: Colors.textMuted },

  reporterCard: {
    backgroundColor: Colors.bgWhite,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: Spacing.xl,
    gap: Spacing.md,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  reporterTitle: {
    fontFamily: Fonts.bold,
    fontSize: 20,
    color: Colors.textDark,
    textAlign: 'center',
    marginTop: 8,
  },
  reporterSub: {
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: -8,
    marginBottom: 8,
  },
  reporterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.bgMain,
    borderRadius: Radius.xl,
    padding: Spacing.md,
  },
  reporterIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reporterEmoji: { fontSize: 24 },
  reporterOptionText: { flex: 1 },
  reporterOptionTitle: {
    fontFamily: Fonts.bold,
    fontSize: 15,
    color: Colors.textDark,
  },
  reporterOptionSub: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
    lineHeight: 17,
  },
  reporterChevron: {
    fontSize: 22,
    color: Colors.textMuted,
  },
  reporterCancelBtn: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  reporterCancelText: {
    fontSize: 15,
    fontFamily: Fonts.bold,
    color: Colors.textMuted,
  },
});


### What Changed?
1. **Added `expo-secure-store` Import**: To interact with the device's keychain/hardware storage safely.
2. **Setup Mount Effect (`useEffect`)**: Retrieved `device_hash` when the screen loads and placed it into a state-tracked variable (`deviceHash`).
3. **Updated API Mutation Hooks**: Injected `device_hash: deviceHash || undefined` directly into the payloads for both `handleSubmitFollowUp` and `handleSubmitOther`. 

Now, when a user creates a standard categorized report, it will securely pass the mobile terminal's hardware signature. The Django API will parse this automatically, bind the registered profile, and correctly serve the device's historical records and emergency contact tables on your Next.js backoffice dashboard detail page!
