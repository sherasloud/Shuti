import React, { useState } from 'react';
import { AIRouteAdvice, Language } from '../types';
import { 
  Sparkles, 
  X, 
  Send, 
  Navigation, 
  Clock, 
  ShieldCheck, 
  AlertTriangle,
  Lightbulb
} from 'lucide-react';

interface AIAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  pickupName?: string;
  dropoffName?: string;
  vehicleType?: string;
  language: Language;
}

export const AIAssistantDrawer: React.FC<AIAssistantDrawerProps> = ({
  isOpen,
  onClose,
  pickupName = 'Dhanmondi 27',
  dropoffName = 'Gulshan 2 Circle',
  vehicleType = 'cng',
  language,
}) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState<AIRouteAdvice | null>({
    trafficStatus: language === 'bn' ? 'মাঝারি ট্রাফিক জ্যাম (মহাখালী রোড)' : 'Moderate Traffic (Mohakhali Flyover)',
    recommendedRoute: language === 'bn' ? 'হাতিরঝিল এক্সপ্রেসওয়ে ও বিজয় সরণি ফ্লাইওভার' : 'Hatirjheel Loop & Bijoy Sarani Flyover',
    estimatedMinutes: 26,
    distanceKm: 9.2,
    estimatedFareBDT: 190,
    aiTips: language === 'bn'
      ? 'পিক আওয়ারের সময়ে ফার্মগেট মোড় এড়িয়ে হাতিরঝিল লিংক রোড ব্যবহার করলে ১০ মিনিট সময় বাঁচবে।'
      : 'Bypassing Farmgate via Hatirjheel express link road will save approx 10 minutes during rush hour.',
    safetyRating: 'Verified Safe Route'
  });

  if (!isOpen) return null;

  const handleAskAI = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/ai/route-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pickup: pickupName,
          dropoff: dropoffName,
          vehicleType,
          timeOfDay: 'Peak Rush Hours',
          language
        })
      });

      const data = await res.json();
      if (data.success) {
        setAdvice(data);
      }
    } catch (err) {
      console.error('AI Request Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-white border-l border-slate-200 h-full p-5 shadow-2xl flex flex-col justify-between text-slate-900 space-y-4">
        
        {/* Header */}
        <div>
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-gradient-to-tr from-amber-500 to-emerald-500 text-white shadow-md">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {language === 'bn' ? 'ছুটি এআই ট্রাফিক গাইড' : 'Shuti AI Route Advisor'}
                </h3>
                <p className="text-[11px] text-slate-500">
                  {language === 'bn' ? 'স্মার্ট রুট বিশ্লেষণ ও ভাড়া পরামর্শ' : 'Real-time Bangladesh route intelligence'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick AI Query Buttons */}
          <div className="pt-4 space-y-3">
            <p className="text-xs font-semibold text-slate-500">
              {language === 'bn' ? 'দ্রুত পরামর্শ প্রশ্ন:' : 'Quick Route Checks:'}
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                language === 'bn' ? 'কোন রুটে জ্যাম কম?' : 'Bypass Rush Hour Jams',
                language === 'bn' ? 'সিএনজি বনাম বাইক কত মিনিট বাঁচাবে?' : 'Bike vs CNG Time Difference',
                language === 'bn' ? 'ফ্লাইওভার টোল কত?' : 'Elevated Toll Rates'
              ].map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setPrompt(q);
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-amber-400 text-slate-600 text-xs transition-all text-left shadow-sm hover:shadow-md"
                >
                  💡 {q}
                </button>
              ))}
            </div>
          </div>

          {/* AI Result Cards */}
          {advice && (
            <div className="mt-4 space-y-3">
              {/* Traffic Condition Badge */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">
                    {language === 'bn' ? 'ট্রাফিক অবস্থা' : 'Traffic Status'}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-amber-500" />
                    {advice.trafficStatus}
                  </span>
                </div>

                <div className="space-y-1 text-xs">
                  <p className="text-slate-700 font-bold flex items-center gap-1.5">
                    <Navigation className="w-4 h-4 text-emerald-600" />
                    <span>{advice.recommendedRoute}</span>
                  </p>
                  <div className="flex items-center gap-4 text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      {advice.estimatedMinutes} {language === 'bn' ? 'মিনিট' : 'mins'}
                    </span>
                    <span>• {advice.distanceKm} km</span>
                    <span className="text-emerald-600 font-black">৳ {advice.estimatedFareBDT}</span>
                  </div>
                </div>
              </div>

              {/* Local Travel Tip Box */}
              <div className="bg-gradient-to-br from-amber-50 to-white border border-amber-200 rounded-xl p-3.5 text-xs text-amber-800 space-y-1 shadow-sm">
                <div className="flex items-center gap-1.5 font-bold text-amber-600">
                  <Lightbulb className="w-4 h-4" />
                  <span>{language === 'bn' ? 'ছুটি এআই পরামর্শ' : 'AI Local Advice'}</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {advice.aiTips}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Ask Prompt Form */}
        <form onSubmit={handleAskAI} className="space-y-2">
          <div className="relative">
            <input
              type="text"
              placeholder={language === 'bn' ? 'যেমন: গুলশান থেকে এয়ারপোর্ট যেতে কত সময় লাগবে?' : 'Ask Shuti AI traffic assistant...'}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-3 pr-10 py-3 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="absolute right-2 top-2 p-1.5 bg-gradient-to-r from-amber-500 to-emerald-500 hover:opacity-90 text-white rounded-lg font-bold shadow-md"
            >
              {loading ? (
                <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin block" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
          <p className="text-[10px] text-slate-400 text-center">
            Powered by Google Gemini 2.5 AI Traffic Engine
          </p>
        </form>
      </div>
    </div>
  );
};
