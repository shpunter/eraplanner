import type { TypeHero } from "#/routes/hero/$id";
import css from "./styles.module.css";

const SecondaryStats = (stats: SecondaryStatsProps) => {
  return (
    <section className={css.list}>
      <div>
        <span>Movement points:</span> <span>{stats.movementPoints}</span>
      </div>
      <div>
        <span>XP:</span> <span>{stats.xp}</span>
      </div>
      <div>
        <span>Mana:</span> <span>{stats.mana}</span>
      </div>
    </section>
  );
};

export default SecondaryStats;

type SecondaryStatsProps = TypeHero["secondaryStats"];
