// Replace this with your actual backend URL
// If running locally: 'http://192.168.x.x:8000' (your PC's IP on the same WiFi)
// If deployed: 'https://yourdomain.com'

export const BASE_URL = 'https://safepulse-production-4e0d.up.railway.app';

export const API = {
  submitIncident:  `${BASE_URL}/api/incidents/incidents/submit/`,
  registerDevice:  `${BASE_URL}/api/incidents/users/register/`,
  contacts:        `${BASE_URL}/api/incidents/contacts/`,
  deleteContact:   (id: number) => `${BASE_URL}/api/incidents/contacts/${id}/`,
};