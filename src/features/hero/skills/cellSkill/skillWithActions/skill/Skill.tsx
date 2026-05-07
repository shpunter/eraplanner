import type { SkillKey, SkillLvl } from "#/features/hero/hero.store";
import css from "./styles.module.css";

const Skill = ({ lvl, name, img }: SkillProps) => {
  return (
    <div className={css["skill-lvl"]} data-lvl={lvl + 1}>
      <img src={`/img/skills/${img}`} alt={name} className={css["item-img"]} />
    </div>
  );
};

export default Skill;

type SkillProps = {
  lvl: SkillLvl;
  name: SkillKey;
  img: string;
};
