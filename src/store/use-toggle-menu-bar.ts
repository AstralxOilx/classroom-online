// atoms/menu.ts
import { atom, useAtom } from "jotai";

const menuState = atom(false);
 
const toggleMenuState = atom(
  (get) => get(menuState),
  (get, set) => set(menuState, !get(menuState))
);
 
export const useToggleMenuBar = () => {
  return useAtom(toggleMenuState); 
};
