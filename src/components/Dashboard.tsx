import React from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Plus, 
  History, 
  User as UserIcon,
  LayoutDashboard,
  PieChart
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

const data = [
  { name: 'Mon', value: 4000 },
  { name: 'Tue', value: 3000 },
  { name: 'Wed', value: 5000 },
  { name: 'Thu', value: 4500 },
  { name: 'Fri', value: 6000 },
  { name: 'Sat', value: 5500 },
  { name: 'Sun', value: 7000 },
];

interface DashboardProps {
  onNavigate: (screen: string) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const { user, dashboard } = useAuth();

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="flex items-center justify-between p-6 mb-4">
        <div>
          <h2 className="text-slate-400 text-sm">Welcome back,</h2>
          <p className="text-xl font-bold">{user?.name} 👋</p>
        </div>
        <div className="w-12 h-12 rounded-full bg-teal-500/20 flex items-center justify-center border border-teal-500/30">
          <UserIcon className="text-teal-500" size={24} />
        </div>
      </div>

      {/* Main Balance Card */}
      <div className="px-6 mb-8">
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative overflow-hidden p-6 rounded-3xl bg-gradient-to-br from-teal-500 to-blue-600 shadow-xl shadow-teal-500/20"
        >
          <div className="absolute top-0 right-0 p-4 opacity-20">
            <TrendingUp size={120} />
          </div>
          
          <div className="relative z-10">
            <p className="text-white/70 text-sm font-medium mb-1">Total Balance</p>
            <h3 className="text-4xl font-bold mb-6">${dashboard?.balance.toLocaleString() || '0.00'}</h3>
            
            <div className="flex gap-4">
              <div className="flex-1 bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
                <p className="text-white/60 text-[10px] uppercase font-bold tracking-wider mb-1">Total Profit</p>
                <p className="text-lg font-bold text-teal-200">+${dashboard?.profit.toLocaleString() || '0.00'}</p>
              </div>
              <div className="flex-1 bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
                <p className="text-white/60 text-[10px] uppercase font-bold tracking-wider mb-1">Active Invest</p>
                <p className="text-lg font-bold">${dashboard?.activeInvestment.toLocaleString() || '0.00'}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-4 px-6 mb-8">
        <button onClick={() => onNavigate('invest')} className="flex flex-col items-center gap-2">
          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-teal-400 hover:bg-teal-500 hover:text-white transition-all">
            <Plus size={24} />
          </div>
          <span className="text-xs font-medium">Invest</span>
        </button>
        <button onClick={() => onNavigate('deposit')} className="flex flex-col items-center gap-2">
          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-400 hover:bg-blue-500 hover:text-white transition-all">
            <ArrowDownLeft size={24} />
          </div>
          <span className="text-xs font-medium">Deposit</span>
        </button>
        <button onClick={() => onNavigate('withdraw')} className="flex flex-col items-center gap-2">
          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-purple-400 hover:bg-purple-500 hover:text-white transition-all">
            <ArrowUpRight size={24} />
          </div>
          <span className="text-xs font-medium">Withdraw</span>
        </button>
      </div>

      {/* Growth Chart */}
      <div className="px-6 mb-8">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h4 className="font-bold">Growth Analysis</h4>
            <div className="flex items-center gap-2 text-teal-400 text-xs font-bold">
              <TrendingUp size={14} />
              <span>+22.5%</span>
            </div>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="value" stroke="#14b8a6" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', fontSize: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="px-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-bold">Recent Activity</h4>
          <button onClick={() => onNavigate('history')} className="text-teal-400 text-xs font-bold">View All</button>
        </div>
        <div className="space-y-3">
          {dashboard?.history.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between p-4 glass-card">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  tx.type === 'deposit' ? 'bg-teal-500/20 text-teal-500' :
                  tx.type === 'withdraw' ? 'bg-red-500/20 text-red-500' :
                  'bg-blue-500/20 text-blue-500'
                }`}>
                  {tx.type === 'deposit' ? <ArrowDownLeft size={20} /> :
                   tx.type === 'withdraw' ? <ArrowUpRight size={20} /> :
                   <PieChart size={20} />}
                </div>
                <div>
                  <p className="text-sm font-bold capitalize">{tx.type}</p>
                  <p className="text-slate-500 text-[10px]">{format(new Date(tx.created_at), 'MMM dd, HH:mm')}</p>
                </div>
              </div>
              <p className={`font-bold ${tx.type === 'deposit' || tx.type === 'profit' ? 'text-teal-400' : 'text-white'}`}>
                {tx.type === 'deposit' || tx.type === 'profit' ? '+' : '-'}${tx.amount.toLocaleString()}
              </p>
            </div>
          ))}
          {(!dashboard?.history || dashboard.history.length === 0) && (
            <p className="text-center text-slate-500 py-8 text-sm italic">No recent activity</p>
          )}
        </div>
      </div>
    </div>
  );
}
