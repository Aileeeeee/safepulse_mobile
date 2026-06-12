import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, SafeAreaView, Vibration,
  Pressable,
} from 'react-native';
import { router } from 'expo-router';
import * as Location from 'expo-location';

const HOURLY = [
  { time: 'Now',   temp: 27, icon: '⛅', wind: '7.7' },
  { time: '08:00', temp: 27, icon: '⛅', wind: '9.3' },
  { time: '09:00', temp: 28, icon: '🌤️', wind: '9.3' },
  { time: '10:00', temp: 29, icon: '🌧️', wind: '11.1' },
  { time: '11:00', temp: 28, icon: '🌧️', wind: '11.1' },
  { time: '12:00', temp: 29, icon: '🌧️', wind: '13.0' },
  { time: '13:00', temp: 31, icon: '⛅', wind: '13.0' },
];

const FORECAST = [
  { day: 'Today',    icon: '🌧️', low: 24, high: 31 },
  { day: 'Tomorrow', icon: '🌧️', low: 23, high: 31 },
  { day: 'Sat',      icon: '🌧️', low: 23, high: 29 },
  { day: 'Sun',      icon: '⛅', low: 24, high: 32 },
  { day: 'Mon',      icon: '☀️', low: 25, high: 33 },
];

export default function WeatherDisguiseScreen() {
  const [city, setCity] = useState('Lagos');
  const [area, setArea] = useState('Apapa');
  const longPressTimer = useRef<any>(null);
  const pressStart = useRef(0);

  useEffect(() => {
    const getCity = async () => {
      try {
        const { status } = await Location.getForegroundPermissionsAsync();
        if (status !== 'granted') return;
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Low,
        });
        const geo = await Location.reverseGeocodeAsync({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });
        if (geo.length > 0) {
          setArea(geo[0].district || geo[0].subregion || geo[0].city || 'Lagos');
          setCity(geo[0].city || geo[0].region || 'Lagos');
        }
      } catch {}
    };
    getCity();
  }, []);

  // Secret: long press temperature for 2 seconds
  const handleTempPressIn = () => {
    pressStart.current = Date.now();
    longPressTimer.current = setTimeout(() => {
      Vibration.vibrate([0, 60, 60, 60]);
      router.replace('/(main)/home');
    }, 2000);
  };

  const handleTempPressOut = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView>
        {/* Top bar */}
        <View style={styles.topBar}>
          <Text style={styles.cityName}>{area}</Text>
          <View style={styles.topIcons}>
            <Text style={styles.topIcon}>+</Text>
            <Text style={[styles.topIcon, { marginLeft: 16 }]}>⬡</Text>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero temperature — long press to unlock */}
        <Pressable
          onPressIn={handleTempPressIn}
          onPressOut={handleTempPressOut}
          style={styles.heroSection}
        >
          <Text style={styles.tempText}>27°</Text>
          <Text style={styles.conditionText}>Cloudy  31°/24°</Text>
          <View style={styles.aqiBadge}>
            <Text style={styles.aqiText}>🍃 AQI 49</Text>
          </View>
        </Pressable>

        {/* 5-day forecast card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardHeaderIcon}>📅</Text>
            <Text style={styles.cardHeaderTitle}>5-day forecast</Text>
            <Text style={styles.cardHeaderMore}>More details ›</Text>
          </View>
          {FORECAST.map((f, i) => (
            <View key={i} style={[styles.forecastRow, i < FORECAST.length - 1 && styles.forecastRowBorder]}>
              <Text style={styles.forecastDay}>{f.day}</Text>
              <Text style={styles.forecastIcon}>{f.icon}</Text>
              <Text style={styles.forecastLow}>{f.low}°</Text>
              <View style={styles.tempBar}>
                <View style={styles.tempBarFill} />
              </View>
              <Text style={styles.forecastHigh}>{f.high}°</Text>
            </View>
          ))}
          <View style={styles.forecastFooter}>
            <Text style={styles.forecastFooterText}>5-day forecast</Text>
          </View>
        </View>

        {/* 24-hour forecast */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>24-hour forecast</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hourlyScroll}>
            {HOURLY.map((h, i) => (
              <View key={i} style={styles.hourlyItem}>
                <Text style={styles.hourlyTemp}>{h.temp}°</Text>
                <Text style={styles.hourlyIcon}>{h.icon}</Text>
                <Text style={styles.hourlyWind}>{h.wind}km/h</Text>
                <Text style={styles.hourlyTime}>{h.time}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Stats grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>UV</Text>
            <Text style={styles.statValue}>Weak</Text>
            <Text style={styles.statBig}>1</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Humidity</Text>
            <Text style={styles.statValue}>90%</Text>
            <Text style={styles.statBig}>💧</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Real feel</Text>
            <Text style={styles.statValue}>33°</Text>
            <Text style={styles.statBig}>🌡️</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Wind</Text>
            <Text style={styles.statValue}>7.7</Text>
            <Text style={styles.statBig}>km/h</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Sunset</Text>
            <Text style={styles.statValue}>18:59</Text>
            <Text style={styles.statBig}>🌅</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Pressure</Text>
            <Text style={styles.statValue}>1013</Text>
            <Text style={styles.statBig}>mbar</Text>
          </View>
        </View>

        {/* AQI card */}
        <View style={[styles.card, { marginBottom: 40 }]}>
          <View style={styles.aqiRow}>
            <Text style={styles.aqiLabel}>🍃 AQI 49</Text>
            <Text style={styles.aqiMore}>Full air quality forecast ›</Text>
          </View>
        </View>

        <Text style={styles.attribution}>Data provided in part by AccuWeather</Text>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#5B8EC9',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
  },
  cityName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
  },
  topIcons: { flexDirection: 'row', alignItems: 'center' },
  topIcon: { fontSize: 22, color: '#fff', fontWeight: '300' },

  heroSection: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 32,
  },
  tempText: {
    fontSize: 96,
    fontWeight: '200',
    color: '#fff',
    letterSpacing: -4,
    lineHeight: 100,
  },
  conditionText: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 4,
  },
  aqiBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  aqiText: { color: '#fff', fontSize: 13, fontWeight: '500' },

  card: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    marginHorizontal: 12,
    marginBottom: 12,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 6,
  },
  cardHeaderIcon: { fontSize: 16 },
  cardHeaderTitle: { fontSize: 14, color: 'rgba(255,255,255,0.8)', flex: 1 },
  cardHeaderMore: { fontSize: 12, color: 'rgba(255,255,255,0.6)' },
  cardTitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 12,
  },

  forecastRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 8,
  },
  forecastRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  forecastDay: { width: 80, fontSize: 15, color: '#fff', fontWeight: '500' },
  forecastIcon: { fontSize: 20, width: 28 },
  forecastLow: { fontSize: 14, color: 'rgba(255,255,255,0.7)', width: 30 },
  tempBar: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  tempBarFill: {
    width: '70%',
    height: 6,
    backgroundColor: '#F5A623',
    borderRadius: 3,
  },
  forecastHigh: { fontSize: 14, color: '#fff', fontWeight: '600', width: 30, textAlign: 'right' },
  forecastFooter: {
    marginTop: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  forecastFooterText: { color: 'rgba(255,255,255,0.7)', fontSize: 13 },

  hourlyScroll: { marginTop: 4 },
  hourlyItem: {
    alignItems: 'center',
    marginRight: 20,
    gap: 4,
  },
  hourlyTemp: { fontSize: 16, fontWeight: '600', color: '#fff' },
  hourlyIcon: { fontSize: 22 },
  hourlyWind: { fontSize: 11, color: 'rgba(255,255,255,0.7)' },
  hourlyTime: { fontSize: 12, color: 'rgba(255,255,255,0.7)' },

  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    gap: 10,
    marginBottom: 12,
  },
  statCard: {
    width: '47%',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    padding: 16,
    gap: 4,
  },
  statLabel: { fontSize: 12, color: 'rgba(255,255,255,0.7)' },
  statValue: { fontSize: 22, fontWeight: '700', color: '#fff' },
  statBig: { fontSize: 28, color: 'rgba(255,255,255,0.5)' },

  aqiRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  aqiLabel: { fontSize: 15, color: '#fff', fontWeight: '500' },
  aqiMore: { fontSize: 12, color: 'rgba(255,255,255,0.7)' },

  attribution: {
    textAlign: 'center',
    fontSize: 11,
    color: 'rgba(255,255,255,0.4)',
    marginBottom: 30,
    marginTop: -20,
  },
});