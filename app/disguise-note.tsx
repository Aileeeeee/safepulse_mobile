import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  SafeAreaView, ScrollView, TextInput,
  Modal, Vibration,
} from 'react-native';
import { router } from 'expo-router';

const GREEN = '#2E8B6E';
const DARK_GREEN = '#1A5C45';
const BG = '#F2F2EE';
const WHITE = '#FFFFFF';

interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
  time: string;
  starred: boolean;
  iconBg: string;
  iconEmoji: string;
}

const INITIAL_NOTES: Note[] = [
  {
    id: '1', title: 'Grocery List',
    content: 'Milk, Bread, Eggs, Chicken, Fruits, Detergent...',
    date: '12 May', time: '10:30 AM', starred: false,
    iconBg: '#FDE8C8', iconEmoji: '🛒',
  },
  {
    id: '2', title: 'Meeting Notes',
    content: 'Discuss project timeline and next steps for phase 2...',
    date: '11 May', time: '09:30 AM', starred: false,
    iconBg: '#D8E8F8', iconEmoji: '📋',
  },
  {
    id: '3', title: 'Weekend Plans',
    content: 'Visit family on Saturday.\nGo hiking on Sunday morning.',
    date: '09 May', time: '08:12 AM', starred: false,
    iconBg: '#D8EEF8', iconEmoji: '🧳',
  },
];

export default function NoteDisguiseScreen() {
  const [notes, setNotes] = useState<Note[]>(INITIAL_NOTES);
  const [showEditor, setShowEditor] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [editNote, setEditNote] = useState<Note | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [isNew, setIsNew] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [menuNoteId, setMenuNoteId] = useState<string | null>(null);

  const tapCount = useRef(0);
  const tapTimer = useRef<any>(null);

  const handleTitleTap = () => {
    tapCount.current += 1;
    if (tapTimer.current) clearTimeout(tapTimer.current);
    if (tapCount.current >= 5) {
      tapCount.current = 0;
      Vibration.vibrate([0, 60, 60, 60]);
      router.replace('/(main)/home');
      return;
    }
    tapTimer.current = setTimeout(() => { tapCount.current = 0; }, 1500);
  };

  const openNew = () => {
    setEditNote(null);
    setEditTitle('');
    setEditContent('');
    setIsNew(true);
    setShowEditor(true);
  };

  const openEdit = (note: Note) => {
    setEditNote(note);
    setEditTitle(note.title);
    setEditContent(note.content);
    setIsNew(false);
    setShowEditor(true);
    setMenuNoteId(null);
  };

  const saveNote = () => {
    if (!editTitle.trim() && !editContent.trim()) {
      setShowEditor(false);
      return;
    }
    const now = new Date();
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const dateStr = `${now.getDate()} ${months[now.getMonth()]}`;
    const h = now.getHours();
    const m = String(now.getMinutes()).padStart(2, '0');
    const timeStr = `${h > 12 ? h - 12 : h}:${m} ${h >= 12 ? 'PM' : 'AM'}`;
    const icons = [
      { bg: '#FDE8C8', emoji: '📝' },
      { bg: '#D8E8F8', emoji: '💡' },
      { bg: '#E8F8D8', emoji: '✅' },
      { bg: '#F8D8E8', emoji: '⭐' },
    ];
    const icon = icons[Math.floor(Math.random() * icons.length)];

    if (isNew) {
      setNotes(prev => [{
        id: Date.now().toString(),
        title: editTitle.trim() || 'Untitled',
        content: editContent,
        date: dateStr, time: timeStr,
        starred: false,
        iconBg: icon.bg, iconEmoji: icon.emoji,
      }, ...prev]);
    } else if (editNote) {
      setNotes(prev => prev.map(n =>
        n.id === editNote.id
          ? { ...n, title: editTitle.trim() || 'Untitled', content: editContent, date: dateStr, time: timeStr }
          : n
      ));
    }
    setShowEditor(false);
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
    setMenuNoteId(null);
  };

  const toggleStar = (id: string) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, starred: !n.starred } : n));
    setMenuNoteId(null);
  };

  const filteredNotes = notes.filter(n =>
    n.title.toLowerCase().includes(searchText.toLowerCase()) ||
    n.content.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safe}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleTitleTap} activeOpacity={1}>
          <Text style={styles.headerTitle}>
            <Text style={styles.black}>Quick </Text>
            <Text style={styles.green}>Notes</Text>
          </Text>
          <Text style={styles.headerSub}>Capture thoughts. Stay organized.</Text>
        </TouchableOpacity>
        <View style={styles.headerIcons}>
          <TouchableOpacity
            style={styles.iconCircle}
            onPress={() => setShowSearch(!showSearch)}
          >
            <Text style={styles.iconEmoji}>🔍</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconCircle}>
            <Text style={styles.iconEmoji}>⚙️</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search */}
      {showSearch && (
        <View style={styles.searchBar}>
          <Text style={{ fontSize: 15, marginRight: 8 }}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search notes..."
            value={searchText}
            onChangeText={setSearchText}
            autoFocus
            placeholderTextColor="#BDBDBD"
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <Text style={{ color: '#999', fontSize: 16 }}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* New Note card */}
        <TouchableOpacity
          style={styles.newNoteCard}
          onPress={openNew}
          activeOpacity={0.88}
        >
          <View style={styles.newNoteIconWrap}>
            <Text style={styles.newNoteIconEmoji}>✏️</Text>
          </View>
          <View>
            <Text style={styles.newNoteTitle}>New Note</Text>
            <Text style={styles.newNoteSub}>Tap to create a new note</Text>
          </View>
        </TouchableOpacity>

        {/* Recent Notes heading */}
        <Text style={styles.sectionTitle}>Recent Notes</Text>

        {filteredNotes.length === 0 && (
          <View style={{ alignItems: 'center', paddingTop: 40 }}>
            <Text style={{ color: '#BDBDBD', fontSize: 15 }}>No notes found</Text>
          </View>
        )}

        {filteredNotes.map((note) => (
          <View key={note.id} style={styles.noteCard}>
            <TouchableOpacity
              style={styles.noteCardInner}
              onPress={() => openEdit(note)}
              activeOpacity={0.88}
            >
              {/* Large illustration icon */}
              <View style={[styles.noteIconWrap, { backgroundColor: note.iconBg }]}>
                <Text style={styles.noteIconEmoji}>{note.iconEmoji}</Text>
              </View>

              {/* Text content */}
              <View style={styles.noteContent}>
                <View style={styles.noteTitleRow}>
                  <Text style={styles.noteTitle} numberOfLines={1}>
                    {note.title}
                  </Text>
                  <TouchableOpacity
                    onPress={() => setMenuNoteId(menuNoteId === note.id ? null : note.id)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Text style={styles.threeDots}>•••</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.notePreview} numberOfLines={2}>
                  {note.content}
                </Text>

                <View style={styles.noteMeta}>
                  <Text style={styles.noteMetaText}>
                    📅 {note.date}  •  {note.time}
                  </Text>
                  {note.starred && (
                    <TouchableOpacity onPress={() => toggleStar(note.id)}>
                      <Text style={{ fontSize: 15 }}>⭐</Text>
                    </TouchableOpacity>
                  )}
                  {!note.starred && (
                    <TouchableOpacity onPress={() => toggleStar(note.id)}>
                      <Text style={{ fontSize: 15, color: '#CCC' }}>☆</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </TouchableOpacity>

            {/* Dropdown */}
            {menuNoteId === note.id && (
              <View style={styles.dropdown}>
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => openEdit(note)}
                >
                  <Text style={styles.dropdownText}>✏️  Edit</Text>
                </TouchableOpacity>
                <View style={styles.dropdownLine} />
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => toggleStar(note.id)}
                >
                  <Text style={styles.dropdownText}>
                    {note.starred ? '☆  Unstar' : '⭐  Star'}
                  </Text>
                </TouchableOpacity>
                <View style={styles.dropdownLine} />
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => deleteNote(note.id)}
                >
                  <Text style={[styles.dropdownText, { color: '#E05050' }]}>
                    🗑️  Delete
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={openNew} activeOpacity={0.85}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* Editor modal */}
      <Modal visible={showEditor} animationType="slide">
        <SafeAreaView style={[styles.safe, { backgroundColor: WHITE }]}>
          <View style={styles.editorHeader}>
            <TouchableOpacity onPress={saveNote}>
              <Text style={styles.editorBack}>← Done</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              if (editNote) deleteNote(editNote.id);
              setShowEditor(false);
            }}>
              <Text style={{ fontSize: 22 }}>🗑️</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.editorTitle}
            value={editTitle}
            onChangeText={setEditTitle}
            placeholder="Title"
            placeholderTextColor="#BDBDBD"
          />
          <Text style={styles.editorMeta}>
            {new Date().toLocaleDateString('en-NG', {
              weekday: 'long', day: 'numeric', month: 'long',
            })}  ·  {editContent.length} characters
          </Text>
          <TextInput
            style={styles.editorBody}
            value={editContent}
            onChangeText={setEditContent}
            placeholder="Start writing..."
            placeholderTextColor="#BDBDBD"
            multiline
            textAlignVertical="top"
            autoFocus={isNew}
          />
        </SafeAreaView>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },

  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-start', paddingHorizontal: 20,
    paddingTop: 16, paddingBottom: 8,
  },
  headerTitle: { fontSize: 30, lineHeight: 36 },
  black: { fontWeight: '800', color: '#1A1A1A' },
  green: { fontWeight: '800', color: GREEN },
  headerSub: { fontSize: 13, color: '#999', marginTop: 2 },
  headerIcons: { flexDirection: 'row', gap: 10, paddingTop: 4 },
  iconCircle: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: WHITE, alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.07,
    shadowRadius: 4, elevation: 2,
  },
  iconEmoji: { fontSize: 16 },

  searchBar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: WHITE, borderRadius: 12,
    marginHorizontal: 16, marginBottom: 8,
    paddingHorizontal: 14, paddingVertical: 11,
    shadowColor: '#000', shadowOpacity: 0.05,
    shadowRadius: 4, elevation: 2, gap: 8,
  },
  searchInput: { flex: 1, fontSize: 15, color: '#1A1A1A' },

  // New Note card
  newNoteCard: {
    flexDirection: 'row', alignItems: 'center', gap: 16,
    backgroundColor: '#E6F4EF',
    borderRadius: 16, marginHorizontal: 16,
    marginTop: 8, marginBottom: 24,
    padding: 16,
    borderWidth: 1, borderColor: '#C5E0D5',
  },
  newNoteIconWrap: {
    width: 64, height: 64, borderRadius: 14,
    backgroundColor: '#C5E0D5',
    alignItems: 'center', justifyContent: 'center',
  },
  newNoteIconEmoji: { fontSize: 30 },
  newNoteTitle: { fontSize: 18, fontWeight: '700', color: '#1A1A1A' },
  newNoteSub: { fontSize: 13, color: '#666', marginTop: 3 },

  sectionTitle: {
    fontSize: 20, fontWeight: '800', color: '#1A1A1A',
    paddingHorizontal: 16, marginBottom: 12,
  },

  // Note cards — matching design exactly
  noteCard: {
    marginHorizontal: 16, marginBottom: 12,
    backgroundColor: WHITE, borderRadius: 16,
    shadowColor: '#000', shadowOpacity: 0.05,
    shadowRadius: 6, elevation: 2,
    overflow: 'visible',
    position: 'relative',
  },
  noteCardInner: {
    flexDirection: 'row', alignItems: 'stretch',
    padding: 14, gap: 14,
  },
  noteIconWrap: {
    width: 80, height: 80, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  noteIconEmoji: { fontSize: 42 },
  noteContent: { flex: 1, justifyContent: 'space-between' },
  noteTitleRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center',
  },
  noteTitle: {
    fontSize: 17, fontWeight: '700', color: '#1A1A1A', flex: 1,
  },
  threeDots: { fontSize: 14, color: '#BDBDBD', letterSpacing: 1, paddingLeft: 8 },
  notePreview: {
    fontSize: 13, color: '#777', lineHeight: 19,
    marginTop: 4, marginBottom: 8,
  },
  noteMeta: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center',
  },
  noteMetaText: { fontSize: 12, color: '#BDBDBD' },

  dropdown: {
    position: 'absolute', right: 12, top: 44,
    backgroundColor: WHITE, borderRadius: 12,
    shadowColor: '#000', shadowOpacity: 0.15,
    shadowRadius: 12, shadowOffset: { width: 0, height: 4 },
    elevation: 10, zIndex: 100, minWidth: 160, overflow: 'hidden',
  },
  dropdownItem: { paddingVertical: 13, paddingHorizontal: 16 },
  dropdownText: { fontSize: 14, fontWeight: '500', color: '#1A1A1A' },
  dropdownLine: { height: 1, backgroundColor: '#F0F0F0' },

  fab: {
    position: 'absolute', bottom: 32, right: 20,
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: DARK_GREEN,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: DARK_GREEN, shadowOpacity: 0.45,
    shadowRadius: 12, shadowOffset: { width: 0, height: 5 },
    elevation: 10,
  },
  fabText: { fontSize: 32, color: WHITE, lineHeight: 36, fontWeight: '300' },

  editorHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: '#F0F0F0',
  },
  editorBack: { fontSize: 16, color: GREEN, fontWeight: '600' },
  editorTitle: {
    fontSize: 24, fontWeight: '700', color: '#1A1A1A',
    paddingHorizontal: 20, paddingVertical: 12,
  },
  editorMeta: {
    fontSize: 12, color: '#BDBDBD',
    paddingHorizontal: 20, marginBottom: 8,
  },
  editorBody: {
    flex: 1, fontSize: 16, color: '#333',
    paddingHorizontal: 20, lineHeight: 26,
  },
});