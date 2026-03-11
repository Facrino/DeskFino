import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Zap, Shield, Crown, CheckCircle2 } from 'lucide-react';
import { INVESTMENT_PLANS } from '../constants';
import { useAuth } from '../context/AuthContext';

interface InvestmentPlansProps {
  onBack: () => void;
}

export default function InvestmentPlans({ onBack }: InvestmentPlansProps) {
  const { user, refreshDashboard } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleInvest = async () => {
    if (!selectedPlan || !amount) return;
    const plan = INVESTMENT_PLANS.find(p => p.id === selectedPlan)!;
    const numAmount = parseFloat(amount);

    if (numAmount < plan.min || numAmount > plan.max) {
      setMessage({ type: 'error', text: `Amount must be between $${plan.min} and $${plan.max}` });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/invest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          planName: plan.name,
          amount: numAmount,
          profitRate: plan.profit
        })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: 'Investment successful!' });
        refreshDashboard();
        setTimeout(onBack, 2000);
      } else {
        setMessage({ type: 'error', text: data.error });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to process investment' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6 pb-24">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 text-slate-400 hover:text-white">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-2xl font-bold">Investment Plans</h2>
      </div>

      <div className="space-y-4 mb-8">
        {INVESTMENT_PLANS.map((plan) => (
          <motion.div
            key={plan.id}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedPlan(plan.id)}
            className={`relative p-6 rounded-3xl border-2 transition-all cursor-pointer overflow-hidden ${
              selectedPlan === plan.id 
                ? 'border-teal-500 bg-teal-500/10' 
                : 'border-white/10 bg-white/5'
            }`}
          >
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${plan.color} opacity-10 rounded-full -mr-16 -mt-16`} />
            
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {plan.id === 'starter' && <Zap size={16} className="text-blue-400" />}
                  {plan.id === 'pro' && <Shield size={16} className="text-teal-400" />}
                  {plan.id === 'vip' && <Crown size={16} className="text-yellow-400" />}
                  <h3 className="font-bold text-lg">{plan.name}</h3>
                </div>
                <p className="text-slate-400 text-xs">Duration: {plan.duration}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-teal-400">{plan.profit}%</p>
                <p className="text-[10px] uppercase font-bold text-slate-500">Monthly Profit</p>
              </div>
            </div>

            <div className="flex justify-between items-center text-sm">
              <div className="space-y-1">
                <p className="text-slate-500 text-xs">Min Investment</p>
                <p className="font-bold">${plan.min}</p>
              </div>
              <div className="space-y-1 text-right">
                <p className="text-slate-500 text-xs">Max Investment</p>
                <p className="font-bold">${plan.max}</p>
              </div>
            </div>

            {selectedPlan === plan.id && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-6 pt-6 border-t border-white/10"
              >
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Enter Amount</label>
                    <input
                      type="number"
                      placeholder={`$${plan.min} - $${plan.max}`}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-teal-500"
                      value={amount}
                      onChange={e => setAmount(e.target.value)}
                    />
                  </div>
                  <button
                    disabled={loading || !amount}
                    onClick={handleInvest}
                    className="w-full btn-primary disabled:opacity-50"
                  >
                    {loading ? 'Processing...' : 'Invest Now'}
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {message.text && (
        <div className={`p-4 rounded-xl mb-4 flex items-center gap-3 ${
          message.type === 'success' ? 'bg-teal-500/20 text-teal-400' : 'bg-red-500/20 text-red-400'
        }`}>
          <CheckCircle2 size={20} />
          <p className="text-sm font-medium">{message.text}</p>
        </div>
      )}
    </div>
  );
}
