import { API } from '../constants/api';
import { getOrCreateDeviceHash } from './useDevice';
import { getExactLocation } from './useLocationTracker';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

const INCIDENT_TYPE_MAP: Record<string, string> = {
  violence_assault:    'Sexual Assault',
  harassment:          'Harassment',
  domestic_conflict:   'Domestic Violence',
  child_endangerment:  'Child Abuse',
  other:               'Unknown',
  pulse:               'Unknown',
};

export async function sendPulse() {
  try {
    const device_hash = await getOrCreateDeviceHash();
    const locationData = await getExactLocation();

    // Check user's saved location preference
    const savedPref = await AsyncStorage.getItem('safepulse_location_sharing');
    const userWantsLocation = savedPref === 'true';

    const payload: any = {
      incident_type:     'Unknown',
      severity_level:    'Critical',
      reporting_channel: 'Mobile App',
      notes:             'Emergency pulse from SafePulse mobile app',
      device_hash,
      reporter_type:     'victim',
    };

    if (userWantsLocation && locationData) {
      // User enabled location — share exact GPS
      payload.location          = locationData.address;
      payload.latitude          = locationData.latitude;
      payload.longitude         = locationData.longitude;
      payload.location_accuracy = locationData.accuracy;
    } else {
      // User disabled location — share city only
      payload.location = await getCityOnly();
    }

    const res = await fetch(API.submitIncident, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      console.log('Pulse error:', await res.json());
      return null;
    }

    return await res.json();
  } catch (e) {
    console.log('sendPulse error:', e);
    return null;
  }
}

async function getCityOnly(): Promise<string> {
  try {
    const { status } = await Location.getForegroundPermissionsAsync();
    if (status !== 'granted') return 'Nigeria';

    const loc = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Low, // low accuracy = city level only
    });

    const geo = await Location.reverseGeocodeAsync({
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
    });

    if (geo.length > 0) {
      const g = geo[0];
      // Return only state/region — not street or district
      return g.region || g.city || 'Nigeria';
    }
    return 'Nigeria';
  } catch {
    return 'Nigeria';
  }
}

export async function submitIncident(params: {
  incident_id: string;
  notes?: string;
  severity?: string;
  victim_age?: number;
  victim_gender?: string;
  perpetrator_relationship?: string;
  reporter_type?: string;
}) {
  try {
    const locationData = await getExactLocation();
    const incident_type = INCIDENT_TYPE_MAP[params.incident_id] || 'Unknown';
    const isVictim = params.reporter_type === 'victim';

    const payload: any = {
      incident_type,
      severity_level:    params.severity || 'High',
      reporting_channel: 'Mobile App',
      notes:             params.notes || '',
      reporter_type:     params.reporter_type || 'bystander',
    };

    if (isVictim) {
      // Check user's saved preference, not just phone permission
      const savedPref = await AsyncStorage.getItem('safepulse_location_sharing');
      const userWantsLocation = savedPref === 'true';

      if (userWantsLocation && locationData) {

        // Location enabled — share exact GPS
        payload.location          = locationData.address;
        payload.latitude          = locationData.latitude;
        payload.longitude         = locationData.longitude;
        payload.location_accuracy = locationData.accuracy;
      } else {
        // Location disabled — respect user choice, city only
        payload.location = await getCityOnly();
      }
    } else {
      // Bystander — always city only regardless
      payload.location = await getCityOnly();
    }

    if (params.victim_age)               payload.victim_age = params.victim_age;
    if (params.victim_gender)            payload.victim_gender = params.victim_gender;
    if (params.perpetrator_relationship) payload.perpetrator_relationship = params.perpetrator_relationship;

    const res = await fetch(API.submitIncident, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      console.log('Submit error:', await res.json());
      return null;
    }

    return await res.json();
  } catch (e) {
    console.log('submitIncident error:', e);
    return null;
  }
}