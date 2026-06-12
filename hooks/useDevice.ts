import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import * as Location from 'expo-location';
import { API } from '../constants/api';

const DEVICE_HASH_KEY = 'safepulse_device_hash';
const DEVICE_ID_KEY   = 'safepulse_device_id';

export async function getOrCreateDeviceHash(): Promise<string> {
  try {
    const existing = await AsyncStorage.getItem(DEVICE_HASH_KEY);
    if (existing) return existing;

    const unique = `${Date.now()}-${Math.random()}-safepulse`;
    const hash = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      unique
    );
    await AsyncStorage.setItem(DEVICE_HASH_KEY, hash);
    return hash;
  } catch (e) {
    return 'unknown-device';
  }
}

async function getZone(): Promise<string> {
  try {
    const { status } = await Location.getForegroundPermissionsAsync();
    if (status !== 'granted') return 'Lagos';
    const loc = await Location.getCurrentPositionAsync({});
    const geo = await Location.reverseGeocodeAsync({
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
    });
    if (geo.length > 0) {
      return geo[0].city || geo[0].region || 'Lagos';
    }
    return 'Lagos';
  } catch {
    return 'Lagos';
  }
}

export async function registerDevice(): Promise<number | null> {
  try {
    const existingId = await AsyncStorage.getItem(DEVICE_ID_KEY);
    if (existingId) return parseInt(existingId);

    const phone_hash = await getOrCreateDeviceHash();
    const registered_zone = await getZone();

    const res = await fetch(API.registerDevice, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone_hash,
        registered_zone,
        landmark: 'Mobile App User',
      }),
    });

    if (!res.ok) return null;
    const data = await res.json();
    await AsyncStorage.setItem(DEVICE_ID_KEY, String(data.id));
    return data.id;
  } catch (e) {
    console.log('Device registration error:', e);
    return null;
  }
}