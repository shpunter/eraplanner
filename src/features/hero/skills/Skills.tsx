import type { IDX } from "../hero.store";
import CellSkill from "./cellSkill/CellSkill";
import css from "./skills.module.css";

const Skills = () => {
  return (
    <section className={css.skills}>
      {Array.from({ length: 8 }).map((_, i) => {
        const key = `key-${i}`;

        return <CellSkill key={key} idx={i as IDX} />;
      })}
    </section>
  );
};

export default Skills;
