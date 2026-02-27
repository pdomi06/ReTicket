import type { IEvent, IEventContext, ISceneryMap } from "./interfaces"

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

export const defaultISceneryMap: ISceneryMap = {
  venue: '',
  width: 0,
  height: 0,
  rate: 0
}