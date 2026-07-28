import { VehicleOption } from '../types';

export const VEHICLE_OPTIONS: VehicleOption[] = [
  {
    id: 'cng',
    name: 'CNG Auto Rickshaw',
    nameBn: 'সবুজ সিএনজি',
    icon: '🛺',
    capacity: 3,
    baseFare: 60,
    perKm: 18,
    speedKmH: 25,
    etaMins: 3,
    description: 'Iconic 3-wheeler green CNG auto-rickshaw. Nimble in traffic & covered seats.',
    descriptionBn: 'ঐতিহ্যবাহী তিন চাকার সবুজ সিএনজি অটোরিকশা। ঢাকার ট্রাফিকে স্বাচ্ছন্দ্যে চলার জন্য দারুণ।',
    popularFor: 'Medium trips & heavy traffic',
    popularForBn: 'মাঝারি দূরত্ব ও ট্রাফিক জ্যামে দ্রুতগতির জন্য'
  },
  {
    id: 'bike',
    name: 'Shuti Bike',
    nameBn: 'শুটি বাইক',
    icon: '🏍️',
    capacity: 1,
    baseFare: 35,
    perKm: 14,
    speedKmH: 38,
    etaMins: 2,
    description: 'Fastest motorbike ride with verified safety helmet for single passenger.',
    descriptionBn: 'ঢাকার জ্যাম কাটাতে দ্রুততম বাইক রাইড। যাত্রীর জন্য সার্টিফাইড হেলমেট নিশ্চিত।',
    popularFor: 'Solo travel & urgent trips',
    popularForBn: 'একা যাতায়াত ও জরুরী দ্রুত ভ্রমণের জন্য'
  },
  {
    id: 'car',
    name: 'Shuti Sedan AC',
    nameBn: 'শুটি এসি কার',
    icon: '🚗',
    capacity: 4,
    baseFare: 120,
    perKm: 32,
    speedKmH: 30,
    etaMins: 5,
    description: 'Comfortable air-conditioned Sedan for family, business, or bad weather.',
    descriptionBn: 'পরিবার বা ব্যবসার কাজে আরামদায়ক এসি প্রাইভেট কার। প্রিমিয়াম অভিজ্ঞতা।',
    popularFor: 'Comfort & rainy days',
    popularForBn: 'আরামদায়ক ও বৃষ্টি বা গরমের দিনে ভ্রমণের জন্য'
  },
  {
    id: 'rickshaw',
    name: 'Eco Rickshaw',
    nameBn: 'ইকো রিকশা',
    icon: '🚲',
    capacity: 2,
    baseFare: 25,
    perKm: 12,
    speedKmH: 12,
    etaMins: 2,
    description: 'Traditional neighborhood pedal & electric rickshaw for short distance.',
    descriptionBn: 'পাড়ার মোড়ে বা অল্প দূরত্বের যাতায়াতে পরিবেশবান্ধব ঐতিহ্যবাহী রিকশা।',
    popularFor: 'Short neighborhood rides',
    popularForBn: 'কাছাকাছি স্বল্প দূরত্বের ভ্রমণের জন্য'
  },
  {
    id: 'microbus',
    name: 'Shuti Microbus',
    nameBn: 'শুটি মাইক্রোবাস (HiAce)',
    icon: '🚐',
    capacity: 10,
    baseFare: 350,
    perKm: 55,
    speedKmH: 35,
    etaMins: 8,
    description: 'Spacious Toyota HiAce Microbus for group tours, office teams & intercity travel.',
    descriptionBn: 'গ্রুপ ভ্রমণ, অফিস টিম বা আন্তঃজেলা ট্যুরের জন্য ১০ সীটের সুবিশাল মাইক্রোবাস।',
    popularFor: 'Group, Airport & Intercity tours',
    popularForBn: 'গ্রুপ ট্যুর, এয়ারপোর্ট ও আন্তঃজেলা ট্যুরের জন্য'
  }
];
