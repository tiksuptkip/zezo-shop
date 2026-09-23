import { StoredUser, Order } from '../types';

const STORAGE_KEY = 'zshop_users';
const REFERRED_BY_KEY = 'referred_by';

// Generate a memorable Canadian fashion referral code, e.g. ZEZO-K8R4
export const generateReferralCode = (name?: string): string => {
  const prefix = name ? name.trim().slice(0, 3).toUpperCase().replace(/[^A-Z]/g, 'ZEZ') : 'ZEZ';
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix.padEnd(3, 'O')}-${randomPart}`;
};

// Initial seed users if zshop_users doesn't exist yet
const INITIAL_ZSHOP_USERS: StoredUser[] = [
  {
    id: 'user-01',
    name: 'Liam Campbell',
    email: 'liam.campbell@zezo.ca',
    phone: '+1 (416) 555-0144',
    referralCodeUsed: 'Direct',
    myReferralCode: 'LIA-8821',
    createdAt: '2026-01-15',
    role: 'customer',
  },
  {
    id: 'user-02',
    name: 'Chantal Tremblay',
    email: 'chantal.tremblay@quebec.ca',
    phone: '+1 (514) 555-0182',
    referralCodeUsed: 'LIA-8821',
    myReferralCode: 'CHA-4491',
    createdAt: '2026-02-10',
    role: 'customer',
  },
  {
    id: 'user-03',
    name: 'Evelyn Wong',
    email: 'evelyn.wong@vancouver.ca',
    phone: '+1 (604) 555-0177',
    referralCodeUsed: 'LIA-8821',
    myReferralCode: 'EVE-9102',
    createdAt: '2026-03-01',
    role: 'customer',
  },
  {
    id: 'user-04',
    name: 'Marcus Miller',
    email: 'marcus.miller@calgary.ca',
    phone: '+1 (403) 555-0133',
    referralCodeUsed: 'Direct',
    myReferralCode: 'MAR-5510',
    createdAt: '2026-02-20',
    role: 'customer',
  },
  {
    id: 'admin-01',
    name: 'Zezo Shop Administrator',
    email: 'admin@zezo.ca',
    phone: '+1 (800) 555-9396',
    referralCodeUsed: 'Direct',
    myReferralCode: 'ADM-2026',
    createdAt: '2025-12-01',
    role: 'admin',
  },
];

/**
 * Return all users from localStorage 'zshop_users'
 */
export const getAllUsers = (): StoredUser[] => {
  if (typeof window === 'undefined') return INITIAL_ZSHOP_USERS;

  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed: StoredUser[] = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch (e) {
      console.error('Error parsing zshop_users:', e);
    }
  }

  // Seed default if missing
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ZSHOP_USERS));
  return INITIAL_ZSHOP_USERS;
};

/**
 * Capture referral code from URL query parameter ?ref=CODE or ?referred_by=CODE
 */
export const captureReferralFromUrl = (): string | null => {
  if (typeof window === 'undefined') return null;

  try {
    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get('ref') || urlParams.get('referred_by');
    if (ref && ref.trim()) {
      const cleanRef = ref.trim().toUpperCase();
      localStorage.setItem(REFERRED_BY_KEY, cleanRef);
      return cleanRef;
    }
  } catch (e) {
    console.error('Could not capture referral from URL:', e);
  }

  return localStorage.getItem(REFERRED_BY_KEY);
};

/**
 * Get active referral code stored in localStorage
 */
export const getActiveReferralCode = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(REFERRED_BY_KEY);
};

/**
 * Save or update user in localStorage 'zshop_users'
 * {id, email, name, phone, referralCodeUsed, myReferralCode, createdAt}
 */
export const saveUser = (userData: Partial<StoredUser>): StoredUser => {
  const users = getAllUsers();
  const cleanEmail = (userData.email || '').trim().toLowerCase();
  const cleanPhone = (userData.phone || '').trim();

  // Find existing by email, phone, or id
  const existingIndex = users.findIndex(
    (u) =>
      (cleanEmail && u.email.toLowerCase() === cleanEmail) ||
      (cleanPhone && u.phone === cleanPhone) ||
      (userData.id && u.id === userData.id)
  );

  const storedRef = typeof window !== 'undefined' ? localStorage.getItem(REFERRED_BY_KEY) : null;

  if (existingIndex >= 0) {
    // Update existing user while preserving generated codes
    const existing = users[existingIndex];
    const updatedUser: StoredUser = {
      ...existing,
      ...userData,
      name: userData.name || existing.name,
      email: cleanEmail || existing.email,
      phone: cleanPhone || existing.phone,
      referralCodeUsed:
        userData.referralCodeUsed || existing.referralCodeUsed || storedRef || 'Direct',
      myReferralCode:
        existing.myReferralCode || userData.myReferralCode || generateReferralCode(existing.name),
      createdAt: existing.createdAt,
    };
    users[existingIndex] = updatedUser;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    return updatedUser;
  }

  // Create new user
  const newUser: StoredUser = {
    id: userData.id || `user-${Date.now()}`,
    name: (userData.name || cleanEmail.split('@')[0] || 'Customer').trim(),
    email: cleanEmail,
    phone: cleanPhone || '+1 (416) 555-0100',
    password: userData.password,
    referralCodeUsed: userData.referralCodeUsed || storedRef || 'Direct',
    myReferralCode: userData.myReferralCode || generateReferralCode(userData.name),
    createdAt: userData.createdAt || new Date().toISOString().split('T')[0],
    role: userData.role || 'customer',
  };

  users.push(newUser);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  return newUser;
};

/**
 * When user places order as guest or logged in, auto-save to users list if not exists
 */
export const autoSaveUserFromOrder = (order: {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  referredBy?: string;
}): StoredUser => {
  const users = getAllUsers();
  const cleanEmail = order.customerEmail.trim().toLowerCase();
  const cleanPhone = order.customerPhone.trim();

  const existing = users.find(
    (u) => u.email.toLowerCase() === cleanEmail || u.phone === cleanPhone
  );

  if (existing) {
    return existing;
  }

  const storedRef = typeof window !== 'undefined' ? localStorage.getItem(REFERRED_BY_KEY) : null;
  const referralUsed = order.referredBy || storedRef || 'Direct';

  return saveUser({
    name: order.customerName,
    email: cleanEmail,
    phone: cleanPhone,
    referralCodeUsed: referralUsed,
    myReferralCode: generateReferralCode(order.customerName),
    createdAt: new Date().toISOString().split('T')[0],
  });
};

/**
 * Link users to orders by email or phone
 */
export const getOrdersForUser = (
  user: { email: string; phone?: string },
  allOrders: Order[]
): Order[] => {
  const cleanEmail = (user.email || '').trim().toLowerCase();
  const cleanPhone = (user.phone || '').trim();

  return allOrders.filter((order) => {
    const orderEmail = (order.customerEmail || order.email || '').trim().toLowerCase();
    const orderPhone = (order.customerPhone || order.phone || '').trim();

    return (
      (cleanEmail && orderEmail === cleanEmail) ||
      (cleanPhone && orderPhone === cleanPhone)
    );
  });
};

/**
 * Calculate user stats: total orders count and total CAD spend
 */
export const getUserStats = (
  user: { email: string; phone?: string },
  allOrders: Order[]
) => {
  const matched = getOrdersForUser(user, allOrders);
  const totalOrders = matched.length;
  const totalSpent = matched.reduce((sum, o) => {
    if (o.status === 'Cancelled') return sum;
    const amount = o.finalTotal ?? o.total ?? 0;
    return sum + amount;
  }, 0);

  return {
    totalOrders,
    totalSpent,
    orders: matched,
  };
};
