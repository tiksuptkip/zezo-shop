import { Order, User } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'user-01',
    fullName: 'Liam Campbell',
    email: 'liam.campbell@zezo.ca',
    phone: '+1 (416) 555-0144',
    role: 'customer',
    wishlist: [],
    createdAt: '2026-01-15',
    addresses: [
      {
        fullName: 'Liam Campbell',
        street: '240 Bay Street',
        apt: 'Suite 1804',
        city: 'Toronto',
        province: 'Ontario',
        postalCode: 'M5J 2N8',
        phone: '+1 (416) 555-0144',
        isDefault: true,
      },
      {
        fullName: 'Liam Campbell (Cottage)',
        street: '12 Muskoka Lake Road',
        city: 'Huntsville',
        province: 'Ontario',
        postalCode: 'P1H 2K1',
        phone: '+1 (705) 555-0199',
        isDefault: false,
      },
    ],
  },
  {
    id: 'admin-01',
    fullName: 'Zezo Shop Administrator',
    email: 'admin@zezo.ca',
    phone: '+1 (800) 555-9396',
    role: 'admin',
    wishlist: [],
    createdAt: '2025-12-01',
    addresses: [
      {
        fullName: 'Zezo Operations HQ',
        street: '1000 Rue de la Gauchetière Ouest',
        city: 'Montreal',
        province: 'Quebec',
        postalCode: 'H3B 4W5',
        phone: '+1 (800) 555-9396',
        isDefault: true,
      },
    ],
  },
];

export const INITIAL_ORDERS: Order[] = [];
