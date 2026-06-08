import type { LawType } from "../laws.config";
import css from "./law.module.css";

// description signatures vary per law (some read lvl, some sight, some neither);
// they all ignore the extra fields at runtime, so call them with a full context
const describe = (law: LawType, lvl: number) =>
  (law.description as (ctx: { lvl: number; sight: number }) => string)({
    lvl,
    sight: 1,
  });

const LawTooltip = ({ law, lawLvl }: LawTooltipProps) => {
  const isMax = lawLvl >= law.max;
  const isUpgrade = lawLvl > 0 && !isMax;

  return (
    <>
      <strong className={css.tooltipTitle}>{law.title}</strong>

      {isUpgrade && (
        <div className={css.currentLVL}>
          <p>Level: {lawLvl}</p><br/>
          <p>{describe(law, lawLvl)}</p>
          <p className={css.nextLabel}>After improvement</p>
        </div>
      )}

      {/* the effect at the next level (capped, so it's the current effect at max) */}
      <p className={isMax ? css.currentLVL : css.tooltipBody}>
        {describe(law, lawLvl + 1)}
      </p>
    </>
  );
};

export default LawTooltip;

type LawTooltipProps = {
  law: LawType;
  lawLvl: number;
};
