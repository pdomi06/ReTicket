import type { ICartContext, IEventContext, IEventForm, IVenueMap } from "./interfaces"

export const defaultIEvent: IEventForm = {
  id: 0,
  name: '',
  description: '',
  venue: '',
  address: '',
  city: '',
  state: '',
  country: '',
  eventDate: 0,
  eventEndDate: 0,
  category: 'music' as const,
  basePrice: 0,
  imageUrl: '',
  createdAt: '',
  updatedAt: ''
}

export const defaultIEventContext: IEventContext = {
  event: {
    id: 0,
    name: '',
    description: '',
    venue: '',
    address: '',
    city: '',
    state: '',
    country: '',
    eventDate: 0,
    eventEndDate: 0,
    category: 'music' as const,
    basePrice: 0,
    imageUrl: '',
    createdAt: '',
    updatedAt: ''
  },
  getEvent: async () => false
}

export const defaultIVenueMap: IVenueMap = {
  venue: '',
  section: '',
  rows: 0,
  cols: 0,
  rate: 0
}

export const defaultICartContext: ICartContext = {
  tickets: [],
  addToCart: async () => false,
  removeFromCart: async () => {},
  clearCart: () => {}
}