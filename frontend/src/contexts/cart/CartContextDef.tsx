import { createContext } from "react";
import type { ICartContext } from "../../utils/interfaces";
import { defaultICartContext } from "../../utils/defaults";

export const CartContext = createContext<ICartContext>(defaultICartContext);