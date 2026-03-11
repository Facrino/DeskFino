import { InvestmentPlan } from "./types";

export const INVESTMENT_PLANS: InvestmentPlan[] = [
  {
    id: "starter",
    name: "Starter Plan",
    min: 10,
    max: 99,
    profit: 110,
    duration: "30 Days",
    color: "from-blue-500 to-cyan-400"
  },
  {
    id: "pro",
    name: "Pro Plan",
    min: 100,
    max: 999,
    profit: 115,
    duration: "30 Days",
    color: "from-teal-500 to-emerald-400"
  },
  {
    id: "vip",
    name: "VIP Plan",
    min: 1000,
    max: 10000,
    profit: 120,
    duration: "30 Days",
    color: "from-indigo-500 to-purple-400"
  }
];

export const CRYPTO_ADDRESS = "TDg6nzpAbEBNw53L2wiKPjRxAA7naB9aQG";
