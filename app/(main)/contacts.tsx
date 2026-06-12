import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  Modal,
  Animated,
} from 'react-native';
import { router } from 'expo-router';
import { Colors, Fonts, Spacing, Radius } from '../../constants/theme';
import { Contact } from '../../types';
import { getOrCreateDeviceHash } from '../../hooks/useDevice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API } from '../../constants/api';

const AVATAR_COLORS = ['#E07050', '#5B8A6E', '#7A6FAC', '#D4875C', '#6CA3C8'];

type ConfirmType = 'deleted' | 'edited' | null;

export default function ContactsScreen() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Add modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newGender, setNewGender] = useState('');
  const [newRelation, setNewRelation] = useState('');

  // Dot menu
  const [menuContactId, setMenuContactId] = useState<string | null>(null);

  // Edit modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editContact, setEditContact] = useState<Contact | null>(null);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editGender, setEditGender] = useState('');
  const [editRelation, setEditRelation] = useState('');

  // Delete confirm modal
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Contact | null>(null);

  // Confirmation screen (signal-sent style)
  const [confirmType, setConfirmType] = useState<ConfirmType>(null);
  const [confirmName, setConfirmName] = useState('');
  const checkScale = useRef(new Animated.Value(0.6)).current;
  const checkOpacity = useRef(new Animated.Value(0)).current;

  // ── Load contacts from backend + AsyncStorage on mount ──
  useEffect(() => {
    const loadContacts = async () => {
      try {
        // Show cached contacts immediately
        const saved = await AsyncStorage.getItem('safepulse_contacts');
        if (saved) {
          setContacts(JSON.parse(saved));
        }

        // Then fetch fresh sync from backend
        const phone_hash = await getOrCreateDeviceHash();
        const res = await fetch(
          `${API.contacts}?phone_hash=${phone_hash}`,
          { 
            method: 'GET',
            headers: { 'Content-Type': 'application/json' } 
          }
        );

        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            const mapped: Contact[] = data.map((c: any) => ({
              id: c.id.toString(),
              backendId: c.id,
              name: c.contact_name,
              phone: c.contact_phone,
              initial: c.contact_name[0].toUpperCase(),
              color: AVATAR_COLORS[c.contact_name.charCodeAt(0) % AVATAR_COLORS.length],
              isAdded: true,
            }));
            setContacts(mapped);
            await AsyncStorage.setItem('safepulse_contacts', JSON.stringify(mapped));
          }
        }
      } catch (e) {
        console.log('Load contacts error:', e);
      } finally {
        setLoaded(true);
      }
    };
    loadContacts();
  }, []);

  // ── Handlers ──────────────────────────────────────────

  const handleAdd = async () => {
    if (!newName.trim()) return;

    // Save values before clearing state
    const savedName     = newName.trim();
    const savedPhone    = newPhone.trim();
    const savedRelation = newRelation.trim();

    const newContact: Contact = {
      id: Date.now().toString(),
      name: savedName,
      phone: savedPhone,
      initial: savedName[0].toUpperCase(),
      color: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
      isAdded: true,
    };

    // Save locally + persist to AsyncStorage
    const updated = [newContact, ...contacts];
    setContacts(updated);
    await AsyncStorage.setItem('safepulse_contacts', JSON.stringify(updated));

    // Clear form and close modal
    setNewName('');
    setNewPhone('');
    setNewGender('');
    setNewRelation('');
    setShowAddModal(false);

    // Sync to backend using saved values
    try {
      const phone_hash = await getOrCreateDeviceHash();
      const res = await fetch(API.contacts, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone_hash,
          contact_name:  savedName,
          contact_phone: savedPhone,
          relationship:  savedRelation || 'Unknown',
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setContacts((prev) => {
          const withId = prev.map((c) =>
            c.id === newContact.id ? { ...c, backendId: data.id } : c
          );
          AsyncStorage.setItem('safepulse_contacts', JSON.stringify(withId));
          return withId;
        });
      }
    } catch (e) {
      console.log('Contact sync error:', e);
    }
  };

  const openEdit = (contact: Contact) => {
    setEditContact(contact);
    setEditName(contact.name);
    setEditPhone(contact.phone);
    setEditGender('');
    setEditRelation('');
    setMenuContactId(null);
    setShowEditModal(true);
  };

  const handleEdit = () => {
    if (!editContact || !editName.trim()) return;
    const updated = contacts.map((c) =>
      c.id === editContact.id
        ? { ...c, name: editName.trim(), phone: editPhone.trim(), initial: editName.trim()[0].toUpperCase() }
        : c
    );
    setContacts(updated);
    AsyncStorage.setItem('safepulse_contacts', JSON.stringify(updated));
    
    setShowEditModal(false);
    setConfirmName(editName.trim());
    showConfirmation('edited');
  };

  const openDeleteConfirm = (contact: Contact) => {
    setDeleteTarget(contact);
    setMenuContactId(null);
    setShowDeleteConfirm(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const name = deleteTarget.name;

    // Remove locally and persist
    const updated = contacts.filter((c) => c.id !== deleteTarget.id);
    setContacts(updated);
    await AsyncStorage.setItem('safepulse_contacts', JSON.stringify(updated));
    setShowDeleteConfirm(false);
    setConfirmName(name);
    showConfirmation('deleted');

    // Then remove from backend
    try {
      const backendId = (deleteTarget as any).backendId;
      if (backendId) {
        await fetch(API.deleteContact(backendId), {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        });
      }
    } catch (e) {
      console.log('Contact delete error:', e);
    }
  };

  const showConfirmation = (type: ConfirmType) => {
    setConfirmType(type);
    checkScale.setValue(0.6);
    checkOpacity.setValue(0);
    Animated.parallel([
      Animated.spring(checkScale, { toValue: 1, damping: 12, stiffness: 120, useNativeDriver: true }),
      Animated.timing(checkOpacity, { toValue: 1, duration: 350, useNativeDriver: true }),
    ]).start();
  };

  // ── Render ─────────────────────────────────────────────

  return (
    <SafeAreaView style={styles.safe}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={{ top:10,bottom:10,left:10,right:10 }}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Trusted Contacts</Text>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
      >
        {/* Add contact button */}
        <TouchableOpacity style={styles.addBtn} onPress={() => setShowAddModal(true)} activeOpacity={0.82}>
          <Text style={styles.addPlus}>+</Text>
          <Text style={styles.addLabel}>Add Contact</Text>
        </TouchableOpacity>

        {/* Contact UI Status Handling */}
        {!loaded ? (
          <View style={{ alignItems: 'center', paddingTop: 20 }}>
            <Text style={{ color: Colors.textMuted, fontSize: 14 }}>Loading contacts...</Text>
          </View>
        ) : contacts.length === 0 ? (
          <View style={{ alignItems: 'center', paddingTop: 20 }}>
            <Text style={{ color: Colors.textMuted, fontSize: 14 }}>No contacts yet. Add one above.</Text>
          </View>
        ) : null}

        {loaded && contacts.map((c) => {
          const avatarColor = AVATAR_COLORS[c.name.charCodeAt(0) % AVATAR_COLORS.length];
          return (
            <View key={c.id} style={styles.contactRow}>
              {/* Avatar */}
              <View style={[styles.avatar, { backgroundColor: avatarColor + '30' }]}>
                <Text style={[styles.avatarText, { color: avatarColor }]}>{c.initial}</Text>
              </View>

              {/* Name + phone */}
              <View style={styles.contactInfo}>
                <Text style={styles.contactName}>{c.name}</Text>
                <Text style={styles.contactPhone}>{c.phone}</Text>
              </View>

              {/* Check */}
              <Text style={styles.checkMark}>✓</Text>

              {/* Vertical dot menu button */}
              <TouchableOpacity
                style={styles.dotBtn}
                onPress={() => setMenuContactId(menuContactId === c.id ? null : c.id)}
                hitSlop={{ top:8,bottom:8,left:8,right:8 }}
              >
                <Text style={styles.dotIcon}>⋮</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>

      {/* DOT MENU DROPDOWN */}
      <Modal
        visible={menuContactId !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuContactId(null)}
      >
        <TouchableOpacity
          style={styles.dropdownOverlay}
          activeOpacity={1}
          onPress={() => setMenuContactId(null)}
        >
          <View style={styles.dropdownMenu}>
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => {
                const contact = contacts.find(c => c.id === menuContactId);
                setMenuContactId(null);
                if (contact) openEdit(contact);
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.dropdownIcon}>✏️</Text>
              <Text style={styles.dropdownLabel}>Edit contact</Text>
            </TouchableOpacity>

            <View style={styles.dropdownDivider} />

            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => {
                const contact = contacts.find(c => c.id === menuContactId);
                setMenuContactId(null);
                if (contact) openDeleteConfirm(contact);
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.dropdownIcon}>🗑️</Text>
              <Text style={[styles.dropdownLabel, styles.dropdownDelete]}>Delete contact</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* ── ADD CONTACT MODAL ── */}
      <Modal visible={showAddModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <TouchableOpacity style={styles.closeBtn} onPress={() => setShowAddModal(false)}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Add New Contact</Text>
            <View style={styles.inputRow}>
              <Text style={styles.inputIcon}>👤</Text>
              <View style={styles.inputDivider} />
              <TextInput style={styles.input} placeholder="Name" value={newName} onChangeText={setNewName} placeholderTextColor="rgba(255,255,255,0.6)" />
            </View>
            <View style={styles.inputRow}>
              <Text style={styles.inputIcon}>📞</Text>
              <View style={styles.inputDivider} />
              <TextInput style={styles.input} placeholder="Contact number" value={newPhone} onChangeText={setNewPhone} keyboardType="phone-pad" placeholderTextColor="rgba(255,255,255,0.6)" />
            </View>
            <Text style={styles.relationLabel}>How is the person related to you ?</Text>
            <View style={styles.relationInputWrap}>
              <TextInput style={styles.relationInput} placeholder="e.g family, friends or neighbour" value={newRelation} onChangeText={setNewRelation} placeholderTextColor="rgba(255,255,255,0.6)" />
            </View>
            <TouchableOpacity style={styles.modalBtn} onPress={handleAdd} activeOpacity={0.82}>
              <Text style={styles.modalBtnText}>Add Contact</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ── EDIT CONTACT MODAL ── */}
      <Modal visible={showEditModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <TouchableOpacity style={styles.closeBtn} onPress={() => setShowEditModal(false)}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Edit Contact</Text>
            <View style={styles.inputRow}>
              <Text style={styles.inputIcon}>👤</Text>
              <View style={styles.inputDivider} />
              <TextInput style={styles.input} placeholder="Name" value={editName} onChangeText={setEditName} placeholderTextColor="rgba(255,255,255,0.6)" />
            </View>
            <View style={styles.inputRow}>
              <Text style={styles.inputIcon}>📞</Text>
              <View style={styles.inputDivider} />
              <TextInput style={styles.input} placeholder="Contact number" value={editPhone} onChangeText={setEditPhone} keyboardType="phone-pad" placeholderTextColor="rgba(255,255,255,0.6)" />
            </View>
            <Text style={styles.relationLabel}>How is the person related to you ?</Text>
            <View style={styles.relationInputWrap}>
              <TextInput style={styles.relationInput} placeholder="e.g family, friends or neighbour" value={editRelation} onChangeText={setEditRelation} placeholderTextColor="rgba(255,255,255,0.6)" />
            </View>
            <TouchableOpacity style={styles.modalBtn} onPress={handleEdit} activeOpacity={0.82}>
              <Text style={styles.modalBtnText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ── DELETE CONFIRMATION MODAL ── */}
      <Modal visible={showDeleteConfirm} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.deleteCard}>
            <View style={styles.deleteIconWrap}>
              <Text style={styles.deleteIconEmoji}>🗑️</Text>
            </View>
            <Text style={styles.deleteTitle}>Remove Contact?</Text>
            <Text style={styles.deleteSubtitle}>
              {deleteTarget?.name} will no longer receive your emergency alerts.
            </Text>
            <TouchableOpacity style={styles.deleteConfirmBtn} onPress={handleDelete} activeOpacity={0.82}>
              <Text style={styles.deleteConfirmBtnText}>Yes, Remove</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteCancelBtn} onPress={() => setShowDeleteConfirm(false)} activeOpacity={0.82}>
              <Text style={styles.deleteCancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ── ACTION CONFIRMATION SCREEN (signal-sent style) ── */}
      <Modal visible={confirmType !== null} transparent animationType="fade">
        <View style={styles.confirmScreen}>
          <Animated.View style={[styles.confirmCheckWrap, { transform: [{ scale: checkScale }], opacity: checkOpacity }]}>
            <View style={styles.confirmCheckInner}>
              <Text style={styles.confirmCheckText}>✓</Text>
              <View style={styles.confirmWave} />
            </View>
          </Animated.View>

          <Text style={styles.confirmHeading}>
            {confirmType === 'deleted' ? 'Contact Removed' : 'Contact Updated'}
          </Text>

          <Text style={styles.confirmSub}>
            {confirmType === 'deleted'
              ? `${confirmName} has been removed from your trusted contacts. They will no longer receive your alerts.`
              : `${confirmName}'s details have been updated successfully.`}
          </Text>

          <TouchableOpacity
            style={styles.confirmDismissBtn}
            onPress={() => setConfirmType(null)}
            activeOpacity={0.82}
          >
            <Text style={styles.confirmDismissText}>Done</Text>
          </TouchableOpacity>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bgMain },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, paddingTop: 48, paddingBottom: Spacing.sm,
  },
  back: { fontSize: 22, color: Colors.textDark, fontWeight: '600' },
  title: { fontFamily: Fonts.boldItalic, fontSize: 20, color: Colors.textDark },
  scroll: { flex: 1},
  scrollContent: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, paddingBottom: 100 },

  addBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.primaryPale, borderRadius: Radius.full,
    paddingVertical: Spacing.md, marginBottom: Spacing.lg, gap: Spacing.sm,
  },
  addPlus: { fontSize: 18, color: Colors.primaryMid, fontWeight: '700' },
  addLabel: { fontSize: 15, fontWeight: '600', color: Colors.primaryMid },

  // Contact row
  contactRow: {
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
    width: 42, height: 42, borderRadius: 21,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: 17, fontWeight: '600' },
  contactInfo: { flex: 1 },
  contactName: { fontSize: 15, fontWeight: '600', color: Colors.textDark },
  contactPhone: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  checkMark: { fontSize: 18, color: Colors.primaryMid, fontWeight: '700' },

  // Dot menu button
  dotBtn: {
    paddingHorizontal: 6, paddingVertical: 4,
  },
  dotIcon: {
    fontSize: 22, color: Colors.textMuted, fontWeight: '700', letterSpacing: -2,
  },

  // Dropdown
  dropdownOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  dropdownMenu: {
    position: 'absolute',
    top: 120,
    right: 20,
    backgroundColor: Colors.bgWhite,
    borderRadius: Radius.md,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 10,
    minWidth: 190,
    overflow: 'hidden',
  },
  dropdownItem: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: 14, paddingHorizontal: 16,
  },
  dropdownIcon: { fontSize: 16 },
  dropdownLabel: { fontSize: 14, fontWeight: '500', color: Colors.textDark },
  dropdownDelete: { color: '#E05050' },
  dropdownDivider: { height: 1, backgroundColor: Colors.border, marginHorizontal: 12 },

  // Shared modal overlay
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20,
  },

  // Add / Edit modal card
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

  // Delete confirm card
  deleteCard: {
    backgroundColor: Colors.bgWhite, borderRadius: 24,
    padding: 28, width: '100%', alignItems: 'center', gap: 12,
  },
  deleteIconWrap: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: '#FFE8E8', alignItems: 'center', justifyContent: 'center',
    marginBottom: 4,
  },
  deleteIconEmoji: { fontSize: 32 },
  deleteTitle: { fontFamily: Fonts.boldItalic, fontSize: 20, color: Colors.textDark },
  deleteSubtitle: {
    fontSize: 14, color: Colors.textMuted,
    textAlign: 'center', lineHeight: 21,
  },
  deleteConfirmBtn: {
    backgroundColor: '#E05050', borderRadius: Radius.full,
    paddingVertical: 16, width: '100%', alignItems: 'center', marginTop: 8,
  },
  deleteConfirmBtnText: { color: Colors.textLight, fontFamily: Fonts.bold, fontSize: 16 },
  deleteCancelBtn: {
    backgroundColor: Colors.bgMain, borderRadius: Radius.full,
    paddingVertical: 16, width: '100%', alignItems: 'center',
  },
  deleteCancelBtnText: { fontFamily: Fonts.bold, fontSize: 15, color: Colors.textMuted },

  // Action confirmation screen (signal-sent style)
  confirmScreen: {
    flex: 1, backgroundColor: Colors.bgDark,
    alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 32, gap: 20,
  },
  confirmCheckWrap: {
    width: 160, height: 160, borderRadius: 80,
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  confirmCheckInner: {
    width: 130, height: 130, borderRadius: 65,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden',
  },
  confirmCheckText: { fontSize: 56, color: Colors.primaryMid },
  confirmWave: {
    position: 'absolute', bottom: -10,
    width: 160, height: 40, borderRadius: 70,
    backgroundColor: 'rgba(46,125,96,0.18)',
  },
  confirmHeading: {
    fontFamily: Fonts.boldItalic, fontSize: 28,
    color: Colors.textLight, textAlign: 'center',
  },
  confirmSub: {
    fontSize: 15, color: 'rgba(255,255,255,0.72)',
    textAlign: 'center', lineHeight: 23,
  },
  confirmDismissBtn: {
    backgroundColor: Colors.primaryLight, borderRadius: Radius.full,
    paddingVertical: 17, paddingHorizontal: 40,
    width: '100%', alignItems: 'center', marginTop: 16,
  },
  confirmDismissText: { color: Colors.textLight, fontFamily: Fonts.bold, fontSize: 16 },
});