import React, { useState } from 'react';
import { Language } from '../types';
import { 
  ShieldAlert, 
  PhoneCall, 
  Send, 
  X, 
  Mic, 
  CheckCircle2,
  MapPin
} from 'lucide-react';

interface SafetySOSModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const SafetySOSModal: React.FC<SafetySOSModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const [alertSent, setAlertSent] = useState(false);
  const [audioGuardActive, setAudioGuardActive] = useState(true);

  if (!isOpen) return null;

  const handleDispatchSOS = () => {
    setAlertSent(true);
    setTimeout(() => {
      setAlertSent(false);
      onClose();
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-rose-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border-2 border-rose-600 rounded-2xl w-full max-w-md p-5 shadow-2xl space-y-5 text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-rose-600 text-white animate-pulse">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-black text-rose-400">
                {language === 'bn' ? 'জাতীয় জরুরি সেবা ৯৯৯ এসওএস' : 'Emergency SOS 999 Alert'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {language === 'bn' ? 'ঢাকা মেট্রোপলিটন পুলিশ ও জরুরি কন্ট্রোল' : 'Dhaka Metropolitan Police Hotline'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {alertSent ? (
          <div className="text-center py-6 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
            <h4 className="text-base font-bold text-white">
              {language === 'bn' ? 'জরুরী বার্তা প্রেরিত হয়েছে!' : 'SOS Emergency Alert Dispatched!'}
            </h4>
            <p className="text-xs text-slate-300">
              {language === 'bn'
                ? 'আপনার লাইভ জিপিএস লোকেশন এবং ট্রিপের বিস্তারিত তথ্য ৯৯৯ কন্ট্রোল রুম এবং বিশ্বস্ত পরিচিতিদের কাছে পাঠানো হয়েছে।'
                : 'Live GPS location & driver details dispatched to 999 Helpline & emergency contacts.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* National Hotline Card */}
            <div className="bg-rose-950/60 border border-rose-800/80 rounded-xl p-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-rose-400 uppercase">National Hotline</span>
                <p className="text-2xl font-black text-white tracking-widest">999</p>
              </div>
              <a
                href="tel:999"
                className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs rounded-xl shadow-lg flex items-center gap-1.5"
              >
                <PhoneCall className="w-4 h-4" />
                <span>{language === 'bn' ? 'কল দিন' : 'Call 999'}</span>
              </a>
            </div>

            {/* Audio Guard Toggle */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mic className={`w-4 h-4 ${audioGuardActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                <div>
                  <p className="text-xs font-bold text-white">
                    {language === 'bn' ? 'অডিও গার্ড প্রটেকশন' : 'Audio Guard Protection'}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {language === 'bn' ? 'রাইডের সময় নিরাপত্তামূলক অডিও মনিটরিং' : 'Encrypted audio trip recording for safety'}
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={audioGuardActive}
                onChange={() => setAudioGuardActive(!audioGuardActive)}
                className="w-4 h-4 accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* Emergency Action */}
            <button
              onClick={handleDispatchSOS}
              className="w-full py-3.5 bg-gradient-to-r from-rose-600 via-rose-500 to-rose-700 text-white font-black text-sm rounded-xl shadow-xl hover:opacity-90 transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{language === 'bn' ? 'জরুরী নোটিফিকেশন পাঠান' : 'Dispatch Emergency SOS Signal'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
