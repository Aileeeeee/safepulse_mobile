import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { registerDevice } from '../hooks/useDevice';
import {
  PlayfairDisplay_400Regular,
  PlayfairDisplay_700Bold,
  PlayfairDisplay_400Regular_Italic,
  PlayfairDisplay_700Bold_Italic,
} from '@expo-google-fonts/playfair-display';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = Font.useFonts({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_700Bold,
    PlayfairDisplay_400Regular_Italic,
    PlayfairDisplay_700Bold_Italic,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
      registerDevice().catch(console.log);
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="splash2" />
        <Stack.Screen name="onboarding/step0" />
        <Stack.Screen name="onboarding/step1" />
        <Stack.Screen name="onboarding/step2" />
        <Stack.Screen name="onboarding/step3" />
        <Stack.Screen name="ready" />
        <Stack.Screen name="(main)" />
        <Stack.Screen name="report" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="report-sent" options={{ animation: 'fade' }} />
        <Stack.Screen name="signal-sent" options={{ animation: 'fade' }} />
        <Stack.Screen name="signal-received" options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="calculator" options={{ animation: 'none' }} />
        <Stack.Screen name="disguise-weather" options={{ animation: 'none' }} />
        <Stack.Screen name="disguise-note" options={{ animation: 'none' }} />
        <Stack.Screen name="disguise-budget" options={{ animation: 'none' }} />
        <Stack.Screen name="disguise-meditation" options={{ animation: 'none' }} />
        <Stack.Screen name="about" options={{ animation: 'slide_from_right' }} />

      </Stack>
    </>
  );
}
