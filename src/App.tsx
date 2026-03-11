import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  PieChart, 
  History, 
  Users, 
  User as UserIcon 
} from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import WelcomeScreen from './components/WelcomeScreen';
import AuthScreen from './components/AuthScreen';
import Dashboard from './components/Dashboard';
import InvestmentPlans from './components/InvestmentPlans';
import DepositScreen from './components/DepositScreen';
import WithdrawScreen from './components/WithdrawScreen';
import ReferralScreen from './components/ReferralScreen';
import ProfileScreen from './components/ProfileScreen';

function AppContent() {
  const { user } = useAuth();
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  // Navigation logic
  if (!user) {
    if (currentScreen === 'login' || currentScreen === 'signup') {
      return <AuthScreen mode={currentScreen as 'login' | 'signup'} onBack={() => setCurrentScreen('welcome')} />;
    }
    return (
      <WelcomeScreen 
        onLogin={() => setCurrentScreen('login')} 
        onSignUp={() => setCurrentScreen('signup')} 
      />
    );
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'invest': return <InvestmentPlans onBack={() => setCurrentScreen('dashboard')} />;
      case 'deposit': return <DepositScreen onBack={() => setCurrentScreen('dashboard')} />;
      case 'withdraw': return <WithdrawScreen onBack={() => setCurrentScreen('dashboard')} />;
      case 'referral': return <ReferralScreen onBack={() => setCurrentScreen('dashboard')} />;
      case 'profile': return <ProfileScreen onBack={() => setCurrentScreen('dashboard')} />;
      case 'history': return <Dashboard onNavigate={setCurrentScreen} />; // History is part of dashboard for now
      default: return <Dashboard onNavigate={setCurrentScreen} />;
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-slate-950 relative shadow-2xl shadow-black">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScreen}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2 }}
        >
          {renderScreen()}
        </motion.div>
      </AnimatePresence>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 z-50">
        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-2 flex items-center justify-around shadow-2xl">
          <NavButton 
            active={currentScreen === 'dashboard'} 
            onClick={() => setCurrentScreen('dashboard')}
            icon={<LayoutDashboard size={20} />}
            label="Home"
          />
          <NavButton 
            active={currentScreen === 'invest'} 
            onClick={() => setCurrentScreen('invest')}
            icon={<PieChart size={20} />}
            label="Invest"
          />
          <NavButton 
            active={currentScreen === 'referral'} 
            onClick={() => setCurrentScreen('referral')}
            icon={<Users size={20} />}
            label="Referral"
          />
          <NavButton 
            active={currentScreen === 'profile'} 
            onClick={() => setCurrentScreen('profile')}
            icon={<UserIcon size={20} />}
            label="Profile"
          />
        </div>
      </div>
    </div>
  );
}

function NavButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all ${
        active ? 'text-teal-400 bg-teal-500/10' : 'text-slate-500 hover:text-slate-300'
      }`}
    >
      {icon}
      <span className="text-[10px] font-bold uppercase tracking-tighter">{label}</span>
    </button>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
