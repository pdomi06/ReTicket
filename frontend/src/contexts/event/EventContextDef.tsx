import { createContext } from "react";
import { defaultIEventContext } from "../../utils/defaults";
import type { IEventContext } from "../../utils/interfaces";

export const EventContext = createContext<IEventContext>(defaultIEventContext)