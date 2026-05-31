import type { ComponentPropsWithoutRef } from "react";
import { classnames } from "#/shared/classnames";
import css from "./dropdown.module.css";

const Dropdown = <T extends string>({
  options,
  value,
  onChange,
  size = "md",
  className,
  ...props
}: DropdownProps<T>) => {
  const classNames = classnames({
    [css.select]: true,
    [css[size]]: true,
  });

  const onChangeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value as T);
  };

  return (
    <div className={css.wrapper}>
      <select
        className={classNames}
        value={value}
        onChange={onChangeHandler}
        {...props}
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
      <span className={css.arrow} aria-hidden />
    </div>
  );
};

export default Dropdown;

export type DropdownOption<T extends string> = {
  label: string;
  value: T;
  disabled?: boolean;
};

type DropdownProps<T extends string> = Omit<
  ComponentPropsWithoutRef<"select">,
  "onChange" | "value" | "size"
> & {
  options: DropdownOption<T>[];
  value: T;
  onChange: (value: T) => void;
  size?: "sm" | "md";
};
