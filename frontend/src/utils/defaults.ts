import type { IEvent, IEventContext } from "./interfaces"

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
  imageUrl: '',
  createdAt: '',
  updatedAt: ''
}

export const defaultIEventContext: IEventContext = {
  event: defaultIEvent,
  getEvent: async () => false
}