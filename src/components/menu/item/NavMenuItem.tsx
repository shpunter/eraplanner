import { Link, type LinkProps } from "@tanstack/react-router";
import type { ReactNode } from "react";
import css from "./menuItem.module.css";

type NavMenuItemProps = Omit<LinkProps, "className" | "activeProps"> & {
  children: ReactNode;
};

const NavMenuItem = ({ children, ...linkProps }: NavMenuItemProps) => (
  <Link
    className={css.item}
    activeProps={{ className: `${css.item} ${css.active}` }}
    activeOptions={{ exact: true }}
    {...linkProps}
  >
    <div className={css.content}>{children}</div>
  </Link>
);

export default NavMenuItem;
