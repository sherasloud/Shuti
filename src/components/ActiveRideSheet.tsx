import React, { useState, useEffect } from 'react';
import { RideDetails, Language } from '../types';
import { 
  Phone, 
  MessageSquare, 
  Share2, 
  ShieldAlert, 
  Clock, 
  MapPin, 
  Navigation, 
  CheckCircle2, 
  Star, 
  X,
  Lock,
  Send
} from 'lucide-react';

interface ActiveRideSheetProps {
  ride: RideDetails;
  onCompleteRide: () => void;
  onCancelRide: () => void;
  onTriggerSOS: () => void;
  language: Language;
}

export const ActiveRideSheet: React.FC<ActiveRideSheetProps> = ({
  ride,
  onCompleteRide,
  onCancelRide,
  onTriggerSOS,
  language,
}) => {
  const [etaSeconds, setEtaSeconds] = useState(180); // 3 mins default
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'driver' | 'user'; text: string; time: string }>>([
    {
      sender: 'driver',
      text: language === 'bn' ? 'আসসালামু আলাইকুম স্যার, আমি লোকেশনের দিকে আসছি।' : 'Assalamu Alaikum! I am heading towards your location.',
      time: '10:14 AM'
    }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [copyShareMsg, setCopyShareMsg] = useState(false);

  // Live countdown timer for driver arrival / trip duration
  useEffect(() => {
    const timer = setInterval(() => {
      setEtaSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatEta = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const newMsg = {
      sender: 'user' as const,
      text: inputMsg.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages((prev) => [...prev, newMsg]);
    setInputMsg('');

    // Simulated driver automated reply
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'driver',
          text: language === 'bn' ? 'ঠিক আছে ভাই, ফ্লাইওভারের নিচ দিয়ে ১ মিনিটে আসছি।' : 'Got it! Arriving under 1 min.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1500);
  };

  const handleShareLiveLocation = () => {
    const shareUrl = `https://shuti.bd/track/${ride.id}`;
    navigator.clipboard.writeText(shareUrl);
    setCopyShareMsg(true);
    setTimeout(() => setCopyShareMsg(false), 3000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xl text-white space-y-4">
      
      {/* Top Banner & Security OTP PIN */}
      <div className="flex items-center justify-between bg-emerald-950/80 border border-emerald-800/80 rounded-xl p-3">
        <div>
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
            {language === 'bn' ? 'পিকআপ সিকিউরিটি পিন (OTP)' : 'Security Start PIN'}
          </span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span className="text-xl font-black text-white tracking-widest">
              {ride.otpCode}
            </span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            {ride.status === 'in_transit'
              ? (language === 'bn' ? 'গন্তব্যে পৌঁছাতে বাকি' : 'Trip ETA')
              : (language === 'bn' ? 'চালকের পৌঁছাতে বাকি' : 'Driver Arriving In')}
          </span>
          <div className="flex items-center gap-1 mt-0.5 text-amber-400 font-mono font-black text-xl">
            <Clock className="w-4 h-4 animate-pulse" />
            <span>{formatEta(etaSeconds)}</span>
          </div>
        </div>
      </div>

      {/* Driver Card Info */}
      {ride.driver && (
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={ride.driver.avatar}
                alt={ride.driver.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500"
              />
              <span className="w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-950 rounded-full absolute bottom-0 right-0" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-sm font-bold text-white">
                  {language === 'bn' ? ride.driver.nameBn : ride.driver.name}
                </h4>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 font-bold border border-amber-800/60 flex items-center gap-0.5">
                  <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                  {ride.driver.rating}
                </span>
              </div>
              <p className="text-xs text-emerald-400 font-semibold">
                {ride.driver.vehicleModel} ({ride.driver.vehicleNumber})
              </p>
              <p className="text-[10px] text-slate-400">
                {language === 'bn' ? 'মোটুকা ভেরিফাইড ক্যাপ্টেন' : 'NID Verified Captain'}
              </p>
            </div>
          </div>

          {/* Quick Communication Actions */}
          <div className="flex items-center gap-2">
            <a
              href={`tel:${ride.driver.phone}`}
              className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-md"
              title="Call Driver"
            >
              <Phone className="w-4 h-4" />
            </a>
            <button
              onClick={() => setChatOpen(!chatOpen)}
              className={`p-2.5 rounded-xl border transition-all ${
                chatOpen
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                  : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
              }`}
              title="Chat with Driver"
            >
              <MessageSquare className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Driver Bangla Chat Simulation Box */}
      {chatOpen && (
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-2.5">
          <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-1.5">
            <span className="font-bold text-slate-300">
              💬 {language === 'bn' ? 'চালকের সাথে চ্যাট' : 'In-App Driver Chat'}
            </span>
            <button onClick={() => setChatOpen(false)} className="text-slate-500 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="max-h-36 overflow-y-auto space-y-2 text-xs p-1">
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[80%] px-3 py-1.5 rounded-xl text-xs ${
                    msg.sender === 'user'
                      ? 'bg-emerald-600 text-white rounded-br-none'
                      : 'bg-slate-800 text-slate-200 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[9px] text-slate-500 mt-0.5">{msg.time}</span>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              placeholder={language === 'bn' ? 'মেসেজ লিখুন...' : 'Type message...'}
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* Trip Route Details */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-2 text-xs">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-semibold text-slate-300">
            {language === 'bn' ? ride.pickup.nameBn : ride.pickup.name}
          </span>
        </div>
        <div className="border-l-2 border-dashed border-slate-700 ml-2 pl-4 py-0.5 text-[10px] text-slate-500">
          {ride.distanceKm} km • {ride.vehicle.name}
        </div>
        <div className="flex items-center gap-2">
          <Navigation className="w-4 h-4 text-rose-400 shrink-0 rotate-45" />
          <span className="font-semibold text-slate-300">
            {language === 'bn' ? ride.dropoff.nameBn : ride.dropoff.name}
          </span>
        </div>
      </div>

      {/* Ride Actions Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        <button
          onClick={handleShareLiveLocation}
          className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-1.5"
        >
          <Share2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>{copyShareMsg ? (language === 'bn' ? 'কপি হয়েছে!' : 'Copied!') : (language === 'bn' ? 'লাইভ লোকেশন শেয়ার' : 'Share Location')}</span>
        </button>

        <button
          onClick={onTriggerSOS}
          className="py-2.5 px-3 bg-rose-950 hover:bg-rose-900 text-rose-200 text-xs font-bold rounded-xl border border-rose-800 transition-all flex items-center justify-center gap-1.5"
        >
          <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
          <span>{language === 'bn' ? '৯৯৯ জরুরী কল' : '999 SOS'}</span>
        </button>

        <button
          onClick={onCancelRide}
          className="col-span-2 sm:col-span-1 py-2.5 px-3 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-bold rounded-xl border border-slate-800 transition-all text-center"
        >
          {language === 'bn' ? 'রাইড বাতিল' : 'Cancel Ride'}
        </button>
      </div>

      {/* Simulator CTA: Complete Ride Test Button */}
      <button
        onClick={onCompleteRide}
        className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
      >
        <CheckCircle2 className="w-5 h-5" />
        <span>
          {language === 'bn' ? 'রাইড সম্পন্ন ও পেমেন্ট করুন (৳' + ride.fareBDT + ')' : 'Arrived! Complete Trip & Pay (৳' + ride.fareBDT + ')'}
        </span>
      </button>
    </div>
  );
};
