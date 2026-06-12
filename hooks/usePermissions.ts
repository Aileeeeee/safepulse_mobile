import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';

export async function requestNotificationPermission(): Promise<boolean> {
  try {
    const { status: existing } = await Notifications.getPermissionsAsync();
    if (existing === 'granted') return true;

    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  } catch (e) {
    console.log('Notification permission error:', e);
    return false;
  }
}

export async function requestLocationPermission(): Promise<boolean> {
  try {
    const { status: existing } = await Location.getForegroundPermissionsAsync();
    if (existing === 'granted') return true;

    // This triggers the real Android popup
    // Shows "Allow once" / "While using app" / "Don't allow"
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === 'granted';
  } catch (e) {
    console.log('Location permission error:', e);
    return false;
  }
}

export async function getNotificationStatus(): Promise<string> {
  try {
    const { status } = await Notifications.getPermissionsAsync();
    return status;
  } catch (e) {
    return 'undetermined';
  }
}

export async function getLocationStatus(): Promise<string> {
  try {
    const { status } = await Location.getForegroundPermissionsAsync();
    return status;
  } catch (e) {
    return 'undetermined';
  }
}

export async function stopLocationTracking() {
  // Background tracking removed — was causing silent crashes on Android
  return;
}