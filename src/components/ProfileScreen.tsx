import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  User as UserIcon, 
  Shield, 
  Lock, 
  HelpCircle, 
  LogOut, 
  ChevronRight, 
  MessageSquare, 
  Mail,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface ProfileScreenProps {
  onBack: () => void;
}

export default function ProfileScreen({ onBack }: ProfileScreenProps) {
  const { user, logout } = useAuth();

  const menuItems = [
    { icon: <Shield size={20} />, label: 'Account Security', sub: '2FA, Password' },
    { icon: <Lock size={20} />, label: 'Privacy Policy', sub: 'Data usage' },
    { icon: <HelpCircle size={20} />, label: 'Support / Help', sub: 'FAQs, Guides' },
    { icon: <MessageSquare size={20} />, label: 'Chat Support', sub: 'Talk to us' },
    { icon: <Mail size={20} />, label: 'Email Support', sub: 'support@finovex.com' },
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="p-6 bg-gradient-to-b from-teal-500/20 to-transparent">
        <button onClick={onBack} className="mb-6 p-2 text-slate-400 hover:text-white">
          <ArrowLeft size={24} />
        </button>
        
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-3xl bg-teal-500/20 flex items-center justify-center border-2 border-teal-500/30 mb-4 relative">
            <UserIcon size={48} className="text-teal-500" />
            <div className="absolute -bottom-2 -right-2 bg-teal-500 text-white p-1.5 rounded-xl border-4 border-slate-950">
              <Shield size={14} />
            </div>
          </div>
          <h3 className="text-2xl font-bold">{user?.name}</h3>
          <p className="text-slate-500 text-sm">{user?.email}</p>
          <div className="mt-4 px-4 py-1 bg-teal-500/10 rounded-full border border-teal-500/20">
            <span className="text-teal-400 text-[10px] uppercase font-bold tracking-widest">Silver Plan Member</span>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="px-6 space-y-3 pb-24">
        {menuItems.map((item, idx) => (
          <motion.button
            key={idx}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-between p-4 glass-card group"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-teal-500 transition-colors">
                {item.icon}
              </div>
              <div className="text-left">
                <p className="font-bold text-sm">{item.label}</p>
                <p className="text-slate-500 text-[10px]">{item.sub}</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-slate-600" />
          </motion.button>
        ))}

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={logout}
          className="w-full flex items-center justify-between p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 mt-8"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
              <LogOut size={20} />
            </div>
            <p className="font-bold text-sm">Logout</p>
          </div>
        </motion.button>
      </div>
    </div>
  );
}
