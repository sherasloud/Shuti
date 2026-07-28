import React from 'react';
import { RideHistoryItem, Language } from '../types';
import { 
  History, 
  X, 
  MapPin, 
  Navigation, 
  CheckCircle2, 
  XCircle, 
  FileText 
} from 'lucide-react';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: RideHistoryItem[];
  language: Language;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  language,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-5 shadow-2xl space-y-4 text-white max-h-[85vh] overflow-y-auto">
        
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-950 border border-emerald-700 text-emerald-400">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {language === 'bn' ? 'রাইড ইতিহাস ও রসিদ' : 'Trip History & Receipts'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {language === 'bn' ? 'আপনার বিগত ভ্রমণের ইতিহাস' : 'Your completed Shuti rides'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          {history.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-xs">
              {language === 'bn' ? 'কোন পূর্ববর্তী রাইড পাওয়া যায়নি' : 'No previous trip logs found'}
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2 text-xs hover:border-emerald-800 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-500">{item.date}</span>
                  <span className="text-sm font-black text-emerald-400">৳ {item.fareBDT}</span>
                </div>

                <div className="space-y-1 font-semibold text-slate-200">
                  <p className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{item.pickupName}</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Navigation className="w-3.5 h-3.5 text-rose-400 shrink-0 rotate-45" />
                    <span>{item.dropoffName}</span>
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Captain {item.driverName} • {item.vehicleType.toUpperCase()}</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold uppercase text-[9px]">
                    {item.paymentMethod} Paid
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
