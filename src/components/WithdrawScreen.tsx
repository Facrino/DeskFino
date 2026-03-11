import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Wallet, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, addDoc, doc, updateDoc, increment } from 'firebase/firestore';

interface WithdrawScreenProps {
  onBack: () => void;
}

export default function WithdrawScreen({ onBack }: WithdrawScreenProps) {
  const { user, dashboard } = useAuth();
  const [amount, setAmount] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');

  const handleWithdraw = async () => {
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount < 11) {
      setError('Minimum withdrawal is $11.00');
      return;
    }
    if (numAmount > (dashboard?.balance || 0)) {
      setError('Insufficient balance');
      return;
    }
    if (!address) {
      setError('Please enter your USDT address');
      return;
    }
    if (!user) return;

    setLoading(true);
    try {
      // Add transaction
      await addDoc(collection(db, 'transactions'), {
        userId: user.id,
        type: 'withdraw',
        amount: numAmount,
        status: 'pending',
        address: address,
        created_at: new Date().toISOString()
      });

      // Update user balance
      await updateDoc(doc(db, 'users', user.id as any), {
        balance: increment(-numAmount)
      });

      setStep(2);
    } catch (err: any) {
      setError(err.message || 'Withdrawal failed');
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
        <h2 className="text-2xl font-bold">Withdraw Funds</h2>
      </div>

      {step === 1 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="glass-card p-6">
            <div className="flex justify-between items-center mb-4">
              <p className="text-xs font-bold text-slate-500 uppercase">Available Balance</p>
              <p className="text-teal-400 font-bold">${dashboard?.balance.toLocaleString() || '0.00'}</p>
            </div>
            
            <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Amount to Withdraw</label>
            <div className="relative mb-6">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-500 font-bold text-xl">$</span>
              <input
                type="number"
                placeholder="0.00"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-6 pl-10 pr-4 text-3xl font-bold focus:outline-none focus:border-teal-500"
                value={amount}
                onChange={e => {
                  setAmount(e.target.value);
                  setError('');
                }}
              />
            </div>

            <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">USDT (TRC20) Address</label>
            <input
              type="text"
              placeholder="Enter your wallet address"
              className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 focus:outline-none focus:border-teal-500 text-sm font-mono"
              value={address}
              onChange={e => {
                setAddress(e.target.value);
                setError('');
              }}
            />
            
            {error && (
              <div className="mt-4 flex items-center gap-2 text-red-400 text-xs font-medium">
                <AlertCircle size={14} />
                <span>{error}</span>
              </div>
            )}
            
            <p className="text-slate-500 text-[10px] mt-4">Minimum withdrawal: $11.00. Processing time: 1-24 hours.</p>
          </div>

          <button
            disabled={loading || !amount || !address}
            onClick={handleWithdraw}
            className="w-full btn-primary disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Withdraw Now'}
          </button>
        </motion.div>
      )}

      {step === 2 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }} 
          className="text-center py-12"
        >
          <div className="w-20 h-20 bg-teal-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-teal-500">
            <CheckCircle2 size={48} />
          </div>
          <h3 className="text-2xl font-bold mb-2">Request Submitted!</h3>
          <p className="text-slate-400 mb-8 px-8">Your withdrawal request is being processed. You will receive your funds shortly.</p>
          <button onClick={onBack} className="w-full btn-primary max-w-xs mx-auto">
            Back to Dashboard
          </button>
        </motion.div>
      )}
    </div>
  );
}
