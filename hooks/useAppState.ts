import { useState, useCallback } from 'react';
import { Contact, DisguiseType } from '../types';

const DEFAULT_CONTACTS: Contact[] = [
  { id: '1', name: 'Aisha', phone: '080-111-2345', initial: 'A', color: '#E07050', isAdded: true },
  { id: '2', name: 'Femi', phone: '080-987-6543', initial: 'F', color: '#5B8A6E', isAdded: true },
];

export function useAppState() {
  const [contacts, setContacts] = useState<Contact[]>(DEFAULT_CONTACTS);
  const [disguise, setDisguise] = useState<DisguiseType>('calculator');
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const addContact = useCallback((contact: Contact) => {
    setContacts((prev) => [...prev, contact]);
  }, []);

  const removeContact = useCallback((id: string) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
  }, []);

  return {
    contacts,
    addContact,
    removeContact,
    disguise,
    setDisguise,
    locationEnabled,
    setLocationEnabled,
    notificationsEnabled,
    setNotificationsEnabled,
  };
}
