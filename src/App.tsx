import React, { useState } from 'react';
import { 
  Language, 
  AppMode, 
  LocationPoint, 
  VehicleOption, 
  PaymentMethod, 
  RideStatus, 
  RideDetails, 
  RideHistoryItem, 
  Driver 
} from './types';
import { BD_LOCATIONS } from './data/bdLocations';
import { VEHICLE_OPTIONS } from './data/vehicleTypes';
import { Header } from './components/Header';
import { InteractiveMap } from './components/InteractiveMap';
import { BookingPanel } from './components/BookingPanel';
import { DriverBiddingModal } from './components/DriverBiddingModal';
import { ActiveRideSheet } from './components/ActiveRideSheet';
import { PaymentModal } from './components/PaymentModal';
import { DriverModePanel } from './components/DriverModePanel';
import { AIAssistantDrawer } from './components/AIAssistantDrawer';
import { SafetySOSModal } from './components/SafetySOSModal';
import { WalletModal } from './components/WalletModal';
import { HistoryModal } from './components/HistoryModal';

export default function App() {
  // Global Application State
  const [language, setLanguage] = useState<Language>('bn');
  const [appMode, setAppMode] = useState<AppMode>('passenger');
  const [selectedCity, setSelectedCity] = useState<'Dhaka' | 'Chittagong' | 'CoxsBazar' | 'Sylhet'>('Dhaka');

  // Booking & Location State
  const [pickup, setPickup] = useState<LocationPoint | null>(BD_LOCATIONS[0]); // Dhanmondi 27
  const [dropoff, setDropoff] = useState<LocationPoint | null>(BD_LOCATIONS[1]); // Gulshan 2
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleOption>(VEHICLE_OPTIONS[0]); // CNG
  const [offeredFareBDT, setOfferedFareBDT] = useState<number>(200);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('bkash');
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [walletBalance, setWalletBalance] = useState<number>(1250);

  // Active Ride Flow State
  const [rideStatus, setRideStatus] = useState<RideStatus>('idle');
  const [currentRide, setCurrentRide] = useState<RideDetails | null>(null);

  // Modals Open State
  const [isBiddingModalOpen, setIsBiddingModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isAIGuideOpen, setIsAIGuideOpen] = useState(false);
  const [isSOSOpen, setIsSOSOpen] = useState(false);
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Ride History
  const [history, setHistory] = useState<RideHistoryItem[]>([
    {
      id: 'hist-1',
      date: '2026-07-26 14:30',
      pickupName: 'Dhanmondi 27',
      dropoffName: 'Motijheel Shapla Chattar',
      vehicleType: 'cng',
      fareBDT: 180,
      driverName: 'Md. Rafiqul Islam',
      status: 'Completed',
      paymentMethod: 'bkash'
    },
    {
      id: 'hist-2',
      date: '2026-07-24 09:15',
      pickupName: 'Banani 11 Road',
      dropoffName: 'Shahbagh TSC',
      vehicleType: 'bike',
      fareBDT: 120,
      driverName: 'Tanvir Ahmed',
      status: 'Completed',
      paymentMethod: 'cash'
    }
  ]);

  // Handle City Change
  const handleCityChange = (city: 'Dhaka' | 'Chittagong' | 'CoxsBazar' | 'Sylhet') => {
    setSelectedCity(city);
    const cityLocs = BD_LOCATIONS.filter((l) => l.city === city);
    if (cityLocs.length >= 2) {
      setPickup(cityLocs[0]);
      setDropoff(cityLocs[1]);
    }
  };

  // Handle Promo Code Apply
  const handleApplyPromoCode = (code: string) => {
    setPromoCode(code);
    if (code === 'SHUTI50' || code === 'EIDAFFORDABLE') {
      setPromoApplied(true);
      setOfferedFareBDT((prev) => Math.max(30, prev - 50));
    } else {
      alert(language === 'bn' ? 'অকার্যকর প্রোমো কোড' : 'Invalid Promo Code');
    }
  };

  // Start Driver Bidding Modal
  const handleStartBidding = () => {
    if (!pickup || !dropoff) return;
    setIsBiddingModalOpen(true);
  };

  // Passenger Accepts Driver's Bid
  const handleAcceptDriver = (driver: Driver) => {
    if (!pickup || !dropoff) return;

    const newRide: RideDetails = {
      id: `SHUTI-${Math.floor(100000 + Math.random() * 900000)}`,
      pickup,
      dropoff,
      vehicle: selectedVehicle,
      fareBDT: driver.bidFareBDT,
      originalFareBDT: driver.bidFareBDT + (promoApplied ? 50 : 0),
      discountBDT: promoApplied ? 50 : 0,
      paymentMethod,
      paymentPaid: false,
      driver,
      status: 'driver_arriving',
      otpCode: `${Math.floor(1000 + Math.random() * 9000)}`,
      estimatedDurationMins: 25,
      distanceKm: 8.5,
      trafficLevel: 'Moderate'
    };

    setCurrentRide(newRide);
    setRideStatus('driver_arriving');
    setIsBiddingModalOpen(false);
  };

  // Complete Ride & Open Payment Modal
  const handleCompleteRide = () => {
    if (!currentRide) return;
    setIsPaymentModalOpen(true);
  };

  // Finalize Payment & Rating
  const handleFinishPayment = (rating: number, review: string) => {
    if (!currentRide) return;

    const completedItem: RideHistoryItem = {
      id: currentRide.id,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      pickupName: language === 'bn' ? currentRide.pickup.nameBn : currentRide.pickup.name,
      dropoffName: language === 'bn' ? currentRide.dropoff.nameBn : currentRide.dropoff.name,
      vehicleType: currentRide.vehicle.id,
      fareBDT: currentRide.fareBDT,
      driverName: currentRide.driver?.name || 'Salahuddin',
      status: 'Completed',
      paymentMethod: currentRide.paymentMethod
    };

    // Deduct from wallet if wallet payment
    if (currentRide.paymentMethod === 'shuti_wallet') {
      setWalletBalance((prev) => Math.max(0, prev - currentRide.fareBDT));
    }

    setHistory((prev) => [completedItem, ...prev]);
    setIsPaymentModalOpen(false);
    setRideStatus('idle');
    setCurrentRide(null);
  };

  // Cancel Ride
  const handleCancelRide = () => {
    setRideStatus('idle');
    setCurrentRide(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col antialiased selection:bg-emerald-500 selection:text-white">
      
      {/* Top Header */}
      <Header
        language={language}
        onToggleLanguage={() => setLanguage(language === 'en' ? 'bn' : 'en')}
        appMode={appMode}
        onToggleAppMode={() => setAppMode(appMode === 'passenger' ? 'driver' : 'passenger')}
        walletBalance={walletBalance}
        onOpenWallet={() => setIsWalletOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenAIGuide={() => setIsAIGuideOpen(true)}
        onTriggerSOS={() => setIsSOSOpen(true)}
      />

      {/* Main Container Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        
        {appMode === 'passenger' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Column: Booking Form or Active Ride Sheet */}
            <div className="lg:col-span-5 space-y-6">
              {rideStatus === 'idle' ? (
                <BookingPanel
                  pickup={pickup}
                  dropoff={dropoff}
                  onSetPickup={(loc) => setPickup(loc)}
                  onSetDropoff={(loc) => setDropoff(loc)}
                  selectedVehicle={selectedVehicle}
                  onSelectVehicle={(v) => setSelectedVehicle(v)}
                  offeredFareBDT={offeredFareBDT}
                  onChangeOfferedFare={(fare) => setOfferedFareBDT(fare)}
                  paymentMethod={paymentMethod}
                  onSelectPaymentMethod={(pm) => setPaymentMethod(pm)}
                  promoCode={promoCode}
                  onApplyPromoCode={handleApplyPromoCode}
                  promoApplied={promoApplied}
                  onStartBidding={handleStartBidding}
                  language={language}
                  selectedCity={selectedCity}
                />
              ) : currentRide ? (
                <ActiveRideSheet
                  ride={currentRide}
                  onCompleteRide={handleCompleteRide}
                  onCancelRide={handleCancelRide}
                  onTriggerSOS={() => setIsSOSOpen(true)}
                  language={language}
                />
              ) : null}
            </div>

            {/* Right Column: Live Interactive Vector Map */}
            <div className="lg:col-span-7 h-[450px] sm:h-[550px] lg:h-[680px]">
              <InteractiveMap
                pickup={pickup}
                dropoff={dropoff}
                onSelectMapLocation={(loc) => {
                  if (!pickup) setPickup(loc);
                  else setDropoff(loc);
                }}
                language={language}
                rideStatus={rideStatus}
                driverLat={currentRide?.driver?.currentLat}
                driverLng={currentRide?.driver?.currentLng}
                vehicleType={selectedVehicle.id}
                selectedCity={selectedCity}
                onCityChange={handleCityChange}
              />
            </div>
          </div>
        ) : (
          /* Captain Driver Platform View */
          <div className="max-w-4xl mx-auto">
            <DriverModePanel language={language} />
          </div>
        )}
      </main>

      {/* Modals & Drawers */}
      {isBiddingModalOpen && (
        <DriverBiddingModal
          offeredFareBDT={offeredFareBDT}
          vehicleType={selectedVehicle.id}
          onAcceptDriver={handleAcceptDriver}
          onCancel={() => setIsBiddingModalOpen(false)}
          language={language}
        />
      )}

      {isPaymentModalOpen && currentRide && (
        <PaymentModal
          ride={currentRide}
          onFinishPayment={handleFinishPayment}
          language={language}
        />
      )}

      <AIAssistantDrawer
        isOpen={isAIGuideOpen}
        onClose={() => setIsAIGuideOpen(false)}
        pickupName={pickup?.name}
        dropoffName={dropoff?.name}
        vehicleType={selectedVehicle.name}
        language={language}
      />

      <SafetySOSModal
        isOpen={isSOSOpen}
        onClose={() => setIsSOSOpen(false)}
        language={language}
      />

      <WalletModal
        isOpen={isWalletOpen}
        onClose={() => setIsWalletOpen(false)}
        balance={walletBalance}
        onTopUp={(amt) => setWalletBalance((prev) => prev + amt)}
        language={language}
      />

      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        language={language}
      />

      {/* Footer Branding */}
      <footer className="border-t border-slate-200 bg-white/80 py-4 text-center text-xs text-slate-400">
        <p>
          Shuti (ছুটি) Ride Sharing Bangladesh • Dhaka • Chittagong • Cox’s Bazar • Sylhet
        </p>
      </footer>
    </div>
  );
}
