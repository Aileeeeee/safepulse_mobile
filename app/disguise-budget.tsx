import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  SafeAreaView, ScrollView, Vibration,
} from 'react-native';
import { router } from 'expo-router';

const SECRET_SEQUENCE = ['food', 'food', 'transport', 'savings'];

const CATEGORIES = [
  { id: 'food', label: 'Food & Dining', emoji: '🍔', spent: 24500, budget: 30000, color: '#FF6B6B' },
  { id: 'transport', label: 'Transport', emoji: '🚌', spent: 8200, budget: 10000, color: '#4ECDC4' },
  { id: 'shopping', label: 'Shopping', emoji: '🛍️', spent: 15800, budget: 20000, color: '#45B7D1' },
  { id: 'savings', label: 'Savings', emoji: '💰', spent: 10000, budget: 10000, color: '#2E7D60' },
  { id: 'bills', label: 'Bills', emoji: '💡', spent: 12000, budget: 15000, color: '#F7DC6F' },
];

export default function BudgetDisguiseScreen() {
  const [tapped, setTapped] = useState<string[]>([]);

  const handleCategoryPress = (id: string) => {
    const next = [...tapped, id].slice(-4);
    setTapped(next);
    if (JSON.stringify(next) === JSON.stringify(SECRET_SEQUENCE)) {
      Vibration.vibrate([0, 60, 60, 60]);
      router.replace('/(main)/home');
    }
  };

  const totalSpent = CATEGORIES.reduce((s, c) => s + c.spent, 0);
  const totalBudget = CATEGORIES.reduce((s, c) => s + c.budget, 0);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.month}>May 2026</Text>
          <Text style={styles.title}>Budget Tracker</Text>
        </View>

        {/* Summary card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View>
              <Text style={styles.summaryLabel}>Total Spent</Text>
              <Text style={styles.summaryAmount}>₦{totalSpent.toLocaleString()}</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View>
              <Text style={styles.summaryLabel}>Budget Left</Text>
              <Text style={[styles.summaryAmount, { color: '#2E7D60' }]}>
                ₦{(totalBudget - totalSpent).toLocaleString()}
              </Text>
            </View>
          </View>
          {/* Progress bar */}
          <View style={styles.totalBar}>
            <View style={[styles.totalBarFill, { width: `${(totalSpent / totalBudget) * 100}%` }]} />
          </View>
          <Text style={styles.totalBarLabel}>{Math.round((totalSpent / totalBudget) * 100)}% of monthly budget used</Text>
        </View>

        {/* Category list */}
        <Text style={styles.sectionTitle}>Categories</Text>
        {CATEGORIES.map((cat) => {
          const pct = Math.min((cat.spent / cat.budget) * 100, 100);
          return (
            <TouchableOpacity
              key={cat.id}
              style={styles.catCard}
              onPress={() => handleCategoryPress(cat.id)}
              activeOpacity={0.85}
            >
              <View style={[styles.catIcon, { backgroundColor: cat.color + '22' }]}>
                <Text style={styles.catEmoji}>{cat.emoji}</Text>
              </View>
              <View style={styles.catBody}>
                <View style={styles.catRow}>
                  <Text style={styles.catLabel}>{cat.label}</Text>
                  <Text style={styles.catAmount}>₦{cat.spent.toLocaleString()}</Text>
                </View>
                <View style={styles.catBar}>
                  <View style={[styles.catBarFill, { width: `${pct}%`, backgroundColor: cat.color }]} />
                </View>
                <Text style={styles.catSub}>₦{cat.budget.toLocaleString()} budget</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <Text style={styles.hint}>Tap: Food → Food → Transport → Savings to exit stealth</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F7F5' },
  header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 8 },
  month: { fontSize: 13, color: '#888', fontWeight: '500' },
  title: { fontSize: 26, fontWeight: '700', color: '#1A2E25' },
  summaryCard: {
    backgroundColor: '#1A5C45', borderRadius: 20,
    margin: 20, padding: 20, gap: 12,
  },
  summaryRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  summaryLabel: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 4 },
  summaryAmount: { fontSize: 22, fontWeight: '700', color: '#fff' },
  summaryDivider: { width: 1, height: 40, backgroundColor: 'rgba(255,255,255,0.2)' },
  totalBar: { height: 8, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 4, overflow: 'hidden' },
  totalBarFill: { height: 8, backgroundColor: '#4CAF82', borderRadius: 4 },
  totalBarLabel: { fontSize: 11, color: 'rgba(255,255,255,0.6)', textAlign: 'center' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1A2E25', paddingHorizontal: 20, marginBottom: 8 },
  catCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#fff', borderRadius: 16,
    marginHorizontal: 20, marginBottom: 10, padding: 14,
  },
  catIcon: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center' },
  catEmoji: { fontSize: 22 },
  catBody: { flex: 1, gap: 4 },
  catRow: { flexDirection: 'row', justifyContent: 'space-between' },
  catLabel: { fontSize: 14, fontWeight: '600', color: '#1A2E25' },
  catAmount: { fontSize: 14, fontWeight: '700', color: '#1A2E25' },
  catBar: { height: 5, backgroundColor: '#f0f0f0', borderRadius: 3, overflow: 'hidden' },
  catBarFill: { height: 5, borderRadius: 3 },
  catSub: { fontSize: 11, color: '#999' },
  hint: { textAlign: 'center', fontSize: 10, color: 'rgba(0,0,0,0.15)', paddingBottom: 12 },
});
