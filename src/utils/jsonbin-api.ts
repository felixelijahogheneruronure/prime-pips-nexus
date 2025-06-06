
const ACCESS_KEY = '$2a$10$UeoblVtgeyOlWM3v92XVFOyCGfveGbYO7iPE73py3KJGwL.A0FKv2';
const BASE_URL = 'https://api.jsonbin.io/v3';

// Store bin IDs in localStorage for persistence
const BIN_STORAGE_KEY = 'prime_pips_bin_ids';

interface BinIds {
  users?: string;
  transactions?: string;
  notifications?: string;
}

export const getBinIds = (): BinIds => {
  const stored = localStorage.getItem(BIN_STORAGE_KEY);
  return stored ? JSON.parse(stored) : {};
};

export const setBinId = (type: keyof BinIds, binId: string) => {
  const binIds = getBinIds();
  binIds[type] = binId;
  localStorage.setItem(BIN_STORAGE_KEY, JSON.stringify(binIds));
};

export const createBin = async (initialData: any): Promise<string> => {
  const response = await fetch(`${BASE_URL}/b`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Access-Key': ACCESS_KEY,
    },
    body: JSON.stringify(initialData),
  });

  if (!response.ok) {
    throw new Error(`Failed to create bin: ${response.statusText}`);
  }

  const data = await response.json();
  return data.metadata.id;
};

export const fetchBinData = async (binId: string): Promise<any> => {
  const response = await fetch(`${BASE_URL}/b/${binId}/latest`, {
    headers: {
      'X-Access-Key': ACCESS_KEY,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch bin: ${response.statusText}`);
  }

  const data = await response.json();
  return data.record;
};

export const updateBinData = async (binId: string, data: any): Promise<boolean> => {
  const response = await fetch(`${BASE_URL}/b/${binId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Access-Key': ACCESS_KEY,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to update bin: ${response.statusText}`);
  }

  return true;
};

// User-specific API functions
export const getUsersBin = async (): Promise<string> => {
  const binIds = getBinIds();
  
  if (binIds.users) {
    return binIds.users;
  }

  // Create new users bin if it doesn't exist
  const binId = await createBin({ users: [] });
  setBinId('users', binId);
  return binId;
};

export const fetchUsers = async (): Promise<any[]> => {
  const binId = await getUsersBin();
  const data = await fetchBinData(binId);
  return data.users || [];
};

export const updateUsers = async (users: any[]): Promise<boolean> => {
  const binId = await getUsersBin();
  return await updateBinData(binId, { users });
};

// Simple password hashing (for demo purposes)
export const hashPassword = (password: string): string => {
  // In production, use a proper hashing library like bcrypt
  return btoa(password + 'prime_pips_salt');
};

export const verifyPassword = (password: string, hash: string): boolean => {
  return hashPassword(password) === hash;
};
