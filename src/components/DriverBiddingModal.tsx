import React, { useState, useEffect } from 'react';
import { Driver, Language, VehicleType } from '../types';
import { MOCK_DRIVERS } from '../data/mockDrivers';
import { 
  Radar, 
  Star, 
  Check, 
  X, 
  ShieldCheck, 
  Clock, 
  Car,
  UserCheck
} from 'lucide-react';

interface DriverBiddingModalProps {
  offeredFareBDT: number;
  vehicleType: VehicleType;
  onAcceptDriver: (driver: Driver) => void;
  onCancel: () => void;
  language: Language;
}

export const DriverBiddingModal: React.FC<DriverBiddingModalProps> = ({
  offeredFareBDT,
  vehicleType,
  onAcceptDriver,
  onCancel,
  language,
}) => {
  const [biddingDrivers, setBiddingDrivers] = useState<Driver[]>([]);
  const [radarSearching, setRadarSearching] = useState(true);

  // Simulate nearby drivers sending bids one by one
  useEffect(() => {
    // Filter matching or close drivers
    const matchingDrivers = MOCK_DRIVERS.filter((d) => d.vehicleType === vehicleType);
    const pool = matchingDrivers.length > 0 ? matchingDrivers : MOCK_DRIVERS;

    // First bid
    const timer1 = setTimeout(() => {
      const d1 = { ...pool[0], bidFareBDT: offeredFareBDT };
      setBiddingDrivers([d1]);
    }, 1200);

    // Second bid with small counter-offer
    const timer2 = setTimeout(() => {
      if (pool[1]) {
        const counterFare = Math.round(offeredFareBDT * 1.1 / 10) * 10;
        const d2 = { ...pool[1], bidFareBDT: counterFare };
        setBiddingDrivers((prev) => [...prev, d2]);
      }
    }, 2800);

    // Third bid with matching fare
    const timer3 = setTimeout(() => {
      if (pool[2]) {
        const d3 = { ...pool[2], bidFareBDT: offeredFareBDT };
        setBiddingDrivers((prev) => [...prev, d3]);
        setRadarSearching(false);
      }
    }, 4500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [offeredFareBDT, vehicleType]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg p-5 sm:p-6 shadow-2xl space-y-5 text-slate-900 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <Radar className="w-5 h-5 animate-spin" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {language === 'bn' ? 'আশেপাশের ছুটি চালকদের অফার' : 'Nearby Drivers Bidding'}
              </h3>
              <p className="text-[11px] text-slate-500">
                {language === 'bn' ? 'চালকরা আপনার অফারে সাড়া দিচ্ছেন' : 'Drivers are submitting bids in real-time'}
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Radar Sweep Animation */}
        <div className="relative py-4 flex flex-col items-center justify-center bg-slate-50/60 rounded-xl border border-slate-100 overflow-hidden">
          <div className="w-24 h-24 rounded-full border border-emerald-200 flex items-center justify-center relative">
            <div className="w-16 h-16 rounded-full border border-emerald-300 flex items-center justify-center">
              <Car className="w-8 h-8 text-emerald-500" />
            </div>
            <div className="absolute inset-0 rounded-full border-2 border-emerald-400/40 animate-ping opacity-75" />
          </div>
          <p className="text-xs font-semibold text-emerald-600 mt-2 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            {radarSearching
              ? (language === 'bn' ? 'আশেপাশের রাইডার রাডার স্ক্যানিং...' : 'Radar Scanning nearby drivers...')
              : (language === 'bn' ? '৩ জন চালক পাওয়া গেছে' : '3 Verified Drivers found')}
          </p>
        </div>

        {/* Drivers Bid Cards List */}
        <div className="space-y-3">
          {biddingDrivers.length === 0 ? (
            <div className="text-center py-6 text-slate-400 text-xs">
              {language === 'bn' ? 'চালক খোঁজা হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন...' : 'Connecting to nearby drivers...'}
            </div>
          ) : (
            biddingDrivers.map((driver) => {
              const isCounterOffer = driver.bidFareBDT > offeredFareBDT;
              return (
                <div
                  key={driver.id}
                  className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-emerald-400 transition-all flex items-center justify-between gap-3 shadow-sm group"
                >
                  {/* Driver Profile Photo & Details */}
                  <div className="flex items-center gap-3">
                    <img
                      src={driver.avatar}
                      alt={driver.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500/60 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900">
                          {language === 'bn' ? driver.nameBn : driver.name}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-50 text-amber-700 font-bold border border-amber-200 flex items-center gap-0.5">
                          <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                          {driver.rating}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        {driver.vehicleModel} • {driver.vehicleNumber}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-400">
                        <span className="flex items-center gap-0.5 text-emerald-600">
                          <Clock className="w-3 h-3" />
                          {driver.estimatedArrivalMins} {language === 'bn' ? 'মি দূরে' : 'mins away'}
                        </span>
                        <span>• {driver.totalRides} {language === 'bn' ? 'রাইড সম্পন্ন' : 'trips'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Bid Amount & Accept Button */}
                  <div className="text-right shrink-0">
                    <div className="mb-1">
                      <span className={`text-base font-black ${isCounterOffer ? 'text-amber-600' : 'text-emerald-600'}`}>
                        ৳ {driver.bidFareBDT}
                      </span>
                      {isCounterOffer && (
                        <p className="text-[9px] text-amber-600 font-medium">
                          {language === 'bn' ? 'কাউন্টার অফার' : 'Counter offer'}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => onAcceptDriver(driver)}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1 active:scale-95"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{language === 'bn' ? 'গ্রহন করুন' : 'Accept'}</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Security Shield Note */}
        <div className="pt-2 text-[11px] text-slate-500 border-t border-slate-100 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            {language === 'bn'
              ? 'সকল ড্রাইভার পুলিশ ভেরিফাইড এবং জাতীয় পরিচয়পত্র পরীক্ষিত।'
              : 'All Shuti captains are NID verified with background checks.'}
          </span>
        </div>
      </div>
    </div>
  );
};
