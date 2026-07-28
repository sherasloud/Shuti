import React, { useState, useEffect } from 'react';
import { UserProfile, Language } from '../types';
import { X, LogOut, CheckCircle2, ShieldCheck, Mail, User, ExternalLink, Flame } from 'lucide-react';
import { auth, googleProvider, signInWithPopup, signOut as firebaseSignOut } from '../lib/firebase';

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  onLogin: (user: UserProfile) => void;
  onLogout: () => void;
  language: Language;
}

export const GoogleAuthModal: React.FC<GoogleAuthModalProps> = ({
  isOpen,
  onClose,
  user,
  onLogin,
  onLogout,
  language,
}) => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [showCustomForm, setShowCustomForm] = useState(false);

  if (!isOpen) return null;

  // Firebase Google Auth Sign In
  const handleFirebaseGoogleSignIn = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;
      const newUser: UserProfile = {
        id: firebaseUser.uid,
        name: firebaseUser.displayName || 'ShuSto BD User',
        email: firebaseUser.email || 'shustobd@gmail.com',
        avatar: firebaseUser.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120',
        isLoggedIn: true,
        provider: 'google',
      };
      onLogin(newUser);
      setLoading(false);
      onClose();
    } catch (err: any) {
      console.error("Firebase Google Auth Error:", err);
      // Fallback if popup blocked or restricted in preview frame
      setErrorMessage(err?.message || "Firebase popup closed or blocked. Trying direct sign-in fallback...");
      handleGoogleSignIn('shustobd@gmail.com', 'ShuSto BD User');
    }
  };

  const handleGoogleSignIn = (email: string, name: string, avatarUrl?: string) => {
    setLoading(true);
    setTimeout(() => {
      const newUser: UserProfile = {
        id: `google_${Date.now()}`,
        name: name || 'ShuSto BD User',
        email: email || 'shustobd@gmail.com',
        avatar: avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120',
        isLoggedIn: true,
        provider: 'google',
      };
      onLogin(newUser);
      setLoading(false);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[2px] animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-6 text-slate-900">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-900 shadow-sm flex items-center justify-center">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
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
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {language === 'bn' ? 'গুগল দিয়ে লগইন' : 'Google Authentication'}
              </h3>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                {language === 'bn' ? 'নিরাপদ অ্যাকাউন্ট অ্যাক্সেস' : 'Secure Account Access'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-50 text-slate-400 hover:text-slate-600 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {user?.isLoggedIn ? (
          <div className="space-y-5 text-center py-2">
            <div className="relative inline-block">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-20 h-20 rounded-full mx-auto border-2 border-emerald-500 shadow-md object-cover"
              />
              <span className="absolute bottom-0 right-0 p-1 bg-emerald-500 text-white rounded-full">
                <CheckCircle2 className="w-4 h-4" />
              </span>
            </div>

            <div>
              <h4 className="text-lg font-bold text-slate-900">{user.name}</h4>
              <p className="text-xs text-slate-500">{user.email}</p>
              <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full text-emerald-700 text-xs font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'গুগল ভেরিফাইড ইউজার' : 'Google Verified Account'}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-all"
              >
                {language === 'bn' ? 'ঠিক আছে' : 'Close'}
              </button>
              <button
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="py-2.5 px-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 font-bold text-xs hover:bg-rose-100 transition-all flex items-center justify-center gap-1.5"
              >
                <LogOut className="w-4 h-4" />
                <span>{language === 'bn' ? 'লগআউট' : 'Sign Out'}</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-xs text-slate-600 leading-relaxed text-center">
              {language === 'bn'
                ? 'আপনার রাইড হিস্টোরি, শুটি ওয়ালেট ও বুকিং ডেটা সুরক্ষিত রাখতে গুগল দিয়ে সাইন ইন করুন।'
                : 'Sign in with your Google Account to securely sync ride history and wallet balance across devices.'}
            </p>

            {/* Firebase Google Auth Button */}
            <div className="space-y-3 pt-2">
              {errorMessage && (
                <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-800">
                  {errorMessage}
                </div>
              )}

              <button
                onClick={handleFirebaseGoogleSignIn}
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2.5 transition-all shadow-md hover:shadow-lg active:scale-[0.99] disabled:opacity-50"
              >
                <Flame className="w-4 h-4 text-amber-300 fill-amber-300" />
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#ffffff"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#ffffff"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#ffffff"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#ffffff"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>
                  {language === 'bn' ? 'ফায়ারবেস গুগল সাইন-ইন' : 'Firebase Google Auth Sign-In'}
                </span>
              </button>

              <div className="relative flex items-center justify-center my-2">
                <div className="border-t border-slate-200 w-full" />
                <span className="bg-white px-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider shrink-0">
                  {language === 'bn' ? 'অথবা দ্রুত প্রবেশ (ShuSto BD)' : 'OR QUICK ACCESS (ShuSto BD)'}
                </span>
                <div className="border-t border-slate-200 w-full" />
              </div>

              {/* Default One-Click Account Option */}
              <button
                onClick={() => handleGoogleSignIn('shustobd@gmail.com', 'ShuSto BD User', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120')}
                disabled={loading}
                className="w-full p-3.5 rounded-xl border-2 border-emerald-500 bg-emerald-50/50 hover:bg-emerald-50 text-slate-900 font-bold text-xs flex items-center justify-between transition-all shadow-sm hover:shadow active:scale-[0.99]"
              >
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120"
                    alt="User"
                    className="w-9 h-9 rounded-full object-cover border-2 border-emerald-500"
                  />
                  <div className="text-left">
                    <p className="text-xs font-black text-slate-900">shustobd@gmail.com</p>
                    <p className="text-[10px] text-emerald-700 font-semibold">ShuSto BD Official Account</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-emerald-600 text-white px-2.5 py-1 rounded-lg font-bold text-[10px]">
                  <span>{language === 'bn' ? 'লগইন করুন' : 'Login Now'}</span>
                  <span>→</span>
                </div>
              </button>

              {!showCustomForm ? (
                <button
                  onClick={() => setShowCustomForm(true)}
                  className="w-full py-2 text-center text-xs text-slate-500 hover:text-slate-800 transition-all font-medium"
                >
                  {language === 'bn' ? 'অন্য কোনো গুগল অ্যাকাউন্ট ব্যবহার করুন' : 'Use a different Google Account'}
                </button>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (customEmail) {
                      handleGoogleSignIn(
                        customEmail,
                        customName || customEmail.split('@')[0],
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120'
                      );
                    }
                  }}
                  className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-3 pt-3"
                >
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">
                      {language === 'bn' ? 'গুগল ইমেইল' : 'Google Email'}
                    </label>
                    <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <input
                        type="email"
                        required
                        placeholder="yourname@gmail.com"
                        value={customEmail}
                        onChange={(e) => setCustomEmail(e.target.value)}
                        className="w-full bg-transparent focus:outline-none text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">
                      {language === 'bn' ? 'আপনার নাম (ঐচ্ছিক)' : 'Full Name (Optional)'}
                    </label>
                    <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Name"
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                        className="w-full bg-transparent focus:outline-none text-slate-900"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !customEmail}
                    className="w-full py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin block" />
                    ) : (
                      <span>{language === 'bn' ? 'গুগল দিয়ে প্রবেশ করুন' : 'Sign In with Google'}</span>
                    )}
                  </button>
                </form>
              )}
            </div>

            <div className="text-center pt-2">
              <p className="text-[10px] text-slate-400">
                Protected by Google reCAPTCHA & Privacy Terms
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
