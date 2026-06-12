export interface Contact {
  id: string;
  name: string;
  phone: string;
  initial: string;
  color: string;
  isAdded: boolean;
}

export type IncidentType =
  | 'violence_assault'
  | 'harassment'
  | 'suspicious_activity'
  | 'domestic_conflict'
  | 'child_endangerment'
  | 'threat_danger'
  | 'stalking_following'
  | 'forced_control'
  | 'public_disturbance'
  | 'other';

export interface Incident {
  id: IncidentType;
  title: string;
  subtitle: string;
}

export type DisguiseType = 'calculator' | 'weather' | 'note' | 'budget' | 'meditation';

export interface DisguiseOption {
  id: DisguiseType;
  label: string;
  description: string;
  image: any;
  accentColor: string;
}

export interface AppState {
  contacts: Contact[];
  disguise: DisguiseType;
  locationEnabled: boolean;
  notificationsEnabled: boolean;
}
