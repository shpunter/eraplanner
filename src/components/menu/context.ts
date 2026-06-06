import { createContext, useContext } from "react";

export type MenuContextValue = {
  value: string;
  onChange: (value: string) => void;
};

export const MenuContext = createContext<MenuContextValue | null>(null);

export const useMenuContext = () => {
  const context = useContext(MenuContext);

  if (!context) {
    throw new Error("<Menu.Item> must be used within <Menu>");
  }

  return context;
};
