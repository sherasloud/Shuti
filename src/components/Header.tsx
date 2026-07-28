import React from 'react';
import { Language, AppMode, UserProfile } from '../types';
import { 
  Navigation, 
  Globe, 
  Wallet, 
  ShieldAlert, 
  Sparkles, 
  History, 
  UserCheck, 
  Car,
  User
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
  user: UserProfile | null;
  onOpenGoogleAuth: () => void;
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
  user,
  onOpenGoogleAuth,
}) => {
  return (
    <header className="bg-white text-slate-900 border-b border-slate-200 sticky top-0 z-40 shadow-sm backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="relative group flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white transition-all shadow-sm">
              <Navigation className="w-5 h-5 rotate-45" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-slate-900">
                  Shuti
                </span>
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-rose-500 text-white uppercase tracking-wider">
                  BD
                </span>
              </div>
              <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-tight">
                {language === 'bn' ? 'ছুটি • রাইড শেয়ারিং বাংলাদেশ' : 'Ride Sharing Bangladesh'}
              </p>
            </div>
          </div>
        </div>

        {/* Right Action Controls: Mode Switcher, Language Switcher & Profile/Login */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Mode Badge (Passenger / Captain Driver) */}
          <button
            onClick={onToggleAppMode}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
              appMode === 'passenger'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
            }`}
            title="Switch between Passenger View and Captain Driver View"
          >
            {appMode === 'passenger' ? (
              <>
                <Car className="w-3.5 h-3.5 text-emerald-600" />
                <span>{language === 'bn' ? 'যাত্রী মোড' : 'Passenger View'}</span>
              </>
            ) : (
              <>
                <UserCheck className="w-3.5 h-3.5 text-rose-600" />
                <span>{language === 'bn' ? 'ক্যাপ্টেন ড্রাইভার' : 'Captain Driver'}</span>
              </>
            )}
          </button>

          {/* Language Switcher */}
          <button
            onClick={onToggleLanguage}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 transition-all text-xs font-bold"
          >
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <span>{language === 'en' ? 'বাংলা' : 'EN'}</span>
          </button>

          {/* Google Auth Login / Profile Pill */}
          <button
            onClick={onOpenGoogleAuth}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-sm ${
              user?.isLoggedIn
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
                : 'bg-slate-900 text-white hover:bg-slate-800 border-slate-900'
            }`}
            title="Google Sign-In / Account"
          >
            {user?.isLoggedIn ? (
              <>
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-4 h-4 rounded-full object-cover border border-emerald-400"
                />
                <span className="hidden md:inline max-w-[90px] truncate">{user.name.split(' ')[0]}</span>
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span className="hidden sm:inline">
                  {language === 'bn' ? 'লগইন' : 'Login'}
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
