export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  balance: number;
  profit: number;
  referral_code: string;
}

export interface DashboardData {
  balance: number;
  profit: number;
  activeInvestment: number;
  history: Transaction[];
}

export interface Transaction {
  id: number;
  type: 'deposit' | 'withdraw' | 'invest' | 'profit';
  amount: number;
  status: string;
  created_at: string;
}

export interface InvestmentPlan {
  id: string;
  name: string;
  min: number;
  max: number;
  profit: number;
  duration: string;
  color: string;
}
