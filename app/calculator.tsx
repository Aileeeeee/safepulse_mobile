import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Vibration,
} from 'react-native';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');
const SIDE_PADDING = 16;
const GAP = 10;
const KEY_SIZE = (width - SIDE_PADDING * 2 - GAP * 3) / 4;

export default function CalculatorScreen() {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [secretBuffer, setSecretBuffer] = useState('');
  const [justCalculated, setJustCalculated] = useState(false);

  const handleKey = (key: string) => {
    if ('0123456789'.includes(key)) {
      const next = secretBuffer + key;
      setSecretBuffer(next.slice(-4));
    }

    if (key === '=') {
      if (secretBuffer === '911' || secretBuffer === '1337') {
        Vibration.vibrate([0, 60, 60, 60]);
        router.replace('/(main)/home');
        return;
      }
      try {
        const expr = expression + display;
        const safe = expr
          .replace(/÷/g, '/')
          .replace(/×/g, '*')
          .replace(/[^0-9+\-*/.]/g, '');
        const result = eval(safe);
        setDisplay(String(parseFloat(result.toFixed(10))));
        setExpression(expr + '=');
        setJustCalculated(true);
      } catch {
        setDisplay('Error');
      }
      return;
    }

    if (key === 'C') {
      setDisplay('0');
      setExpression('');
      setSecretBuffer('');
      setJustCalculated(false);
      return;
    }

    if (key === '+/-') {
      setDisplay((prev) => (prev.startsWith('-') ? prev.slice(1) : '-' + prev));
      return;
    }

    if (key === '%') {
      setDisplay((prev) => String(parseFloat(prev) / 100));
      return;
    }

    if (['÷', '×', '-', '+'].includes(key)) {
      setExpression(expression + display + key);
      setDisplay('0');
      setJustCalculated(false);
      return;
    }

    if (key === '.') {
      if (!display.includes('.')) setDisplay(display + '.');
      return;
    }

    if (justCalculated) {
      setDisplay(key);
      setExpression('');
      setJustCalculated(false);
    } else {
      setDisplay(display === '0' ? key : display + key);
    }
  };

  const isOp = (k: string) => ['÷', '×', '-', '+', '='].includes(k);

  const ROWS = [
    ['C', '+/-', '%', '÷'],
    ['7', '8', '9', '×'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['0', '.', '='],
  ];

  return (
    <SafeAreaView style={styles.safe}>

      {/* Top two buttons */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.topBtn}>
          <Text style={styles.topBtnIcon}>🎤</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.topBtn}>
          <Text style={styles.topBtnIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* Display */}
      <View style={styles.display}>
        {expression.length > 0 && (
          <Text style={styles.expressionText} numberOfLines={1}>
            {expression}
          </Text>
        )}
        <Text style={styles.displayText} numberOfLines={1} adjustsFontSizeToFit>
          {display}
        </Text>
      </View>

      {/* Keypad */}
      <View style={styles.keypad}>
        {ROWS.map((row, ri) => (
          <View key={ri} style={styles.keyRow}>
            {row.map((key) => {
              const isWide = key === '0';
              const isOperator = isOp(key);
              return (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.key,
                    isOperator && styles.keyOp,
                    isWide && styles.keyWide,
                  ]}
                  onPress={() => handleKey(key)}
                  onLongPress={() => {
                    if (key === '=') {
                      Vibration.vibrate([0, 60, 60, 60]);
                      router.replace('/(main)/home');
                    }
                  }}
                  delayLongPress={800}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.keyText, isOperator && styles.keyTextOp]}>
                    {key}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },

  // Top two wide buttons
  topBar: {
    flexDirection: 'row',
    paddingHorizontal: SIDE_PADDING,
    paddingTop: 45,
    gap: GAP,
  },
  topBtn: {
    flex: 1,
    height: 64,
    backgroundColor: '#d4ede4',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBtnIcon: {
    fontSize: 22,
    opacity: 0.5,
  },

  // Display area
  display: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingHorizontal: SIDE_PADDING + 8,
    paddingBottom: 16,
  },
  expressionText: {
    fontSize: 20,
    color: 'rgba(255,255,255,0.4)',
    marginBottom: 6,
  },
  displayText: {
    fontSize: 72,
    fontWeight: '300',
    color: '#ffffff',
    letterSpacing: -2,
  },

  // Keypad
  keypad: {
    paddingHorizontal: SIDE_PADDING,
    paddingBottom: 24,
    gap: GAP,
  },
  keyRow: {
    flexDirection: 'row',
    gap: GAP,
  },
  key: {
    width: KEY_SIZE,
    height: KEY_SIZE,
    borderRadius: 14,
    backgroundColor: '#d4ede4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyWide: {
    width: KEY_SIZE * 2 + GAP,
    alignItems: 'center',
    paddingLeft: 0,
  },
  keyOp: {
    backgroundColor: '#4CAF82',
  },
  keyText: {
    fontSize: 24,
    fontWeight: '400',
    color: '#1a1a1a',
  },
  keyTextOp: {
    color: '#ffffff',
    fontWeight: '500',
  },
});