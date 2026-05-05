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
  created_at: string;
  updated_at: string;
  lastLogin: string | null;
}

export interface IEmailVerify {
  id: number;
  userId: number;
  token: string;
  expiresAt: string;
  verifiedAt: string;
  created_at: string;
  updated_at: string | null;
}

export interface IPasswordReset {
  id: number;
  userId: number;
  token: string;
  expiresAt: string;
  verifiedAt: string;
  created_at: string;
  updated_at: string | null;
}

export interface IUserSettings {
  userId: number;
  emailNotification: boolean;
  smsNotification: boolean;
  profileVisibility: typeof ProfileVisibility[keyof typeof ProfileVisibility];
  created_at: string;
  updated_at: string;
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
  isFeatured: boolean;
  views: number;
  created_at: string;
  updated_at: string;
  firstTicketStatus?: typeof TicketStatus[keyof typeof TicketStatus] | null;
}

export type IEventForm = Omit<IEvent, 'eventDate' | 'eventEndDate' | 'views' | 'created_at' | 'updated_at' | 'firstTicketStatus'> & {
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
  created_at: string;
  updated_at: string;
}

export interface ITicketHistory {
  id: number;
  originalTicketId: number;
  ticketListingId: string;
  fromUserId: number | null;
  toUser: string;
  price: number;
  platformFee: number;
  isResell: boolean;
}

export interface ITicketForsale {
  id: number;
  originalTicketId: number;
  fromUserId: number | null;
  price: number;
  isResell: boolean;
  inBasket: boolean;
  eventId: number;
  row?: number;
  col?: number;
}

export interface IOrder {
  id: number;
  orderNumber: number;
  subtotal: number;
  platformFee: number;
  tax: number | null;
  status: typeof OrderStatus[keyof typeof OrderStatus];
  paymentIntentId: string;
  paymentStatus: typeof PaymentStatus[keyof typeof PaymentStatus];
  deliveryEmail: string;
  deliveryStatus: typeof DeliveryStatus[keyof typeof DeliveryStatus];
  deliveredAt: string | null;
  created_at: string;
  updated_at: string;
  completedAt: string | null;
  cancelledAt: string | null;
}

export interface IOrderItem {
  id: number;
  orderId: number;
  ticketListingId: string;
  price: number;
  created_at: string;
  updated_at: string | null;
}

export interface IActiveTicket {
  id: number;
  originalTicketId: number;
  ticketListingId: string;
  orderId: number;
  isValidated: boolean;
  validatedAt: string | null;
}

export interface IPayout {
  id: number;
  vendorId: number;
  orderItemId: number;
  status: typeof PayoutStatus[keyof typeof PayoutStatus];
  bank: string;
  iban: string;
  paidAt: string;
  created_at: string;
  updated_at: string | null;
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
  created_at: string;
  updated_at: string;
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
    category?: string;
    price?: number;
    title: string;
    description: string;
    imageUrl?: string;
    buttonText?: string;
    link?: string;
    onClick?: React.MouseEventHandler<HTMLDivElement>;
}

export interface IEventContext {
  event: IEvent | undefined;
  getEvent: (id: string) => Promise<IEvent | undefined>;
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
export interface IMyDashboardTicket {
  id: number;
  eventName: string;
  eventDate: number | string;
  venue: string;
  section: string;
  row: number;
  seatNumber: number;
  price: number;
}