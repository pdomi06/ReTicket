// ============================================
// Enums for Status Fields
// ============================================

export const enum KYCStatus {
    PENDING = "pending",
    REJECTED = "rejected",
    APPROVED = "approved"
}

export const enum ProfileVisibility {
    VISIBLE = "visible",
    RESTRICTED = "restricted",
    BANNED = "banned"
}

export const enum EventCategory {
    CULTURAL = "cultural",
    MUSIC = "music",
    SPORT = "sport"
}

export const enum TicketStatus {
    PRE_RELEASE = "pre-release",
    ACTIVE = "active",
    CANCELLED = "cancelled",
    EXPIRED = "expired"
}

export const enum OrderStatus {
    PENDING = "pending",
    PROCESSING = "processing",
    COMPLETED = "completed",
    FAILED = "failed",
    REFUNDED = "refunded"
}

export const enum PaymentStatus {
    PENDING = "pending",
    AUTHORIZED = "authorized",
    CAPTURED = "captured",
    FAILED = "failed",
    REFUNDED = "refunded"
}

export const enum DeliveryStatus {
    PENDING = "pending",
    SENT = "sent",
    DELIVERED = "delivered"
}

export const enum PayoutStatus {
    CREATED = "created",
    PENDING = "pending",
    CANCELLED = "cancelled",
    FULFILLED = "fulfilled"
}

// ============================================
// User Models
// ============================================

export interface User {
    id: number;
    email: string;
    passwordHash: string;
    name: string;
    phone: string;
    isVerified: boolean;
    isActive: boolean;
    isOnline: boolean;
    kycStatus: KYCStatus;
    createdAt: string;
    updatedAt: string;
    lastLogin: string;
}

export interface UserSettings {
    userId: number;
    emailNotification: boolean;
    smsNotification: boolean;
    profileVisibility: ProfileVisibility;
    createdAt: string;
    updatedAt: string;
}

export interface EmailVerify {
    id: number;
    userId: number;
    token: string;
    expiresAt: string;
    verifiedAt: string;
    createdAt: string;
}

export interface PasswordReset {
    id: number;
    userId: number;
    token: string;
    expiresAt: string;
    verifiedAt: string;
    createdAt: string;
}

// ============================================
// Event Models
// ============================================

export interface Events {
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
    category: EventCategory;
    imageUrl: string;
    createdAt: string;
    updatedAt: string;
}

export interface VenueMap {
    id: number;
    venue: string;
    section: string;
    row: string;
    seat: string;
    rate: number;
}

// ============================================
// Ticket Models
// ============================================

export interface OriginalTickets {
    id: number;
    eventId: number;
    section: string;
    row: string;
    seatNumber: string;
    price: number;
    status: TicketStatus;
    ticketPdfUrl: string;
    createdAt: string;
    updatedAt: string;
}

export interface TicketHistory {
    id: number;
    originalTicketId: number;
    ticketListingId: number;
    fromUserId: number;
    toUserId: number;
    price: number;
    platformFee: number;
}

export interface TicketForSale {
    id: number;
    originalTicketId: number;
    fromUserId: number;
    price: number;
    inBasket: boolean;
}

export interface ActiveTickets {
    id: number;
    originalTicketId: number;
    ticketListingId: number;
}

// ============================================
// Order Models
// ============================================

export interface Orders {
    id: number;
    orderNumber: number;
    buyerEmail: string;
    subtotal: number;
    platformFee: number;
    tax?: number;
    status: OrderStatus;
    paymentIntentId: string;
    paymentStatus: PaymentStatus;
    deliveryEmail: string;
    deliveryStatus: DeliveryStatus;
    deliveredAt: string;
    createdAt: string;
    updatedAt: string;
    completedAt: string;
    cancelledAt: string;
}

export interface OrderItems {
    id: number;
    orderId: number;
    ticketListingId: number;
    price: number;
    createdAt: string;
}

// ============================================
// Misc Models
// ============================================

export interface Payouts {
    id: number;
    vendorId: number;
    orderItemId: number;
    status: PayoutStatus;
    bank: number;
    iban: number;
    paidAt: number;
    createdAt: number;
}

export interface Reviews {
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

// ============================================
// UI Component Props (Existing)
// ============================================

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