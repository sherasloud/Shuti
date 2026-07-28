import React, { useState } from 'react';
import { Language } from '../types';
import { 
  Wallet, 
  Plus, 
  X, 
  CheckCircle2, 
  CreditCard, 
  Sparkles
} from 'lucide-react';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  balance: number;
  onTopUp: (amount: number) => void;
  language: Language;
}

export const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onClose,
  balance,
  onTopUp,
  language,
}) => {
  const [topUpAmount, setTopUpAmount] = useState<number>(500);
  const [selectedMethod, setSelectedMethod] = useState<'bkash' | 'nagad'>('bkash');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleTopUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onTopUp(topUpAmount);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-5 shadow-2xl space-y-4 text-white">
        
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-950 border border-emerald-700 text-emerald-400">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {language === 'bn' ? 'শুটি পে ওয়ালেট' : 'Shuti Pay Wallet'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {language === 'bn' ? 'ক্যাশলেস রাইডের জন্য ওয়ালেট ব্যালেন্স' : 'Cashless ride balance & top-up'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Balance Display */}
        <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 border border-emerald-800/80 rounded-xl p-4 text-center space-y-1 shadow-inner">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            {language === 'bn' ? 'বর্তমান ব্যালেন্স' : 'Current Balance'}
          </span>
          <span className="text-3xl font-black text-emerald-400 tracking-tight">
            ৳ {balance}
          </span>
        </div>

        {success ? (
          <div className="text-center py-4 text-emerald-400 font-bold text-sm flex flex-col items-center gap-2">
            <CheckCircle2 className="w-10 h-10 animate-bounce" />
            <span>{language === 'bn' ? '৳' + topUpAmount + ' রিচার্জ সফল হয়েছে!' : '৳' + topUpAmount + ' Added Successfully!'}</span>
          </div>
        ) : (
          <form onSubmit={handleTopUpSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase">
                {language === 'bn' ? 'রিচার্জের পরিমাণ (BDT)' : 'Select Top-Up Amount'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[200, 500, 1000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setTopUpAmount(amt)}
                    className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                      topUpAmount === amt
                        ? 'bg-emerald-600 text-white border-emerald-500 shadow'
                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    ৳ {amt}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase">
                {language === 'bn' ? 'মোবাইল ব্যাংকিং রিচার্জ' : 'Recharge Via MFS'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedMethod('bkash')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                    selectedMethod === 'bkash'
                      ? 'bg-pink-950 text-pink-300 border-pink-600 ring-2 ring-pink-600/40'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  🌸 bKash
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedMethod('nagad')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                    selectedMethod === 'nagad'
                      ? 'bg-orange-950 text-orange-300 border-orange-600 ring-2 ring-orange-600/40'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  🟠 Nagad
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>{language === 'bn' ? 'টাকা যোগ করুন (৳' + topUpAmount + ')' : 'Top Up ৳' + topUpAmount}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
