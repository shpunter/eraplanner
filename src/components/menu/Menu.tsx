import { useState } from "react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { MenuContext } from "./context";
import MenuItem from "./item/MenuItem";
import css from "./menu.module.css";

const Menu = <T extends string>({
  value: controlledValue,
  defaultValue,
  onChange,
  className,
  children,
  ...props
}: MenuProps<T>) => {
  const [internalValue, setInternalValue] = useState<T | undefined>(
    defaultValue,
  );

  // controlled when `value` is supplied; otherwise the menu owns its selection
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  const handleChange = (next: T) => {
    if (!isControlled) setInternalValue(next);

    onChange?.(next);
  };

  const contextValue = {
    value: value ?? "",
    onChange: handleChange as (value: string) => void,
  };

  return (
    <MenuContext.Provider value={contextValue}>
      <nav
        className={`${css.menu}${className ? ` ${className}` : ""}`}
        {...props}
      >
        {children}
      </nav>
    </MenuContext.Provider>
  );
};

Menu.Item = MenuItem;

export default Menu;
export { MenuItem };

type MenuProps<T extends string> = Omit<
  ComponentPropsWithoutRef<"nav">,
  "onChange"
> & {
  defaultValue?: T;
  value?: T;
  onChange?: (value: T) => void;
  children: ReactNode;
};
