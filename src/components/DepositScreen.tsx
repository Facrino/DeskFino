import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Copy, CheckCircle2, Wallet, ExternalLink } from 'lucide-react';
import { CRYPTO_ADDRESS } from '../constants';
import { useAuth } from '../context/AuthContext';

interface DepositScreenProps {
  onBack: () => void;
}

export default function DepositScreen({ onBack }: DepositScreenProps) {
  const { user, refreshDashboard } = useAuth();
  const [amount, setAmount] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const handleCopy = () => {
    navigator.clipboard.writeText(CRYPTO_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async () => {
    if (!amount) return;
    setLoading(true);
    try {
      const res = await fetch('/api/transactions/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id, amount: parseFloat(amount) })
      });
      if (res.ok) {
        setStep(3);
        refreshDashboard();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 text-slate-400 hover:text-white">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-2xl font-bold">Deposit Funds</h2>
      </div>

      {step === 1 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="glass-card p-6">
            <label className="text-xs font-bold text-slate-500 uppercase mb-4 block">Enter Amount (USD)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-500 font-bold text-xl">$</span>
              <input
                type="number"
                placeholder="0.00"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-6 pl-10 pr-4 text-3xl font-bold focus:outline-none focus:border-teal-500"
                value={amount}
                onChange={e => setAmount(e.target.value)}
              />
            </div>
            <p className="text-slate-500 text-xs mt-4">Minimum deposit: $10.00</p>
          </div>

          <button
            disabled={!amount || parseFloat(amount) < 10}
            onClick={() => setStep(2)}
            className="w-full btn-primary disabled:opacity-50"
          >
            Continue to Payment
          </button>
        </motion.div>
      )}

      {step === 2 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-500">
                <Wallet size={20} />
              </div>
              <div>
                <h3 className="font-bold">USDT (TRC20)</h3>
                <p className="text-slate-500 text-xs">Send exact amount to address below</p>
              </div>
            </div>

            <div className="bg-slate-900 rounded-2xl p-4 mb-6 border border-white/5">
              <p className="text-slate-500 text-[10px] uppercase font-bold mb-2">Deposit Address</p>
              <div className="flex items-center justify-between gap-4">
                <p className="text-xs font-mono break-all text-teal-400">{CRYPTO_ADDRESS}</p>
                <button onClick={handleCopy} className="p-2 text-slate-400 hover:text-white">
                  {copied ? <CheckCircle2 size={20} className="text-teal-500" /> : <Copy size={20} />}
                </button>
              </div>
            </div>

            <div className="space-y-3 text-sm text-slate-400">
              <div className="flex justify-between">
                <span>Amount to pay:</span>
                <span className="text-white font-bold">${amount} USDT</span>
              </div>
              <div className="flex justify-between">
                <span>Network:</span>
                <span className="text-white font-bold">TRC20</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              disabled={loading}
              onClick={handleSubmit}
              className="w-full btn-primary"
            >
              {loading ? 'Verifying...' : 'I have paid'}
            </button>
            <button
              onClick={() => setStep(1)}
              className="w-full btn-secondary"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      )}

      {step === 3 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }} 
          className="text-center py-12"
        >
          <div className="w-20 h-20 bg-teal-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-teal-500">
            <CheckCircle2 size={48} />
          </div>
          <h3 className="text-2xl font-bold mb-2">Deposit Received!</h3>
          <p className="text-slate-400 mb-8 px-8">Your balance has been updated. You can now start investing.</p>
          <button onClick={onBack} className="w-full btn-primary max-w-xs mx-auto">
            Back to Dashboard
          </button>
        </motion.div>
      )}
    </div>
  );
}
