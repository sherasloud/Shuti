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
    <div className="bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 sm:px-6 py-2.5 flex items-center justify-between sm:justify-around shadow-2xl z-40 shrink-0 max-w-7xl mx-auto">
      {/* Ride Tab */}
      <button
        onClick={() => onSelectTab('ride')}
        className={`flex-1 flex flex-col items-center gap-1 transition-all ${
          activeTab === 'ride' ? 'text-emerald-600 font-extrabold scale-105' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <div className={`p-1.5 rounded-2xl transition-colors ${activeTab === 'ride' ? 'bg-emerald-100 text-emerald-700' : ''}`}>
          <Navigation className="w-5 h-5 rotate-45" />
        </div>
        <span className="text-[11px] tracking-tight">{language === 'bn' ? 'রাইড' : 'Ride'}</span>
      </button>

      {/* Wallet Tab with Balance */}
      <button
        onClick={() => onSelectTab('wallet')}
        className={`flex-1 flex flex-col items-center gap-1 transition-all relative ${
          activeTab === 'wallet' ? 'text-emerald-600 font-extrabold scale-105' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <div className={`p-1.5 rounded-2xl relative transition-colors ${activeTab === 'wallet' ? 'bg-emerald-100 text-emerald-700' : ''}`}>
          <Wallet className="w-5 h-5" />
          <span className="absolute -top-1.5 -right-3 text-[9px] bg-emerald-600 text-white font-extrabold px-1.5 py-0.5 rounded-full shadow-sm border border-white">
            ৳{walletBalance}
          </span>
        </div>
        <span className="text-[11px] tracking-tight">{language === 'bn' ? 'ওয়ালেট' : 'Wallet'}</span>
      </button>

      {/* SOS 999 Emergency Tab */}
      <button
        onClick={() => onSelectTab('sos')}
        className={`flex-1 flex flex-col items-center gap-1 transition-all ${
          activeTab === 'sos' ? 'text-rose-600 font-extrabold scale-105' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <div className="p-1.5 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 shadow-sm">
          <ShieldAlert className="w-5 h-5 animate-pulse" />
        </div>
        <span className="text-[11px] font-extrabold text-rose-600">৯৯৯ SOS</span>
      </button>

      {/* History Tab */}
      <button
        onClick={() => onSelectTab('history')}
        className={`flex-1 flex flex-col items-center gap-1 transition-all ${
          activeTab === 'history' ? 'text-emerald-600 font-extrabold scale-105' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <div className={`p-1.5 rounded-2xl transition-colors ${activeTab === 'history' ? 'bg-emerald-100 text-emerald-700' : ''}`}>
          <History className="w-5 h-5" />
        </div>
        <span className="text-[11px] tracking-tight">{language === 'bn' ? 'ইতিহাস' : 'History'}</span>
      </button>

      {/* AI Route Guide Tab */}
      <button
        onClick={() => onSelectTab('ai')}
        className={`flex-1 flex flex-col items-center gap-1 transition-all ${
          activeTab === 'ai' ? 'text-emerald-600 font-extrabold scale-105' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <div className={`p-1.5 rounded-2xl transition-colors ${activeTab === 'ai' ? 'bg-emerald-100 text-emerald-700' : ''}`}>
          <Sparkles className="w-5 h-5" />
        </div>
        <span className="text-[11px] tracking-tight">{language === 'bn' ? 'ছুটি এআই' : 'AI Guide'}</span>
      </button>

      {/* Account / Google Auth Tab */}
      <button
        onClick={() => onSelectTab('account')}
        className={`flex-1 flex flex-col items-center gap-1 transition-all ${
          activeTab === 'account' ? 'text-emerald-600 font-extrabold scale-105' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        {user?.isLoggedIn ? (
          <img
            src={user.avatar}
            alt={user.name}
            className={`w-6 h-6 rounded-full object-cover border-2 ${
              activeTab === 'account' ? 'border-emerald-600 ring-2 ring-emerald-200' : 'border-slate-300'
            }`}
          />
        ) : (
          <div className={`p-1.5 rounded-2xl transition-colors ${activeTab === 'account' ? 'bg-emerald-100 text-emerald-700' : ''}`}>
            <User className="w-5 h-5" />
          </div>
        )}
        <span className="text-[11px] tracking-tight">{user?.isLoggedIn ? user.name.split(' ')[0] : (language === 'bn' ? 'প্রোফাইল' : 'Profile')}</span>
      </button>
    </div>
  );
};
