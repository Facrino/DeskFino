import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp, ShieldCheck, Zap } from 'lucide-react';

interface WelcomeScreenProps {
  onSignUp: () => void;
  onLogin: () => void;
}

export default function WelcomeScreen({ onSignUp, onLogin }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-slate-950 via-teal-950 to-slate-950 overflow-hidden relative">
      {/* Decorative elements */}
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-teal-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-700" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center z-10"
      >
        <div className="relative inline-block mb-8">
          <div className="w-24 h-24 bg-gradient-to-tr from-teal-400 to-blue-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-teal-500/30">
            <TrendingUp size={48} className="text-white" />
          </div>
          <motion.div 
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full border-4 border-slate-950"
          />
        </div>

        <h1 className="text-5xl font-bold tracking-tighter mb-2 bg-gradient-to-r from-white to-teal-300 bg-clip-text text-transparent">
          Finovex
        </h1>
        <p className="text-teal-400 font-medium mb-12 tracking-widest uppercase text-xs">
          Smart Investment App
        </p>

        <div className="space-y-4 w-full max-w-xs mx-auto">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onSignUp}
            className="w-full btn-primary"
          >
            Sign Up
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onLogin}
            className="w-full btn-secondary"
          >
            Login
          </motion.button>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="mt-16 grid grid-cols-3 gap-8 text-slate-400"
      >
        <div className="flex flex-col items-center gap-2">
          <ShieldCheck size={20} className="text-teal-500" />
          <span className="text-[10px] uppercase tracking-tighter">Secure</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Zap size={20} className="text-teal-500" />
          <span className="text-[10px] uppercase tracking-tighter">Fast</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <TrendingUp size={20} className="text-teal-500" />
          <span className="text-[10px] uppercase tracking-tighter">Profit</span>
        </div>
      </motion.div>
    </div>
  );
}
