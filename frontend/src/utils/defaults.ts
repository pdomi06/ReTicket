import type { ICartContext, IEvent, IEventContext, IVenueMap } from "./interfaces"

export const defaultIEvent: IEvent = {
  id: 0,
  name: '',
  description: '',
  venue: '',
  address: '',
  city: '',
  state: '',
  country: '',
  eventDate: '',
  eventEndDate: '',
  category: 'music' as const,
  basePrice: 0,
  imageUrl: '',
  createdAt: '',
  updatedAt: ''
}

export const defaultIEventContext: IEventContext = {
  event: defaultIEvent,
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
  items: [],
  addToCart: async () => {},
  removeFromCart: () => {},
  clearCart: () => {}
}