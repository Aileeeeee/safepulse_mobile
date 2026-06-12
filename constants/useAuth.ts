import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API } from '../constants/api';

export async function saveTokens(access: string, refresh: string) {
  await AsyncStorage.setItem('access_token', access);
  await AsyncStorage.setItem('refresh_token', refresh);
}

export async function getAccessToken(): Promise<string | null> {
  return await AsyncStorage.getItem('access_token');
}

export async function clearTokens() {
  await AsyncStorage.removeItem('access_token');
  await AsyncStorage.removeItem('refresh_token');
}

export async function refreshAccessToken(): Promise<string | null> {
  const refresh = await AsyncStorage.getItem('refresh_token');
  if (!refresh) return null;

  const res = await fetch(API.refresh, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh }),
  });

  if (res.ok) {
    const data = await res.json();
    await AsyncStorage.setItem('access_token', data.access);
    return data.access;
  }
  return null;
}

// Main fetch wrapper — handles auth headers + token refresh automatically
export async function apiFetch(url: string, options: RequestInit = {}) {
  let token = await getAccessToken();

  const makeRequest = async (t: string | null) => {
    return fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(t ? { Authorization: `Bearer ${t}` } : {}),
        ...options.headers,
      },
    });
  };

  let res = await makeRequest(token);

  // If 401, try refreshing token once
  if (res.status === 401) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      res = await makeRequest(newToken);
    }
  }

  return res;
}