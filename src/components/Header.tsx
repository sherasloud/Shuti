import React from 'react';
import { Language, AppMode } from '../types';
import { 
  Navigation, 
  Globe, 
  Wallet, 
  ShieldAlert, 
  Sparkles, 
  History, 
  UserCheck, 
  Car
} from 'lucide-react';

interface HeaderProps {
  language: Language;
  onToggleLanguage: () => void;
  appMode: AppMode;
  onToggleAppMode: () => void;
  walletBalance: number;
  onOpenWallet: () => void;
  onOpenHistory: () => void;
  onOpenAIGuide: () => void;
  onTriggerSOS: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onToggleLanguage,
  appMode,
  onToggleAppMode,
  walletBalance,
  onOpenWallet,
  onOpenHistory,
  onOpenAIGuide,
  onTriggerSOS,
}) => {
  return (
    <header className="bg-white text-slate-900 border-b border-slate-200 sticky top-0 z-40 shadow-sm backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="relative group cursor-pointer flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-100 transform group-hover:scale-105 transition-all">
              <Navigation className="w-6 h-6 rotate-45" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-slate-900">
                  Shuti
                </span>
                <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-rose-600 text-white uppercase tracking-wider">
                  BD
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium">
                {language === 'bn' ? 'ছুটি • নিরাপদ ও দ্রুত রাইড' : 'Seamless Bangladesh Rides'}
              </p>
            </div>
          </div>

          {/* Mode Badge (Passenger / Captain) */}
          <button
            onClick={onToggleAppMode}
            className={`hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
              appMode === 'passenger'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
            }`}
            title="Switch between Passenger View and Captain Driver View"
          >
            {appMode === 'passenger' ? (
              <>
                <Car className="w-3.5 h-3.5 text-emerald-500" />
                <span>{language === 'bn' ? 'যাত্রী মোড' : 'Passenger View'}</span>
              </>
            ) : (
              <>
                <UserCheck className="w-3.5 h-3.5 text-rose-500" />
                <span>{language === 'bn' ? 'ক্যাপ্টেন ড্রাইভার' : 'Captain Driver'}</span>
              </>
            )}
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* AI Route Advisor Trigger */}
          <button
            onClick={onOpenAIGuide}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium hover:bg-emerald-100 transition-all shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span className="hidden sm:inline">
              {language === 'bn' ? 'ছুটি এআই গাইড' : 'AI Route Guide'}
            </span>
          </button>

          {/* Wallet Pill */}
          <button
            onClick={onOpenWallet}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 hover:bg-slate-100 transition-all text-xs font-bold shadow-sm"
          >
            <Wallet className="w-3.5 h-3.5 text-emerald-600" />
            <span>৳ {walletBalance}</span>
          </button>

          {/* Ride History */}
          <button
            onClick={onOpenHistory}
            className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-500 hover:bg-slate-100 transition-all"
            title="Trip History"
          >
            <History className="w-4 h-4" />
          </button>

          {/* Language Switcher */}
          <button
            onClick={onToggleLanguage}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 transition-all text-xs font-semibold"
          >
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <span>{language === 'en' ? 'বাংলা' : 'EN'}</span>
          </button>

          {/* Emergency 999 SOS Button */}
          <button
            onClick={onTriggerSOS}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-lg shadow-rose-100"
            title="National Police Helpline 999 SOS"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">SOS 999</span>
          </button>
        </div>
      </div>
    </header>
  );
};
