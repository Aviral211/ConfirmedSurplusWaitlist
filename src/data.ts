import { BakeryDetails, WaitlistMember } from './types';

export const DEMO_BAKERY: BakeryDetails = {
  name: 'Sunrise Bakery',
  location: 'Bellevue',
  address: '10400 NE 4th St, Bellevue, WA 98004',
  bagQuantity: 3,
  pricePerBag: 5,
  pickupWindow: '7:30–8:00 PM',
  pickupCode: '4821',
};

export const INITIAL_WAITLIST: WaitlistMember[] = [
  {
    id: 'user-1',
    name: 'Maya Lin',
    joinedTime: '4:15 PM',
    status: 'waiting',
  },
  {
    id: 'user-2',
    name: 'David Kim',
    joinedTime: '4:42 PM',
    status: 'waiting',
  },
  {
    id: 'user-3',
    name: 'You (Alex)',
    joinedTime: '5:10 PM',
    isCurrentUser: true,
    status: 'waiting',
  },
  {
    id: 'user-4',
    name: 'Sarah Torres',
    joinedTime: '5:35 PM',
    status: 'standby',
  },
  {
    id: 'user-5',
    name: 'James Patel',
    joinedTime: '6:02 PM',
    status: 'standby',
  },
];
