import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';

const BACKGROUND_TASK   = 'safepulse-location-task';
const LAST_LOCATION_KEY = 'safepulse_last_location';

TaskManager.defineTask(BACKGROUND_TASK, async ({ data, error }) => {
  if (error || !data) return;
  const { locations } = data as any;
  if (locations?.length > 0) {
    const loc = locations[locations.length - 1];
    await AsyncStorage.setItem(LAST_LOCATION_KEY, JSON.stringify({
      latitude:  loc.coords.latitude,
      longitude: loc.coords.longitude,
      accuracy:  loc.coords.accuracy,
      timestamp: loc.timestamp,
    }));
  }
});

export async function getExactLocation() {
  try {
    const { status } = await Location.getForegroundPermissionsAsync();

    if (status !== 'granted') {
      const saved = await AsyncStorage.getItem(LAST_LOCATION_KEY);
      if (saved) {
        const loc = JSON.parse(saved);
        return { ...loc, address: 'Last known location' };
      }
      return null;
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.BestForNavigation,
    });

    let address = `${location.coords.latitude.toFixed(4)}, ${location.coords.longitude.toFixed(4)}`;
    try {
      const geo = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      if (geo.length > 0) {
        const g = geo[0];
        address = [g.name, g.street, g.district, g.city, g.region]
          .filter(Boolean).join(', ');
      }
    } catch {}

    await AsyncStorage.setItem(LAST_LOCATION_KEY, JSON.stringify({
      latitude:  location.coords.latitude,
      longitude: location.coords.longitude,
      accuracy:  location.coords.accuracy,
      timestamp: Date.now(),
    }));

    return {
      latitude:  location.coords.latitude,
      longitude: location.coords.longitude,
      accuracy:  location.coords.accuracy || 0,
      address,
    };
  } catch (e) {
    return null;
  }
}

export async function startBackgroundTracking(): Promise<boolean> {
  try {
    // Background tracking only works in standalone build, not Expo Go
    const isExpoGo = typeof __DEV__ !== 'undefined' && __DEV__;
    if (isExpoGo) {
    console.log('Background tracking skipped in Expo Go');
    await AsyncStorage.setItem('location_tracking_enabled', 'true');
    return true; // Return true so the toggle works visually
    }
    
    const { status: fg } = await Location.getForegroundPermissionsAsync();
    if (fg !== 'granted') return false;

    const isRunning = await Location.hasStartedLocationUpdatesAsync(BACKGROUND_TASK)
      .catch(() => false);

    if (!isRunning) {
      await Location.startLocationUpdatesAsync(BACKGROUND_TASK, {
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 30000,
        distanceInterval: 100,
        showsBackgroundLocationIndicator: true,
        foregroundService: {
          notificationTitle: 'SafePulse is active',
          notificationBody: 'Location monitoring is on for your safety.',
          notificationColor: '#1A5C45',
        },
      });
    }

    await AsyncStorage.setItem('location_tracking_enabled', 'true');
    return true;
  } catch (e) {
    console.log('Background tracking error:', e);
    return false;
  }
}

export async function stopBackgroundTracking(): Promise<void> {
  try {
    const isRunning = await Location.hasStartedLocationUpdatesAsync(BACKGROUND_TASK)
      .catch(() => false);
    if (isRunning) {
      await Location.stopLocationUpdatesAsync(BACKGROUND_TASK);
    }
    await AsyncStorage.setItem('location_tracking_enabled', 'false');
  } catch {}
}

export function useLocationTracker() {
  const [tracking, setTracking] = useState(false);

  useEffect(() => {
    Location.hasStartedLocationUpdatesAsync(BACKGROUND_TASK)
      .then(setTracking)
      .catch(() => setTracking(false));
  }, []);

  return {
    tracking,
    enableTracking: async () => {
      const ok = await startBackgroundTracking();
      setTracking(ok);
      return ok;
    },
    disableTracking: async () => {
      await stopBackgroundTracking();
      setTracking(false);
    },
  };
}