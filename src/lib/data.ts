import type { Patient } from '@/lib/types';

export const initialPatients: Patient[] = [
  {
    id: 'p1',
    tokenNumber: 101,
    name: 'John Doe',
    age: 45,
    symptoms: 'Chest pain and shortness of breath',
    priority: 'Critical',
    registrationTime: new Date(Date.now() - 10 * 60 * 1000), // 10 mins ago
  },
  {
    id: 'p2',
    tokenNumber: 102,
    name: 'Jane Smith',
    age: 34,
    symptoms: 'High fever and severe headache',
    priority: 'High',
    registrationTime: new Date(Date.now() - 25 * 60 * 1000), // 25 mins ago
  },
  {
    id: 'p3',
    tokenNumber: 103,
    name: 'Peter Jones',
    age: 62,
    symptoms: 'Abdominal pain',
    priority: 'High',
    registrationTime: new Date(Date.now() - 5 * 60 * 1000), // 5 mins ago
  },
  {
    id: 'p4',
    tokenNumber: 104,
    name: 'Mary Johnson',
    age: 28,
    symptoms: 'Persistent cough and sore throat',
    priority: 'Medium',
    registrationTime: new Date(Date.now() - 40 * 60 * 1000), // 40 mins ago
  },
  {
    id: 'p5',
    tokenNumber: 105,
    name: 'David Williams',
    age: 19,
    symptoms: 'Sprained ankle',
    priority: 'Low',
    registrationTime: new Date(Date.now() - 60 * 60 * 1000), // 60 mins ago
  },
];
