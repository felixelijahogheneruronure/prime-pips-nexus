const ACCESS_KEY = '$2a$10$UeoblVtgeyOlWM3v92XVFOyCGfveGbYO7iPE73py3KJGwL.A0FKv2';
const BASE_URL = 'https://api.jsonbin.io/v3';

// Use the specific bin ID provided by the user for users
const USERS_BIN_ID = '684483768960c979a5a6640c';

// Store bin IDs in localStorage for persistence
const BIN_STORAGE_KEY = 'prime_pips_bin_ids';

interface BinIds {
  users?: string;
  agentApplications?: string;
  accountDetails?: string;
  notifications?: string;
  trialLimits?: string;
  userTransactions?: string;
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

// User-specific API functions - now using the specific bin ID
export const getUsersBin = async (): Promise<string> => {
  return USERS_BIN_ID;
};

export const fetchUsers = async (): Promise<any[]> => {
  try {
    const data = await fetchBinData(USERS_BIN_ID);
    return data.users || [];
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};

export const updateUsers = async (users: any[]): Promise<boolean> => {
  return await updateBinData(USERS_BIN_ID, { users });
};

// Agent Application API functions
export const getAgentApplicationsBin = async (): Promise<string> => {
  const binIds = getBinIds();
  
  if (binIds.agentApplications) {
    return binIds.agentApplications;
  }

  const binId = await createBin({ applications: [] });
  setBinId('agentApplications', binId);
  return binId;
};

export const fetchAgentApplications = async (): Promise<any[]> => {
  const binId = await getAgentApplicationsBin();
  const data = await fetchBinData(binId);
  return data.applications || [];
};

export const updateAgentApplications = async (applications: any[]): Promise<boolean> => {
  const binId = await getAgentApplicationsBin();
  return await updateBinData(binId, { applications });
};

// Account Details API functions
export const getAccountDetailsBin = async (): Promise<string> => {
  const binIds = getBinIds();
  
  if (binIds.accountDetails) {
    return binIds.accountDetails;
  }

  const binId = await createBin({ accountDetails: [] });
  setBinId('accountDetails', binId);
  return binId;
};

export const fetchAccountDetails = async (): Promise<any[]> => {
  const binId = await getAccountDetailsBin();
  const data = await fetchBinData(binId);
  return data.accountDetails || [];
};

export const updateAccountDetails = async (accountDetails: any[]): Promise<boolean> => {
  const binId = await getAccountDetailsBin();
  return await updateBinData(binId, { accountDetails });
};

// Notifications API functions
export const getNotificationsBin = async (): Promise<string> => {
  const binIds = getBinIds();
  
  if (binIds.notifications) {
    return binIds.notifications;
  }

  const binId = await createBin({ notifications: [] });
  setBinId('notifications', binId);
  return binId;
};

export const fetchNotifications = async (): Promise<any[]> => {
  const binId = await getNotificationsBin();
  const data = await fetchBinData(binId);
  return data.notifications || [];
};

export const updateNotifications = async (notifications: any[]): Promise<boolean> => {
  const binId = await getNotificationsBin();
  return await updateBinData(binId, { notifications });
};

// Trial Limits API functions
export const getTrialLimitsBin = async (): Promise<string> => {
  const binIds = getBinIds();
  
  if (binIds.trialLimits) {
    return binIds.trialLimits;
  }

  const defaultLimits = {
    trial1: { monthlyMin: 100, monthlyMax: 500 },
    trial2: { monthlyMin: 150, monthlyMax: 1000 },
    trial3: { monthlyMin: 200, monthlyMax: 1500 },
    trial4: { monthlyMin: 250, monthlyMax: 2000 },
    trial5: { monthlyMin: 300, monthlyMax: 2500 },
    trial6: { monthlyMin: 350, monthlyMax: 3000 },
    trial7: { monthlyMin: 400, monthlyMax: 3500 },
    trial8: { monthlyMin: 450, monthlyMax: 4000 },
    trial9: { monthlyMin: 500, monthlyMax: 4500 },
    trial10: { monthlyMin: 550, monthlyMax: 5000 },
    trial11: { monthlyMin: 600, monthlyMax: 6000 },
    trial12: { monthlyMin: 650, monthlyMax: 7000 }
  };

  const binId = await createBin({ trialLimits: defaultLimits });
  setBinId('trialLimits', binId);
  return binId;
};

export const fetchTrialLimits = async (): Promise<any> => {
  try {
    const binId = await getTrialLimitsBin();
    const data = await fetchBinData(binId);
    return data.trialLimits || {};
  } catch (error) {
    console.error('Error fetching trial limits:', error);
    return {};
  }
};

export const updateTrialLimits = async (trialLimits: any): Promise<boolean> => {
  const binId = await getTrialLimitsBin();
  return await updateBinData(binId, { trialLimits });
};

// User Transactions API functions
export const getUserTransactionsBin = async (): Promise<string> => {
  const binIds = getBinIds();
  
  if (binIds.userTransactions) {
    return binIds.userTransactions;
  }

  const binId = await createBin({ transactions: [] });
  setBinId('userTransactions', binId);
  return binId;
};

export const fetchUserTransactions = async (userId?: string): Promise<any[]> => {
  try {
    const binId = await getUserTransactionsBin();
    const data = await fetchBinData(binId);
    const transactions = data.transactions || [];
    
    if (userId) {
      return transactions.filter((t: any) => t.userId === userId);
    }
    
    return transactions;
  } catch (error) {
    console.error('Error fetching user transactions:', error);
    return [];
  }
};

export const addUserTransaction = async (transaction: any): Promise<boolean> => {
  try {
    const transactions = await fetchUserTransactions();
    const newTransaction = {
      id: `txn-${Date.now()}`,
      timestamp: new Date().toISOString(),
      ...transaction
    };
    
    const updatedTransactions = [...transactions, newTransaction];
    const binId = await getUserTransactionsBin();
    return await updateBinData(binId, { transactions: updatedTransactions });
  } catch (error) {
    console.error('Error adding transaction:', error);
    return false;
  }
};

// Enhanced user functions with expanded wallet support
export const updateUserWallet = async (userId: string, walletUpdate: any): Promise<boolean> => {
  try {
    const users = await fetchUsers();
    const updatedUsers = users.map(user => {
      if (user.id === userId) {
        return {
          ...user,
          wallets: {
            ...user.wallets,
            ...walletUpdate
          }
        };
      }
      return user;
    });
    
    return await updateUsers(updatedUsers);
  } catch (error) {
    console.error('Error updating user wallet:', error);
    return false;
  }
};

export const getUserMonthlyDeposits = async (userId: string): Promise<number> => {
  try {
    const transactions = await fetchUserTransactions(userId);
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyDeposits = transactions
      .filter(t => {
        const transactionDate = new Date(t.timestamp);
        return t.type === 'deposit' && 
               transactionDate.getMonth() === currentMonth && 
               transactionDate.getFullYear() === currentYear;
      })
      .reduce((sum, t) => sum + (t.amount || 0), 0);
    
    return monthlyDeposits;
  } catch (error) {
    console.error('Error calculating monthly deposits:', error);
    return 0;
  }
};

// Simple password hashing (for demo purposes)
export const hashPassword = (password: string): string => {
  return btoa(password + 'prime_pips_salt');
};

export const verifyPassword = (password: string, hash: string): boolean => {
  return hashPassword(password) === hash;
};
