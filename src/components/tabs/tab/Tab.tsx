import type { ComponentPropsWithoutRef } from "react";
import { classnames } from "#/shared/classnames";
import { useTabsContext } from "../context";
import css from "./tab.module.css";

const Tab = <T extends string>({
  value,
  children,
  className,
  ...props
}: TabProps<T>) => {
  const { value: activeValue, onChange, size } = useTabsContext();
  const isActive = value === activeValue;

  const classNames = classnames({
    [css.tab]: true,
    [css[size]]: true,
    [css.active]: isActive,
  });

  const onClick = () => onChange(value);

  return (
    <button
      {...props}
      type="button"
      role="tab"
      aria-selected={isActive}
      className={classNames}
      onClick={onClick}
    >
      <span className={css.label}>{children}</span>
    </button>
  );
};

export default Tab;

type TabProps<T extends string> = ComponentPropsWithoutRef<"button"> & {
  value: T;
};
