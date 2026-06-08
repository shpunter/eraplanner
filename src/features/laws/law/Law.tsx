import type { CastleID } from "#/routes/faction/$id";
import { classnames } from "#/shared/classnames";
import { useHistoryStore } from "../../history/history.store";
import type { LawType } from "../laws.config";
import { useLawsStore } from "../laws.store";
import css from "./law.module.css";

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

  return (
    <div className={classNames} onClick={onClick} data-testid={`law-${law.id}`}>
      <div className={css.dots}>
        {dots.map((dot) => (
          <div key={dot.id} className={dot.filled ? css.dotFilled : css.dot} />
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
    </div>
  );
};

export default Law;
