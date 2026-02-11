import {
  type KycStatus,
  type EventCategory,
  type TicketStatus,
  type OrderStatus,
  type PaymentStatus,
  type DeliveryStatus,
  type PayoutStatus,
  type ProfileVisibility,
} from "./enums";

// Database Table Interfaces

export interface IUser {
  id: number;
  email: string;
  passwordHash: string;
  name: string;
  phone: string;
  isVerified: boolean;
  isActive: boolean;
  isOnline: boolean;
  kycStatus: typeof KycStatus;
  createdAt: string;
  updatedAt: string;
  lastLogin: string;
}

export interface IEmailVerify {
  id: number;
  userId: number;
  token: string;
  expiresAt: string;
  verifiedAt: string;
  createdAt: string;
}

export interface IPasswordReset {
  id: number;
  userId: number;
  token: string;
  expiresAt: string;
  verifiedAt: string;
  createdAt: string;
}

export interface IUserSettings {
  userid: number;
  emailNotification: boolean;
  smsNotification: boolean;
  profileVisibility: typeof ProfileVisibility;
  createdAt: string;
  updatedAt: string;
}

export interface IEvent {
  id: number;
  name: string;
  description: string;
  venue: string;
  address: string;
  city: string;
  state: string;
  country: string;
  eventDate: string;
  eventEndDate: string;
  category: typeof EventCategory;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface IOriginalTicket {
  id: number;
  eventId: number;
  section: string;
  row: string;
  seatNumber: string;
  price: number;
  status: typeof TicketStatus;
  ticketPdfUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface ITicketHistory {
  id: number;
  originalTicketId: number;
  ticketListingId: number;
  fromUserId: number;
  toUserId: number;
  price: number;
  platformFee: number;
}

export interface ITicketForsale {
  id: number;
  originalTicketId: number;
  fromUserId: number;
  price: number;
  inBasket: boolean;
}

export interface IOrder {
  id: number;
  orderNumber: number;
  buyerEmail: string;
  subtotal: number;
  platformFee: number;
  tax: number | null;
  status: typeof OrderStatus;
  paymentIntentId: string;
  paymentStatus: typeof PaymentStatus;
  deliveryEmail: string;
  deliverStatus: typeof DeliveryStatus;
  deliveredAt: string;
  createdAt: string;
  updatedAt: string;
  completedAt: string;
  cancelledAt: string;
}

export interface IOrderItem {
  id: number;
  orderId: number;
  ticketListingId: number;
  price: number;
  createdAt: string;
}

export interface IActiveTicket {
  id: number;
  originalTicketId: number;
  ticketListingId: number;
}

export interface IPayout {
  id: number;
  vendorId: number;
  orderItemId: number;
  status: typeof PayoutStatus;
  bank: number;
  iban: number;
  paidAt: number;
  createdAt: number;
}

export interface IReview {
  id: number;
  orderItemId: number;
  reviewerName: string;
  reviewedUserId: number;
  rating: number;
  title: string;
  comment: string;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IVenueMap {
  id: number;
  venue: string;
  section: string;
  row: string;
  seat: string;
  rate: number;
}

// Components

export interface ISceneryMap {
    name: string;
    width: number;
    height: number;
    rate: number;
}

export interface InputProps {
    type?: string;
    label: string;
    name: string;
    value?: string | number;
    theme?: 'light' | 'dark';
    step?: number;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface TextareaProps {
    label: string;
    name: string;
    value?: string;
    rows?: number;
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

