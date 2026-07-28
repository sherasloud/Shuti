import React, { useState } from 'react';
import { Language } from '../types';
import { 
  UserCheck, 
  Power, 
  DollarSign, 
  Car, 
  Star, 
  MapPin, 
  Navigation, 
  CheckCircle2, 
  Fuel, 
  Send
} from 'lucide-react';

interface DriverModePanelProps {
  language: Language;
}

interface IncomingRequest {
  id: string;
  passengerName: string;
  pickup: string;
  dropoff: string;
  offeredFareBDT: number;
  distanceKm: number;
  vehicleType: string;
  estimatedTimeMins: number;
}

export const DriverModePanel: React.FC<DriverModePanelProps> = ({ language }) => {
  const [isOnline, setIsOnline] = useState(true);
  const [todayEarnings, setTodayEarnings] = useState(2450);
  const [activeJob, setActiveJob] = useState<IncomingRequest | null>(null);
  const [jobStage, setJobStage] = useState<'accepted' | 'arrived_pickup' | 'in_transit' | 'completed'>('accepted');
  const [counterBidValue, setCounterBidValue] = useState<number>(250);

  const mockRequests: IncomingRequest[] = [
    {
      id: 'req-1',
      passengerName: 'Anika Rahman',
      pickup: 'Dhanmondi 27 (Rapa Plaza)',
      dropoff: 'Gulshan 2 Circle',
      offeredFareBDT: 220,
      distanceKm: 9.4,
      vehicleType: 'cng',
      estimatedTimeMins: 28
    },
    {
      id: 'req-2',
      passengerName: 'Kazi Farhan',
      pickup: 'Banani 11 Road',
      dropoff: 'Hazrat Shahjalal Airport',
      offeredFareBDT: 350,
      distanceKm: 8.1,
      vehicleType: 'car',
      estimatedTimeMins: 20
    }
  ];

  const handleAcceptRequest = (req: IncomingRequest) => {
    setActiveJob(req);
    setJobStage('accepted');
  };

  const handleSendCounterBid = (req: IncomingRequest) => {
    alert(language === 'bn' ? `যাত্রীকে ৳${counterBidValue} এর প্রস্তাব পাঠানো হয়েছে!` : `Counter-bid of ৳${counterBidValue} sent to passenger!`);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 text-slate-900 space-y-5 shadow-2xl">
      
      {/* Driver Header & Online Switch */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 border border-slate-200 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center text-white text-xl font-black shadow-lg">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">
                {language === 'bn' ? 'ক্যাপ্টেন সালাহউদ্দিন' : 'Captain Salahuddin'}
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 font-bold border border-emerald-200 flex items-center gap-0.5">
                <Star className="w-3 h-3 fill-emerald-500 text-emerald-500" /> 4.95
              </span>
            </div>
            <p className="text-xs text-slate-500">
              CNG • Dhaka Metro-TH-11-8899
            </p>
          </div>
        </div>

        {/* Online / Offline Switch */}
        <button
          onClick={() => setIsOnline(!isOnline)}
          className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all shadow-lg ${
            isOnline
              ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-100 ring-2 ring-emerald-500/20'
              : 'bg-white hover:bg-slate-50 text-slate-400 border border-slate-200'
          }`}
        >
          <Power className="w-4 h-4" />
          <span>{isOnline ? (language === 'bn' ? 'অনলাইন (ডিউটি)' : 'ONLINE (On Duty)') : (language === 'bn' ? 'অফলাইন' : 'OFFLINE')}</span>
        </button>
      </div>

      {/* Driver Stats Dashboard */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
          <span className="text-[10px] text-slate-500 uppercase block font-medium">
            {language === 'bn' ? 'আজকের আয়' : 'Today Earnings'}
          </span>
          <span className="text-lg font-black text-emerald-600">
            ৳ {todayEarnings}
          </span>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
          <span className="text-[10px] text-slate-500 uppercase block font-medium">
            {language === 'bn' ? 'সম্পন্ন রাইড' : 'Trips Done'}
          </span>
          <span className="text-lg font-black text-amber-600">
            12
          </span>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
          <span className="text-[10px] text-slate-500 uppercase block font-medium">
            {language === 'bn' ? 'একসেপ্ট রেট' : 'Acceptance'}
          </span>
          <span className="text-lg font-black text-rose-600">
            98%
          </span>
        </div>
      </div>

      {/* Active Job Interface or Ride Requests Radar */}
      {activeJob ? (
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-emerald-100 pb-2">
            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
              <Car className="w-4 h-4 text-emerald-600" />
              {language === 'bn' ? 'চলতি রাইড ডিউটি' : 'Active Duty Ride'}
            </span>
            <span className="text-sm font-black text-emerald-600">
              ৳ {activeJob.offeredFareBDT}
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <p className="font-bold text-slate-900 text-sm">
              Passenger: {activeJob.passengerName}
            </p>
            <div className="flex items-center gap-2 text-slate-600">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{activeJob.pickup}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Navigation className="w-4 h-4 text-rose-500 shrink-0 rotate-45" />
              <span>{activeJob.dropoff}</span>
            </div>
          </div>

          {/* Job Stage Stepper */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            {jobStage === 'accepted' && (
              <button
                onClick={() => setJobStage('arrived_pickup')}
                className="col-span-2 py-2.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow"
              >
                {language === 'bn' ? 'পিকআপ পয়েন্টে পৌঁছেছি' : 'Arrived at Pickup Location'}
              </button>
            )}

            {jobStage === 'arrived_pickup' && (
              <button
                onClick={() => setJobStage('in_transit')}
                className="col-span-2 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow"
              >
                {language === 'bn' ? 'OTP যাচাই করে রাইড শুরু করুন' : 'Verify OTP & Start Trip'}
              </button>
            )}

            {jobStage === 'in_transit' && (
              <button
                onClick={() => {
                  setTodayEarnings((prev) => prev + activeJob.offeredFareBDT);
                  setJobStage('completed');
                }}
                className="col-span-2 py-2.5 bg-rose-600 text-white font-bold text-xs rounded-xl shadow"
              >
                {language === 'bn' ? 'গন্তব্যে পৌছে টাকা গ্রহন করুন (৳' + activeJob.offeredFareBDT + ')' : 'Arrived! Collect Fare (৳' + activeJob.offeredFareBDT + ')'}
              </button>
            )}

            {jobStage === 'completed' && (
              <button
                onClick={() => setActiveJob(null)}
                className="col-span-2 py-2.5 bg-slate-800 text-emerald-400 font-bold text-xs rounded-xl"
              >
                {language === 'bn' ? 'নতুন রাইড রিকোয়েস্ট নিন' : 'Job Completed • Take Next Ride'}
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span>{language === 'bn' ? 'আশেপাশের যাত্রী রিকোয়েস্ট (রাডার)' : 'Incoming Passenger Requests'}</span>
            {isOnline && (
              <span className="text-[10px] text-emerald-600 flex items-center gap-1 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Feed
              </span>
            )}
          </h4>

          {isOnline ? (
            mockRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-3 shadow-sm hover:border-emerald-400 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      {req.passengerName}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {req.distanceKm} km • {req.estimatedTimeMins} mins trip
                    </span>
                  </div>
                  <span className="text-base font-black text-emerald-600">
                    ৳ {req.offeredFareBDT}
                  </span>
                </div>

                <div className="space-y-1 text-xs text-slate-600">
                  <p>📍 {req.pickup}</p>
                  <p>🏁 {req.dropoff}</p>
                </div>

                <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                  <button
                    onClick={() => handleAcceptRequest(req)}
                    className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition-all shadow-sm"
                  >
                    {language === 'bn' ? 'রাইড গ্রহণে গ্রহণ করুন' : 'Accept Trip'}
                  </button>

                  <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg p-1">
                    <input
                      type="number"
                      value={counterBidValue}
                      onChange={(e) => setCounterBidValue(Number(e.target.value))}
                      className="w-16 bg-transparent text-xs text-amber-700 font-bold text-center focus:outline-none"
                    />
                    <button
                      onClick={() => handleSendCounterBid(req)}
                      className="p-1.5 bg-amber-500 hover:bg-amber-400 text-white font-bold rounded text-xs shadow-sm"
                      title="Send Counter Bid"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 bg-slate-50 rounded-xl border border-slate-200 text-slate-400 text-xs">
              {language === 'bn' ? 'ডিউটিতে যুক্ত হতে অনলাইন সুইচ অন করুন' : 'Switch Online to start receiving ride requests'}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
