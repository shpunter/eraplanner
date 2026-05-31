import type { TBuilding } from "#/routes/castle/$id";

import { classnames } from "#/shared/classnames";
import css from "./buildingLabel.module.css";

const BuildingLabel = ({
  name,
  isMarked,
  isBuilt,
  isAvailable,
}: BuildingLabelProps) => {
  const className = classnames({
    [css.label]: true,
    [css.marked]: !isBuilt && isMarked,
    [css.available]: isAvailable && isMarked && !isBuilt,
  });

  return <div className={className}>{name}</div>;
};

export default BuildingLabel;

type BuildingLabelProps = {
  name: TBuilding["name"];
  isMarked: boolean;
  isBuilt: boolean;
  isAvailable: boolean;
};
