import type { TypeHero } from "#/routes/hero/$id";
import css from "./styles.module.css";

const MainStats = (stats: MainStatsProps) => {
  return (
    <section className={css.list}>
      <div>
        <img src={`/img/attack.webp`} alt="attack" />
        <span>{stats.attack}</span>
      </div>
      <div>
        <img src={`/img/defense.webp`} alt="defense" />
        <span>{stats.defense}</span>
      </div>
      <div>
        <img src={`/img/intelligence.webp`} alt="intelligence" />
        <span>{stats.magicPower}</span>
      </div>
      <div>
        <img src={`/img/spell-power.webp`} alt="spell-power" />
        <span>{stats.knowledge}</span>
      </div>

      <div>
        <img src={`/img/luck.webp`} alt="luck" />
        <span>{stats.luck}</span>
      </div>
      <div>
        <img src={`/img/morale.webp`} alt="morale" />
        <span>{stats.morale}</span>
      </div>
    </section>
  );
};

export default MainStats;

type MainStatsProps = TypeHero["mainStats"];
