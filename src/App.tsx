import React, { useState, useEffect } from 'react';
import { 
  Language, 
  AppMode, 
  LocationPoint, 
  VehicleOption, 
  PaymentMethod, 
  RideStatus, 
  RideDetails, 
  RideHistoryItem, 
  Driver,
  UserProfile 
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
import { GoogleAuthModal } from './components/GoogleAuthModal';
import { BottomNavBar } from './components/BottomNavBar';
import { Wifi, Battery, Signal, Smartphone } from 'lucide-react';

export default function App() {
  // Global Application State
  const [language, setLanguage] = useState<Language>('bn');
  const [appMode, setAppMode] = useState<AppMode>('passenger');
  const [selectedCity, setSelectedCity] = useState<'Dhaka' | 'Chittagong' | 'CoxsBazar' | 'Sylhet'>('Dhaka');
  const [activeTab, setActiveTab] = useState<'ride' | 'wallet' | 'history' | 'ai' | 'sos' | 'account'>('ride');

  // Time state for mobile status bar
  const [timeString, setTimeString] = useState('09:41');
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateTime();
    const timer = setInterval(updateTime, 30000);
    return () => clearInterval(timer);
  }, []);

  // User Auth State
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const savedUser = localStorage.getItem('shuti_user_profile');
      if (savedUser) return JSON.parse(savedUser);
    } catch (e) {
      console.error(e);
    }
    return null;
  });
  const [isGoogleAuthOpen, setIsGoogleAuthOpen] = useState(false);

  // Sync user profile to localStorage
  const handleUserLogin = (newUser: UserProfile) => {
    setUser(newUser);
    try {
      localStorage.setItem('shuti_user_profile', JSON.stringify(newUser));
    } catch (e) {
      console.error(e);
    }
  };

  const handleUserLogout = () => {
    setUser(null);
    try {
      localStorage.removeItem('shuti_user_profile');
    } catch (e) {
      console.error(e);
    }
  };

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

  // Handle Bottom Nav Bar Clicks
  const handleSelectTab = (tab: 'ride' | 'wallet' | 'history' | 'ai' | 'sos' | 'account') => {
    setActiveTab(tab);
    if (tab === 'wallet') setIsWalletOpen(true);
    else if (tab === 'history') setIsHistoryOpen(true);
    else if (tab === 'ai') setIsAIGuideOpen(true);
    else if (tab === 'sos') setIsSOSOpen(true);
    else if (tab === 'account') setIsGoogleAuthOpen(true);
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
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col antialiased selection:bg-slate-200 pb-16 md:pb-0">
      
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
        user={user}
        onOpenGoogleAuth={() => setIsGoogleAuthOpen(true)}
      />

      {/* Main Container Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-10">
        
        {appMode === 'passenger' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Booking Form or Active Ride Sheet */}
            <div className="lg:col-span-5 space-y-8">
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
            <div className="lg:col-span-7 h-[500px] sm:h-[600px] lg:h-[720px]">
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

      {/* Mobile Sticky Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40">
        <BottomNavBar
          activeTab={activeTab}
          onSelectTab={handleSelectTab}
          walletBalance={walletBalance}
          user={user}
          language={language}
        />
      </div>

      {/* Footer Branding */}
      <footer className="py-8 text-center border-t border-slate-200 mt-12 bg-white">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
          Shuti BD • Seamless Ride Sharing Bangladesh
        </p>
      </footer>

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
        onClose={() => {
          setIsAIGuideOpen(false);
          setActiveTab('ride');
        }}
        pickupName={pickup?.name}
        dropoffName={dropoff?.name}
        vehicleType={selectedVehicle.name}
        language={language}
      />

      <SafetySOSModal
        isOpen={isSOSOpen}
        onClose={() => {
          setIsSOSOpen(false);
          setActiveTab('ride');
        }}
        language={language}
      />

      <WalletModal
        isOpen={isWalletOpen}
        onClose={() => {
          setIsWalletOpen(false);
          setActiveTab('ride');
        }}
        balance={walletBalance}
        onTopUp={(amt) => setWalletBalance((prev) => prev + amt)}
        language={language}
      />

      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => {
          setIsHistoryOpen(false);
          setActiveTab('ride');
        }}
        history={history}
        language={language}
      />

      <GoogleAuthModal
        isOpen={isGoogleAuthOpen}
        onClose={() => {
          setIsGoogleAuthOpen(false);
          setActiveTab('ride');
        }}
        user={user}
        onLogin={handleUserLogin}
        onLogout={handleUserLogout}
        language={language}
      />
    </div>
  );
}

