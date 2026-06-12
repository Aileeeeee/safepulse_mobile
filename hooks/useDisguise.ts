import { useState, useCallback } from 'react';
import { DisguiseType } from '../types';

// Maps each disguise type to its route
export const DISGUISE_ROUTES: Record<DisguiseType, string> = {
  calculator: '/calculator',
  weather: '/disguise-weather',
  note: '/disguise-note',
  budget: '/disguise-budget',
  meditation: '/disguise-meditation',
};

export const DISGUISE_META: Record<DisguiseType, { label: string; emoji: string; description: string; accentColor: string }> = {
  calculator: {
    label: 'Calculator',
    emoji: '🧮',
    description: 'Opens as a fully working calculator',
    accentColor: '#3D3D3D',
  },
  weather: {
    label: 'Weather',
    emoji: '⛅',
    description: 'Opens as a Lagos weather app',
    accentColor: '#4A90D9',
  },
  note: {
    label: 'Notes',
    emoji: '📝',
    description: 'Opens as a notes and memo app',
    accentColor: '#E8A020',
  },
  budget: {
    label: 'Budget',
    emoji: '💰',
    description: 'Opens as a budget tracker',
    accentColor: '#2E7D60',
  },
  meditation: {
    label: 'Meditation',
    emoji: '🧘',
    description: 'Opens as a wellness and meditation app',
    accentColor: '#7B5EA7',
  },
};

export function useDisguise() {
  const [activeDisguise, setActiveDisguise] = useState<DisguiseType>('calculator');

  const getDisguiseRoute = useCallback(() => {
    return DISGUISE_ROUTES[activeDisguise];
  }, [activeDisguise]);

  return { activeDisguise, setActiveDisguise, getDisguiseRoute };
}
