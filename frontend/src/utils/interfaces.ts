import {
  type EventCategory,
  type KycStatus,
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
  kycStatus: typeof KycStatus[keyof typeof KycStatus];
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
  profileVisibility: typeof ProfileVisibility[keyof typeof ProfileVisibility];
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
  eventDate: number;
  eventEndDate: number;
  category: typeof EventCategory[keyof typeof EventCategory];
  basePrice: number;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  firstTicketStatus?: typeof TicketStatus[keyof typeof TicketStatus] | null;
}

export type IEventForm = Omit<IEvent, 'eventDate' | 'eventEndDate'> & {
  eventDate: number | string;
  eventEndDate: number | string;
};

export interface IOriginalTicket {
  id: number;
  eventId: number;
  section: string;
  row: number;
  seatNumber: number;
  price: number;
  status: typeof TicketStatus[keyof typeof TicketStatus];
  ticketPdfUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface ITicketHistory {
  id: number;
  originalTicketId: number;
  ticketListingId: number;
  fromUserId: number | null;
  toUserId: number;
  price: number;
  platformFee: number;
}

export interface ITicketForsale {
  id: number;
  originalTicketId: number;
  fromUserId: number | null;
  price: number;
  inBasket: boolean;
  eventId: number;
  row?: number;
  col?: number;
}

export interface IOrder {
  id: number;
  orderNumber: number;
  buyerEmail: string;
  subtotal: number;
  platformFee: number;
  tax: number | null;
  status: typeof OrderStatus[keyof typeof OrderStatus];
  paymentIntentId: string;
  paymentStatus: typeof PaymentStatus[keyof typeof PaymentStatus];
  deliveryEmail: string;
  deliverStatus: typeof DeliveryStatus[keyof typeof DeliveryStatus];
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
  status: typeof PayoutStatus[keyof typeof PayoutStatus];
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
  id?: number;
  venue: string;
  section: string;
  rows: number;
  cols: number;
  rate: number;
}

// Components

export interface InputProps {
    type?: string;
    label: string;
    name: string;
    value?: string | number;
    min?: number;
    step?: number;
    theme?: 'light' | 'dark';
    size?: 'small' | 'medium' | 'large';
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface TextareaProps {
    label: string;
    name: string;
    value?: string;
    rows?: number;
    theme?: 'light' | 'dark';
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export interface ButtonProps {
    type?: 'button' | 'submit' | 'reset';
    text: string | React.ReactNode;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    disabled?: boolean;
    className?: string;
    id?: string;
    name?: string;
    variant?: 'primary' | 'outline';
    link?: string;
    'aria-label'?: string;
}

export interface SelectProps {
  label: string;
  name?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children?: React.ReactNode;
  theme?: 'light' | 'dark';
  size?: 'small' | 'medium' | 'large';
}

export interface CardProps {
    title: string;
    description: string;
    imageUrl?: string;
    buttonText?: string;
    link?: string;
    onClick?: React.MouseEventHandler<HTMLDivElement>;
}

export interface IEventContext {
  event: IEvent | undefined;
  getEvent: (id: string) => Promise<boolean>;
}

export interface ICartContext {
  tickets: ITicketForsale[];
  addToCart: (eventId: number, row: number, seat: number) => Promise<boolean>;
  removeFromCart: (ticket: ITicketForsale) => Promise<void>;
  clearCart: () => void;
}

export interface IDashboardTicket {
  id: number;
  eventName: string;
  eventDate: number | string;
  venue: string;
  section: string;
  row: number;
  seatNumber: number;
  price: number;
  status: typeof TicketStatus[keyof typeof TicketStatus];
}