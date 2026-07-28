import React from 'react';
import { Navigation, Wallet, ShieldAlert, History, Sparkles, User } from 'lucide-react';
import { Language, UserProfile } from '../types';

interface BottomNavBarProps {
  activeTab: 'ride' | 'wallet' | 'history' | 'ai' | 'sos' | 'account';
  onSelectTab: (tab: 'ride' | 'wallet' | 'history' | 'ai' | 'sos' | 'account') => void;
  walletBalance: number;
  user: UserProfile | null;
  language: Language;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onSelectTab,
  walletBalance,
  user,
  language,
}) => {
  return (
    <div className="bg-white border-t border-slate-100 px-3 py-2 flex items-center justify-around shadow-lg z-30 shrink-0">
      {/* Ride Tab */}
      <button
        onClick={() => onSelectTab('ride')}
        className={`flex flex-col items-center gap-1 transition-all ${
          activeTab === 'ride' ? 'text-emerald-600 font-bold' : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <div className={`p-1.5 rounded-full ${activeTab === 'ride' ? 'bg-emerald-50' : ''}`}>
          <Navigation className="w-5 h-5 rotate-45" />
        </div>
        <span className="text-[10px]">{language === 'bn' ? 'রাইড' : 'Ride'}</span>
      </button>

      {/* Wallet Tab */}
      <button
        onClick={() => onSelectTab('wallet')}
        className={`flex flex-col items-center gap-1 transition-all relative ${
          activeTab === 'wallet' ? 'text-emerald-600 font-bold' : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <div className={`p-1.5 rounded-full ${activeTab === 'wallet' ? 'bg-emerald-50' : ''}`}>
          <Wallet className="w-5 h-5" />
        </div>
        <span className="text-[10px]">{language === 'bn' ? 'ওয়ালেট' : 'Wallet'}</span>
        <span className="absolute -top-1 -right-1 text-[8px] bg-emerald-600 text-white font-extrabold px-1.5 py-0.2 rounded-full">
          ৳{walletBalance}
        </span>
      </button>

      {/* SOS 999 Tab */}
      <button
        onClick={() => onSelectTab('sos')}
        className={`flex flex-col items-center gap-1 transition-all ${
          activeTab === 'sos' ? 'text-rose-600 font-bold' : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <div className="p-1.5 rounded-full bg-rose-50 text-rose-600">
          <ShieldAlert className="w-5 h-5 animate-pulse" />
        </div>
        <span className="text-[10px] font-bold text-rose-600">৯৯৯</span>
      </button>

      {/* History Tab */}
      <button
        onClick={() => onSelectTab('history')}
        className={`flex flex-col items-center gap-1 transition-all ${
          activeTab === 'history' ? 'text-emerald-600 font-bold' : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <div className={`p-1.5 rounded-full ${activeTab === 'history' ? 'bg-emerald-50' : ''}`}>
          <History className="w-5 h-5" />
        </div>
        <span className="text-[10px]">{language === 'bn' ? 'ইতিহাস' : 'History'}</span>
      </button>

      {/* AI Guide Tab */}
      <button
        onClick={() => onSelectTab('ai')}
        className={`flex flex-col items-center gap-1 transition-all ${
          activeTab === 'ai' ? 'text-emerald-600 font-bold' : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <div className={`p-1.5 rounded-full ${activeTab === 'ai' ? 'bg-emerald-50' : ''}`}>
          <Sparkles className="w-5 h-5" />
        </div>
        <span className="text-[10px]">{language === 'bn' ? 'এআই' : 'AI Guide'}</span>
      </button>

      {/* Account Tab */}
      <button
        onClick={() => onSelectTab('account')}
        className={`flex flex-col items-center gap-1 transition-all ${
          activeTab === 'account' ? 'text-emerald-600 font-bold' : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        {user?.isLoggedIn ? (
          <img
            src={user.avatar}
            alt={user.name}
            className={`w-6 h-6 rounded-full object-cover border ${
              activeTab === 'account' ? 'border-emerald-600 ring-2 ring-emerald-200' : 'border-slate-300'
            }`}
          />
        ) : (
          <div className={`p-1.5 rounded-full ${activeTab === 'account' ? 'bg-emerald-50' : ''}`}>
            <User className="w-5 h-5" />
          </div>
        )}
        <span className="text-[10px]">{language === 'bn' ? 'প্রোফাইল' : 'Account'}</span>
      </button>
    </div>
  );
};
