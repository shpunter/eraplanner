import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { useTooltipContext } from "../hook";
import styles from "./tooltipContent.module.css";

const TooltipContent = ({
  children,
  className,
  style,
  ...props
}: ContentProps) => {
  const { popoverRef, anchorName } = useTooltipContext();

  return (
    <div
      className={`${styles.content} ${className ?? ""}`.trim()}
      ref={popoverRef}
      popover="auto"
      style={{ ...style, positionAnchor: anchorName } as AnchorStyle}
      {...props}
    >
      {children}
    </div>
  );
};

export default TooltipContent;

export interface ContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

// `position-anchor` isn't in csstype yet; widen locally.
type AnchorStyle = CSSProperties & { positionAnchor?: string };
