import React from 'react';
import { Feather } from '@expo/vector-icons';

export type AppIconName = React.ComponentProps<typeof Feather>['name'];

interface AppIconProps {
  name: AppIconName;
  size: number;
  color: string;
}

export function AppIcon({ name, size, color }: AppIconProps) {
  return <Feather name={name} size={size} color={color} />;
}
