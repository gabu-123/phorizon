export type Transaction = {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'debit' | 'credit';
  category: string;
  status: 'Completed' | 'Pending' | 'Failed';
  cardId?: string;
};

export type Card = {
  id: string;
  name: string;
  type: 'Virtual' | 'Physical';
  provider: 'Visa' | 'Mastercard';
  lastFour: string;
  expiryDate: string;
  isFrozen: boolean;
  spendingLimit: number;
  monthlySpending: number;
};

export type Account = {
  id: string;
  type: 'Checking' | 'Savings';
  accountNumber: string;
  balance: number;
  transactions: Transaction[];
  cards: Card[];
};

export type InvestmentHolding = {
  id: string;
  name: string;
  ticker: string;
  shares: number;
  price: number;
  value: number;
  changePercent: number;
};

export type InvestmentPortfolio = {
  totalValue: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
  holdings: InvestmentHolding[];
  history: { date: string; value: number }[];
};

export type UserData = {
  name: string;
  email: string;
  accounts: Account[];
  investments: InvestmentPortfolio;
};

const MOCK_DATE_NOW = new Date('2023-10-27T12:00:00.000Z').getTime();

export const mockUserData: UserData = {
  name: 'Angelina',
  email: 'angelina.jolie@example.com',
  accounts: [
    {
      id: 'acc_chk_1',
      type: 'Checking',
      accountNumber: '**** **** **** 1234',
      balance: 35215567.87,
      transactions: [
        {
          id: 'txn_dep_1',
          date: '2026-03-30',
          description: 'from AGT',
          amount: 10000000,
          type: 'credit',
          category: 'Deposit',
          status: 'Completed',
        },
      ],
      cards: [
        {
          id: 'card_1',
          name: 'Horizon Plus',
          type: 'Physical',
          provider: 'Visa',
          lastFour: '1234',
          expiryDate: '12/26',
          isFrozen: false,
          spendingLimit: 5000,
          monthlySpending: 21450.75,
        },
        {
          id: 'card_2',
          name: 'Horizon Virtual',
          type: 'Virtual',
          provider: 'Mastercard',
          lastFour: '9876',
          expiryDate: '06/26',
          isFrozen: true,
          spendingLimit: 1000,
          monthlySpending: 3320.50,
        },
      ],
    },
    {
      id: 'acc_sav_1',
      type: 'Savings',
      accountNumber: '**** **** **** 5678',
      balance: 328750,
      transactions: [],
      cards: [],
    },
  ],
  investments: {
    totalValue: 95320.45,
    totalGainLoss: 22820.45,
    totalGainLossPercent: 20.5,
    holdings: [
        { id: 'inv_1', name: 'Apple Inc.', ticker: 'AAPL', shares: 50, price: 195.50, value: 9775.00, changePercent: 1.2 },
        { id: 'inv_2', name: 'Tesla, Inc.', ticker: 'TSLA', shares: 30, price: 250.10, value: 7503.00, changePercent: -0.8 },
        { id: 'inv_3', name: 'Vanguard S&P 500 ETF', ticker: 'VOO', shares: 100, price: 450.42, value: 45042.45, changePercent: 0.5 },
        { id: 'inv_4', name: 'Microsoft Corp.', ticker: 'MSFT', shares: 40, price: 325.00, value: 13000.00, changePercent: 0.9 },
    ],
    history: [
        { date: 'Jan', value: 60000 },
        { date: 'Feb', value: 62000 },
        { date: 'Mar', value: 65000 },
        { date: 'Apr', value: 68000 },
        { date: 'May', value: 71000 },
        { date: 'Jun', value: 75320.45 },
    ]
  },
};
