import React, { useState } from 'react';
import { LocationPoint, VehicleOption, PaymentMethod, Language, VehicleType } from '../types';
import { BD_LOCATIONS } from '../data/bdLocations';
import { VEHICLE_OPTIONS } from '../data/vehicleTypes';
import { 
  MapPin, 
  Navigation, 
  ArrowUpDown, 
  Tag, 
  CheckCircle2, 
  Sparkles,
  Info
} from 'lucide-react';

interface BookingPanelProps {
  pickup: LocationPoint | null;
  dropoff: LocationPoint | null;
  onSetPickup: (loc: LocationPoint) => void;
  onSetDropoff: (loc: LocationPoint) => void;
  selectedVehicle: VehicleOption;
  onSelectVehicle: (v: VehicleOption) => void;
  offeredFareBDT: number;
  onChangeOfferedFare: (fare: number) => void;
  paymentMethod: PaymentMethod;
  onSelectPaymentMethod: (pm: PaymentMethod) => void;
  promoCode: string;
  onApplyPromoCode: (code: string) => void;
  promoApplied: boolean;
  onStartBidding: () => void;
  language: Language;
  selectedCity: 'Dhaka' | 'Chittagong' | 'CoxsBazar' | 'Sylhet';
}

export const BookingPanel: React.FC<BookingPanelProps> = ({
  pickup,
  dropoff,
  onSetPickup,
  onSetDropoff,
  selectedVehicle,
  onSelectVehicle,
  offeredFareBDT,
  onChangeOfferedFare,
  paymentMethod,
  onSelectPaymentMethod,
  promoCode,
  onApplyPromoCode,
  promoApplied,
  onStartBidding,
  language,
  selectedCity,
}) => {
  const [pickupSearch, setPickupSearch] = useState('');
  const [dropoffSearch, setDropoffSearch] = useState('');
  const [showPickupDropdown, setShowPickupDropdown] = useState(false);
  const [showDropoffDropdown, setShowDropoffDropdown] = useState(false);
  const [promoInput, setPromoInput] = useState('');

  // Filter locations by city and search
  const cityLocations = BD_LOCATIONS.filter((loc) => loc.city === selectedCity);

  const filteredPickup = cityLocations.filter((loc) =>
    loc.name.toLowerCase().includes(pickupSearch.toLowerCase()) ||
    loc.nameBn.includes(pickupSearch)
  );

  const filteredDropoff = cityLocations.filter((loc) =>
    loc.name.toLowerCase().includes(dropoffSearch.toLowerCase()) ||
    loc.nameBn.includes(dropoffSearch)
  );

  // Swap pickup & dropoff
  const handleSwap = () => {
    if (pickup && dropoff) {
      const temp = pickup;
      onSetPickup(dropoff);
      onSetDropoff(temp);
    }
  };

  // Estimate distance and fare base
  const calculatedDistanceKm = 8.5; // Average default route distance in km
  const estimatedStandardFare = Math.round(selectedVehicle.baseFare + calculatedDistanceKm * selectedVehicle.perKm);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoInput.trim()) {
      onApplyPromoCode(promoInput.trim().toUpperCase());
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-7 shadow-sm space-y-6 text-slate-900">
      
      {/* Location Input Section */}
      <div className="space-y-4 relative">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold flex items-center gap-2 text-slate-900">
            <Navigation className="w-4 h-4 text-emerald-600" />
            <span>{language === 'bn' ? 'কোথায় যাবেন?' : 'Where to?'}</span>
          </h2>
          <button
            onClick={handleSwap}
            className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all border border-slate-200"
            title="Swap Locations"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Pickup Input */}
        <div className="relative">
          <div className="flex items-center gap-3 p-3.5 bg-slate-50 border border-slate-100 rounded-xl focus-within:border-emerald-500/50 focus-within:bg-white transition-all">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <input
              type="text"
              placeholder={language === 'bn' ? 'পিকআপ পয়েন্ট...' : 'Pickup Location...'}
              value={pickup ? (language === 'bn' ? pickup.nameBn : pickup.name) : pickupSearch}
              onChange={(e) => {
                setPickupSearch(e.target.value);
                setShowPickupDropdown(true);
              }}
              onFocus={() => setShowPickupDropdown(true)}
              className="w-full bg-transparent text-sm text-slate-900 focus:outline-none placeholder-slate-400 font-medium"
            />
          </div>

          {/* Pickup Search Dropdown */}
          {showPickupDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1 z-30 max-h-48 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-2xl p-1 divide-y divide-slate-100">
              {filteredPickup.map((loc) => (
                <button
                  key={loc.id}
                  onClick={() => {
                    onSetPickup(loc);
                    setShowPickupDropdown(false);
                    setPickupSearch('');
                  }}
                  className="w-full text-left p-2.5 hover:bg-slate-50 rounded-lg transition-all flex items-center justify-between group"
                >
                  <div>
                    <p className="text-xs font-bold text-slate-700 group-hover:text-emerald-600">
                      {language === 'bn' ? loc.nameBn : loc.name}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      {language === 'bn' ? loc.addressBn : loc.address}
                    </p>
                  </div>
                  {loc.isPopular && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-600 font-bold border border-emerald-100">
                      Hotspot
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Dropoff Input */}
        <div className="relative">
          <div className="flex items-center gap-3 p-3.5 bg-slate-50 border border-slate-100 rounded-xl focus-within:border-rose-500/50 focus-within:bg-white transition-all">
            <div className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
            <input
              type="text"
              placeholder={language === 'bn' ? 'গন্তব্য...' : 'Destination...'}
              value={dropoff ? (language === 'bn' ? dropoff.nameBn : dropoff.name) : dropoffSearch}
              onChange={(e) => {
                setDropoffSearch(e.target.value);
                setShowDropoffDropdown(true);
              }}
              onFocus={() => setShowDropoffDropdown(true)}
              className="w-full bg-transparent text-sm text-slate-900 focus:outline-none placeholder-slate-400 font-medium"
            />
          </div>

          {/* Dropoff Search Dropdown */}
          {showDropoffDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1 z-30 max-h-48 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-2xl p-1 divide-y divide-slate-100">
              {filteredDropoff.map((loc) => (
                <button
                  key={loc.id}
                  onClick={() => {
                    onSetDropoff(loc);
                    setShowDropoffDropdown(false);
                    setDropoffSearch('');
                  }}
                  className="w-full text-left p-2.5 hover:bg-slate-50 rounded-lg transition-all flex items-center justify-between group"
                >
                  <div>
                    <p className="text-xs font-bold text-slate-700 group-hover:text-rose-600">
                      {language === 'bn' ? loc.nameBn : loc.name}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      {language === 'bn' ? loc.addressBn : loc.address}
                    </p>
                  </div>
                  {loc.isPopular && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-50 text-rose-600 font-bold border border-rose-100">
                      Popular
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Popular Hotspot Quick Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar">
          <span className="text-[11px] text-slate-400 font-medium shrink-0 flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {language === 'bn' ? 'জনপ্রিয়:' : 'Hotspots:'}
          </span>
          {cityLocations.slice(0, 5).map((loc) => (
            <button
              key={loc.id}
              onClick={() => {
                if (!pickup) onSetPickup(loc);
                else onSetDropoff(loc);
              }}
              className="px-2.5 py-1 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-medium shrink-0 border border-slate-200 transition-all hover:scale-105"
            >
              {language === 'bn' ? loc.nameBn.split('(')[0] : loc.name.split('(')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Vehicle Category Selection Grid */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
          {language === 'bn' ? 'যানবাহন টাইপ বেছে নিন' : 'Select Vehicle Category'}
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {VEHICLE_OPTIONS.map((v) => {
            const fare = Math.round(v.baseFare + calculatedDistanceKm * v.perKm);
            const isSelected = selectedVehicle.id === v.id;
            return (
              <button
                key={v.id}
                onClick={() => {
                  onSelectVehicle(v);
                  onChangeOfferedFare(fare);
                }}
                className={`p-3.5 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-slate-900 border-slate-900 text-white shadow-lg'
                    : 'bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50 text-slate-900'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-2xl">{v.icon}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${isSelected ? 'bg-slate-800 text-slate-300' : 'bg-slate-50 text-slate-500'}`}>
                      {v.etaMins} {language === 'bn' ? 'মি' : 'min'}
                    </span>
                  </div>
                  <p className="text-xs font-bold">
                    {language === 'bn' ? v.nameBn : v.name}
                  </p>
                </div>

                <div className={`mt-2 pt-2 border-t flex items-center justify-between ${isSelected ? 'border-slate-800' : 'border-slate-50'}`}>
                  <span className={`text-xs font-bold ${isSelected ? 'text-emerald-400' : 'text-emerald-600'}`}>
                    ৳{fare}
                  </span>
                  <span className={`text-[9px] ${isSelected ? 'text-slate-500' : 'text-slate-400'}`}>
                    👤{v.capacity}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bargain / Fare Offer Slider (চুক্তি রাইড / Fare Offer) */}
      <div className="bg-amber-50/50 border border-amber-200 rounded-xl p-3.5 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-bold text-amber-800">
              {language === 'bn' ? 'ভাড়া চুক্তি / Fare Bargain Offer' : 'Offer Your Custom Fare'}
            </span>
          </div>
          <span className="text-sm font-black text-amber-600">
            ৳ {offeredFareBDT}
          </span>
        </div>

        <p className="text-[11px] text-slate-500">
          {language === 'bn'
            ? `স্ট্যান্ডার্ড আনুমানিক ভাড়া ৳${estimatedStandardFare}। চালকদের কাছ থেকে দ্রুত সাড়া পেতে ভাড়া বাড়াতে বা কমাতে পারেন।`
            : `Estimated system fare is ৳${estimatedStandardFare}. Adjust slider to bargain with nearby drivers.`}
        </p>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onChangeOfferedFare(Math.max(30, offeredFareBDT - 10))}
            className="w-8 h-8 rounded-lg bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm flex items-center justify-center border border-slate-200 shadow-sm"
          >
            -
          </button>
          <input
            type="range"
            min={Math.max(30, Math.round(estimatedStandardFare * 0.7))}
            max={Math.round(estimatedStandardFare * 1.6)}
            step={10}
            value={offeredFareBDT}
            onChange={(e) => onChangeOfferedFare(Number(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer"
          />
          <button
            onClick={() => onChangeOfferedFare(offeredFareBDT + 10)}
            className="w-8 h-8 rounded-lg bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm flex items-center justify-center border border-slate-200 shadow-sm"
          >
            +
          </button>
        </div>
      </div>

      {/* Payment Method Selector & Promo Code */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Payment Method */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-500 uppercase">
            {language === 'bn' ? 'পেমেন্ট মাধ্যম' : 'Payment Method'}
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { id: 'bkash', name: 'bKash', color: 'bg-pink-50 text-pink-700 border-pink-200' },
              { id: 'nagad', name: 'Nagad', color: 'bg-orange-50 text-orange-700 border-orange-200' },
              { id: 'cash', name: 'Cash', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
            ].map((pm) => (
              <button
                key={pm.id}
                onClick={() => onSelectPaymentMethod(pm.id as PaymentMethod)}
                className={`py-2 text-xs font-bold rounded-lg border transition-all text-center ${
                  paymentMethod === pm.id
                    ? pm.color + ' ring-2 ring-emerald-500 shadow-sm'
                    : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {pm.name}
              </button>
            ))}
          </div>
        </div>

        {/* Promo Code */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-500 uppercase flex items-center justify-between">
            <span>{language === 'bn' ? 'প্রোমো কোড' : 'Promo Coupon'}</span>
            {promoApplied && (
              <span className="text-[10px] text-emerald-600 flex items-center gap-0.5">
                <CheckCircle2 className="w-3 h-3" /> {language === 'bn' ? '৳৫০ ছাড়' : '৳50 OFF'}
              </span>
            )}
          </label>
          <form onSubmit={handleApplyPromo} className="flex gap-1.5">
            <div className="relative flex-1">
              <Tag className="w-3.5 h-3.5 absolute left-2.5 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="e.g. SHUTI50"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-2 py-2 text-xs text-slate-900 uppercase focus:outline-none focus:border-amber-500"
              />
            </div>
            <button
              type="submit"
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 rounded-lg border border-slate-200"
            >
              {language === 'bn' ? 'প্রয়োগ' : 'Apply'}
            </button>
          </form>
        </div>
      </div>

      {/* Primary CTA: Start Searching & Driver Bidding */}
      <button
        onClick={onStartBidding}
        disabled={!pickup || !dropoff}
        className={`w-full py-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
          pickup && dropoff
            ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-xl active:scale-[0.98]'
            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
        }`}
      >
        <Navigation className="w-4 h-4 rotate-45" />
        <span>
          {language === 'bn' ? 'চালকের জন্য রিকোয়েস্ট (৳' + offeredFareBDT + ')' : 'Request Driver (৳' + offeredFareBDT + ')'}
        </span>
      </button>

      {/* Info Banner */}
      <p className="text-[11px] text-slate-500 text-center flex items-center justify-center gap-1">
        <Info className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
        <span>
          {language === 'bn'
            ? 'সব রাইডে ৯৯৯ জাতীয় জরুরী সেবা ও লাইভ ট্র্যাকিং সুবিধা অন্তর্ভুক্ত।'
            : 'Every Shuti trip includes 999 Emergency SOS & Live GPS sharing.'}
        </span>
      </p>
    </div>
  );
};
