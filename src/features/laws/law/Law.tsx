import Tooltip from "#/components/tooltip/Tooltip";
import type { CastleID } from "#/routes/faction/$id";
import { classnames } from "#/shared/classnames";
import { useHistoryStore } from "../../history/history.store";
import type { LawType } from "../laws.config";
import { useLawsStore } from "../laws.store";
import css from "./law.module.css";

// description signatures vary per law (some read lvl, some sight, some neither);
// they all ignore the extra fields at runtime, so call them with a full context
type LawCtx = { lvl: number; sight: number };

const Law = ({ law, factionID }: { law: LawType; factionID: CastleID }) => {
  const addLaw = useLawsStore((state) => state.addLaw);
  const historyIDX = useHistoryStore((state) => state.historyIDX);

  // Level as of the selected day: upgrades of this law up to historyIDX.
  const lawLvl = useLawsStore((state) => {
    let count = 0;

    for (let day = 0; day <= historyIDX; day++) {
      const dayLaws = state.history[day];

      if (!dayLaws) continue;

      for (const id of dayLaws) if (id === law.id) count++;
    }

    return count;
  });

  const isMax = lawLvl >= law.max;

  const dots = Array.from({ length: law.max }, (_, i) => ({
    id: `${law.img}-${i}`,
    filled: i < lawLvl,
  }));

  const onClick = () => {
    if (isMax) return;
    addLaw(law.id);
  };

  const classNames = classnames({ [css.maxed]: isMax }, [css.law]);

  const descNext = (law.description as (ctx: LawCtx) => string)({
    lvl: lawLvl + 1,
    sight: 1,
  });

  const descCurr = (law.description as (ctx: LawCtx) => string)({
    lvl: lawLvl,
    sight: 1,
  });

  return (
    <Tooltip>
      <Tooltip.Trigger
        className={classNames}
        onClick={onClick}
        data-testid={`law-${law.id}`}
      >
        <div className={css.dots}>
          {dots.map((dot) => (
            <div
              key={dot.id}
              className={dot.filled ? css.dotFilled : css.dot}
            />
          ))}
        </div>
        <img
          className={css.image}
          src={`/img/laws/${factionID}/${law.img}`}
          alt=""
          draggable={false}
        />
        <div className={css.cost}>
          <img
            className={css.icon}
            src="/img/resource/law.png"
            alt="law"
            draggable={false}
          />
          <span className={css.value}>{law.cost}</span>
        </div>
      </Tooltip.Trigger>
      <Tooltip.Content className={css.tooltip}>
        <strong className={css.tooltipTitle}>{law.title}</strong>
        {lawLvl > 0 && lawLvl < law.max ? (
          <>
            <p className={css.tooltipBody}>{descCurr}</p>
            <p>After improvement</p>
          </>
        ) : null}
        <p className={css.tooltipBody}>{descNext}</p>
      </Tooltip.Content>
    </Tooltip>
  );
};

export default Law;
