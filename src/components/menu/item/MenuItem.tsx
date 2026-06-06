import type { ReactNode } from "react";
import { classnames } from "#/shared/classnames";
import { useMenuContext } from "../context";
import css from "./menuItem.module.css";

const MenuItem = <T extends string>({ value, children }: MenuItemProps<T>) => {
  const { value: activeValue, onChange } = useMenuContext();
  const isActive = value === activeValue;
  const className = classnames({ [css.item]: true, [css.active]: isActive });

  const onClick = () => {
    onChange(value);
  };

  return (
    <div className={className} onClick={onClick}>
      <div className={css.content}>{children}</div>
    </div>
  );
};

export default MenuItem;

type MenuItemProps<T extends string> = {
  value: T;
  children: ReactNode;
};
