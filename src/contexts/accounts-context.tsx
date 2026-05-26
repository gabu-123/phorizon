'use client';

import { createContext, useContext, useState, useEffect, ReactNode, Dispatch, SetStateAction } from 'react';
import { useRouter } from 'next/navigation';
import { mockUserData } from '@/lib/mock-data';
import type { Account, Transaction } from '@/lib/mock-data';

interface AccountsContextType {
  accounts: Account[];
  setAccounts: Dispatch<SetStateAction<Account[]>>;
  handleNewTransaction: (newTransaction: Transaction, fromAccountNumber: string) => void;
  transferCount: number;
  resetTransferCount: () => void;
  handleLogout: () => void;
  handleLockout: () => void;
}

const AccountsContext = createContext<AccountsContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'horizon-bank-data';

type StoredData = {
  version?: number;
  accounts: Account[];
  transferCount: number;
};

export function AccountsProvider({ children }: { children: ReactNode }) {
  const [accounts, setAccounts] = useState<Account[]>(mockUserData.accounts);
  const [isInitialized, setIsInitialized] = useState(false);
  const [transferCount, setTransferCount] = useState(0);
  const router = useRouter();

  // Load state from localStorage on initial client-side render
  useEffect(() => {
    try {
      const storedDataString = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedDataString) {
        const storedData: StoredData = JSON.parse(storedDataString);
        if (!storedData.version || storedData.version < mockUserData.version) {
          setAccounts(mockUserData.accounts);
          setTransferCount(0);
        } else {
          setAccounts(storedData.accounts);
          setTransferCount(storedData.transferCount || 0);
        }
      }
    } catch (error) {
      console.error("Failed to load or parse data from localStorage, using fresh mock data.", error);
      setAccounts(mockUserData.accounts);
      setTransferCount(0);
    }
    setIsInitialized(true);
  }, []);

  // Persist state to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      try {
        const dataToStore: StoredData = { 
          version: mockUserData.version,
          accounts, 
          transferCount 
        };
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dataToStore));
      } catch (error) {
        console.error("Failed to save data to localStorage", error);
      }
    }
  }, [accounts, transferCount, isInitialized]);
  
  const handleLogout = () => {
    router.push('/login');
  };

  const handleLockout = () => {
    // Reset password to jolie12345 as requested
    localStorage.setItem('horizon-bank-password', 'jolie12345');
    handleLogout();
  };

  const resetTransferCount = () => {
    setTransferCount(0);
  };

  const handleNewTransaction = (newTransaction: Transaction, fromAccountNumber: string) => {
    setAccounts(prevAccounts =>
      prevAccounts.map(account => {
        if (account.accountNumber === fromAccountNumber) {
          const newBalance = Number(account.balance) + Number(newTransaction.amount);
          return {
            ...account,
            balance: newBalance,
            transactions: [newTransaction, ...account.transactions],
          };
        }
        return account;
      })
    );
    setTransferCount(prevCount => prevCount + 1);
  };

  const value = {
    accounts,
    setAccounts,
    handleNewTransaction,
    transferCount,
    resetTransferCount,
    handleLogout,
    handleLockout
  };

  return (
    <AccountsContext.Provider value={value}>
      {children}
    </AccountsContext.Provider>
  );
}

export function useAccounts() {
  const context = useContext(AccountsContext);
  if (context === undefined) {
    throw new Error('useAccounts must be used within an AccountsProvider');
  }
  return context;
}
