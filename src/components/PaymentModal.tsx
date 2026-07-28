import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { RideDetails, Language } from '../types';
import { 
  CheckCircle2, 
  Star, 
  Download, 
  ArrowRight, 
  Lock, 
  Smartphone, 
  Sparkles
} from 'lucide-react';

interface PaymentModalProps {
  ride: RideDetails;
  onFinishPayment: (rating: number, review: string) => void;
  language: Language;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  ride,
  onFinishPayment,
  language,
}) => {
  const [step, setStep] = useState<'gateway' | 'otp' | 'rating'>('gateway');
  const [mobileNo, setMobileNo] = useState('01700-123456');
  const [otp, setOtp] = useState('123456');
  const [pin, setPin] = useState('•••••');
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (ride.paymentMethod === 'cash') {
      triggerConfetti();
      setStep('rating');
    } else {
      setStep('otp');
    }
  };

  const handleConfirmOTP = (e: React.FormEvent) => {
    e.preventDefault();
    triggerConfetti();
    setStep('rating');
  };

  const handleFinalize = () => {
    onFinishPayment(rating, review);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-5 sm:p-6 shadow-2xl space-y-5 text-white">
        
        {/* Step 1: bKash / Nagad / Payment Gateway */}
        {step === 'gateway' && (
          <div className="space-y-4">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-full bg-emerald-950 border border-emerald-700 mx-auto flex items-center justify-center text-emerald-400">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white">
                {ride.paymentMethod === 'bkash' ? 'bKash Merchant Payment' :
                 ride.paymentMethod === 'nagad' ? 'Nagad Payment Gateway' :
                 ride.paymentMethod === 'rocket' ? 'Rocket Mobile Banking' :
                 language === 'bn' ? 'নগদ টাকা পেমেন্ট' : 'Cash on Drop'}
              </h3>
              <p className="text-xs text-slate-400">
                {language === 'bn' ? 'মোটুকা রাইড বিল বিবরণী' : 'Shuti Ride Invoice Details'}
              </p>
            </div>

            {/* Bill Summary */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>{language === 'bn' ? 'রাইড চার্জ' : 'Trip Base Fare'}:</span>
                <span>৳ {ride.originalFareBDT || ride.fareBDT}</span>
              </div>
              {ride.discountBDT > 0 && (
                <div className="flex justify-between text-rose-400 font-bold">
                  <span>{language === 'bn' ? 'প্রোমো ডিসকাউন্ট' : 'Promo Discount'}:</span>
                  <span>- ৳ {ride.discountBDT}</span>
                </div>
              )}
              <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-sm font-black">
                <span className="text-emerald-400">{language === 'bn' ? 'মোট প্রদেয় বিল' : 'Total Payable'}:</span>
                <span className="text-lg text-emerald-400">৳ {ride.fareBDT}</span>
              </div>
            </div>

            {/* Mobile Banking Form */}
            {ride.paymentMethod !== 'cash' ? (
              <form onSubmit={handleProcessPayment} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase">
                    {ride.paymentMethod.toUpperCase()} Account Number
                  </label>
                  <input
                    type="text"
                    value={mobileNo}
                    onChange={(e) => setMobileNo(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
                    placeholder="017XX-XXXXXX"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-emerald-600 to-rose-600 hover:from-emerald-500 hover:to-rose-500 text-white font-black text-sm rounded-xl shadow-lg transition-all"
                >
                  {language === 'bn' ? 'পেমেন্ট এগিয়ে যান' : 'Proceed Payment'} (৳{ride.fareBDT})
                </button>
              </form>
            ) : (
              <button
                onClick={() => {
                  triggerConfetti();
                  setStep('rating');
                }}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>{language === 'bn' ? 'চালকের কাছে নগদ পরিশোধ করেছি' : 'Paid Cash to Captain'}</span>
              </button>
            )}
          </div>
        )}

        {/* Step 2: OTP Verification */}
        {step === 'otp' && (
          <form onSubmit={handleConfirmOTP} className="space-y-4">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-full bg-pink-950 border border-pink-700 mx-auto flex items-center justify-center text-pink-400">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white">
                Enter Verification OTP
              </h3>
              <p className="text-xs text-slate-400">
                A 6-digit code was sent to {mobileNo}
              </p>
            </div>

            <div className="space-y-2">
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-center text-lg font-mono tracking-widest text-emerald-400 focus:outline-none focus:border-emerald-500"
                maxLength={6}
                required
              />
              <div className="flex gap-2">
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-center text-sm font-mono tracking-widest text-white focus:outline-none focus:border-emerald-500"
                  placeholder="PIN"
                  maxLength={5}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm rounded-xl shadow-lg transition-all"
            >
              {language === 'bn' ? 'পেমেন্ট নিশ্চিত করুন' : 'Confirm Payment'}
            </button>
          </form>
        )}

        {/* Step 3: Rate Driver & Experience Feedback */}
        {step === 'rating' && (
          <div className="space-y-4 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-950 border-2 border-emerald-500 mx-auto flex items-center justify-center text-emerald-400 animate-bounce">
              <Sparkles className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-xl font-black text-white">
                {language === 'bn' ? 'পেমেন্ট সফল হয়েছে!' : 'Trip Completed Successfully!'}
              </h3>
              <p className="text-xs text-slate-400">
                {language === 'bn' ? 'ছুটি ক্যাপ্টেনের সাথে আপনার রাইড কেমন লাগলো?' : 'How was your experience with Captain ' + (ride.driver?.name || '') + '?'}
              </p>
            </div>

            {/* Star Rating Bar */}
            <div className="flex items-center justify-center gap-2 py-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  onClick={() => setRating(s)}
                  className="p-1 transition-transform hover:scale-125"
                >
                  <Star
                    className={`w-8 h-8 ${
                      s <= rating
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-700 fill-slate-800'
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Review Input */}
            <textarea
              placeholder={language === 'bn' ? 'রাইডার সম্পর্কে মন্তব্য লিখুন (ঐচ্ছিক)...' : 'Write a comment about your ride...'}
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500 h-20 resize-none"
            />

            <button
              onClick={handleFinalize}
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-rose-600 hover:from-emerald-500 hover:to-rose-500 text-white font-black text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <span>{language === 'bn' ? 'হোমে ফিরে যান' : 'Finish & Back to Home'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
