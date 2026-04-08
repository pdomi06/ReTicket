// User - kycStatus
export const KycStatus = {
  Pending: "pending",
  Rejected: "rejected",
  Approved: "approved",
} as const;

// Events - category
export const EventCategory = {
  Cultural: "cultural",
  Music: "music",
  Sport: "sport",
} as const;

// Original Tickets - status
export const TicketStatus = {
  PreRelease: "pre-release",
  Active: "active",
  Cancelled: "cancelled",
  Expired: "expired",
} as const;

// Orders - status
export const OrderStatus = {
  Created: "created",
  Processing: "processing",
  Completed: "completed",
  Failed: "failed",
  Cancelled: "cancelled",
  Refunded: "refunded",
} as const;

// Orders - paymentStatus
export const PaymentStatus = {
  Pending: "pending",
  Authorized: "authorized",
  Captured: "captured",
  Failed: "failed",
} as const;

// Orders - deliverStatus
export const DeliveryStatus = {
  Pending: "pending",
  Sent: "sent",
  Delivered: "delivered",
} as const;

// Payouts - status
export const PayoutStatus = {
  Created: "created",
  Pending: "pending",
  Cancelled: "cancelled",
  Fulfilled: "fulfilled",
} as const;

// User Settings - profileVisibility
export const ProfileVisibility = {
  Visible: "visible",
  Restricted: "restricted",
  Banned: "banned",
} as const;
