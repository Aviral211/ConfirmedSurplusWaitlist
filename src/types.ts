export type AppState =
  | 'waitlist'
  | 'merchant'
  | 'distribution'
  | 'offer'
  | 'success'
  | 'reassignment';

export interface WaitlistMember {
  id: string;
  name: string;
  joinedTime: string;
  isCurrentUser?: boolean;
  status: 'waiting' | 'offered' | 'accepted' | 'declined' | 'expired' | 'standby';
}

export interface BakeryDetails {
  name: string;
  location: string;
  address: string;
  bagQuantity: number;
  pricePerBag: number;
  pickupWindow: string;
  pickupCode: string;
}
