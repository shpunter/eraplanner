import type { CastleID } from "#/routes/faction/$id";
import type { LAWS } from "../laws.config";
import css from "./law.module.css";

type LawType = (typeof LAWS)[keyof typeof LAWS][number][number];

const Law = ({ law, factionID }: { law: LawType; factionID: CastleID }) => {
  const dots = Array.from({ length: law.max }, (_, i) => ({
    id: `${law.img}-${i}`,
    filled: i < law.curr,
  }));

  return (
    <div className={css.law}>
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
