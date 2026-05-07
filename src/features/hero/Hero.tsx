import { Route } from "#/routes/hero/$id";
import css from "./hero.module.css";
import Info from "./info/Info";
import MainStats from "./mainStats/MainStats";
import SecondaryStats from "./secondaryStats/Secondary";
import Skills from "./skills/Skills";

const Hero = () => {
  const { hero } = Route.useLoaderData();

  return (
    <section className={css["hero-grid"]}>
      <div className={css.avatar}>
        <img
          src={`/img/hero/${hero.id}.webp`}
          alt={hero.name}
          className={css.avatar}
        />
      </div>
      <div className={css.info}>
        <Info hName={hero.name} hClass={hero.class} />
      </div>
      <div className={css["main-stats"]}>
        <MainStats {...hero.mainStats} />
      </div>
      <div className={css.skills}>
        <Skills />
      </div>
      <div className={css["secondary-stats"]}>
        <SecondaryStats {...hero.secondaryStats} />
      </div>
      <div className={css.hero}>hero</div>
      <div className={css.inventory}>inventory</div>
      <div className={css.army}>army</div>
    </section>
  );
};

export default Hero;
