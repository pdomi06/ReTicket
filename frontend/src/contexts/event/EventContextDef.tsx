import { createContext } from "react";
import { defaultIEventContext, type IEventContext } from "../../utils/interfaces";

export const EventContext = createContext<IEventContext>(defaultIEventContext)