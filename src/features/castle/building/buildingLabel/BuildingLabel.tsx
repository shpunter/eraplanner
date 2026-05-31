import type { TBuilding } from "#/routes/castle/$id";

import { classnames } from "#/shared/classnames";
import css from "./styles.module.css";

const BuildingLabel = ({ name, isMarked, isBuilt }: BuildingLabelProps) => {
  const className = classnames({
    [css.label]: true,
    [css.marked]: !isBuilt && isMarked,
  });

  return <div className={className}>{name}</div>;
};

export default BuildingLabel;

type BuildingLabelProps = {
  name: TBuilding["name"];
  isMarked: boolean;
  isBuilt: boolean;
};
