import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Copy, Share2, Users, Gift, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface ReferralScreenProps {
  onBack: () => void;
}

export default function ReferralScreen({ onBack }: ReferralScreenProps) {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  const referralLink = `${window.location.origin}/signup?ref=${user?.referral_code}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(user?.referral_code || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join Finovex',
          text: 'Start investing with Finovex and get high returns!',
          url: referralLink
        });
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 text-slate-400 hover:text-white">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-2xl font-bold">Referral Program</h2>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="glass-card p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 to-blue-500" />
          <div className="w-20 h-20 bg-teal-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-teal-500">
            <Gift size={40} />
          </div>
          <h3 className="text-2xl font-bold mb-2">Earn 5% Commission</h3>
          <p className="text-slate-400 text-sm mb-8">Invite your friends and earn a percentage of every investment they make.</p>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
              <p className="text-slate-500 text-[10px] uppercase font-bold mb-1">Total Referrals</p>
              <p className="text-xl font-bold">0</p>
            </div>
            <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
              <p className="text-slate-500 text-[10px] uppercase font-bold mb-1">Total Earned</p>
              <p className="text-xl font-bold text-teal-400">$0.00</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-slate-900 rounded-2xl p-6 border border-white/5">
            <p className="text-slate-500 text-xs font-bold uppercase mb-4">Your Referral Code</p>
            <div className="flex items-center justify-between bg-black/30 rounded-xl p-4 border border-white/10">
              <p className="text-2xl font-mono font-bold tracking-widest text-teal-400">{user?.referral_code}</p>
              <button onClick={handleCopy} className="p-2 text-slate-400 hover:text-white">
                {copied ? <CheckCircle2 size={24} className="text-teal-500" /> : <Copy size={24} />}
              </button>
            </div>
          </div>

          <button onClick={handleShare} className="w-full btn-primary flex items-center justify-center gap-2">
            <Share2 size={20} />
            Share Referral Link
          </button>
        </div>

        <div className="glass-card p-6">
          <h4 className="font-bold mb-4 flex items-center gap-2">
            <Users size={18} className="text-teal-500" />
            How it works
          </h4>
          <ul className="space-y-4">
            <li className="flex gap-4">
              <div className="w-6 h-6 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-500 text-xs font-bold shrink-0">1</div>
              <p className="text-slate-400 text-sm">Share your unique referral link or code with your network.</p>
            </li>
            <li className="flex gap-4">
              <div className="w-6 h-6 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-500 text-xs font-bold shrink-0">2</div>
              <p className="text-slate-400 text-sm">Your friends sign up and make their first investment.</p>
            </li>
            <li className="flex gap-4">
              <div className="w-6 h-6 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-500 text-xs font-bold shrink-0">3</div>
              <p className="text-slate-400 text-sm">You receive a 5% commission instantly in your balance.</p>
            </li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
}
