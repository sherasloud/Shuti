import { LocationPoint } from '../types';

export const BD_LOCATIONS: LocationPoint[] = [
  // --- DHAKA DIVISION ---
  {
    id: 'loc-dhaka-1',
    name: 'Dhanmondi 27 (Mirpur Road)',
    nameBn: 'ধানমন্ডি ২৭ (মিরপুর রোড)',
    address: 'Near Rapa Plaza & Metro Shopping Mall, Dhaka',
    addressBn: 'রাপা প্লাজা ও মেট্রো শপিং মল সংলগ্ন, ঢাকা',
    city: 'Dhaka',
    lat: 23.7538,
    lng: 90.3768,
    isPopular: true,
    category: 'shopping'
  },
  {
    id: 'loc-dhaka-2',
    name: 'Gulshan 2 Circle',
    nameBn: 'গুলশান ২ সার্কেল',
    address: 'Gulshan Avenue, Diplomatic Zone, Dhaka',
    addressBn: 'গুলশান এভিনিউ, ডিপ্লোম্যাটিক জোন, ঢাকা',
    city: 'Dhaka',
    lat: 23.7949,
    lng: 90.4143,
    isPopular: true,
    category: 'business'
  },
  {
    id: 'loc-dhaka-3',
    name: 'Banani 11 Road',
    nameBn: 'বনানী ১১ নম্বর রোড',
    address: 'Food & Commercial Hub, Banani, Dhaka',
    addressBn: 'ফুড ও কমার্শিয়াল হাব, বনানী, ঢাকা',
    city: 'Dhaka',
    lat: 23.7937,
    lng: 90.4047,
    isPopular: true,
    category: 'business'
  },
  {
    id: 'loc-dhaka-4',
    name: 'Uttara Sector 11 (Garib-e-Nawaz Ave)',
    nameBn: 'উত্তরা সেক্টর ১১ (গরীব-ই-নেওয়াজ এভিনিউ)',
    address: 'Uttara Model Town, Dhaka',
    addressBn: 'উত্তরা মডেল টাউন, ঢাকা',
    city: 'Dhaka',
    lat: 23.8728,
    lng: 90.3888,
    isPopular: true,
    category: 'hub'
  },
  {
    id: 'loc-dhaka-5',
    name: 'Hazrat Shahjalal Int. Airport (HSIA)',
    nameBn: 'হযরত শাহজালাল আন্তর্জাতিক বিমানবন্দর',
    address: 'Kurmitola, Dhaka-1229',
    addressBn: 'কুর্মিটোলা, ঢাকা-১২২৯',
    city: 'Dhaka',
    lat: 23.8433,
    lng: 90.3978,
    isPopular: true,
    category: 'airport'
  },
  {
    id: 'loc-dhaka-6',
    name: 'Shahbagh & TSC (Dhaka University)',
    nameBn: 'শাহবাগ ও টিএসসি (ঢাকা বিশ্ববিদ্যালয়)',
    address: 'TSC Campus Circle, Shahbagh, Dhaka',
    addressBn: 'টিএসসি ক্যাম্পাস মোড়, শাহবাগ, ঢাকা',
    city: 'Dhaka',
    lat: 23.7317,
    lng: 90.3958,
    isPopular: true,
    category: 'university'
  },
  {
    id: 'loc-dhaka-7',
    name: 'Motijheel Commercial Area',
    nameBn: 'মতিঝিল বাণিজিক এলাকা',
    address: 'Shapla Chattar, Bank Hub, Dhaka',
    addressBn: 'শাপলা চত্বর, ব্যাংক হাব, ঢাকা',
    city: 'Dhaka',
    lat: 23.7289,
    lng: 90.4182,
    isPopular: true,
    category: 'business'
  },
  {
    id: 'loc-dhaka-8',
    name: 'Mirpur 10 Bus Stand & Metro Station',
    nameBn: 'মিরপুর ১০ বাসস্ট্যান্ড ও মেট্রো স্টেশন',
    address: 'Mirpur 10 Circle, Dhaka',
    addressBn: 'মিরপুর ১০ চত্বর, ঢাকা',
    city: 'Dhaka',
    lat: 23.8069,
    lng: 90.3687,
    isPopular: true,
    category: 'hub'
  },
  {
    id: 'loc-dhaka-9',
    name: 'Jamuna Future Park (Kuril Expressway)',
    nameBn: 'যমুনা ফিউচার পার্ক (কুরিল এসি)',
    address: 'Ka-244, Pragati Sarani, Kuril, Dhaka',
    addressBn: 'ক-২৪৪, প্রগতি সরণি, কুরিল, ঢাকা',
    city: 'Dhaka',
    lat: 23.8135,
    lng: 90.4242,
    isPopular: true,
    category: 'shopping'
  },
  {
    id: 'loc-dhaka-10',
    name: 'Old Dhaka (Lalbagh Fort / Sadarghat)',
    nameBn: 'পুরান ঢাকা (লালবাগ কেল্লা / সদরঘাট)',
    address: 'Lalbagh Road, Old Dhaka',
    addressBn: 'লালবাগ রোড, পুরান ঢাকা',
    city: 'Dhaka',
    lat: 23.7189,
    lng: 90.3882,
    isPopular: true,
    category: 'hub'
  },

  // --- CHITTAGONG DIVISION ---
  {
    id: 'loc-ctg-1',
    name: 'GEC Circle, Chattogram',
    nameBn: 'জিইসি মোড়, চট্টগ্রাম',
    address: 'CDA Avenue, Nasirabad, Chattogram',
    addressBn: 'সিডিএ এভিনিউ, নাসিরাবাদ, চট্টগ্রাম',
    city: 'Chittagong',
    lat: 22.3587,
    lng: 91.8214,
    isPopular: true,
    category: 'hub'
  },
  {
    id: 'loc-ctg-2',
    name: 'Agrabad Commercial Area',
    nameBn: 'অগ্রাবাদ বাণিজ্যিক এলাকা',
    address: 'Agrabad C/A, Chattogram',
    addressBn: 'অগ্রাবাদ সি/এ, চট্টগ্রাম',
    city: 'Chittagong',
    lat: 22.3275,
    lng: 91.8122,
    isPopular: true,
    category: 'business'
  },
  {
    id: 'loc-ctg-3',
    name: 'Patenga Sea Beach',
    nameBn: 'পতেঙ্গা সমুদ্র সৈকত',
    address: 'Patenga Road, Chattogram Airport Zone',
    addressBn: 'পতেঙ্গা রোড, বিমানবন্দর রোড, চট্টগ্রাম',
    city: 'Chittagong',
    lat: 22.2319,
    lng: 91.7915,
    isPopular: true,
    category: 'beach'
  },

  // --- COX'S BAZAR DIVISION ---
  {
    id: 'loc-cox-1',
    name: 'Kolatoli Beach Point',
    nameBn: 'কলাতলী বিচ পয়েন্ট',
    address: 'Hotel Motel Zone, Cox’s Bazar',
    addressBn: 'হোটেল মোটেল জোন, কক্সবাজার',
    city: 'CoxsBazar',
    lat: 21.4278,
    lng: 91.9806,
    isPopular: true,
    category: 'beach'
  },
  {
    id: 'loc-cox-2',
    name: 'Sugandha Beach Point',
    nameBn: 'সুগন্ধা বিচ পয়েন্ট',
    address: 'Beach Road, Cox’s Bazar',
    addressBn: 'সৈকত সড়ক, কক্সবাজার',
    city: 'CoxsBazar',
    lat: 21.4312,
    lng: 91.9765,
    isPopular: true,
    category: 'beach'
  },

  // --- SYLHET DIVISION ---
  {
    id: 'loc-sylhet-1',
    name: 'Zindabazar Circle',
    nameBn: 'জিন্দাবাজার পয়েন্ট',
    address: 'Zindabazar Main Road, Sylhet',
    addressBn: 'জিন্দাবাজার মেইন রোড, সিলেট',
    city: 'Sylhet',
    lat: 24.8949,
    lng: 91.8687,
    isPopular: true,
    category: 'hub'
  },
  {
    id: 'loc-sylhet-2',
    name: 'Hazrat Shah Jalal Mazar Dargah',
    nameBn: 'হযরত শাহজালাল (রঃ) মাজার শরীফ',
    address: 'Dargah Gate, Sylhet',
    addressBn: 'দরগাহ গেট, সিলেট',
    city: 'Sylhet',
    lat: 24.8998,
    lng: 91.8702,
    isPopular: true,
    category: 'hub'
  }
];
